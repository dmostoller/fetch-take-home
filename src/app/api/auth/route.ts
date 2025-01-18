import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
      }),
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: response.status },
      );
    }

    const setCookieHeader = response.headers.get("set-cookie");
    const res = NextResponse.json({ success: true }, { status: 200 });

    if (setCookieHeader) {
      res.headers.set("Set-Cookie", setCookieHeader);
    }

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: cookies().toString(),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Logout failed" },
        { status: response.status },
      );
    }

    const res = NextResponse.json({ success: true });
    res.headers.set(
      "Set-Cookie",
      "fetch-access-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    );

    return res;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" + error },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const response = await fetch(`${BASE_URL}/auth/check`, {
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json({
      authenticated: response.ok,
    });
  } catch (error: unknown) {
    console.error("Auth check failed:", error);
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
