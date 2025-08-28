// ... existing code replaced with the minimal monochrome version including VoiceAssist from earlier ...
"use client"

import { useState } from "react"
import VoiceAssist, { speak } from "@/components/voice-assist"

type Point = { village: string; fever: number; cough: number }

export default function OutbreakPredictionPage() {
  const [lang, setLang] = useState("en-US")
  const [village, setVillage] = useState("Nandipur")
  const [fever, setFever] = useState("")
  const [cough, setCough] = useState("")
  const [data, setData] = useState<Point[]>([])

  const add = () => {
    const f = Number.parseInt(fever || "0", 10)
    const c = Number.parseInt(cough || "0", 10)
    const row: Point = { village, fever: isNaN(f) ? 0 : f, cough: isNaN(c) ? 0 : c }
    setData([row, ...data])
    speak("Data added.", lang)
    setFever("")
    setCough("")
  }

  const riskLabel = (p: Point) => {
    const score = p.fever * 2 + p.cough
    if (score >= 10) return "High"
    if (score >= 5) return "Medium"
    return "Low"
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold text-[#253900] mb-4">Outbreak Prediction</h1>

      <div className="mb-3">
        <label className="text-sm text-[#253900] mr-2">Language</label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-2 py-1 rounded border border-[#253900]/20 bg-white text-sm"
        >
          <option value="en-US">en-US</option>
          <option value="hi-IN">hi-IN</option>
          <option value="bn-IN">bn-IN</option>
          <option value="ta-IN">ta-IN</option>
        </select>
      </div>

      <VoiceAssist
        lang={lang}
        onTranscript={(text) => {
          // e.g. "Nandipur fever 6 cough 3"
          setVillage(text.split(" ")[0] || village)
          const matchF = text.match(/fever\s+(\d+)/i)
          const matchC = text.match(/cough\s+(\d+)/i)
          setFever(matchF?.[1] || "")
          setCough(matchC?.[1] || "")
        }}
        className="mb-3"
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          placeholder="Village"
        />
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={fever}
          onChange={(e) => setFever(e.target.value)}
          placeholder="Fever count"
        />
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={cough}
          onChange={(e) => setCough(e.target.value)}
          placeholder="Cough count"
        />
        <button onClick={add} className="px-4 py-2 rounded-md bg-[#08CB00] text-[#000000] text-sm font-medium">
          Add
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {data.map((p, i) => (
          <li key={i} className="p-3 rounded-md border border-[#253900]/20 bg-white">
            <div className="text-sm text-[#000000]">{p.village}</div>
            <div className="text-xs text-[#253900]">
              fever {p.fever} · cough {p.cough} · risk {riskLabel(p)}
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
