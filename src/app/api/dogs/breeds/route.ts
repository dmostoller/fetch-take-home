import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/constants";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${BASE_URL}/dogs/breeds`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch breeds" },
        { status: response.status },
      );
    }

    const breeds = await response.json();
    return NextResponse.json(breeds);
  } catch (error) {
    console.error("Breeds API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
