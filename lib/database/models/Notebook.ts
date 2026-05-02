import { Schema, model, models } from "mongoose"

const notebookSchema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, default: "Untitled Notebook" },
    sources: [{ type: String }],
    linkSources: [{ type: String }],
    linkSourcesTitles: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const Notebook = models.Notebook || model("Notebook", notebookSchema)

export default Notebook
