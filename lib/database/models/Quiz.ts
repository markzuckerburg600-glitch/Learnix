import { Schema, model, models } from "mongoose"

/* 
Parallel to this 
export default interface QuestionMap {
  questionText: string,
  choices: string[],
  hint: string,
  correct: number,
  explanation: string
}
*/

const quizSchema = new Schema({
    userId: { type: String, required: true },
    notebookId: { type: String, required: true },
    data: [{
        questionText: { type: String, required: true },
        choices: [{ type: String, required: true }],
        hint: { type: String, required: true },
        correct: { type: Number, required: true },
        explanation: { type: String, required: true }
    }],
    prompt: { type: String, required: true },
    numQuestions: { type: Number, required: true },
    difficulty: { type: String, required: true }
})

const Quiz = models.Quiz || model("Quiz", quizSchema)

export default Quiz