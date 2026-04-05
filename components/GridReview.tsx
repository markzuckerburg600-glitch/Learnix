import React from 'react'
import { Quote, Star } from 'lucide-react'

export default function GridReview({ description, by }: { description: string, by: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-200 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:scale-150 transition-transform duration-500" />
      <Quote className="w-8 h-8 text-purple-400 mb-4" />
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 relative z-10 leading-relaxed">{description}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {by.charAt(0)}
        </div>
        <span className="font-semibold text-gray-800">{by}</span>
      </div>
    </div>
  )
}
