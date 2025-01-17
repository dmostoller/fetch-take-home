import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

export const authApi = {
  login: async (credentials: { name: string; email: string }) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },

  logout: async () => {
    const res = await fetch("/api/auth", { method: "DELETE" });
    if (!res.ok) throw new Error("Logout failed");
    return res.json();
  },

  check: async () => {
    const res = await fetch("/api/auth/check");
    return res.ok;
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    // Create response with success message
    const res = NextResponse.json({ success: true }, { status: 200 });

    // Forward the auth cookie if present
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
        Cookie: cookies().toString(), // Forward existing cookies
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Logout failed" },
        { status: response.status },
      );
    }

    const res = NextResponse.json({ success: true });

    // Clear the auth cookie
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
