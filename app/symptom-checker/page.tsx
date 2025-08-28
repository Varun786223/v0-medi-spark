"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MessageCircle, Mic, Send, ArrowLeft, Volume2, CheckCircle, AlertTriangle, Menu, X } from "lucide-react"
import Link from "next/link"
import VoiceAssist, { speak } from "@/components/voice-assist" // add voice controls

export default function SymptomCheckerPage() {
  const [symptomInput, setSymptomInput] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [isRecording, setIsRecording] = useState(false)
  const [result, setResult] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const langMap: Record<string, string> = {
    hindi: "hi-IN",
    tamil: "ta-IN",
    english: "en-US",
    bengali: "bn-IN",
    telugu: "te-IN",
  }

  const handleSymptomCheck = async () => {
    if (!symptomInput.trim()) return

    setIsAnalyzing(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const symptoms = symptomInput.toLowerCase()
    let suggestion = ""
    let severity = "low"

    if (symptoms.includes("fever") || symptoms.includes("बुखार") || symptoms.includes("காய்ச்சல்")) {
      if (symptoms.includes("high") || symptoms.includes("तेज") || symptoms.includes("severe")) {
        suggestion =
          "High fever detected. This could be a serious infection. Please see a health worker immediately. Drink plenty of water and rest."
        severity = "high"
      } else {
        suggestion =
          "Mild fever detected. Possible viral infection. Drink plenty of water, rest, and monitor temperature. See health worker if fever persists over 3 days."
        severity = "medium"
      }
    } else if (symptoms.includes("cough") || symptoms.includes("खांसी") || symptoms.includes("இருமல்")) {
      if (symptoms.includes("blood") || symptoms.includes("खून") || symptoms.includes("இரத்தம்")) {
        suggestion =
          "Cough with blood is serious. Please see a health worker or doctor immediately. This needs urgent medical attention."
        severity = "high"
      } else {
        suggestion =
          "Persistent cough detected. Possible respiratory infection. Avoid cold drinks, stay warm. See health worker if cough worsens or lasts more than a week."
        severity = "medium"
      }
    } else if (symptoms.includes("stomach") || symptoms.includes("पेट") || symptoms.includes("வயிறு")) {
      if (symptoms.includes("severe") || symptoms.includes("तेज") || symptoms.includes("கடுமையான")) {
        suggestion =
          "Severe stomach pain detected. This could be serious. Please see a health worker immediately. Avoid solid foods until examined."
        severity = "high"
      } else {
        suggestion =
          "Stomach discomfort detected. Possible digestive issue. Eat light foods, stay hydrated with clean water. See health worker if pain worsens."
        severity = "low"
      }
    } else if (symptoms.includes("headache") || symptoms.includes("सिरदर्द") || symptoms.includes("தலைவலி")) {
      suggestion =
        "Headache detected. Could be due to stress, dehydration, or lack of sleep. Rest in a quiet place, drink water. See health worker if severe or persistent."
      severity = "low"
    } else if (symptoms.includes("chest pain") || symptoms.includes("सीने में दर्द") || symptoms.includes("மார்பு வலி")) {
      suggestion =
        "Chest pain is serious and needs immediate attention. Please see a health worker or doctor right away. Do not ignore chest pain."
      severity = "high"
    } else {
      suggestion =
        "Please describe your symptoms in more detail for better guidance. Include when symptoms started, how severe they are, and any other related symptoms."
      severity = "low"
    }

    setResult(JSON.stringify({ suggestion, severity, language: selectedLanguage }))
    setIsAnalyzing(false)
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false)
      setSymptomInput("मुझे बुखार और खांसी है, तीन दिन से परेशान हूं")
    }, 3000)
  }

  const playAudioResponse = () => {
    const lang = langMap[selectedLanguage] || "en-US"
    const suggestion = parsedResult?.suggestion || "No result yet."
    speak(suggestion, lang)
  }

  const parsedResult = result ? JSON.parse(result) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEEE] to-white">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg border-[#08CB00] hover:bg-[#08CB00] hover:text-white transition-colors"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 border-r-2 border-[#08CB00] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-[#EEEEEE] bg-gradient-to-r from-[#08CB00] to-[#253900]">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-white" />
            <h2 className="text-lg font-bold text-white">MediSpark</h2>
          </Link>
          <p className="text-sm text-white/90 mt-1">Symptom Checker</p>
        </div>

        <nav className="p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#253900] hover:text-[#08CB00] transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">Symptom Checker</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              Describe your symptoms in your own language. Our AI will analyze them and provide health guidance.
            </p>
          </div>

          {/* Language Selection */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900] text-lg">Select Your Language</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-full border-[#08CB00]/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                  <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Symptom Input */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900] text-lg">Describe Your Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VoiceAssist
                lang={langMap[selectedLanguage] || "en-US"}
                onTranscript={(t) => setSymptomInput((prev) => (prev ? `${prev}\n${t}` : t))}
                className="mb-2"
              />
              <div className="flex gap-2 mb-3">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={startVoiceRecording}
                  disabled={isRecording}
                  className={`${!isRecording ? "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white" : ""}`}
                >
                  <Mic className="h-4 w-4 mr-1" />
                  {isRecording ? "Recording..." : "Voice Input"}
                </Button>
                {selectedLanguage === "hindi" && (
                  <span className="text-sm text-[#253900]/60 self-center">आवाज़ से बोलें</span>
                )}
                {selectedLanguage === "tamil" && (
                  <span className="text-sm text-[#253900]/60 self-center">குரல் மூலம் சொல்லுங்கள்</span>
                )}
              </div>

              <Textarea
                placeholder={
                  selectedLanguage === "hindi"
                    ? "अपने लक्षणों का वर्णन करें... (जैसे: 'मुझे बुखार और खांसी है')"
                    : selectedLanguage === "tamil"
                      ? "உங்கள் அறிகுறிகளை விவரிக்கவும்... (உதாரணம்: 'எனக்கு காய்ச்சல் மற்றும் இருமல் உள்ளது')"
                      : "Describe your symptoms... (e.g., 'I have fever and cough for 3 days')"
                }
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                className="min-h-32 border-[#08CB00]/30 focus:border-[#08CB00] focus:ring-[#08CB00]/20"
                disabled={isRecording}
              />

              <Button
                onClick={handleSymptomCheck}
                className="w-full bg-[#08CB00] hover:bg-[#253900] text-white"
                disabled={isAnalyzing || !symptomInput.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Check Symptoms
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {parsedResult && (
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#253900]">
                  {parsedResult.severity === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : parsedResult.severity === "medium" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-[#08CB00]" />
                  )}
                  AI Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`p-4 rounded-lg border ${
                    parsedResult.severity === "high"
                      ? "bg-red-50 border-red-200"
                      : parsedResult.severity === "medium"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-[#08CB00]/10 border-[#08CB00]/30"
                  }`}
                >
                  <p className="text-sm text-[#253900] leading-relaxed whitespace-pre-line">
                    {parsedResult.suggestion}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={playAudioResponse}
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white transition-colors bg-transparent"
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Play Audio
                  </Button>

                  {parsedResult.severity === "high" && (
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Find Nearest Health Worker
                    </Button>
                  )}
                </div>

                <div className="text-xs text-[#253900]/60 border-t pt-3">
                  <p>
                    ⚠️ This is AI-generated guidance and not a medical diagnosis. Always consult with a qualified health
                    professional for serious symptoms.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How It Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How Symptom Checker Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  Describe symptoms in your local language using voice or text
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">AI analyzes symptoms and matches with medical knowledge</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">Get health guidance and severity assessment</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">Works completely offline - no internet required</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
