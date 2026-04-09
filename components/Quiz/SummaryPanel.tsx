
export default function SummaryPanel({correctCount, answered}: {correctCount: number, answered: number}) {
  const percentage = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;
  
  const getScoreColor = () => {
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 70) return 'from-blue-500 to-indigo-500';
    if (percentage >= 50) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };
  
  const getScoreMessage = () => {
    if (percentage === 100) return { text: 'Perfect Score! 🎉', emoji: '🏆' };
    if (percentage >= 80) return { text: 'Excellent Work! 🌟', emoji: '⭐' };
    if (percentage >= 60) return { text: 'Good Job! 👍', emoji: '👏' };
    return { text: 'Keep Practicing! 💪', emoji: '💡' };
  };
  
  const scoreMessage = getScoreMessage();
  
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 pl-20 pr-20 shadow-2xl border border-white/20 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        {/* Score Circle */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto relative">
            <div className={`absolute inset-0 bg-linear-to-r ${getScoreColor()} rounded-full animate-pulse-slow opacity-20`}></div>
            <div className="relative w-full h-full bg-linear-to-r from-gray-50 to-white rounded-full shadow-xl flex items-center justify-center border-4 border-white">
              <div className="text-center">
                <div className={`text-3xl font-bold bg-linear-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
                  {percentage}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Score</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Title and Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Quiz Complete!</h2>
        
        <div className="mb-6">
          <div className="text-xl text-gray-700 mb-3">
            You scored <span className={`font-bold bg-linear-to-r ${getScoreColor()} bg-clip-text text-transparent text-2xl`}>{correctCount}</span> out of <span className="font-bold text-gray-800 text-2xl">{answered}</span> questions
          </div>
          
          <div className="flex items-center justify-center gap-3 text-lg">
            <span className="text-2xl">{scoreMessage.emoji}</span>
            <span className={`font-semibold bg-linear-to-r ${getScoreColor()} bg-clip-text text-transparent`}>
              {scoreMessage.text}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full bg-linear-to-r ${getScoreColor()} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-20 animate-shimmer"></div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600 font-medium">{percentage}% Complete</div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-1 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Another Quiz
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium shadow hover:shadow-lg transform hover:scale-105"
          >
            Print Results
          </button>
        </div>
      </div>
    </div>
  )
}
