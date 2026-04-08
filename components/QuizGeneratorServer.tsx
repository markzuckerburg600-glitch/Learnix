"use client";

import { Fragment, useState, useRef } from "react";
import { useDebounce } from "use-debounce"
import puter from "@heyputer/puter.js";
import QuizButton from "./ui/quizButton";
import Question from "./Question";
import Loader from "./Loading";
import SummaryPanel from "./SummaryPanel";
import FileAcceptor from "./FileAcceptor";
import UploadFile from "./UploadFile";
import UploadYoutubeLink from "./UploadYoutubeLink";
import { QuestionContext } from "@/lib/context";

export default interface QuestionMap {
    questionText: string,
    choices: [string],
    hint: string,
    correct: number,
    explaination: string 
}

export default function QuizGeneratorServer() {
  const [prompt, setPrompt] = useState<string>("");
  const [sources, setSources] = useState<string[]>([])
  const [linkSources, setLinkSources] = useState<string[]>([])
  const [linkSourcesTitles, setLinkSourcesTitles] = useState<string[]>([])
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizData, setQuizData] = useState<QuestionMap[] | null>(null);
  const [numQuestions, setNumQuestions] = useState<number>(10)
  const [difficulty, setDifficulty] = useState("medium")
  const [correctCount, setCorrectCount] = useState<number>(0)
  const [answered, setAnswered] = useState<number>(0)
  const [includeKey, setIncludeKey] = useState<boolean>(false)
  const [includeSimpleKey, setIncludeSimpleKey] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [header, setHeader] = useState<string>("")
  const isCancelledRef = useRef<boolean>(false)
  const [debouncedTitle] = useDebounce(title, 500)
  const [debouncedHeader] = useDebounce(header, 500)

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

  let systemPrompt = `You are an expert MCQ quiz generator.
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
]

HERE ARE THE USERS SOURCES
MAKE SURE THE QUESTIONS ARE RELATING TO THESE
`
  const cancelRequest = () => {
    setLoading(false);
    isCancelledRef.current = true;
  };

  async function handleAsk() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");
    isCancelledRef.current = false;
    // Add onto the system prompt 
    systemPrompt += sources.join("\n")
    systemPrompt += linkSources.join("\n")

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
       model: "openai/gpt-5.4",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    {(!quizData && !loading)?
    <div className="w-full max-w-6xl mx-auto p-4 lg:p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-6 lg:p-8 flex flex-col justify-center items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Quiz Generator
          </h1>
          <p className="text-gray-600 text-base lg:text-lg">Create engaging quizzes in seconds with AI</p>
        </div>
        
        <div className="w-full space-y-6 max-w-4xl">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-2">
              What would you like to create a quiz about?
            </label>
            <textarea
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white/60 backdrop-blur-sm text-base"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Create a quiz about World War II', 'Make a chemistry quiz about atoms', 'Generate questions about Python programming'..."
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
            />
          </div>
          
          {/* Adding sources using dropzone */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-base font-semibold text-gray-700">Add sources (optional)</p>
            </div>
            <div className="space-y-4">
              <UploadFile sources = {sources} setSources = {setSources}/>
              <UploadYoutubeLink linkSources = {linkSources} setLinkSources = {setLinkSources} linkSourcesTitles = {linkSourcesTitles} setLinkSourcesTitles = {setLinkSourcesTitles}/>
            </div>
          </div>
          
          {/* Quiz settings */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Number of questions
                </label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-base"
                >
                  {range.map((num) => (
                    <option key={num} value={num}>
                      {num} questions
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <DifficultyToggle />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <QuizButton click={handleAsk} not={loading}/> 
          </div>
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Your Generated Quiz</h1>
              <p className="text-gray-600 text-base lg:text-lg">Review your questions below</p>
            </div>
            <div className="space-y-6">
              {(() => {
                try {
                  const parsed = JSON.parse(response!);
                  return Array.isArray(parsed) ? parsed.map((questionData: QuestionMap, index) => {
                    return (
                    <Fragment key = {index}>
                    <div className="mb-6">
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
        </div>
        ) : (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="text-base font-semibold text-gray-700">
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
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
                >
                  Start New Quiz
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / (quizData.length + 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Question display */}
            <div className="mb-6 pl-30 pr-30">
              {currentQuestionIndex < quizData.length ?
              <QuestionContext.Provider value = {{setCorrectCount, setAnswered}}>
              <Question key={quizData[currentQuestionIndex].questionText} {...quizData[currentQuestionIndex]} />
              </QuestionContext.Provider>
              :  <SummaryPanel correctCount = {correctCount} answered = {answered}/>
              }
            </div>
            
            {/* Navigation buttons - sticky for better access */}
            <div className="sticky bottom-4 flex justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20 mt-6">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none border border-gray-200 text-base"
              >
                ← Previous
              </button>
              
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(quizData.length, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex > quizData.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-base"
              >
               {currentQuestionIndex !== quizData.length-1 ? 
               <div> Next → </div> : 
               <div> Summary → </div>
               }
              </button>
            </div>
          </div>
        </div>
        )}
        </>
        }
      {quizData && 
      <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col justify-center items-center mt-16 lg:mt-24 space-y-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 p-6 lg:p-8 max-w-lg w-full mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <span className="text-2xl">📄</span>
            Download Quiz PDF
          </h3>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="quiz-header" className="text-sm font-medium text-gray-700">
                Quiz Header
              </label>
              <input 
                id="quiz-header"
                placeholder="Enter quiz title..." 
                type="text" 
                onChange={(e) => setHeader(e.target.value)} 
                value={header}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

             <div className="space-y-2">
              <label htmlFor="quiz-title" className="text-sm font-medium text-gray-700">
                Quiz Title
              </label>
              <input 
                id="quiz-title"
                placeholder="Enter quiz title..." 
                type="text" 
                onChange={(e) => setTitle(e.target.value)} 
                value={title}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">
                Export Options
              </label>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <input 
                  type="checkbox" 
                  id="include-key"
                  checked={includeKey}
                  onChange={() => setIncludeKey(!includeKey)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                />
                <label htmlFor="include-key" className="text-sm text-gray-700 cursor-pointer select-none">
                  Include detailed answer key
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <input 
                  type="checkbox" 
                  id="include-simple-key"
                  checked={includeSimpleKey}
                  onChange={() => setIncludeSimpleKey(!includeSimpleKey)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                />
                <label htmlFor="include-simple-key" className="text-sm text-gray-700 cursor-pointer select-none">
                  Include simple answer key
                </label>
              </div>
            </div>
          </div>
        </div>

        <FileAcceptor quizData={quizData} includeKey={includeKey} includeSimpleKey={includeSimpleKey} title={debouncedTitle} header = {debouncedHeader}/>
      </div>
      </>
      }
    </div>
  );
}
