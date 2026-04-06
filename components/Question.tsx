"use client"
import { Fragment } from "react/jsx-runtime"
import { QuestionMap } from "./QuizGeneratorServer"
import { useState } from "react"
import QuestionChoice from "./QuestionChoice"

export default function Question(question: QuestionMap) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  
  const handleChoiceClick = (index: number) => {
    setClickedIndex(index)
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
        {/* Question number badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Question
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 flex-1 rounded-full"></div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.questionText}
        </h2>
        
        <div className="space-y-3 mb-6">
          {question.choices.map((choice, i: number) => {
              return(
                  <Fragment key = {i}>
                  <QuestionChoice 
                    correct = {question.correct} 
                    choice = {choice} 
                    i = {i} 
                    clickedIndex = {clickedIndex}
                    onClick = {() => handleChoiceClick(i)}
                  />
                  </Fragment>
              )
          })}
        </div>
        
        {/* Enhanced hint section */}
        <div className="relative">
          <button
            onClick={() => setShowHint(!showHint)}
            className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-left hover:from-amber-100 hover:to-orange-100 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200">
                  💡
                </div>
                <span className="font-semibold text-amber-800">Need a hint?</span>
              </div>
              <svg 
                className={`w-5 h-5 text-amber-600 transition-transform duration-300 ${showHint ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {showHint && (
            <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-slide-down">
              <p className="text-gray-700">{question.hint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
