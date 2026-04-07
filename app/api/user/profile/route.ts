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
    const updates = body;

    // Update allowed fields
    if (updates.name) user.name = updates.name;
    if (updates.avatar) user.avatar = updates.avatar;

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        streak: user.streak,
        isPro: user.isPro,
        totalCoins: user.totalCoins,
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
