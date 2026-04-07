import { NextRequest, NextResponse } from "next/server";
import { createMockToken, verifyMockToken, getUserByEmail } from "@/lib/data/mock-data";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyMockToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Create new token with fresh expiration
    const newToken = createMockToken(decoded.userId, decoded.email);

    return NextResponse.json(
      { token: newToken },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
