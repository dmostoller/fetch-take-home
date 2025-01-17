import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("fetch-access-token");

    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Auth check failed" + error, authenticated: false },
      { status: 500 },
    );
  }
}
