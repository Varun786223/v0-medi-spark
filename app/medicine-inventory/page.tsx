// ... existing code from earlier minimal monochrome version with VoiceAssist ...
"use client"

import { useMemo, useState } from "react"
import VoiceAssist, { speak } from "@/components/voice-assist"

type Med = { name: string; stock: number; monthlyUse: number }

export default function MedicineInventoryPage() {
  const [lang, setLang] = useState("en-US")
  const [name, setName] = useState("")
  const [stock, setStock] = useState("")
  const [monthly, setMonthly] = useState("")
  const [list, setList] = useState<Med[]>([])

  const add = () => {
    const s = Number.parseInt(stock || "0", 10)
    const m = Number.parseInt(monthly || "0", 10)
    const row = { name: name || "Unknown", stock: isNaN(s) ? 0 : s, monthlyUse: isNaN(m) ? 0 : m }
    setList([row, ...list])
    speak("Inventory item added.", lang)
    setName("")
    setStock("")
    setMonthly("")
  }

  const forecasts = useMemo(() => {
    return list.map((it) => ({
      ...it,
      monthsLeft: it.monthlyUse > 0 ? (it.stock / it.monthlyUse).toFixed(1) : "∞",
    }))
  }, [list])

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold text-[#253900] mb-4">Medicine Inventory</h1>

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

      <VoiceAssist
        lang={lang}
        onTranscript={(text) => {
          // e.g. "paracetamol stock 120 use 60"
          setName(text.split(" ")[0] || name)
          const s = text.match(/stock\s+(\d+)/i)?.[1]
          const u = text.match(/use\s+(\d+)/i)?.[1]
          if (s) setStock(s)
          if (u) setMonthly(u)
        }}
        className="mb-3"
      />

      <div className="grid gap-2 sm:grid-cols-4">
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medicine"
        />
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
        />
        <input
          className="px-3 py-2 rounded-md border border-[#253900]/20 bg-white text-sm"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          placeholder="Monthly use"
        />
        <button onClick={add} className="px-4 py-2 rounded-md bg-[#08CB00] text-[#000000] text-sm font-medium">
          Add
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {forecasts.map((it, i) => (
          <li key={i} className="p-3 rounded-md border border-[#253900]/20 bg-white">
            <div className="text-sm text-[#000000]">{it.name}</div>
            <div className="text-xs text-[#253900]">
              stock {it.stock} · use {it.monthlyUse}/mo · lasts ~{it.monthsLeft} months
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
