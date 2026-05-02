import { NextResponse } from "next/server";
import connect from "@/lib/database/db";
import { auth } from "@clerk/nextjs/server";
import ChatMessage from "@/lib/database/models/Chatmessages";

// Fetch all chatmessages on load for a notebook 
export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const notebookId = new URL(request.url).searchParams.get("notebookId")
        await connect();
        // Try and get chatmessages if they exist 
        const chatMessages = await ChatMessage.find({
            userId: userId,
            notebookId: notebookId
        })
        // If no chat messages exist, return empty array
        if (!chatMessages || chatMessages.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json(chatMessages[0].messages, { status: 200 });
    } catch (error) {
        console.error("Error getting chat messages:", error);
        return NextResponse.json({ error: "Failed to get chat messages" }, { status: 500 });
    }
}


// Create a chatmessage 
export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { role, content } = await request.json()
        const notebookId = new URL(request.url).searchParams.get("notebookId")

        await connect();

        // See if chat message already exists
        // If it does, add the message to the messages array using $push
        // If it doesn't, create a new chat message
        const checkChatMessage = await ChatMessage.findOne({
            userId: userId,
            notebookId: notebookId
        })

        if (checkChatMessage) {
            await ChatMessage.updateOne({
                _id: checkChatMessage._id,
                $push: {
                    messages: {
                        role: role,
                        content: content
                    }
                }
            }, { new: true })
            return NextResponse.json({ success: true }, { status: 200 });
        }

        const chatMessage = new ChatMessage({
            userId,
            notebookId: notebookId,
            messages: [{
                role: role,
                content: content
            }]
        });
        await chatMessage.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error creating chat message:", error);
        return NextResponse.json({ error: "Failed to create chat message" }, { status: 500 });
    }
}