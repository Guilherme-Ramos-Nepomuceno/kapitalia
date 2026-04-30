import { NextRequest, NextResponse } from "next/server";
import { verifyMockToken, getUserByEmail } from "@/lib/data/mock-data";

export async function PATCH(request: NextRequest) {
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

    const user = getUserByEmail(decoded.email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { monthlyIncome } = body;

    if (monthlyIncome === undefined) {
      return NextResponse.json(
        { error: "Monthly income is required" },
        { status: 400 }
      );
    }

    user.monthlyIncome = monthlyIncome;

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
