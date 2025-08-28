// ... existing code from earlier minimal monochrome version with VoiceAssist ...
"use client"

import { useState } from "react"
import VoiceAssist, { speak } from "@/components/voice-assist"

const EXERCISES = [
  "Take a slow breath in for 4 seconds, hold 4, out 4. Repeat three times.",
  "Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
  "Say one kind sentence to yourself: “I am doing my best today.”",
]

export default function MentalHealthPage() {
  const [lang, setLang] = useState("en-US")
  const [last, setLast] = useState<string>("")

  const coach = (text: string) => {
    const t = text.toLowerCase()
    let reply = "I hear you. Let’s try one short breathing exercise."
    if (t.includes("anxious") || t.includes("anxiety")) reply = EXERCISES[0]
    else if (t.includes("stress") || t.includes("stressed")) reply = EXERCISES[1]
    else if (t.includes("sad") || t.includes("down")) reply = EXERCISES[2]
    setLast(reply)
    speak(reply, lang)
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold text-[#253900] mb-4">Mental Health Assistant</h1>

      <div className="mb-3">
        <label className="text-sm text-[#253900] mr-2">Language</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-2 py-1 rounded border border-[#253900]/20 bg-white text-sm"
        >
          <option>en-US</option>
          <option>hi-IN</option>
          <option>bn-IN</option>
          <option>ta-IN</option>
        </select>
      </div>

      <VoiceAssist lang={lang} onTranscript={(text) => coach(text)} className="mb-3" />

      <div className="p-3 rounded-md border border-[#253900]/20 bg-white">
        <div className="text-xs text-[#253900] mb-1">Assistant</div>
        <div className="text-sm text-[#000000] min-h-10">{last || "Tell me how you feel today…"}</div>
      </div>
    </main>
  )
}
