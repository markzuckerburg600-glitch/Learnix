import { NextResponse } from "next/server";
import connect from "@/lib/database/db";
import Quiz from "@/lib/database/models/Quiz";
import { auth } from "@clerk/nextjs/server";

// POST request to store a quiz
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { notebookId, data, prompt, numQuestions, difficulty } = body;

        await connect();

        const quiz = await Quiz.create({
            userId,
            notebookId,
            data,
            prompt,
            numQuestions,
            difficulty
        });

        return NextResponse.json({ success: true, quiz }, { status: 201 });
    } catch (error) {
        console.error("Error creating quiz:", error);
        return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
    }
}

// GET request to fetch quizzes for a notebook
export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const notebookId = searchParams.get("notebookId");

        await connect();

        const quizzes = await Quiz.find({ userId, notebookId });
        return NextResponse.json({ quizzes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
    }
}