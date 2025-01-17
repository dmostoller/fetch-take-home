import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const dogIds = await request.json();

    if (!dogIds?.length) {
      return NextResponse.json([]);
    }

    const response = await fetch(`${BASE_URL}/dogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
      body: JSON.stringify(dogIds),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch dogs" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dogs API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
