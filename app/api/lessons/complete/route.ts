import { NextRequest, NextResponse } from "next/server";
import { verifyMockToken, getUserByEmail, mockTrails } from "@/lib/data/mock-data";

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
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    // Find lesson to get XP reward
    let lesson = null;
    for (const trail of mockTrails) {
      lesson = trail.lessons.find(l => l.id === lessonId);
      if (lesson) break;
    }

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Check if already completed
    if (user.completedLessons.includes(lessonId)) {
      return NextResponse.json(
        { error: "Lesson already completed" },
        { status: 400 }
      );
    }

    // Add lesson to completed
    user.completedLessons.push(lessonId);

    // Calculate rewards
    const xpGained = lesson.xpReward;
    const coinsGained = Math.floor(lesson.xpReward / 10);

    user.xp += xpGained;
    user.totalCoins += coinsGained;
    user.streak += 1;

    // Check for level up
    let newLevel = null;
    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xp = user.xp - user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.2);
      newLevel = user.level;
    }

    return NextResponse.json(
      {
        success: true,
        xpGained,
        coinsGained,
        newLevel,
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
