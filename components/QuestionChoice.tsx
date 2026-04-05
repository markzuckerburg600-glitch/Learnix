"use client"
import { Fragment } from "react"
import { useState } from "react"
export default function QuestionChoice({ correct, choice, i}: { correct: number, choice: string, i: number}) {
    const [hasClicked, setHasClicked] = useState(false)
    const [gotCorrect, setGotCorrect] = useState(false)
    
    const handleClick = () => {
        if (i+1 === correct) {
            setGotCorrect(true)
        } else {
            setGotCorrect(false)
        }
        setHasClicked(true)
    }
    
    const getButtonStyles = () => {
        const baseStyles = "w-full text-left p-4 rounded-xl font-medium transition-all duration-300 transform border-2 flex items-center gap-4"
        
        if (!hasClicked) {
            return `${baseStyles} bg-white border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] hover:bg-blue-50 cursor-pointer`
        }
        
        if (gotCorrect) {
            return `${baseStyles} bg-green-50 border-green-400 text-green-800 cursor-not-allowed`
        }
        
        return `${baseStyles} bg-red-50 border-red-400 text-red-800 cursor-not-allowed`
    }
    
    const getIndicator = () => {
        if (!hasClicked) return <span className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold">{i + 1}</span>
        if (gotCorrect) return <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">✓</span>
        return <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">✗</span>
    }
    
    return (
        <Fragment key={i}>
            <button
                className={getButtonStyles()}
                onClick={handleClick}
                disabled={hasClicked}
            >
                {getIndicator()}
                <span className="flex-1">{choice}</span>
            </button>
        </Fragment>
    )
}
