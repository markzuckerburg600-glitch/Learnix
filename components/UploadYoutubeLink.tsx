"use client"

import { useState } from "react"
import { fetchTranscript } from "youtube-transcript"
import { YoutubeFetchingResponse } from "@/types/types"
import { X, Play, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function UploadYoutubeLink({
    linkSources,
    setLinkSources,
    linkSourcesTitles,
    setLinkSourcesTitles
}: {
    linkSources: string[],
    setLinkSources: React.Dispatch<React.SetStateAction<string[]>>
    linkSourcesTitles: string[],
    setLinkSourcesTitles: React.Dispatch<React.SetStateAction<string[]>>
}) {

    const [link, setLink] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")

    const handleClick = async (): Promise<void> => {
        if (!link.trim()) {
            setError("Please enter a YouTube URL")
            return
        }
        
        setLoading(true)
        setError("")
        setSuccess("")
        
        try {
            // Fetch from backend cuz of cors 
            const res = await fetch(`api/transcript?url=${encodeURIComponent(link)}`)
            
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to fetch transcript')
            }
            
            const result: YoutubeFetchingResponse = await res.json()
            
            setLinkSources((prev) => [...prev, result.transcript])
            setLinkSourcesTitles((prev) => [...prev, result.title])
            setSuccess(`Successfully added: ${result.title}`)
            setLink("")
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch transcript')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="space-y-3">
            {/* Input Section */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                    <input 
                        type="url" 
                        placeholder="Enter a YouTube URL..." 
                        value={link} 
                        onChange={(e) => {
                            setLink(e.target.value)
                            setError("")
                            setSuccess("")
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleClick()}
                        className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm"
                        disabled={loading}
                    />
                </div>
                <button 
                    onClick={handleClick} 
                    disabled={loading || !link.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2 min-w-24"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-sm">Loading...</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-3 h-3" />
                            <span className="text-sm">Add</span>
                        </>
                    )}
                </button>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="text-xs">{error}</span>
                </div>
            )}
            
            {success && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    <span className="text-xs">{success}</span>
                </div>
            )}

            {/* Added Videos List */}
            {linkSources.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Play className="w-3 h-3" />
                        Added Videos ({linkSources.length})
                    </h4>
                    <div className="grid gap-2">
                        {linkSourcesTitles.map((title, i) => (
                            <div 
                                key={i} 
                                className="group relative p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 rounded-lg hover:shadow-sm transition-all duration-300"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Play className="w-3 h-3 text-red-500 shrink-0" />
                                            <h5 className="text-sm font-medium text-gray-800 truncate">{title}</h5>
                                        </div>
                                        {linkSources[i] && 
                                        <p className="text-xs text-gray-600">
                                            Transcript: {linkSources[i].substring(0, 80)}...
                                        </p>
                                        }
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setLinkSources(prev => prev.filter((_, index) => index !== i))
                                            setLinkSourcesTitles(prev => prev.filter((_, index) => index !== i))
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-100 rounded-md transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        aria-label="Remove video"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
