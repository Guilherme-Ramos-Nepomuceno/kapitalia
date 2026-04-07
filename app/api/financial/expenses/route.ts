import { NextRequest, NextResponse } from "next/server";
import { verifyMockToken, getUserByEmail } from "@/lib/data/mock-data";

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

    const user = getUserByEmail(decoded.email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, budgeted, color } = body;

    if (!name || budgeted === undefined) {
      return NextResponse.json(
        { error: "Name and budgeted amount are required" },
        { status: 400 }
      );
    }

    const newExpense = {
      id: `exp-${Date.now()}`,
      name,
      budgeted,
      spent: 0,
      color: color || "#FF6B6B",
    };

    user.expenses.push(newExpense);

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
