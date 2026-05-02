"use client"

import { useState, useEffect } from "react"
import { SendHorizonal, Globe, Plus, Mic, Brain } from "lucide-react"
import SelectChatbot from "./SelectChatbot"
import puter from "@heyputer/puter.js"
import { MarkdownContent } from "../ui/markdown"
import { usePathname } from "next/navigation"

export default function Chatbot({ sources, linkSources }: { sources: string[], linkSources: string[] }) {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
  const [input, setInput] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [chatModel, setChatModel] = useState<string>("gpt-5-nano")
  const [thinking, setThinking] = useState<string>("")
  // Web search
  const [search, setSearch] = useState<boolean>(false)
  // Initial messages for fetching 
  const [initialMessages, setInitialMessages] = useState<{ role: string, content: string }[]>([])

  const pathname = usePathname()
  const notebookId = pathname?.split("/").pop() // Last part of url
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(`/api/chatmessages?notebookId=${notebookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("Failed to get chat messages")
        }
        const data = await response.json()
        // FIX: data contains database user id and notebook id, we need to access the messages array
        // Fix the backend for that 
        console.log("Initial messages:", data)
        if (data && data[0]) {
          // List of messages 
          setInitialMessages(data[0].content)
        } else {
          setInitialMessages([])
        }
      } catch (error) {
        console.error("Error getting chat messages:", error)
      }
    }
    getMessages()
  }, [notebookId])
  console.log(initialMessages)

  const saveChatMessage = async (message: { role: string, content: string }) => {
    try {
      const response = await fetch(`/api/chatmessages?notebookId=${notebookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to save chat message")
      }
    } catch (error) {
      console.error("Error saving chat message:", error)
    }
  }

  // System prompt and stuff 
  let systemPrompt = `
  You are a tutor who analyzes sources to simplify complex topics. 
  Use bullet points or tables instead of long paragraphs
  Here are the users sources.`
  if (sources || linkSources) {
  systemPrompt += sources.join("\n")
  systemPrompt += linkSources.join("\n")
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setThinking("")
    setLoading(true)
    // Request 
    try {
      await saveChatMessage({ role: "user", content: input })
      const reply = await puter.ai.chat([
        {
          role: "system",
          content: systemPrompt
        },
        
        ...messages,
        userMessage
      ], {
        model: chatModel,
        ...(search && { tools: [{ type: "web_search" }] }),
        stream: true,
      })

      const assistantMessage = {
        role: "assistant",
        content: ""
      }
      // Prevent duplicated content cuz react acting weird 
      let content = ""
      let thinkingStream = ""
      setMessages(prev => [...prev, assistantMessage])

      for await (const part of reply) {
        // Thinking mode for the model 
        if (part?.reasoning) {
          thinkingStream += part?.reasoning
          setThinking(thinkingStream)
        }
        // Could be undefined 
        content += part.text || ""
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1].content = content
          return updated
        }
        )
      }
      await saveChatMessage({ role: "assistant", content })
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Sorry, something went wrong. Error: ${error instanceof Error ? error.message : String(error)}`
      }])
    } finally {
      setLoading(false)

    }
  }

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">AI Chatbot</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 bg-white rounded-xl border border-gray-200">
        {initialMessages.length === 0 && messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-lg">Start a conversation!</p>
            <p className="text-sm mt-2">Ask me anything about your sources.</p>
          </div>
        ) : (
          // Making sure to merge initialMessages and messages 
          [...initialMessages, ...messages].map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
              >
                <MarkdownContent id = {index} content = {message.content}/>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl max-w-[80%]">
              <div className="flex items-start space-x-2">
                <Brain className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-700 mb-1">Thinking</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{thinking}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="What would you like to know?"
          className="pt-5 pb-10 resize-none flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-100"
          disabled={loading}
        />
        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="right-5 bottom-3 absolute px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SendHorizonal />
        </button>

        {/* Adding attachments */}
        <button onClick={() => { }} className={`p-1 rounded-md absolute bottom-3 left-3 bg-gray-100 hover:bg-gray-300`}>
          <Plus color="gray" />
        </button>

        {/* Mic Icon */}
        <button onClick={() => { }} className={`p-1 rounded-md absolute bottom-3 left-15 bg-gray-100 hover:bg-gray-300`}>
          <Mic color="gray" />
        </button>

        {/* Select Model */}
        <SelectChatbot chatModel = {chatModel} setChatModel = {setChatModel}/>

        {/* Web search */}
        <button onClick={() => setSearch(!search)} className={` p-1 pl-3 pr-3 rounded-md absolute bottom-3 left-27 ${search ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-100 hover:bg-gray-300"}`}>
          <div className="flex flex-row items-center justify-center">
            <Globe color={`${search ? "white" : "gray"}`} />
            <span className={`${search ? "text-white" : "text-gray-600"} ml-3`}> Search </span>
          </div>
        </button>
      </div>
    </div>
  )
}
