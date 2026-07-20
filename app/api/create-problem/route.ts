import { db } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/enums";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    // 1. Check authentication
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user from database
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: clerkUser.id,
      },
    });

    // 3. Check if user exists
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Check admin role
    if (dbUser.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      );
    }

    // 5. Read request body
    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    // Basic validation
    if (!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate test cases
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 }
      );
    }

    // Validate reference solutions
    if (!referenceSolutions || typeof referenceSolutions !== 'object') {
      return NextResponse.json(
        { error: "Reference solutions must be provided for all supported languages" },
        { status: 400 }
      );
    }

    
  } catch (error) {
    console.error("Database error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 },
    );
  }
};
