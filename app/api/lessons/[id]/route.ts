import { NextRequest, NextResponse } from "next/server";
import { verifyMockToken, getUserByEmail, mockTrails } from "@/lib/data/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find lesson across all trails
    let lesson = null;
    for (const trail of mockTrails) {
      lesson = trail.lessons.find(l => l.id === params.id);
      if (lesson) break;
    }

    if (!lesson) {
      return NextResponse.json(
        { error: "Lesson not found" },
        { status: 404 }
      );
    }

    // Update lesson with completion status
    return NextResponse.json(
      {
        ...lesson,
        isCompleted: user.completedLessons.includes(lesson.id),
        isLocked: lesson.isPro && !user.isPro,
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
