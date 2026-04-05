"use client"
import { useEffect } from "react";


export default function Error({ error, reset }: { error: Error, reset: () => void}) {
    useEffect(() => {
        console.error(error)
    }, [])
  return (
    <div>
      <button onClick = {reset}>
      </button>
    </div>
  )
}
