import { Schema, model, models } from "mongoose"

const embeddingSchema = new Schema({
    userId: { type: String, required: true },
    notebookId: { type: String, required: true },
    embedding: { type: [Number], required: true },
    text: { type: [String], required: true },
})

export const Embedding = models.Embedding || model('Embedding', embeddingSchema)