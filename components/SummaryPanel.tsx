

export default function SummaryPanel({correctCount, answered}: {correctCount: number, answered: number}) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h2>
        <div className="text-xl text-gray-600 mb-6">
          You scored <span className="font-bold text-green-600">{correctCount}</span> out of <span className="font-bold">{answered}</span> questions
        </div>
        <div className="text-lg text-gray-500">
          {correctCount === answered ? "Perfect score! 🎉" : 
           correctCount >= answered * 0.8 ? "Great job! 🌟" : 
           correctCount >= answered * 0.6 ? "Good effort! 👍" : 
           "Keep practicing! 💪"}
        </div>
      </div>
    </div>
  )
}
