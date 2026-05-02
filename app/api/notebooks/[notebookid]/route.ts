import { NextResponse } from "next/server";
import connect from "@/lib/database/db";
import Notebook from "@/lib/database/models/Notebook";
import { auth } from "@clerk/nextjs/server";

// GET request to fetch a specific notebook
export async function GET(
    request: Request,
    { params }: { params: { notebookid: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notebookId = await params.notebookid;

        await connect();

        const notebook = await Notebook.findOne({ _id: notebookId, userId });
        
        if (!notebook) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json({ notebook }, { status: 200 });
    } catch (error) {
        console.error("Error fetching notebook:", error);
        return NextResponse.json({ error: "Failed to fetch notebook" }, { status: 500 });
    }
}

// PUT request to update a notebook
export async function PUT(
    request: Request,
    { params }: { params: { notebookid: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notebookId = await params.notebookid;
        const body = await request.json();
        const { name, sources, linkSources, linkSourcesTitles } = body;

        await connect();

        const notebook = await Notebook.findOneAndUpdate(
            { _id: notebookId, userId },
            { 
                name, 
                sources, 
                linkSources, 
                linkSourcesTitles,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!notebook) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, notebook }, { status: 200 });
    } catch (error) {
        console.error("Error updating notebook:", error);
        return NextResponse.json({ error: "Failed to update notebook" }, { status: 500 });
    }
}

// DELETE request to delete a notebook
export async function DELETE(
    request: Request,
    { params }: { params: { notebookid: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const notebookId = await params.notebookid;

        await connect();

        const notebook = await Notebook.findOneAndDelete({ _id: notebookId, userId });

        if (!notebook) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting notebook:", error);
        return NextResponse.json({ error: "Failed to delete notebook" }, { status: 500 });
    }
}
