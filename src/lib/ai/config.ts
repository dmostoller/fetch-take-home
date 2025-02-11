import { ChatCompletionFunctions } from "openai/resources/chat";

export const systemPrompt = `You are a helpful AI assistant specializing in helping users find their perfect dog match. 
Guide users through the dog matching process by:
1. Asking for their location (ZIP code)
2. Understanding their breed preferences
3. Determining preferred age range (young: 0-2, adult: 2-8, senior: 8+)

Keep responses conversational but focused on gathering the necessary information.`;

export const functions: ChatCompletionFunctions[] = [
  {
    name: "searchDogs",
    description: "Search for dogs based on location, breeds, and age range",
    parameters: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "ZIP code for location-based search",
        },
        breeds: {
          type: "array",
          items: { type: "string" },
          description: "List of preferred dog breeds",
        },
        ageRange: {
          type: "string",
          enum: ["young", "adult", "senior"],
          description: "Preferred age range of the dog",
        },
      },
    },
  },
];
