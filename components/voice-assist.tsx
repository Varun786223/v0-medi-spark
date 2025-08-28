"use client"

import React from "react"

type VoiceAssistProps = {
  onTranscript: (text: string) => void
  lang?: string // e.g., 'en-US', 'hi-IN'
  autoSpeakResponse?: string | null
  className?: string
}

export function speak(text: string, lang = "en-US") {
  try {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = lang
    utter.rate = 1
    utter.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  } catch {
    // no-op
  }
}

export default function VoiceAssist({ onTranscript, lang = "en-US", autoSpeakResponse, className }: VoiceAssistProps) {
  const [supported, setSupported] = React.useState(false)
  const [recording, setRecording] = React.useState(false)
  const recognitionRef = React.useRef<any>(null)
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    const w: any = typeof window !== "undefined" ? window : {}
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition
    if (Rec) {
      setSupported(true)
      recognitionRef.current = new Rec()
      recognitionRef.current.lang = lang
      recognitionRef.current.interimResults = false
      recognitionRef.current.continuous = false
      recognitionRef.current.onresult = (event: any) => {
        let collected = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          collected += event.results[i][0].transcript
        }
        if (collected?.trim()) onTranscript(collected.trim())
      }
      recognitionRef.current.onerror = (e: any) => {
        setErrorMsg(e?.error || "Voice recognition error")
        setRecording(false)
      }
      recognitionRef.current.onend = () => setRecording(false)
    } else {
      setSupported(false)
    }
    return () => {
      try {
        recognitionRef.current?.stop?.()
      } catch {}
    }
  }, [lang, onTranscript])

  React.useEffect(() => {
    if (autoSpeakResponse && autoSpeakResponse.trim()) {
      speak(autoSpeakResponse, lang)
    }
  }, [autoSpeakResponse, lang])

  const start = () => {
    if (!supported) return
    try {
      setErrorMsg(null)
      setRecording(true)
      recognitionRef.current?.start?.()
    } catch (e: any) {
      setErrorMsg(e?.message || "Unable to start voice")
      setRecording(false)
    }
  }

  const stop = () => {
    if (!supported) return
    try {
      recognitionRef.current?.stop?.()
      setRecording(false)
    } catch {}
  }

  return (
    <div
      className={`${className || ""} flex items-center gap-2 p-2 rounded-md border border-[#253900]/20 bg-[#EEEEEE] text-[#000000]`}
      aria-live="polite"
    >
      <button
        type="button"
        onClick={recording ? stop : start}
        className={`px-3 py-2 rounded-md text-sm font-medium ${recording ? "bg-[#253900] text-white" : "bg-[#08CB00] text-[#000000]"} focus:outline-none focus:ring-2 focus:ring-[#08CB00] focus:ring-offset-2`}
        aria-pressed={recording}
        aria-label={recording ? "Stop voice recording" : "Start voice recording"}
      >
        {recording ? "Stop" : "Speak"}
      </button>
      <div className="text-xs text-[#253900]">
        {supported ? (recording ? "Listening…" : "Tap Speak, talk, then Stop") : "Voice not supported"}
      </div>
      {errorMsg ? (
        <div className="ml-auto text-xs text-red-600" role="alert">
          {errorMsg}
        </div>
      ) : null}
    </div>
  )
}
