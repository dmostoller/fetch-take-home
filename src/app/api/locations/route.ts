import { cookies } from "next/headers";
import { LocationSearchParams, LocationSearchResponse } from "@/lib/types";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const body: LocationSearchParams = await request.json();
    const params = {
      ...body,
      size: body.size || 500,
    };

    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/locations/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(params),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search locations");
    }

    const data: LocationSearchResponse = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}
