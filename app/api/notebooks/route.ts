import { NextResponse } from "next/server";
import connect from "@/lib/database/db";
import Notebook from "@/lib/database/models/Notebook";
import { auth } from "@clerk/nextjs/server";

// POST request to create a notebook
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, sources, linkSources, linkSourcesTitles } = body;

        await connect();

        const notebook = await Notebook.create({
            userId,
            name: name || "Untitled Notebook",
            sources: sources || [],
            linkSources: linkSources || [],
            linkSourcesTitles: linkSourcesTitles || []
        });

        return NextResponse.json({ success: true, notebook }, { status: 201 });
    } catch (error) {
        console.error("Error creating notebook:", error);
        return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 });
    }
}

// GET request to fetch all notebooks for a user
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connect();

        const notebooks = await Notebook.find({ userId }).sort({ updatedAt: -1 });
        return NextResponse.json({ notebooks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching notebooks:", error);
        return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
    }
}