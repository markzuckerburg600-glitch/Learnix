"use client"

import { useState } from "react"
import UploadFile from "./UploadFile"
import Modal from "./ui/modal"
import { Upload } from "lucide-react"

interface UploadPdfPopupProps {
  sources: string[]
  setSources: React.Dispatch<React.SetStateAction<string[]>>
}

export default function UploadPdfPopup({ sources, setSources }: UploadPdfPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center gap-2 group"
      >
        <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-gray-700">Upload PDFs</span>
        <span className="text-xs text-gray-500">{sources.length} file(s) uploaded</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload PDF Files">
        <UploadFile sources={sources} setSources={setSources} />
      </Modal>
    </>
  )
}
