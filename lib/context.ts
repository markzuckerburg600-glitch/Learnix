import { createContext } from "react";
import { useContext } from "react";

interface QuestionContextType {
  setCorrectCount: (value: number | ((prev: number) => number)) => void;
  setAnswered: (value: number | ((prev: number) => number)) => void;
}

export const QuestionContext = createContext<QuestionContextType | undefined>(undefined)

export function useQuestionContext() {
    const ctx = useContext(QuestionContext);
    if (ctx === undefined) {
        throw new Error("useQuestionContext must be used within a QuestionContext.Provider")
    }
    return [ctx.setCorrectCount, ctx.setAnswered] as const;
}