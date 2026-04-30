import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
  createMockToken,
  mockUsers,
} from "@/lib/data/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (getUserByEmail(email)) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      streak: 0,
      isPro: false,
      totalCoins: 0,
      joinedAt: new Date().toISOString().split("T")[0],
      completedLessons: [] as string[],
      monthlyIncome: 0,
      expenses: [
        {
          id: "exp-default-1",
          name: "Alimentação",
          budgeted: 500,
          spent: 0,
          color: "#FF6B6B",
        },
        {
          id: "exp-default-2",
          name: "Transporte",
          budgeted: 200,
          spent: 0,
          color: "#4ECDC4",
        },
      ] as any[],
      transactions: [] as any[],
      investments: [] as any[],
      emergencyFundGoal: 5000,
      emergencyFundCurrent: 0,
    };

    mockUsers.set(email, newUser);

    // Create token
    const token = createMockToken(newUser.id, newUser.email);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          level: newUser.level,
          xp: newUser.xp,
          xpToNextLevel: newUser.xpToNextLevel,
          streak: newUser.streak,
          isPro: newUser.isPro,
          totalCoins: newUser.totalCoins,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
