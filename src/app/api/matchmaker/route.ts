import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/constants";

const AGE_RANGES = {
  young: { min: 0, max: 2 },
  adult: { min: 2, max: 8 },
  senior: { min: 8, max: 20 },
} as const;

type AgeRangeKey = keyof typeof AGE_RANGES;

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
    const zipCodes = results.map(
      (location: { zip_code: string }) => location.zip_code,
    );
    return zipCodes;
  } catch (error: Error | unknown) {
    console.error("Zip code fetch error:", error);
    return [zipCode];
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();

    const {
      location,
      breeds,
      ageRange,
    }: { location: string; breeds: string[]; ageRange: AgeRangeKey } =
      requestData;

    const zipCodes = await getNearbyZipCodes(location);
    if (!zipCodes.length) {
      return NextResponse.json({ error: "Invalid location" }, { status: 400 });
    }

    const searchParams = new URLSearchParams();
    zipCodes.forEach((zip) => searchParams.append("zipCodes", zip));
    breeds?.forEach((breed: string) => searchParams.append("breeds", breed));
    searchParams.append("ageMin", AGE_RANGES[ageRange].min.toString());
    searchParams.append("ageMax", AGE_RANGES[ageRange].max.toString());

    const searchUrl = `${BASE_URL}/dogs/search?${searchParams}`;

    const dogsResponse = await fetchWithAuth(searchUrl);

    if (!dogsResponse.ok) {
      return NextResponse.json(
        { error: `Dogs search failed: ${dogsResponse.status}` },
        { status: dogsResponse.status },
      );
    }

    const { resultIds } = await dogsResponse.json();

    if (!resultIds?.length) {
      return NextResponse.json({ error: "No dogs found" }, { status: 404 });
    }

    const matchResponse = await fetchWithAuth(`${BASE_URL}/dogs/match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultIds),
      credentials: "include",
    });

    if (!matchResponse.ok) {
      return NextResponse.json(
        { error: `Match failed: ${matchResponse.status}` },
        { status: matchResponse.status },
      );
    }

    const data = await matchResponse.json();
    return NextResponse.json(data);
  } catch (error: Error | unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
