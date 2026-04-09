"use client"

import { useState } from "react"
import UploadYoutubeLink from "./UploadYoutubeLink"
import Modal from "./ui/modal"
import { Play } from "lucide-react"

interface UploadYoutubePopupProps {
  linkSources: string[]
  setLinkSources: React.Dispatch<React.SetStateAction<string[]>>
  linkSourcesTitles: string[]
  setLinkSourcesTitles: React.Dispatch<React.SetStateAction<string[]>>
}

export default function UploadYoutubePopup({
  linkSources,
  setLinkSources,
  linkSourcesTitles,
  setLinkSourcesTitles,
}: UploadYoutubePopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300 flex flex-col items-center gap-2 group"
      >
        <div className="w-12 h-12 bg-linear-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
          <Play className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-gray-700">Add YouTube Videos</span>
        <span className="text-xs text-gray-500">{linkSources.length} video(s) added</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add YouTube Videos">
        <UploadYoutubeLink
          linkSources={linkSources}
          setLinkSources={setLinkSources}
          linkSourcesTitles={linkSourcesTitles}
          setLinkSourcesTitles={setLinkSourcesTitles}
        />
      </Modal>
    </>
  )
}
