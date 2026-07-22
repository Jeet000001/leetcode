import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole } from "@/lib/generated/prisma/enums";

export async function POST(request: Request) {
  try {
    // 1. Authentication & Authorization
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (!user || userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Parse request body
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

    // 3. Basic validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 4. Validate test cases
    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        {
          error: "At least one test case is required",
        },
        { status: 400 },
      );
    }

    // 5. Validate reference solutions
    if (
      typeof referenceSolutions !== "object" ||
      Array.isArray(referenceSolutions) ||
      Object.keys(referenceSolutions).length === 0
    ) {
      return NextResponse.json(
        {
          error: "Reference solutions must be provided",
        },
        { status: 400 },
      );
    }

    // 6. Validate reference solution for each language
    for (const [language, solutionCode] of Object.entries(
      referenceSolutions,
    )) {
      // Get Judge0 language ID
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return NextResponse.json(
          {
            error: `Unsupported language: ${language}`,
          },
          { status: 400 },
        );
      }

      // Validate solution code
      if (typeof solutionCode !== "string" || !solutionCode.trim()) {
        return NextResponse.json(
          {
            error: `Invalid solution code for ${language}`,
          },
          { status: 400 },
        );
      }

      // Prepare submissions
      const submissions = testCases.map(
        ({ input, output }: { input: string; output: string }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }),
      );

      // Submit all test cases
      const submissionResults = await submitBatch(submissions);

      // Extract tokens
      const tokens = submissionResults.map(
        (result) => result.token,
      );

      // Poll results
      const results = await pollBatchResults(tokens);

      // Validate results
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const submission = submissions[i];

        console.log(`Test case ${i + 1}:`, {
          language,
          input: submission.stdin,
          expectedOutput: submission.expected_output,
          actualOutput: result.stdout,
          status: result.status,
          error: result.stderr || result.compile_output,
        });

        // Judge0 status ID 3 = Accepted
        if (result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submission.stdin,
                expectedOutput: submission.expected_output,
                actualOutput: result.stdout,
                error:
                  result.stderr ||
                  result.compile_output ||
                  result.message,
              },
            },
            { status: 400 },
          );
        }
      }
    }

    // 7. Save problem to database
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    // 8. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Problem creation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create problem",
      },
      { status: 500 },
    );
  }
}