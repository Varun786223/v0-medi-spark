"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import VoiceAssist, { speak } from "@/components/voice-assist" // add voice controls
import {
  Heart,
  Bell,
  ArrowLeft,
  User,
  MessageSquare,
  TrendingUp,
  Activity,
  Plus,
  Send,
  Menu,
  X,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  age: number
  condition: string
  riskLevel: "low" | "medium" | "high"
  lastReading: string
  nextReminder: string
  adherence: number
  phone: string
  language: string
}

interface Reminder {
  id: string
  patientId: string
  patientName: string
  type: "medication" | "checkup" | "reading" | "lifestyle"
  message: string
  scheduledTime: string
  status: "pending" | "sent" | "acknowledged"
  language: string
}

interface Reading {
  id: string
  patientId: string
  type: "blood_sugar" | "blood_pressure" | "weight" | "heart_rate"
  value: string
  date: string
  time: string
  notes: string
}

export default function ChronicMonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"patients" | "reminders" | "readings">("patients")
  const [newReminder, setNewReminder] = useState({
    patientId: "",
    type: "medication",
    message: "",
    time: "",
    language: "hindi",
  })
  const [showAddReminder, setShowAddReminder] = useState(false)

  const [patients] = useState<Patient[]>([
    {
      id: "P001",
      name: "राम कुमार",
      age: 45,
      condition: "Diabetes Type 2",
      riskLevel: "medium",
      lastReading: "2024-01-15",
      nextReminder: "2024-01-16 08:00",
      adherence: 85,
      phone: "+91-9876543210",
      language: "hindi",
    },
    {
      id: "P002",
      name: "सीता देवी",
      age: 58,
      condition: "Hypertension",
      riskLevel: "high",
      lastReading: "2024-01-14",
      nextReminder: "2024-01-16 09:00",
      adherence: 92,
      phone: "+91-9876543211",
      language: "hindi",
    },
    {
      id: "P003",
      name: "अजय सिंह",
      age: 52,
      condition: "Heart Disease",
      riskLevel: "high",
      lastReading: "2024-01-15",
      nextReminder: "2024-01-16 07:30",
      adherence: 78,
      phone: "+91-9876543212",
      language: "punjabi",
    },
    {
      id: "P004",
      name: "गीता शर्मा",
      age: 41,
      condition: "Diabetes Type 1",
      riskLevel: "medium",
      lastReading: "2024-01-15",
      nextReminder: "2024-01-16 12:00",
      adherence: 95,
      phone: "+91-9876543213",
      language: "hindi",
    },
  ])

  const [reminders] = useState<Reminder[]>([
    {
      id: "R001",
      patientId: "P001",
      patientName: "राम कुमार",
      type: "medication",
      message: "राम जी, अपनी दवा लेने का समय हो गया है। मेटफॉर्मिन 500mg लें।",
      scheduledTime: "08:00",
      status: "sent",
      language: "hindi",
    },
    {
      id: "R002",
      patientId: "P002",
      patientName: "सीता देवी",
      type: "reading",
      message: "सीता जी, कृपया अपना ब्लड प्रेशर चेक करें और रिपोर्ट करें।",
      scheduledTime: "09:00",
      status: "pending",
      language: "hindi",
    },
    {
      id: "R003",
      patientId: "P003",
      patientName: "अजय सिंह",
      type: "lifestyle",
      message: "ਅਜੇ ਜੀ, ਅੱਜ 30 ਮਿੰਟ ਸੈਰ ਕਰਨਾ ਨਾ ਭੁੱਲੋ।",
      scheduledTime: "07:30",
      status: "acknowledged",
      language: "punjabi",
    },
  ])

  const [readings] = useState<Reading[]>([
    {
      id: "RD001",
      patientId: "P001",
      type: "blood_sugar",
      value: "145 mg/dL",
      date: "2024-01-15",
      time: "08:30",
      notes: "After breakfast",
    },
    {
      id: "RD002",
      patientId: "P002",
      type: "blood_pressure",
      value: "150/95 mmHg",
      date: "2024-01-14",
      time: "09:15",
      notes: "Feeling slightly dizzy",
    },
    {
      id: "RD003",
      patientId: "P003",
      type: "heart_rate",
      value: "88 bpm",
      date: "2024-01-15",
      time: "07:45",
      notes: "After morning walk",
    },
  ])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-[#08CB00] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-500 text-white"
      case "acknowledged":
        return "bg-[#08CB00] text-white"
      case "pending":
        return "bg-yellow-500 text-black"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const sendReminder = (reminderId: string) => {
    // Simulate sending SMS reminder
    alert(`SMS reminder sent successfully!`)
    speak("Reminder sent.", "en-US")
  }

  const addNewReminder = () => {
    if (!newReminder.patientId || !newReminder.message) return

    // Simulate adding new reminder
    setNewReminder({
      patientId: "",
      type: "medication",
      message: "",
      time: "",
      language: "hindi",
    })
    setShowAddReminder(false)
  }

  const selectedPatientData = patients.find((p) => p.id === selectedPatient)

  const getConditionIcon = (condition: string) => {
    if (condition.includes("Diabetes")) return Activity
    if (condition.includes("Hypertension")) return TrendingUp
    if (condition.includes("Heart")) return Heart
    return Activity
  }

  const parseReminderVoice = (text: string) => {
    // e.g. "patient P001 medication at 08:00 take metformin in hindi"
    const pid = text.match(/patient\s+(p\d{3})/i)?.[1]?.toUpperCase()
    const type = (text.match(/(medication|checkup|reading|lifestyle)/i)?.[1] || "medication").toLowerCase()
    const time = text.match(/at\s+(\d{1,2}:\d{2})/i)?.[1] || ""
    const lang = (text.match(/\b(hindi|punjabi|tamil|bengali|english)\b/i)?.[1] || "hindi").toLowerCase()
    const msg = text
      .replace(
        /patient\s+p\d{3}|at\s+\d{1,2}:\d{2}|\b(medication|checkup|reading|lifestyle)\b|\b(hindi|punjabi|tamil|bengali|english)\b/gi,
        "",
      )
      .trim()
    setNewReminder({
      patientId: pid || newReminder.patientId,
      type: type as any,
      time: time || newReminder.time,
      language: lang,
      message: msg || newReminder.message,
    })
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
          <p className="text-sm text-white/90 mt-1">Chronic Disease Monitoring</p>
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
              <Bell className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">Chronic Disease Monitoring</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              SMS-based monitoring and reminders for patients with chronic conditions like diabetes and hypertension.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#253900]">{patients.length}</div>
                <div className="text-sm text-[#253900]/60">Total Patients</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-500">
                  {patients.filter((p) => p.riskLevel === "high").length}
                </div>
                <div className="text-sm text-[#253900]/60">High Risk</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#08CB00]">
                  {reminders.filter((r) => r.status === "sent").length}
                </div>
                <div className="text-sm text-[#253900]/60">SMS Sent Today</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#253900]">
                  {Math.round(patients.reduce((acc, p) => acc + p.adherence, 0) / patients.length)}%
                </div>
                <div className="text-sm text-[#253900]/60">Avg Adherence</div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveTab("patients")}
              variant={activeTab === "patients" ? "default" : "outline"}
              className={
                activeTab === "patients"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <User className="h-4 w-4 mr-2" />
              Patients
            </Button>
            <Button
              onClick={() => setActiveTab("reminders")}
              variant={activeTab === "reminders" ? "default" : "outline"}
              className={
                activeTab === "reminders"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <Bell className="h-4 w-4 mr-2" />
              SMS Reminders
            </Button>
            <Button
              onClick={() => setActiveTab("readings")}
              variant={activeTab === "readings" ? "default" : "outline"}
              className={
                activeTab === "readings"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <Activity className="h-4 w-4 mr-2" />
              Health Readings
            </Button>
            <VoiceAssist onTranscript={parseReminderVoice} className="w-full md:w-auto" />
          </div>

          {/* Patients Tab */}
          {activeTab === "patients" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#253900]">Chronic Disease Patients</h2>
                <Button onClick={() => setShowAddReminder(true)} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>

              <div className="grid gap-4">
                {patients.map((patient) => {
                  const ConditionIcon = getConditionIcon(patient.condition)
                  return (
                    <Card
                      key={patient.id}
                      className="border-[#08CB00]/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedPatient(patient.id === selectedPatient ? null : patient.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center border border-[#08CB00]/20">
                              <ConditionIcon className="h-6 w-6 text-[#08CB00]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#253900]">{patient.name}</h3>
                              <p className="text-sm text-[#253900]/60">
                                {patient.age} years • {patient.condition}
                              </p>
                              <p className="text-xs text-[#253900]/60">
                                Last reading: {patient.lastReading} • Next reminder: {patient.nextReminder}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-medium text-[#253900]">Adherence</div>
                              <div className="flex items-center gap-2">
                                <Progress value={patient.adherence} className="w-16 h-2 bg-[#08CB00]/20" />
                                <span className="text-sm text-[#253900]">{patient.adherence}%</span>
                              </div>
                            </div>
                            <Badge className={getRiskColor(patient.riskLevel)}>
                              {patient.riskLevel.toUpperCase()} RISK
                            </Badge>
                          </div>
                        </div>

                        {selectedPatient === patient.id && (
                          <div className="mt-4 pt-4 border-t border-[#08CB00]/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-[#253900]/60">Phone</p>
                                <p className="font-medium text-[#253900]">{patient.phone}</p>
                              </div>
                              <div>
                                <p className="text-sm text-[#253900]/60">Language</p>
                                <p className="font-medium text-[#253900] capitalize">{patient.language}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    sendReminder(`manual-${patient.id}`)
                                  }}
                                  className="bg-[#08CB00] hover:bg-[#253900] text-white"
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Send SMS
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                                >
                                  <Phone className="h-4 w-4 mr-1" />
                                  Call
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Reminders Tab */}
          {activeTab === "reminders" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#253900]">SMS Reminders</h2>
                <Button onClick={() => setShowAddReminder(true)} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Reminder
                </Button>
              </div>

              <div className="grid gap-4">
                {reminders.map((reminder) => (
                  <Card key={reminder.id} className="border-[#08CB00]/30 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[#253900]">{reminder.patientName}</h3>
                            <Badge
                              variant="secondary"
                              className="bg-[#08CB00]/10 text-[#253900] border border-[#08CB00]/20"
                            >
                              {reminder.type}
                            </Badge>
                            <Badge className={getStatusColor(reminder.status)}>{reminder.status.toUpperCase()}</Badge>
                          </div>
                          <div className="bg-[#08CB00]/5 p-3 rounded-lg border border-[#08CB00]/20 mb-2">
                            <p className="text-sm text-[#253900]">{reminder.message}</p>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#253900]/60">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Scheduled: {reminder.scheduledTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span>Language: {reminder.language}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {reminder.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => sendReminder(reminder.id)}
                              className="bg-[#08CB00] hover:bg-[#253900] text-white"
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send Now
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Readings Tab */}
          {activeTab === "readings" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#253900]">Recent Health Readings</h2>

              <div className="grid gap-4">
                {readings.map((reading) => {
                  const patient = patients.find((p) => p.id === reading.patientId)
                  return (
                    <Card key={reading.id} className="border-[#08CB00]/30 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#08CB00]/10 rounded-full flex items-center justify-center border border-[#08CB00]/20">
                              <Activity className="h-5 w-5 text-[#08CB00]" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#253900]">{patient?.name}</h3>
                              <p className="text-sm text-[#253900]/60 capitalize">
                                {reading.type.replace("_", " ")} Reading
                              </p>
                              <p className="text-xs text-[#253900]/60">
                                {reading.date} at {reading.time}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#253900]">{reading.value}</div>
                            {reading.notes && <p className="text-sm text-[#253900]/60">{reading.notes}</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Add Reminder Modal */}
          {showAddReminder && (
            <Card className="border-[#08CB00]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#253900]">Schedule New SMS Reminder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-2 block">Select Patient</label>
                    <Select
                      value={newReminder.patientId}
                      onValueChange={(value) => setNewReminder({ ...newReminder, patientId: value })}
                    >
                      <SelectTrigger className="border-[#08CB00]/30">
                        <SelectValue placeholder="Choose patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} - {patient.condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-2 block">Reminder Type</label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value) => setNewReminder({ ...newReminder, type: value })}
                    >
                      <SelectTrigger className="border-[#08CB00]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="checkup">Health Checkup</SelectItem>
                        <SelectItem value="reading">Take Reading</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle Reminder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#253900] mb-2 block">SMS Message</label>
                  <Input
                    placeholder="Enter reminder message in patient's language"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                    className="border-[#08CB00]/30 focus:border-[#08CB00]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-2 block">Time</label>
                    <Input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-2 block">Language</label>
                    <Select
                      value={newReminder.language}
                      onValueChange={(value) => setNewReminder({ ...newReminder, language: value })}
                    >
                      <SelectTrigger className="border-[#08CB00]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="punjabi">Punjabi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="bengali">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addNewReminder} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Schedule Reminder
                  </Button>
                  <Button
                    onClick={() => setShowAddReminder(false)}
                    variant="outline"
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How Chronic Monitoring Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How Chronic Disease Monitoring Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  Patients receive automated SMS reminders for medications, checkups, and lifestyle habits
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">
                  Messages are sent in local languages (Hindi, Tamil, Punjabi, etc.) for better understanding
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">
                  Patients can reply with health readings via SMS, even from basic feature phones
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">
                  Health workers monitor adherence and can intervene when patients miss medications or readings
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
