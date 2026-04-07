import { NextRequest, NextResponse } from "next/server";
import { verifyMockToken, getUserByEmail, mockTrails } from "@/lib/data/mock-data";

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

    // Calculate stats
    const totalLessonsCompleted = user.completedLessons.length;
    const currentLevel = user.level;
    const totalXp = user.xp;

    // Get recent transactions
    const recentTransactions = user.transactions.slice(-5);

    // Get trails with updated completion status
    const trails = mockTrails.map(trail => ({
      ...trail,
      completedLessons: trail.lessons.filter(l => 
        user.completedLessons.includes(l.id)
      ).length,
    }));

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
          avatar: user.avatar,
          joinedAt: user.joinedAt,
        },
        stats: {
          totalLessonsCompleted,
          currentLevel,
          totalXp,
          streakDays: user.streak,
        },
        recentTransactions,
        trails,
        financialSummary: {
          monthlyIncome: user.monthlyIncome,
          monthlyExpenses: user.expenses.reduce((sum, exp) => sum + exp.spent, 0),
          emergencyFundGoal: user.emergencyFundGoal,
          emergencyFundCurrent: user.emergencyFundCurrent,
          emergencyFundPercentage: (
            (user.emergencyFundCurrent / user.emergencyFundGoal) * 100
          ).toFixed(1),
        },
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
    const { name, age, goal, experience } = body;

    // Update user with onboarding data
    if (name) user.name = name;

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
