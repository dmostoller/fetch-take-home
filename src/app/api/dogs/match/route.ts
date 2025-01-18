import { NextResponse } from "next/server";
import { cookies } from "next/headers";

interface Match {
  match: string;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const dogIds = await request.json();

    if (!Array.isArray(dogIds) || dogIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid request body - expected array of dog IDs" },
        { status: 400 },
      );
    }

    const response = await fetch(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify(dogIds),
        credentials: "include",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to get match" },
        { status: response.status },
      );
    }

    const data: Match = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /dogs/match:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
