// ... existing code from earlier minimal monochrome version with VoiceAssist ...
"use client"

import { useState } from "react"
import VoiceAssist, { speak } from "@/components/voice-assist"

type Tip = { time: string; text: string }

export default function PreventiveCarePage() {
  const [lang, setLang] = useState("en-US")
  const [tip, setTip] = useState("")
  const [tips, setTips] = useState<Tip[]>([])

  const add = (t: string) => {
    if (!t.trim()) return
    const item = { time: new Date().toLocaleString(), text: t.trim() }
    setTips([item, ...tips])
    speak("Tip saved.", lang)
    setTip("")
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold text-[#253900] mb-4">Preventive Care Tips</h1>

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

      <VoiceAssist lang={lang} onTranscript={(text) => add(text)} className="mb-3" />

      <div className="flex gap-2">
        <input
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Add a health tip…"
          className="flex-1 px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
        />
        <button
          onClick={() => add(tip)}
          className="px-4 py-2 rounded-md bg-[#08CB00] text-[#000000] text-sm font-medium"
        >
          Save
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="p-3 rounded-md border border-[#253900]/20 bg-white">
            <div className="text-xs text-[#253900]">{t.time}</div>
            <div className="text-sm text-[#000000]">{t.text}</div>
            <div className="mt-2">
              <button
                onClick={() => speak(t.text, lang)}
                className="px-3 py-1 rounded-md border border-[#253900]/20 bg-white text-xs"
              >
                Play Tip
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
