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
    const { description, amount, category, type } = body;

    if (!description || amount === undefined || !category || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTransaction = {
      id: `trans-${Date.now()}`,
      description,
      amount,
      category,
      date: new Date().toISOString().split("T")[0],
      type: type as "income" | "expense",
    };

    user.transactions.push(newTransaction);

    // Update expense category if it's an expense
    if (type === "expense") {
      const expense = user.expenses.find(e => e.name === category);
      if (expense) {
        expense.spent += amount;
      }
    }

    // Update monthly income if it's income
    if (type === "income") {
      // Could update monthly income here if needed
    }

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    // Parse pagination params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const start = (page - 1) * limit;
    const end = start + limit;

    const transactions = user.transactions.slice(start, end);
    const total = user.transactions.length;

    return NextResponse.json(
      {
        transactions,
        total,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
