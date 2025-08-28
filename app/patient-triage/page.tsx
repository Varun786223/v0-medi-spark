"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import VoiceAssist, { speak } from "@/components/voice-assist" // add voice controls
import {
  Heart,
  TrendingUp,
  ArrowLeft,
  AlertTriangle,
  Clock,
  User,
  Plus,
  Menu,
  X,
  CheckCircle,
  Users,
} from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  age: number
  symptoms: string
  vitalSigns: {
    temperature: number
    bloodPressure: string
    heartRate: number
    respiratoryRate: number
  }
  priority: "CRITICAL" | "URGENT" | "MODERATE" | "LOW"
  arrivalTime: string
  waitTime: number
}

export default function PatientTriagePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "P001",
      name: "राम कुमार",
      age: 45,
      symptoms: "Severe chest pain, sweating, difficulty breathing",
      vitalSigns: {
        temperature: 37.8,
        bloodPressure: "160/95",
        heartRate: 110,
        respiratoryRate: 24,
      },
      priority: "CRITICAL",
      arrivalTime: "09:15",
      waitTime: 5,
    },
    {
      id: "P002",
      name: "सीता देवी",
      age: 32,
      symptoms: "Mild headache, no fever, feeling tired",
      vitalSigns: {
        temperature: 36.8,
        bloodPressure: "120/80",
        heartRate: 75,
        respiratoryRate: 16,
      },
      priority: "LOW",
      arrivalTime: "09:30",
      waitTime: 45,
    },
    {
      id: "P003",
      name: "अजय सिंह",
      age: 28,
      symptoms: "High fever, severe cough, body aches",
      vitalSigns: {
        temperature: 39.2,
        bloodPressure: "130/85",
        heartRate: 95,
        respiratoryRate: 20,
      },
      priority: "URGENT",
      arrivalTime: "09:45",
      waitTime: 15,
    },
    {
      id: "P004",
      name: "गीता शर्मा",
      age: 55,
      symptoms: "Stomach pain, nausea, mild fever",
      vitalSigns: {
        temperature: 37.5,
        bloodPressure: "140/90",
        heartRate: 88,
        respiratoryRate: 18,
      },
      priority: "MODERATE",
      arrivalTime: "10:00",
      waitTime: 30,
    },
  ])

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    symptoms: "",
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: "",
  })

  const [showAddForm, setShowAddForm] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-500 text-white"
      case "URGENT":
        return "bg-orange-500 text-white"
      case "MODERATE":
        return "bg-yellow-500 text-black"
      case "LOW":
        return "bg-[#08CB00] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const calculatePriority = (symptoms: string, vitalSigns: any): "CRITICAL" | "URGENT" | "MODERATE" | "LOW" => {
    const temp = Number.parseFloat(vitalSigns.temperature)
    const heartRate = Number.parseInt(vitalSigns.heartRate)
    const symptomsLower = symptoms.toLowerCase()

    // Critical conditions
    if (
      symptomsLower.includes("chest pain") ||
      symptomsLower.includes("difficulty breathing") ||
      symptomsLower.includes("unconscious") ||
      heartRate > 120 ||
      temp > 40
    ) {
      return "CRITICAL"
    }

    // Urgent conditions
    if (symptomsLower.includes("severe") || symptomsLower.includes("high fever") || temp > 38.5 || heartRate > 100) {
      return "URGENT"
    }

    // Moderate conditions
    if (symptomsLower.includes("fever") || symptomsLower.includes("pain") || temp > 37.5 || heartRate > 90) {
      return "MODERATE"
    }

    return "LOW"
  }

  const addNewPatient = () => {
    if (!newPatient.name || !newPatient.symptoms) return

    const vitalSigns = {
      temperature: Number.parseFloat(newPatient.temperature) || 36.5,
      bloodPressure: newPatient.bloodPressure || "120/80",
      heartRate: Number.parseInt(newPatient.heartRate) || 75,
      respiratoryRate: Number.parseInt(newPatient.respiratoryRate) || 16,
    }

    const priority = calculatePriority(newPatient.symptoms, vitalSigns)

    const patient: Patient = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: newPatient.name,
      age: Number.parseInt(newPatient.age) || 25,
      symptoms: newPatient.symptoms,
      vitalSigns,
      priority,
      arrivalTime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      waitTime: 0,
    }

    setPatients([...patients, patient])
    setNewPatient({
      name: "",
      age: "",
      symptoms: "",
      temperature: "",
      bloodPressure: "",
      heartRate: "",
      respiratoryRate: "",
    })
    setShowAddForm(false)
    speak(`Patient added with priority ${priority}.`, "en-US")
  }

  const sortedPatients = [...patients].sort((a, b) => {
    const priorityOrder = { CRITICAL: 0, URGENT: 1, MODERATE: 2, LOW: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const runAutoTriage = () => {
    const updatedPatients = patients.map((patient) => ({
      ...patient,
      priority: calculatePriority(patient.symptoms, patient.vitalSigns),
      waitTime: patient.waitTime + Math.floor(Math.random() * 10),
    }))
    setPatients(updatedPatients)
    speak("Triage updated. Queue reordered by priority.", "en-US")
  }

  const parsePatientVoice = (text: string) => {
    const t = text.toLowerCase()
    setShowAddForm(true)
    // simple patterns: "name Ram age 45 temp 39 chest pain"
    const name = t.match(/name\s+([a-zA-Z\u0900-\u097F\u0B80-\u0BFF]+(?:\s+[a-zA-Z\u0900-\u097F\u0B80-\u0BFF]+)*)/)?.[1]
    const age = t.match(/age\s+(\d{1,3})/)?.[1]
    const temp = t.match(/temp(?:erature)?\s+(\d{1,2}(?:\.\d)*)/)?.[1]
    const hr = t.match(/heart\s*rate\s+(\d{2,3})/)?.[1]
    const rr = t.match(/resp(?:iratory)?\s*rate\s+(\d{2,3})/)?.[1]
    const bp = t.match(/(?:bp|blood\s*pressure)\s+(\d{2,3}\/\d{2,3})/)?.[1]
    setNewPatient((prev) => ({
      ...prev,
      name: name ? name : prev.name,
      age: age ?? prev.age,
      temperature: temp ?? prev.temperature,
      heartRate: hr ?? prev.heartRate,
      respiratoryRate: rr ?? prev.respiratoryRate,
      bloodPressure: bp ?? prev.bloodPressure,
      symptoms: prev.symptoms || t,
    }))
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
          <p className="text-sm text-white/90 mt-1">Patient Triage</p>
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
              <TrendingUp className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">Patient Triage System</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              AI-powered patient prioritization system that helps health workers allocate resources efficiently.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#08CB00] hover:bg-[#253900] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button
                onClick={runAutoTriage}
                variant="outline"
                className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white transition-colors bg-transparent"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Run AI Triage
              </Button>
            </div>
            <div className="w-full sm:w-auto">
              <VoiceAssist onTranscript={parsePatientVoice} className="max-w-md" />
            </div>
            <div className="flex items-center gap-4 text-sm text-[#253900]/80">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{patients.length} Patients</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Avg Wait: {Math.round(patients.reduce((acc, p) => acc + p.waitTime, 0) / patients.length)}min
                </span>
              </div>
            </div>
          </div>

          {/* Add Patient Form */}
          {showAddForm && (
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#253900]">Add New Patient</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Patient Name</label>
                    <Input
                      placeholder="Enter patient name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Age</label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#253900] mb-1 block">Symptoms</label>
                  <Textarea
                    placeholder="Describe patient symptoms..."
                    value={newPatient.symptoms}
                    onChange={(e) => setNewPatient({ ...newPatient, symptoms: e.target.value })}
                    className="border-[#08CB00]/30 focus:border-[#08CB00]"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Temperature (°C)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={newPatient.temperature}
                      onChange={(e) => setNewPatient({ ...newPatient, temperature: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Blood Pressure</label>
                    <Input
                      placeholder="120/80"
                      value={newPatient.bloodPressure}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodPressure: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Heart Rate</label>
                    <Input
                      type="number"
                      placeholder="75"
                      value={newPatient.heartRate}
                      onChange={(e) => setNewPatient({ ...newPatient, heartRate: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Respiratory Rate</label>
                    <Input
                      type="number"
                      placeholder="16"
                      value={newPatient.respiratoryRate}
                      onChange={(e) => setNewPatient({ ...newPatient, respiratoryRate: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addNewPatient} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white transition-colors bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Priority Legend */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900] text-lg">Priority Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 text-white">CRITICAL</Badge>
                  <span className="text-sm text-[#253900]/80">Life-threatening</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500 text-white">URGENT</Badge>
                  <span className="text-sm text-[#253900]/80">Needs immediate care</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 text-black">MODERATE</Badge>
                  <span className="text-sm text-[#253900]/80">Can wait briefly</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#08CB00] text-white">LOW</Badge>
                  <span className="text-sm text-[#253900]/80">Non-urgent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Queue */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#253900]">Patient Queue (Sorted by Priority)</h2>

            {sortedPatients.map((patient, index) => (
              <Card key={patient.id} className="border-[#08CB00]/30 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Patient Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#253900]">#{index + 1}</span>
                          <User className="h-4 w-4 text-[#08CB00]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#253900]">{patient.name}</h3>
                          <p className="text-sm text-[#253900]/60">
                            Age: {patient.age} | ID: {patient.id}
                          </p>
                        </div>
                        <Badge className={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
                      </div>

                      <div className="text-sm text-[#253900]/80">
                        <strong>Symptoms:</strong> {patient.symptoms}
                      </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="bg-[#08CB00]/10 p-2 rounded border border-[#08CB00]/20">
                        <div className="text-[#253900]/60">Temperature</div>
                        <div className="font-semibold text-[#253900]">{patient.vitalSigns.temperature}°C</div>
                      </div>
                      <div className="bg-[#08CB00]/10 p-2 rounded border border-[#08CB00]/20">
                        <div className="text-[#253900]/60">BP</div>
                        <div className="font-semibold text-[#253900]">{patient.vitalSigns.bloodPressure}</div>
                      </div>
                      <div className="bg-[#08CB00]/10 p-2 rounded border border-[#08CB00]/20">
                        <div className="text-[#253900]/60">Heart Rate</div>
                        <div className="font-semibold text-[#253900]">{patient.vitalSigns.heartRate} bpm</div>
                      </div>
                      <div className="bg-[#08CB00]/10 p-2 rounded border border-[#08CB00]/20">
                        <div className="text-[#253900]/60">Wait Time</div>
                        <div className="font-semibold text-[#253900]">{patient.waitTime}min</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-[#08CB00] hover:bg-[#253900] text-white">
                        See Patient
                      </Button>
                      {patient.priority === "CRITICAL" && (
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Emergency
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How AI Triage Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How AI Patient Triage Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  AI analyzes patient symptoms, vital signs, and medical history
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">Assigns priority level: Critical, Urgent, Moderate, or Low</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">Automatically sorts patient queue by priority and wait time</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">
                  Helps health workers allocate resources efficiently and save lives
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
