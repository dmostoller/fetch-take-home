import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { cookies } from "next/headers";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";

const AGE_RANGES = {
  young: { min: 0, max: 2 },
  adult: { min: 2, max: 8 },
  senior: { min: 8, max: 20 },
} as const;

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: cookieHeader,
    },
    credentials: "include",
  });
}

async function getNearbyZipCodes(zipCode: string): Promise<string[]> {
  try {
    const response = await axios.get(`http://api.zippopotam.us/us/${zipCode}`);
    const centerLat = parseFloat(response.data.places[0].latitude);
    const centerLng = parseFloat(response.data.places[0].longitude);

    const latRange = 0.7;
    const lngRange = 0.7;

    const bounds = {
      top_right: {
        lat: centerLat + latRange,
        lon: centerLng + lngRange,
      },
      bottom_left: {
        lat: centerLat - latRange,
        lon: centerLng - lngRange,
      },
    };

    const searchResponse = await fetchWithAuth(`${BASE_URL}/locations/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        geoBoundingBox: bounds,
        size: 100,
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`Location search failed: ${searchResponse.status}`);
    }

    const { results } = await searchResponse.json();
    return results.map((location: { zip_code: string }) => location.zip_code);
  } catch (error) {
    console.error("Zip code fetch error:", error);
    return [zipCode];
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log("Processing chat request:", messages);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    tools: {
      matchDog: tool({
        description:
          "Start the dog matching process with the user's preferences. If a breed is provided, it will be filtered against available breeds; if not, all breeds will be used.",
        parameters: z.object({
          location: z.string().describe("ZIP code for location-based search"),
          breeds: z
            .array(z.string())
            .optional()
            .describe("List of user specified breeds"),
          ageRange: z
            .enum(["young", "adult", "senior"])
            .describe("Age range of the dog"),
        }),
        execute: async ({ location, breeds, ageRange }) => {
          try {
            console.log("Executing matchDog with params:", {
              location,
              breeds,
              ageRange,
            });

            // Get nearby zip codes
            const zipCodes = await getNearbyZipCodes(location);
            if (!zipCodes.length) {
              return {
                success: false,
                message:
                  "Invalid location provided. Please try a different ZIP code.",
              };
            }

            // Construct search parameters
            const searchParams = new URLSearchParams();
            zipCodes.forEach((zip) => searchParams.append("zipCodes", zip));
            if (breeds?.length) {
              breeds.forEach((breed) => searchParams.append("breeds", breed));
            }
            searchParams.append("ageMin", AGE_RANGES[ageRange].min.toString());
            searchParams.append("ageMax", AGE_RANGES[ageRange].max.toString());

            // Search for dogs
            const searchUrl = `${BASE_URL}/dogs/search?${searchParams}`;
            const dogsResponse = await fetchWithAuth(searchUrl);

            if (!dogsResponse.ok) {
              console.error("Dogs search failed:", dogsResponse.status);
              return {
                success: false,
                message: "Failed to search for dogs. Please try again.",
              };
            }

            const { resultIds } = await dogsResponse.json();
            if (!resultIds?.length) {
              return {
                success: false,
                message:
                  "No dogs found matching your criteria. Would you like to try with different preferences?",
              };
            }

            // Get a match from the results
            const matchResponse = await fetchWithAuth(
              `${BASE_URL}/dogs/match`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(resultIds),
                credentials: "include",
              },
            );

            if (!matchResponse.ok) {
              console.error("Match failed:", matchResponse.status);
              return {
                success: false,
                message: "Failed to find a match. Please try again.",
              };
            }

            const { match } = await matchResponse.json();
            const dogDetailsResponse = await fetchWithAuth(`${BASE_URL}/dogs`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify([match]), // Send as array since the endpoint expects an array of IDs
              credentials: "include",
            });

            if (!dogDetailsResponse.ok) {
              console.error(
                "Failed to fetch dog details:",
                dogDetailsResponse.status,
              );
              return {
                success: false,
                message: "Failed to retrieve dog details. Please try again.",
              };
            }

            const dogDetailsArray = await dogDetailsResponse.json();
            const dogDetails = dogDetailsArray[0]; // Get the first (and only) dog from the response

            return {
              success: true,
              matchId: match,
              dogDetails,
              showModal: true,
              message: `
              ### 🐾 Meet Your Perfect Match! 🐾

              **${dogDetails.name}** is a ${dogDetails.age}-year-old ${dogDetails.breed} who could be your new best friend!

              ${dogDetails.img ? `![${dogDetails.name}](${dogDetails.img})` : ""}

              **Quick Facts:**
              - **Age:** ${dogDetails.age} years
              - **Breed:** ${dogDetails.breed}
              ${dogDetails.size ? `- **Size:** ${dogDetails.size}` : ""}

              ${dogDetails.description ? `\n**About ${dogDetails.name}:**\n${dogDetails.description}` : ""}

              Would you like to learn more about ${dogDetails.name}?`,
            };
          } catch (error) {
            console.error("Error during matchDog execution:", error);
            return {
              success: false,
              message: "An unexpected error occurred. Please try again later.",
            };
          }
        },
      }),
    },
    system: `You are a helpful AI assistant specializing in matching users with their perfect dog.
    When presenting a dog match:
    - Use markdown formatting to make the content engaging
    - Present the dog's details in a clear, organized way
    - Use emojis appropriately to add warmth to the message
    - When the match includes a showModal flag, inform the user they can click for more details

    When asking for location:
    - Only accept 5-digit US ZIP codes
    - If a user provides a city or state, help them find the appropriate ZIP code
    - Say something like "I need a specific 5-digit ZIP code to search. For example, if you're in Manhattan, you might use 10001."
    - Don't proceed with matching until you have a valid 5-digit ZIP code
    
    Guide users through these steps in order:
    1. Get a valid 5-digit ZIP code (help them find one if needed)
    2. Ask for breed preferences (if any)
    3. Ask for age preference (young, adult, senior)
    
    After collecting these preferences, use the matchDog tool to obtain a match.
    Be friendly and conversational, but firm about needing a specific ZIP code.`,
  });

  return result.toDataStreamResponse();
}
