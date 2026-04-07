import { NextRequest, NextResponse } from "next/server";
import {
  getUserByEmail,
  verifyPassword,
  createMockToken,
  mockUsers,
} from "@/lib/data/mock-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials
    if (!verifyPassword(email, password)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create token
    const token = createMockToken(user.id, user.email!);

    // Return user data and token
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          xpToNextLevel: user.xpToNextLevel,
          streak: user.streak,
          isPro: user.isPro,
          totalCoins: user.totalCoins,
        },
        token,
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
