"use client"

import { useState } from "react"
import Modal from "../ui/modal"
import QuizButton from "../ui/quizButton"
import { Brain } from "lucide-react"

interface QuizGeneratorPopupProps {
  prompt: string
  setPrompt: React.Dispatch<React.SetStateAction<string>>
  numQuestions: number
  setNumQuestions: React.Dispatch<React.SetStateAction<number>>
  difficulty: string
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
  range: number[]
  onGenerate: () => void
  loading: boolean
}

function DifficultyToggle({
  difficulty,
  setDifficulty,
}: {
  difficulty: string
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
}) {
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

export default function QuizGeneratorPopup({
  prompt,
  setPrompt,
  numQuestions,
  setNumQuestions,
  difficulty,
  setDifficulty,
  range,
  onGenerate,
  loading,
}: QuizGeneratorPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 flex flex-col items-center gap-2 group"
      >
        <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
          <Brain className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-gray-700">Generate Quiz</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Quiz Settings">
        <div className="space-y-6">
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
            />
          </div>

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
                <DifficultyToggle difficulty={difficulty} setDifficulty={setDifficulty} />
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <QuizButton click={() => { onGenerate(); setIsOpen(false); }} not={loading} />
          </div>
        </div>
      </Modal>
    </>
  )
}
