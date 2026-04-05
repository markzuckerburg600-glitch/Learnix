"use client";

import { Fragment, useState, useRef } from "react";
import puter from "@heyputer/puter.js";
import QuizButton from "./ui/quizButton";
import Question from "./Question";
import Loader from "./Loading";
import SummaryPanel from "./SummaryPanel";
import { QuestionContext } from "@/lib/context";

export interface QuestionMap {
    questionText: string,
    choices: [string],
    hint: string,
    correct: number,
    explaination: string 
}

export default function QuizGeneratorServer() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuestionMap[] | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(10)
  const [difficulty, setDifficulty] = useState("medium")
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [answered, setAnswered] = useState(0)
  const isCancelledRef = useRef<boolean>(false)

  const range = Array.from({ length: 49 }, (_, i) => i + 1)

  const DifficultyToggle = () => {
    const difficulties = [
      { value: 'easy', label: 'Easy', bgColor: 'bg-green-500' },
      { value: 'medium', label: 'Medium', bgColor: 'bg-yellow-500' },
      { value: 'hard', label: 'Hard', bgColor: 'bg-red-500' }
    ]

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Difficulty:</span>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {difficulties.map((diff) => (
            <button
              key={diff.value}
              onClick={() => setDifficulty(diff.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                difficulty === diff.value
                  ? `${diff.bgColor} text-white shadow-sm`
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const systemPrompt = `You are an expert MCQ quiz generator.
CRITICAL: You must ONLY return a valid JSON array. No extra text, no markdown formatting.
HERE ARE THE USERS REQUIREMENTS:
The correct answer is between 1-4, just like the choices.
${numQuestions} MCQ'S
A difficulty of ${difficulty}
Format:
[
  {
    "questionText": "Your question here",
    "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
    "hint": "A helpful hint",
    "correct": 1,
    "explaination": "Why this answer is correct"
  }
]

Example:
[
  {
    "questionText": "What is 2+2?",
    "choices": ["2", "1", "3", "4"],
    "hint": "Basic arithmetic",
    "correct": 1,
    "explaination": "2+2 equals 4"
  }
]`
  const cancelRequest = () => {
    setLoading(false);
    isCancelledRef.current = true;
  };

  async function handleAsk() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    isCancelledRef.current = false;

    try {
      const reply = await puter.ai.chat([
        {
            role: "system",
            content: systemPrompt
        },
        {
            role: "user",
            content: prompt
        } 
    ], {
       model: "gpt-5.4-nano",
       tools: [{type: "web_search"}]
     }
  );
      
      // Check if request was cancelled while waiting
      if (isCancelledRef.current) {
        return; // Exit early if cancelled
      }
      
      const text = reply.message?.content.toString() || "";
      const parsed = JSON.parse(text);
      setQuizData(parsed);
      setResponse(text);
      setCurrentQuestionIndex(0);
    } catch (err: unknown) {
      if (isCancelledRef.current) return; // Don't show error if cancelled
      
      setResponse("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
    {(!quizData && !loading)?
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What would you like to create a quiz about?
        </label>
        <textarea
          className="w-full p-3 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-400 overflow-scroll"
          rows={5}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Create a quiz about World War II', 'Make a chemistry quiz about atoms', 'Generate questions about Python programming'..."
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
        />
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Number of questions:</span>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {range.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          
          <DifficultyToggle />
        </div>
        
        <div className="mt-6 flex justify-center">
          <QuizButton click={handleAsk} not={loading}/> 
        </div>
      </div>
    </div>
    : ""
    }
        {loading ? 
        <>
        <Loader
        onCancel = {cancelRequest}
        /> 
        </>:
        <>
        {!quizData ? (
        <div>
          <div>
            {(() => {
              try {
                const parsed = JSON.parse(response!);
                return Array.isArray(parsed) ? parsed.map((questionData: QuestionMap, index) => {
                  return (
                <Fragment key = {index}>
                <div>
                  <QuestionContext.Provider value = {{setCorrectCount, setAnswered}}>
                  <Question {...questionData}/>
                  </QuestionContext.Provider>
                </div>
                </Fragment>
                  )
                }) : ""
              } catch (error) {
                console.log(error)
                return 
              }
            })()}
          </div>
        </div>
        ) : (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600 font-medium">
              {currentQuestionIndex < quizData.length ? 
                `Question ${currentQuestionIndex + 1} of ${quizData.length}` : 
                'Quiz Summary'
              }
            </div>
            <button
              onClick={() => {
                setQuizData(null);
                setResponse(null);
                setCurrentQuestionIndex(0);
                setPrompt("");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              Start New Quiz
            </button>
          </div>
          {/* Do the question at the current index */}
          {
          currentQuestionIndex < quizData.length ?
          <QuestionContext.Provider value = {{setCorrectCount, setAnswered}}>
          <Question key={quizData[currentQuestionIndex].questionText} {...quizData[currentQuestionIndex]} />
          </QuestionContext.Provider>
          :  <SummaryPanel correctCount = {correctCount} answered = {answered}/>
          }
          
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all duration-200 font-medium shadow-sm"
            >
              ← Previous
            </button>
            
            <button
              onClick={() => setCurrentQuestionIndex(Math.min(quizData.length, currentQuestionIndex + 1))}
              disabled={currentQuestionIndex > quizData.length - 1}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-all duration-200 font-medium shadow-lg"
            >
             {currentQuestionIndex !== quizData.length-1 ? 
             <div> Next → </div> : 
             <div> Summary → </div>
             }
            </button>
          </div>
        </div>
        )}
        </>
        }
    </div>
  );
}
