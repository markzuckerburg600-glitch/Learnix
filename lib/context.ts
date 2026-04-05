import { createContext } from "react";
import { useContext } from "react";
import { QuestionChoiceProps } from "@/components/QuestionChoice";

export const QuestionContext = createContext<QuestionChoiceProps | undefined>(undefined)

export function useQuestionContext() {
    const {setCorrectCount, setAnswered} = useContext(QuestionContext)
    if (setCorrectCount === undefined || setAnswered === undefined) {
        throw new Error("useQuestionContext must be used with a QuestionContext")
    }
    return [setCorrectCount, setAnswered]
}