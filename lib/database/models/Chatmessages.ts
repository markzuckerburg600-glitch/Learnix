import { Schema, model, models } from "mongoose"

const chatMessageSchema = new Schema({
    userId: { type: String, required: true },
    notebookId: { type: String, required: true },
    messages: [
        {
            role: { type: String, enum: ["user", "assistant"], required: true },
            content: { type: String, required: true },
        }
    ],
}, {
    timestamps: true
})

const ChatMessage = models.ChatMessage || model("ChatMessage", chatMessageSchema)

export default ChatMessage