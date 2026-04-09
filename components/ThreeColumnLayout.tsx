"use client"

import { ReactNode } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"
import Chatbot from "./Chatbot"
import UploadFile from "./FileUploads/UploadFile"
import UploadYoutubeLink from "./FileUploads/UploadYoutubeLink"

interface ThreeColumnLayoutProps {
  children: ReactNode
  sources: string[]
  setSources: React.Dispatch<React.SetStateAction<string[]>>
  linkSources: string[]
  setLinkSources: React.Dispatch<React.SetStateAction<string[]>>
  linkSourcesTitles: string[]
  setLinkSourcesTitles: React.Dispatch<React.SetStateAction<string[]>>
}

export default function ThreeColumnLayout({
  children,
  sources,
  setSources,
  linkSources,
  setLinkSources,
  linkSourcesTitles,
  setLinkSourcesTitles,
}: ThreeColumnLayoutProps) {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-screen">
      <ResizablePanel defaultSize="25%" minSize="20%">
        <div className="h-full p-4 bg-white border-r border-gray-200 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sources</h2>
          <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm font-semibold text-gray-700">Add sources (optional)</p>
            </div>
            <div className="space-y-4">
              {setSources && <UploadFile sources={sources} setSources={setSources} />}
              {setLinkSources && (
                <UploadYoutubeLink
                  linkSources={linkSources}
                  setLinkSources={setLinkSources}
                  linkSourcesTitles={linkSourcesTitles}
                  setLinkSourcesTitles={setLinkSourcesTitles}
                />
              )}
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="35%" minSize="25%">
        <Chatbot />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="40%" minSize="30%">
        <div className="h-full p-4 bg-gray-50 overflow-y-auto">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
