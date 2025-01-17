import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const searchResponse = await fetch(
      `${BASE_URL}/dogs/search?${searchParams}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
      },
    );

    if (!searchResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch dogs" },
        { status: searchResponse.status },
      );
    }

    const { resultIds, total, next, prev } = await searchResponse.json();

    const dogsResponse = await fetch(`${BASE_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(resultIds),
      credentials: "include",
    });

    if (!dogsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch dog details" },
        { status: dogsResponse.status },
      );
    }

    const dogs = await dogsResponse.json();

    return NextResponse.json({
      dogs,
      total,
      next,
      prev,
    });
  } catch (error) {
    console.error("Dogs API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
