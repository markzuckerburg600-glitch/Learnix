"use client"
import { Fragment } from "react"
export default function QuestionChoice(
    { setCorrectCount, 
        setAnswered, 
        correct,     
        choice, 
        i, 
        clickedIndex, 
        onClick
     }: 
     { 
        setCorrectCount: () => void, 
        setAnswered: () => void, 
        correct: number, 
        choice: string, 
        i: number, 
        clickedIndex: number | null, 
        onClick: () => void 
    }) {
    console.log('QuestionChoice props:', { correct, choice, i, clickedIndex })
    
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
        const baseStyles = "w-full text-left p-4 rounded-xl font-medium transition-all duration-300 transform border-2 flex items-center gap-4"
        
        if (clickedIndex === null) {
            return `${baseStyles} bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] hover:bg-blue-50 cursor-pointer`
        }
        
        // Show correct answer in green
        if (i+1 === correct) {
            return `${baseStyles} bg-green-50 border-green-400 text-green-800 cursor-not-allowed`
        }
        
        // Show clicked wrong answer in red, others in normal disabled state
        if (i === clickedIndex) {
            return `${baseStyles} bg-red-50 border-red-400 text-red-800 cursor-not-allowed`
        }
        
        return `${baseStyles} bg-gray-50 border-gray-300 text-gray-600 cursor-not-allowed`
    }
    
    const getIndicator = () => {
        if (clickedIndex === null) return <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold">{i + 1}</span>
        if (i+1 === correct) return <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</span>
        if (i === clickedIndex) return <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">✗</span>
        return <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold text-gray-500">{i + 1}</span>
    }
    
    return (
        <Fragment key={i}>
            <button
                className={getButtonStyles()}
                onClick={handleChoiceClick}
                disabled={clickedIndex !== null}
            >
                {getIndicator()}
                <span className="flex-1">{choice}</span>
            </button>
        </Fragment>
    )
}
