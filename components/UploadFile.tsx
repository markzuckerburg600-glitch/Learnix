"use client"
import { useCallback, useState } from 'react';
// Use react-dropzone for drap-n-drop
// use react-pdftotext to extract text and put it to prompt
import { useDropzone } from 'react-dropzone';
import pdfToText from 'react-pdftotext';

const dropzoneStyle = {
  border: '2px dashed #d1d5db',
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center' as const,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)'
};
// Adds onto prompt based on the file the user sends
export default function UploadFile({ sources, setSources }: { sources: string[], setSources: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = async (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    
    // Process all files
    const textPromises = acceptedFiles.map((file: File) => 
      pdfToText(file).catch(error => {
        console.error("Failed to extract text from file:", error)
        return "" // Return empty string on error
      })
    )
    
    const extractedTexts = await Promise.all(textPromises)
    setSources(prev => [...prev, ...extractedTexts])
  };
/**
 * getRootProps -> makes div into drap and drop container
 * getInputProps -> makes input handle file selection  
 * boolean that's true when using is dragging files over that area
 */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'] // Restrict to PDF only
    },
    multiple: true,
    maxSize: 5242880, // ~5mb 
    maxFiles: 5, 
  });

  const removeFile = (i: number) => {
    setFiles(files.filter((_, index) => index !== i))
    setSources(sources.filter((_, index) => index !== i))
  }

  return (
    <>
    <div 
      {...getRootProps()} 
      style={dropzoneStyle}
      className="hover:border-blue-400 hover:bg-blue-50/50 group"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        {
          isDragActive ?
            <div className="text-center">
              <p className="text-lg font-semibold text-blue-600 mb-2">Drop the PDF here</p>
              <p className="text-sm text-gray-600">Release to upload your file</p>
            </div> :
            files.length > 0 ? 
            <div className="text-center">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">File(s) Uploaded Successfully!</span>
              </div>
              <p className="text-sm text-gray-600">Click or drag more files to add</p>
            </div> :
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700 mb-2">Upload PDF Files</p>
              <p className="text-sm text-gray-600">Drag & drop or click to browse</p>
              <p className="text-xs text-gray-500 mt-2">Maximum 5 files, 5MB each</p>
            </div>
        }
      </div>
    </div>
    
    {files.length > 0 && (
      <div className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Files:</h3>
        {files.map((file, i) => {
          return (
            <div key={i} className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300 group">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              <button 
                onClick={() => removeFile(i)}
                className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    )}
    </>
  );
}

