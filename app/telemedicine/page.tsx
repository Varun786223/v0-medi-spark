"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import VoiceAssist, { speak } from "@/components/voice-assist" // add voice controls
import {
  Heart,
  Phone,
  ArrowLeft,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Languages,
  Send,
  User,
  Menu,
  X,
  MessageCircle,
  Volume2,
  PhoneCall,
  Calendar,
} from "lucide-react"
import Link from "next/link"

interface Doctor {
  id: string
  name: string
  specialty: string
  languages: string[]
  availability: "online" | "busy" | "offline"
  rating: number
  consultations: number
}

interface Consultation {
  id: string
  patientName: string
  doctorName: string
  status: "scheduled" | "ongoing" | "completed"
  time: string
  language: string
  symptoms: string
}

export default function TelemedicinePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [patientLanguage, setPatientLanguage] = useState("hindi")
  const [doctorLanguage, setDoctorLanguage] = useState("english")
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [translationMode, setTranslationMode] = useState(true)
  const [currentMessage, setCurrentMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "patient",
      originalText: "मुझे सीने में दर्द हो रहा है",
      translatedText: "I am experiencing chest pain",
      language: "hindi",
      timestamp: "10:15",
    },
    {
      id: 2,
      sender: "doctor",
      originalText: "How long have you been experiencing this pain?",
      translatedText: "यह दर्द कितने समय से हो रहा है?",
      language: "english",
      timestamp: "10:16",
    },
  ])

  const [doctors] = useState<Doctor[]>([
    {
      id: "D001",
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      languages: ["Hindi", "English", "Punjabi"],
      availability: "online",
      rating: 4.8,
      consultations: 1250,
    },
    {
      id: "D002",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      languages: ["Hindi", "English", "Bengali"],
      availability: "online",
      rating: 4.9,
      consultations: 890,
    },
    {
      id: "D003",
      name: "Dr. Anita Patel",
      specialty: "Pediatrics",
      languages: ["Hindi", "English", "Gujarati"],
      availability: "busy",
      rating: 4.7,
      consultations: 1100,
    },
  ])

  const [consultations] = useState<Consultation[]>([
    {
      id: "C001",
      patientName: "राम कुमार",
      doctorName: "Dr. Priya Sharma",
      status: "scheduled",
      time: "11:00 AM",
      language: "Hindi",
      symptoms: "Chest pain, difficulty breathing",
    },
    {
      id: "C002",
      patientName: "सीता देवी",
      doctorName: "Dr. Rajesh Kumar",
      status: "completed",
      time: "09:30 AM",
      language: "Hindi",
      symptoms: "High blood pressure consultation",
    },
  ])

  const startVideoCall = () => {
    setIsCallActive(true)
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsMuted(false)
    setIsVideoOn(true)
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "patient" as const,
      originalText: currentMessage,
      translatedText: translateText(currentMessage, patientLanguage, doctorLanguage),
      language: patientLanguage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setChatMessages([...chatMessages, newMessage])
    setCurrentMessage("")
  }

  const translateText = (text: string, fromLang: string, toLang: string): string => {
    // Simulate AI translation
    const translations: { [key: string]: { [key: string]: string } } = {
      "मुझे बुखार है": {
        english: "I have fever",
        tamil: "எனக்கு காய்ச்சல் உள்ளது",
      },
      "सीने में दर्द": {
        english: "chest pain",
        tamil: "மார்பு வலி",
      },
      "How are you feeling?": {
        hindi: "आप कैसा महसूस कर रहे हैं?",
        tamil: "நீங்கள் எப்படி உணர்கிறீர்கள்?",
      },
    }

    return translations[text]?.[toLang] || `[Translated to ${toLang}]: ${text}`
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "online":
        return "bg-[#08CB00] text-white"
      case "busy":
        return "bg-yellow-500 text-black"
      case "offline":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const langMap: Record<string, string> = {
    hindi: "hi-IN",
    tamil: "ta-IN",
    bengali: "bn-IN",
    gujarati: "gu-IN",
    punjabi: "pa-IN",
    english: "en-US",
  }

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
          <p className="text-sm text-white/90 mt-1">Telemedicine</p>
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Phone className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">Telemedicine with AI Translation</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              Connect with doctors remotely with real-time AI translation in your local language.
            </p>
          </div>

          {/* Language Settings */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#253900]">
                <Languages className="h-5 w-5 text-[#08CB00]" />
                Translation Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#253900] mb-2 block">Patient Language</label>
                  <Select value={patientLanguage} onValueChange={setPatientLanguage}>
                    <SelectTrigger className="border-[#08CB00]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="gujarati">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="punjabi">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#253900] mb-2 block">Doctor Language</label>
                  <Select value={doctorLanguage} onValueChange={setDoctorLanguage}>
                    <SelectTrigger className="border-[#08CB00]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => setTranslationMode(!translationMode)}
                    variant={translationMode ? "default" : "outline"}
                    className={
                      translationMode
                        ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                        : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white"
                    }
                  >
                    <Languages className="h-4 w-4 mr-2" />
                    {translationMode ? "Translation ON" : "Translation OFF"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Doctors */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">Available Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-4 border border-[#08CB00]/20 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center border border-[#08CB00]/20">
                        <User className="h-6 w-6 text-[#08CB00]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#253900]">{doctor.name}</h3>
                        <p className="text-sm text-[#253900]/60">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getAvailabilityColor(doctor.availability)}>
                            {doctor.availability.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-[#253900]/60">
                            ⭐ {doctor.rating} • {doctor.consultations} consultations
                          </span>
                        </div>
                        <p className="text-xs text-[#253900]/60 mt-1">Languages: {doctor.languages.join(", ")}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={startVideoCall}
                        disabled={doctor.availability !== "online"}
                        className="bg-[#08CB00] hover:bg-[#253900] text-white disabled:bg-gray-300"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={doctor.availability !== "online"}
                        className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white disabled:border-gray-300 bg-transparent"
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Video Call */}
          {isCallActive && (
            <Card className="border-[#08CB00]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-[#253900]">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-[#08CB00]" />
                    Video Consultation - Dr. Priya Sharma
                  </div>
                  <Badge className="bg-red-500 text-white">LIVE</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative">
                    <div className="text-white text-center">
                      <User className="h-16 w-16 mx-auto mb-2" />
                      <p>Dr. Priya Sharma</p>
                      <p className="text-sm opacity-75">Speaking in English</p>
                    </div>
                    {translationMode && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-2 rounded text-sm">
                        <p className="font-medium">Live Translation:</p>
                        <p>"आप कैसा महसूस कर रहे हैं? क्या दर्द अभी भी है?"</p>
                      </div>
                    )}
                  </div>
                  <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center relative">
                    <div className="text-white text-center">
                      <User className="h-16 w-16 mx-auto mb-2" />
                      <p>You (Patient)</p>
                      <p className="text-sm opacity-75">Speaking in {patientLanguage}</p>
                    </div>
                    {!isVideoOn && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <VideoOff className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setIsMuted(!isMuted)}
                    variant={isMuted ? "destructive" : "outline"}
                    size="sm"
                    className={!isMuted ? "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white" : ""}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    variant={!isVideoOn ? "destructive" : "outline"}
                    size="sm"
                    className={isVideoOn ? "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white" : ""}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => setTranslationMode(!translationMode)}
                    variant={translationMode ? "default" : "outline"}
                    size="sm"
                    className={
                      translationMode
                        ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                        : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white"
                    }
                  >
                    <Languages className="h-4 w-4" />
                  </Button>
                  <Button onClick={endCall} variant="destructive" size="sm">
                    <PhoneCall className="h-4 w-4 mr-1" />
                    End Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat with Translation */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#253900]">
                <MessageCircle className="h-5 w-5 text-[#08CB00]" />
                Chat with Real-time Translation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat Messages */}
              <div className="h-64 overflow-y-auto space-y-3 p-4 bg-[#08CB00]/5 rounded-lg border border-[#08CB00]/20">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "patient"
                          ? "bg-[#08CB00] text-white"
                          : "bg-white border border-[#08CB00]/30 text-[#253900]"
                      }`}
                    >
                      <div className="text-sm">
                        <p className="font-medium">{message.originalText}</p>
                        {translationMode && message.translatedText !== message.originalText && (
                          <p className="text-xs opacity-75 mt-1 italic">Translation: {message.translatedText}</p>
                        )}
                      </div>
                      <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <VoiceAssist
                lang={langMap[patientLanguage] || "en-US"}
                onTranscript={(t) => setCurrentMessage((prev) => (prev ? `${prev} ${t}` : t))}
                className="mb-2"
              />

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    patientLanguage === "hindi"
                      ? "अपना संदेश लिखें..."
                      : patientLanguage === "tamil"
                        ? "உங்கள் செய்தியை எழுதுங்கள்..."
                        : "Type your message..."
                  }
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="border-[#08CB00]/30 focus:border-[#08CB00]"
                />
                <Button onClick={sendMessage} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const last = chatMessages[chatMessages.length - 1]
                    const toSpeak = translationMode ? last?.translatedText : last?.originalText
                    if (toSpeak) speak(toSpeak, langMap[patientLanguage] || "en-US")
                  }}
                  className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consultation History */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">Recent Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-3 border border-[#08CB00]/20 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-[#253900]">{consultation.patientName}</h4>
                      <p className="text-sm text-[#253900]/60">
                        with {consultation.doctorName} • {consultation.time}
                      </p>
                      <p className="text-xs text-[#253900]/60">
                        {consultation.symptoms} • Language: {consultation.language}
                      </p>
                    </div>
                    <Badge
                      className={
                        consultation.status === "completed"
                          ? "bg-[#08CB00] text-white"
                          : consultation.status === "ongoing"
                            ? "bg-orange-500 text-white"
                            : "bg-blue-500 text-white"
                      }
                    >
                      {consultation.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How Telemedicine Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How AI Translation Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  Patient speaks in their local language (Hindi, Tamil, Bengali, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">
                  AI instantly translates speech and text to doctor's preferred language
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">
                  Doctor responds in their language, AI translates back to patient
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">
                  Works offline with pre-downloaded medical translation models
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
