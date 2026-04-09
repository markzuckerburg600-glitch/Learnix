"use client";

import { useState, useRef } from "react";
import { useDebounce } from "use-debounce"
import puter from "@heyputer/puter.js";
import Question from "./Quiz/Question";
import Loader from "./Loading";
import SummaryPanel from "./Quiz/SummaryPanel";
import FileAcceptor from "./FileUploads/FileAcceptor";
import UploadPdfPopup from "./FileUploads/UploadPdfPopup";
import UploadYoutubePopup from "./FileUploads/UploadYoutubePopup";
import QuizGeneratorPopup from "./Quiz/QuizGeneratorPopup";
import { QuestionContext } from "@/lib/context";
import Chatbot from "./Chatbot";
import Modal from "./ui/modal";
// Resizeable panel layout
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { X } from "lucide-react";

export default interface QuestionMap {
    questionText: string,
    choices: string[],
    hint: string,
    correct: number,
    explanation: string 
}

export default function QuizGeneratorServer() {
  const [prompt, setPrompt] = useState<string>("");
  const [sources, setSources] = useState<string[]>([])
  const [linkSources, setLinkSources] = useState<string[]>([])
  const [linkSourcesTitles, setLinkSourcesTitles] = useState<string[]>([])
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
  const [showQuizModal, setShowQuizModal] = useState(false)

  const range = Array.from({ length: 55 }, (_, i) => i + 1)

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
    "explanation": "Why this answer is correct"
  }
]

Example:
[
  {
    "questionText": "What is 2+2?",
    "choices": ["2", "1", "3", "4"],
    "hint": "Basic arithmetic",
    "correct": 1,
    "explanation": "2+2 equals 4"
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
      setCurrentQuestionIndex(0);
    } catch (err: unknown) {
      if (isCancelledRef.current) return; // Don't show error if cancelled

      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-[calc(100vh-64px)] w-full">
      {/* Sources and sources viewer */}
      <ResizablePanel defaultSize="25%" minSize="20%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel>
        <div className="h-full p-4 bg-white border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sources</h2>
          <div className="space-y-4">
            <UploadPdfPopup sources={sources} setSources={setSources} />
            <UploadYoutubePopup
              linkSources={linkSources}
              setLinkSources={setLinkSources}
              linkSourcesTitles={linkSourcesTitles}
              setLinkSourcesTitles={setLinkSourcesTitles}
            />
          </div>
        </div>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel maxSize="50%">
        <div className="h-full p-4 bg-white overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Uploaded Sources</h3>
          {sources.length === 0 && linkSources.length === 0 ? (
            <p className="text-gray-500 text-sm">No sources uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{source}</span>
                    <button onClick = {() => {
                      setSources(sources.filter((_, i) => i !== index))
                    }}>
                    <X/>
                    </button>
                  </div>
                </div>
              ))}
              {linkSources.map((source, index) => (
                <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{linkSourcesTitles[index] || source}</span>
                    <button onClick = {() => {
                      setLinkSources(linkSources.filter((_, i) => i !== index))
                    }}>
                    <X/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      {/* Chatbot section */}
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize="35%" minSize="25%">
        <Chatbot/>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize="40%" minSize="30%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel maxSize="70%">
        <div className="h-full p-4 bg-gray-50 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <QuizGeneratorPopup
              prompt={prompt}
              setPrompt={setPrompt}
              numQuestions={numQuestions}
              setNumQuestions={setNumQuestions}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              range={range}
              onGenerate={handleAsk}
              loading={loading}
            />
            <button className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300 flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 bg-linear-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">Video Support</span>
            </button>
          </div>

          {quizData && (
            <button
              onClick={() => setShowQuizModal(true)}
              className="w-full p-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              View Generated Quiz
            </button>
          )}
        {loading && (
          <Loader onCancel={cancelRequest} />
        )}
    </div>
    </ResizablePanel>
    <ResizableHandle withHandle/>
    <ResizablePanel maxSize="70%" minSize="20%">
        <div className="h-full p-4 bg-white overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Generated Documents</h3>
          {quizData ? (
            <div className="space-y-3">
              <button
                onClick={() => setShowQuizModal(true)}
                className="w-full p-4 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Quiz 1</span>
                  <span className="text-sm opacity-80">{quizData.length} questions</span>
                </div>
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No documents generated yet</p>
          )}
        </div>
    </ResizablePanel>
    </ResizablePanelGroup>
    </ResizablePanel>

    {/* Quiz Modal */}
    {showQuizModal && quizData && (
      <Modal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} title="Your Quiz">
        <div className="min-h-[60vh]">
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
                  setCurrentQuestionIndex(0);
                  setPrompt("");
                  setShowQuizModal(false);
                }}
                className="px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 text-base"
              >
                Start New Quiz
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-linear-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / (quizData.length + 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question display */}
          <div className="mb-6">
            {currentQuestionIndex < quizData.length ?
              <QuestionContext.Provider value={{ setCorrectCount, setAnswered }}>
                <Question key={quizData[currentQuestionIndex].questionText} {...quizData[currentQuestionIndex]} />
              </QuestionContext.Provider>
              : <SummaryPanel correctCount={correctCount} answered={answered} />
            }
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20 mt-6">
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
              className="px-6 py-3 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-base"
            >
              {currentQuestionIndex !== quizData.length - 1 ?
                <div> Next → </div> :
                <div> Summary → </div>
              }
            </button>
          </div>

          {/* PDF Download Options */}
          {currentQuestionIndex === quizData.length && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-xl">📄</span>
                Download Quiz PDF
              </h3>

              <div className="space-y-3">
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

              <FileAcceptor quizData={quizData} includeKey={includeKey} includeSimpleKey={includeSimpleKey} title={debouncedTitle} header={debouncedHeader} />
            </div>
          )}
        </div>
      </Modal>
    )}
    </ResizablePanelGroup>
  );
}
