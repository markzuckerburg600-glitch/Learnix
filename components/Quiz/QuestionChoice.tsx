"use client"
import { useQuestionContext } from "@/lib/context"
import { Fragment } from "react"

export default function QuestionChoice(
    { 
        correct,     
        choice, 
        i, 
        clickedIndex, 
        onClick
     }: 
     { 
        correct: number, 
        choice: string, 
        i: number, 
        clickedIndex: number | null, 
        onClick: () => void 
    }) {
    const [setCorrectCount, setAnswered] = useQuestionContext()
    
    const handleChoiceClick = () => {
        if (clickedIndex === null) {  // Only count first click
            if (i+1 === correct) {
                setCorrectCount(prev => prev + 1)
            }
            setAnswered(prev => prev + 1)
        }
        onClick()
    }
    
    const getButtonStyles = () => {
        const baseStyles = "w-full text-left p-4 rounded-2xl font-medium transition-all duration-500 transform border-2 flex items-center gap-4 relative overflow-hidden"
        
        if (clickedIndex === null) {
            return `${baseStyles} bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg hover:scale-[1.02] hover:bg-linear-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer group`
        }
        
        // Show correct answer in green with success animation
        if (i+1 === correct) {
            return `${baseStyles} bg-linear-to-r from-green-50 to-emerald-50 border-green-400 text-green-800 cursor-not-allowed animate-success-pulse`
        }
        
        // Show clicked wrong answer in red with shake animation
        if (i === clickedIndex) {
            return `${baseStyles} bg-linear-to-r from-red-50 to-pink-50 border-red-400 text-red-800 cursor-not-allowed animate-error-shake`
        }
        
        return `${baseStyles} bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed opacity-60`
    }
    
    const getIndicator = () => {
        if (clickedIndex === null) {
            return (
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold bg-white group-hover:border-blue-400 group-hover:bg-blue-50 transition-all duration-300">
                    {i + 1}
                </div>
            )
        }
        
        if (i+1 === correct) {
            return (
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center animate-bounce-once shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )
        }
        
        if (i === clickedIndex) {
            return (
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-red-500 to-pink-500 text-white flex items-center justify-center animate-pulse shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )
        }
        
        return (
            <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-500 bg-gray-100">
                {i + 1}
            </div>
        )
    }
    
    return (
        <Fragment key={i}>
            <button
                className={getButtonStyles()}
                onClick={handleChoiceClick}
                disabled={clickedIndex !== null}
            >
                {getIndicator()}
                <span className="flex-1 text-lg">{choice}</span>
                {clickedIndex === null && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"></div>
                )}
            </button>
        </Fragment>
    )
}
