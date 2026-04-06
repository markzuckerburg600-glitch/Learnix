"use client"
import { useCallback, useState } from 'react';
// Use react-dropzone for drap-n-drop
// use react-pdftotext to extract text and put it to prompt
import { useDropzone } from 'react-dropzone';
import pdfToText from 'react-pdftotext';
import { X } from 'lucide-react';

const dropzoneStyle = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
};
// Adds onto prompt based on the file the user sends
export default function UploadFile({ sources, setSources }: { sources: string[], setSources }) {
  const [files, setFiles] = useState([])

  const onDrop = (acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    pdfToText(acceptedFiles[0])
    .then(text => {console.log(text); setSources((prev) => [...prev, text])})
    .catch(error => console.error("Failed to extract the text", error))
    console.log("added file")
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
    <div {...getRootProps()} style={dropzoneStyle}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the PDF here ...</p> :
          files ? 
          <div> File(s) Uploaded Sucessfully!</div> :
          <div> </div>
      }
    </div>
    <div className = "mt-5">
    {files.map((file, i) => {
        return (
            <div key = {i} className = "pr-10 relative bg-gray-200 border-2 rounded-3xl p-3 mb-3 hover:scale-105 transition-all duration-200 ease-in-out">
                {file.name}
                <button className = "absolute right-2 hover:cursor-pointe" onClick = {() => removeFile(i)}>
                <X/>
                </button>
            </div>
        )
    })}
    </div>
    </>
  );
}

