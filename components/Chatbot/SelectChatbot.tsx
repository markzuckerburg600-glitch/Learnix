"use client"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { SetStateAction, useEffect, useState } from "react"
import puter from "@heyputer/puter.js"

interface Model {
  id: string
  name?: string
  provider?: string
}

export default function SelectChatbot({ chatModel, setChatModel }: { chatModel: string, setChatModel: Dispatch<SetStateAction<string>>}) {
  const [models, setModels] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>(chatModel)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const availableModels = await puter.ai.listModels()
        const modelIds = (availableModels as unknown as Model[]).map((model) => model.id || model.name || "")
        setModels(modelIds)
        if (modelIds.length > 0 && !chatModel) {
          setSelectedModel(modelIds[0])
          setChatModel(modelIds[0])
        }
      } catch (error) {
        console.error("Failed to fetch models:", error)
        const fallbackModels = ["gpt-4o-mini", "gpt-4o", "claude-opus-4-5"]
        setModels(fallbackModels)
        if (!chatModel) {
          setSelectedModel(fallbackModels[0])
          setChatModel(fallbackModels[0])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [setChatModel, chatModel])

  useEffect(() => {
    if (chatModel) {
      setSelectedModel(chatModel)
    }
  }, [chatModel])

  const handleValueChange = (value: string | null) => {
    if (value) {
      setSelectedModel(value)
      setChatModel(value)
    }
  }

  return (
    <div className = "absolute bottom-3 left-59">
    <Combobox items={models} value={selectedModel} onValueChange={handleValueChange}>
      <ComboboxInput placeholder={loading ? "Loading models..." : "Select model"} disabled={loading} />
      <ComboboxContent>
        <ComboboxEmpty>No models found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    </div>
  )
}

     