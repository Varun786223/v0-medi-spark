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
  Shield,
  ArrowLeft,
  User,
  FileText,
  Download,
  Upload,
  Search,
  Plus,
  Edit,
  Wifi,
  WifiOff,
  Menu,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
} from "lucide-react"
import Link from "next/link"

interface HealthRecord {
  id: string
  patientId: string
  patientName: string
  age: number
  gender: string
  bloodGroup: string
  allergies: string[]
  chronicConditions: string[]
  medications: string[]
  lastVisit: string
  nextAppointment: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  vitals: {
    height: number
    weight: number
    bmi: number
    bloodPressure: string
    heartRate: number
    temperature: number
    lastUpdated: string
  }
  medicalHistory: {
    id: string
    date: string
    diagnosis: string
    treatment: string
    doctor: string
    notes: string
  }[]
  vaccinations: {
    vaccine: string
    date: string
    nextDue: string
  }[]
}

export default function HealthRecordsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isOffline, setIsOffline] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"synced" | "pending" | "syncing">("synced")
  const [showAddRecord, setShowAddRecord] = useState(false)

  const [healthRecords] = useState<HealthRecord[]>([
    {
      id: "HR001",
      patientId: "P001",
      patientName: "राम कुमार",
      age: 45,
      gender: "Male",
      bloodGroup: "B+",
      allergies: ["Penicillin", "Dust"],
      chronicConditions: ["Diabetes Type 2", "Hypertension"],
      medications: ["Metformin 500mg", "Amlodipine 5mg"],
      lastVisit: "2024-01-15",
      nextAppointment: "2024-02-15",
      emergencyContact: {
        name: "सीता कुमार",
        phone: "+91-9876543210",
        relation: "Wife",
      },
      vitals: {
        height: 170,
        weight: 75,
        bmi: 26.0,
        bloodPressure: "140/90",
        heartRate: 78,
        temperature: 36.8,
        lastUpdated: "2024-01-15",
      },
      medicalHistory: [
        {
          id: "MH001",
          date: "2024-01-15",
          diagnosis: "Diabetes Type 2 - Regular checkup",
          treatment: "Continue current medication, dietary counseling",
          doctor: "Dr. Priya Sharma",
          notes: "Blood sugar levels stable. Patient following diet plan well.",
        },
        {
          id: "MH002",
          date: "2023-12-10",
          diagnosis: "Hypertension monitoring",
          treatment: "Adjusted medication dosage",
          doctor: "Dr. Rajesh Kumar",
          notes: "Blood pressure slightly elevated. Increased Amlodipine to 5mg.",
        },
      ],
      vaccinations: [
        {
          vaccine: "COVID-19 Booster",
          date: "2023-10-15",
          nextDue: "2024-10-15",
        },
        {
          vaccine: "Influenza",
          date: "2023-09-20",
          nextDue: "2024-09-20",
        },
      ],
    },
    {
      id: "HR002",
      patientId: "P002",
      patientName: "सीता देवी",
      age: 32,
      gender: "Female",
      bloodGroup: "A+",
      allergies: ["Shellfish"],
      chronicConditions: [],
      medications: ["Iron supplements"],
      lastVisit: "2024-01-10",
      nextAppointment: "2024-03-10",
      emergencyContact: {
        name: "राम कुमार",
        phone: "+91-9876543211",
        relation: "Husband",
      },
      vitals: {
        height: 160,
        weight: 55,
        bmi: 21.5,
        bloodPressure: "120/80",
        heartRate: 72,
        temperature: 36.6,
        lastUpdated: "2024-01-10",
      },
      medicalHistory: [
        {
          id: "MH003",
          date: "2024-01-10",
          diagnosis: "Iron deficiency anemia",
          treatment: "Iron supplements, dietary recommendations",
          doctor: "Dr. Anita Patel",
          notes: "Hemoglobin levels improving. Continue iron supplements for 3 months.",
        },
      ],
      vaccinations: [
        {
          vaccine: "Tetanus",
          date: "2023-08-15",
          nextDue: "2033-08-15",
        },
      ],
    },
  ])

  const [newRecord, setNewRecord] = useState({
    patientName: "",
    age: "",
    gender: "",
    bloodGroup: "",
    allergies: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
  })

  const filteredRecords = healthRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedRecord = healthRecords.find((record) => record.id === selectedPatient)

  const simulateSync = () => {
    setSyncStatus("syncing")
    speak("Syncing data.", "en-US")
    setTimeout(() => {
      setSyncStatus("synced")
      speak("All data synced.", "en-US")
    }, 2000)
  }

  const addNewRecord = () => {
    if (!newRecord.patientName) return

    // Simulate adding new record
    setNewRecord({
      patientName: "",
      age: "",
      gender: "",
      bloodGroup: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
    })
    setShowAddRecord(false)
    setSyncStatus("pending")
  }

  const exportRecord = (recordId: string) => {
    // Simulate record export
    alert(`Exporting health record ${recordId} as PDF...`)
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
          <p className="text-sm text-white/90 mt-1">Health Records</p>
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
              <Shield className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">Electronic Health Records</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              Secure, offline-first patient data management system for health workers and clinics.
            </p>
          </div>

          {/* Status Bar */}
          <Card className="border-[#08CB00]/30 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {isOffline ? (
                      <WifiOff className="h-5 w-5 text-red-500" />
                    ) : (
                      <Wifi className="h-5 w-5 text-[#08CB00]" />
                    )}
                    <span className="text-sm text-[#253900]">{isOffline ? "Offline Mode" : "Online"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        syncStatus === "synced"
                          ? "bg-[#08CB00]"
                          : syncStatus === "syncing"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-[#253900]">
                      {syncStatus === "synced"
                        ? "All data synced"
                        : syncStatus === "syncing"
                          ? "Syncing..."
                          : "Sync pending"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsOffline(!isOffline)}
                    variant="outline"
                    size="sm"
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                  >
                    {isOffline ? "Go Online" : "Go Offline"}
                  </Button>
                  <Button
                    onClick={simulateSync}
                    variant="outline"
                    size="sm"
                    disabled={syncStatus === "syncing"}
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Sync Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#253900]/60" />
                <Input
                  placeholder="Search patients by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#08CB00]/30 focus:border-[#08CB00]"
                />
              </div>
              <VoiceAssist onTranscript={(t) => setSearchQuery(t)} className="mt-2" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddRecord(!showAddRecord)}
                className="bg-[#08CB00] hover:bg-[#253900] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
              <Button
                variant="outline"
                className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          {/* Add New Record Form */}
          {showAddRecord && (
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#253900]">Add New Patient Record</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Patient Name</label>
                    <Input
                      placeholder="Enter patient name"
                      value={newRecord.patientName}
                      onChange={(e) => setNewRecord({ ...newRecord, patientName: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Age</label>
                    <Input
                      type="number"
                      placeholder="Age"
                      value={newRecord.age}
                      onChange={(e) => setNewRecord({ ...newRecord, age: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Gender</label>
                    <Select
                      value={newRecord.gender}
                      onValueChange={(value) => setNewRecord({ ...newRecord, gender: value })}
                    >
                      <SelectTrigger className="border-[#08CB00]/30">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Blood Group</label>
                    <Select
                      value={newRecord.bloodGroup}
                      onValueChange={(value) => setNewRecord({ ...newRecord, bloodGroup: value })}
                    >
                      <SelectTrigger className="border-[#08CB00]/30">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#253900] mb-1 block">Known Allergies</label>
                  <Input
                    placeholder="Enter allergies separated by commas"
                    value={newRecord.allergies}
                    onChange={(e) => setNewRecord({ ...newRecord, allergies: e.target.value })}
                    className="border-[#08CB00]/30 focus:border-[#08CB00]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Emergency Contact Name</label>
                    <Input
                      placeholder="Contact name"
                      value={newRecord.emergencyContactName}
                      onChange={(e) => setNewRecord({ ...newRecord, emergencyContactName: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Phone Number</label>
                    <Input
                      placeholder="+91-XXXXXXXXXX"
                      value={newRecord.emergencyContactPhone}
                      onChange={(e) => setNewRecord({ ...newRecord, emergencyContactPhone: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#253900] mb-1 block">Relation</label>
                    <Input
                      placeholder="e.g., Spouse, Parent"
                      value={newRecord.emergencyContactRelation}
                      onChange={(e) => setNewRecord({ ...newRecord, emergencyContactRelation: e.target.value })}
                      className="border-[#08CB00]/30 focus:border-[#08CB00]"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={addNewRecord} className="bg-[#08CB00] hover:bg-[#253900] text-white">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                  <Button
                    onClick={() => setShowAddRecord(false)}
                    variant="outline"
                    className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="lg:col-span-1">
              <Card className="border-[#08CB00]/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#253900]">Patient Records ({filteredRecords.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredRecords.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => setSelectedPatient(record.id)}
                        className={`p-4 border-b border-[#08CB00]/20 cursor-pointer hover:bg-[#08CB00]/5 transition-colors ${
                          selectedPatient === record.id ? "bg-[#08CB00]/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#08CB00]/10 rounded-full flex items-center justify-center border border-[#08CB00]/20">
                            <User className="h-5 w-5 text-[#08CB00]" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[#253900]">{record.patientName}</h3>
                            <p className="text-sm text-[#253900]/60">
                              {record.age} years • {record.gender} • {record.bloodGroup}
                            </p>
                            <p className="text-xs text-[#253900]/60">ID: {record.patientId}</p>
                          </div>
                          {record.chronicConditions.length > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Details */}
            <div className="lg:col-span-2">
              {selectedRecord ? (
                <div className="space-y-6">
                  {/* Patient Overview */}
                  <Card className="border-[#08CB00]/30 shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-[#253900] text-xl">{selectedRecord.patientName}</CardTitle>
                          <p className="text-[#253900]/60">Patient ID: {selectedRecord.patientId}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => exportRecord(selectedRecord.id)}
                            className="bg-[#08CB00] hover:bg-[#253900] text-white"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-[#253900]/60">Age</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.age} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#253900]/60">Gender</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.gender}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#253900]/60">Blood Group</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.bloodGroup}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#253900]/60">Last Visit</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.lastVisit}</p>
                        </div>
                      </div>

                      {selectedRecord.allergies.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-red-700">Allergies</span>
                          </div>
                          <p className="text-sm text-red-600">{selectedRecord.allergies.join(", ")}</p>
                        </div>
                      )}

                      {selectedRecord.chronicConditions.length > 0 && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium text-yellow-700">Chronic Conditions</span>
                          </div>
                          <p className="text-sm text-yellow-600">{selectedRecord.chronicConditions.join(", ")}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vital Signs */}
                  <Card className="border-[#08CB00]/30 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#253900]">
                        <Activity className="h-5 w-5 text-[#08CB00]" />
                        Latest Vital Signs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">Height</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.height} cm</p>
                        </div>
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">Weight</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.weight} kg</p>
                        </div>
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">BMI</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.bmi}</p>
                        </div>
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">Blood Pressure</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.bloodPressure}</p>
                        </div>
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">Heart Rate</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.heartRate} bpm</p>
                        </div>
                        <div className="bg-[#08CB00]/10 p-3 rounded-lg border border-[#08CB00]/20">
                          <p className="text-xs text-[#253900]/60">Temperature</p>
                          <p className="font-semibold text-[#253900]">{selectedRecord.vitals.temperature}°C</p>
                        </div>
                      </div>
                      <p className="text-xs text-[#253900]/60 mt-3">
                        Last updated: {selectedRecord.vitals.lastUpdated}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Medical History */}
                  <Card className="border-[#08CB00]/30 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#253900]">
                        <FileText className="h-5 w-5 text-[#08CB00]" />
                        Medical History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedRecord.medicalHistory.map((entry) => (
                          <div key={entry.id} className="border border-[#08CB00]/20 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-[#253900]">{entry.diagnosis}</h4>
                                <p className="text-sm text-[#253900]/60">by {entry.doctor}</p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="bg-[#08CB00]/10 text-[#253900] border border-[#08CB00]/20"
                              >
                                {entry.date}
                              </Badge>
                            </div>
                            <p className="text-sm text-[#253900]/80 mb-2">
                              <strong>Treatment:</strong> {entry.treatment}
                            </p>
                            <p className="text-sm text-[#253900]/80">
                              <strong>Notes:</strong> {entry.notes}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card className="border-[#08CB00]/30 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#253900]">
                        <User className="h-5 w-5 text-[#08CB00]" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-[#253900]/60">Name</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#253900]/60">Phone</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.emergencyContact.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#253900]/60">Relation</p>
                          <p className="font-medium text-[#253900]">{selectedRecord.emergencyContact.relation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-[#08CB00]/30 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <User className="h-12 w-12 text-[#08CB00]/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#253900] mb-2">Select a Patient</h3>
                    <p className="text-[#253900]/60">Choose a patient from the list to view their health records.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* How EHR Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How Electronic Health Records Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  All patient data is stored securely on the device with encryption
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">
                  Works completely offline - no internet required for daily operations
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">
                  Automatically syncs with central database when internet is available
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">
                  Accessible by authorized health workers and doctors across the network
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
