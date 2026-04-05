"use client"
import { Fragment } from "react/jsx-runtime"
import { QuestionMap } from "./QuizGeneratorServer"
import { useState } from "react"
import QuestionChoice from "./QuestionChoice"

export default function Question(question: QuestionMap, setCorrectCount: () => void, setAnswered: () => void) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)
  
  const handleChoiceClick = (index: number) => {
    console.log('Clicked choice index:', index, 'Correct answer:', question.correct)
    setClickedIndex(index)
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {question.questionText}
        </h2>
        
        <div className="space-y-3 mb-8">
          {question.choices.map((choice, i: number) => {
              return(
                  <Fragment key = {i}>
                  <QuestionChoice 
                    setCorrectCount = {setCorrectCount}
                    setAnswered = {setAnswered}
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
        
        <details className="group bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-blue-200">
          <summary className="cursor-pointer font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200 list-none flex items-center gap-2">
            <span className="transform group-open:rotate-90 transition-transform duration-200">▶</span>
            Need a hint?
          </summary>
          <p className="mt-3 text-gray-700 pl-6"> {question.hint} </p>
        </details>
      </div>
    </div>
  )
}
