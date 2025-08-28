"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Users,
  Phone,
  Shield,
  Bell,
  TrendingUp,
  Package,
  MessageCircle,
  Brain,
  Menu,
  X,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import VoiceAssist, { speak } from "@/components/voice-assist"

export default function MediSparkDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const features = [
    {
      id: "symptom-checker",
      title: "Symptom Checker",
      description: "AI suggests illnesses from voice/text inputs in local languages",
      icon: MessageCircle,
      href: "/symptom-checker",
      color: "text-[#08CB00]",
    },
    {
      id: "patient-triage",
      title: "Patient Triage",
      description: "AI prioritizes patients by condition severity",
      icon: TrendingUp,
      href: "/patient-triage",
      color: "text-[#08CB00]",
    },
    {
      id: "telemedicine",
      title: "Telemedicine",
      description: "AI translates symptoms for remote doctor consultations",
      icon: Phone,
      href: "/telemedicine",
      color: "text-[#08CB00]",
    },
    {
      id: "health-records",
      title: "Health Records",
      description: "Securely stores patient data offline",
      icon: Shield,
      href: "/health-records",
      color: "text-[#08CB00]",
    },
    {
      id: "chronic-monitoring",
      title: "Chronic Disease Monitoring",
      description: "SMS updates/reminders for chronic conditions",
      icon: Bell,
      href: "/chronic-monitoring",
      color: "text-[#08CB00]",
    },
    {
      id: "chw-training",
      title: "CHW Training",
      description: "Localized offline modules with badges",
      icon: Users,
      href: "/chw-training",
      color: "text-[#08CB00]",
    },
    {
      id: "outbreak-prediction",
      title: "Outbreak Prediction",
      description: "AI analyzes data to predict outbreaks",
      icon: TrendingUp,
      href: "/outbreak-prediction",
      color: "text-[#08CB00]",
    },
    {
      id: "medicine-inventory",
      title: "Medicine Inventory",
      description: "AI forecasts medication demand",
      icon: Package,
      href: "/medicine-inventory",
      color: "text-[#08CB00]",
    },
    {
      id: "preventive-care",
      title: "Preventive Care Tips",
      description: "SMS-based health tips in local languages",
      icon: MessageCircle,
      href: "/preventive-care",
      color: "text-[#08CB00]",
    },
    {
      id: "mental-health",
      title: "Mental Health Support",
      description: "AI delivers mindfulness audio and CBT exercises",
      icon: Brain,
      href: "/mental-health",
      color: "text-[#08CB00]",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-white relative text-gray-800">
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
        className={`fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm shadow-lg transform transition-transform duration-300 z-40 border-r-2 border-[#08CB00] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-[#EEEEEE] bg-gradient-to-r from-[#08CB00] to-[#253900]">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-white" />
            <h2 className="text-lg font-bold text-white font-mono">MediSpark</h2>
          </div>
          <p className="text-sm text-white/90 mt-1 font-sans">Healthcare Dashboard</p>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          <Link
            href="/"
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#08CB00]/10 rounded-lg transition-colors border border-transparent hover:border-[#08CB00]/20"
            onClick={() => setSidebarOpen(false)}
          >
            <Heart className="h-4 w-4 text-[#08CB00]" />
            <span className="text-sm font-medium text-[#253900] font-sans">Dashboard</span>
          </Link>
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#08CB00]/10 rounded-lg transition-colors border border-transparent hover:border-[#08CB00]/20"
              onClick={() => setSidebarOpen(false)}
            >
              <feature.icon className={`h-4 w-4 ${feature.color}`} />
              <span className="text-sm font-medium text-[#253900] font-sans">{feature.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="md:ml-64 p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900] font-mono">MediSpark</h1>
            </div>
            <p className="text-base sm:text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed font-sans">
              Simple village healthcare. Local languages. Works offline.
            </p>

            <div className="max-w-xl mx-auto">
              <VoiceAssist
                onTranscript={(text) => {
                  const t = text.toLowerCase()
                  const match = [
                    { key: "symptom", href: "/symptom-checker" },
                    { key: "triage", href: "/patient-triage" },
                    { key: "tele", href: "/telemedicine" },
                    { key: "record", href: "/health-records" },
                    { key: "chronic", href: "/chronic-monitoring" },
                    { key: "training", href: "/chw-training" },
                    { key: "outbreak", href: "/outbreak-prediction" },
                    { key: "inventory", href: "/medicine-inventory" },
                    { key: "prevent", href: "/preventive-care" },
                    { key: "mental", href: "/mental-health" },
                  ].find((m) => t.includes(m.key))
                  if (match) {
                    speak("Opening " + match.href.replace("/", "").replace("-", " "), "en-US")
                    router.push(match.href)
                  } else {
                    speak("Say a feature name like symptom, triage, tele, records, or inventory.", "en-US")
                  }
                }}
                className="mt-2"
              />
              <p className="text-xs text-[#253900] mt-1 font-sans">
                Try: “Open symptom checker” or “Go to telemedicine”
              </p>
            </div>
          </div>

          {/* Who Uses It */}
          <Card className="border-[#08CB00]/30 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#253900] font-mono">
                <Users className="h-5 w-5 text-[#08CB00]" />
                Who Uses MediSpark?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center mx-auto border border-[#08CB00]/20">
                    <Users className="h-6 w-6 text-[#08CB00]" />
                  </div>
                  <p className="font-medium text-[#253900] text-sm sm:text-base font-sans">Villagers</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center mx-auto border border-[#08CB00]/20">
                    <Heart className="h-6 w-6 text-[#08CB00]" />
                  </div>
                  <p className="font-medium text-[#253900] text-sm sm:text-base font-sans">Health Workers</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center mx-auto border border-[#08CB00]/20">
                    <Phone className="h-6 w-6 text-[#08CB00]" />
                  </div>
                  <p className="font-medium text-[#253900] text-sm sm:text-base font-sans">Doctors</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center mx-auto border border-[#08CB00]/20">
                    <Package className="h-6 w-6 text-[#08CB00]" />
                  </div>
                  <p className="font-medium text-[#253900] text-sm sm:text-base font-sans">Clinic Managers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-[#253900] font-mono">MediSpark Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => (
                <Link key={feature.id} href={feature.href}>
                  <Card className="border-[#08CB00]/20 shadow-sm hover:shadow-md transition-all hover:border-[#08CB00]/40 cursor-pointer h-full">
                    <CardContent className="p-4 h-full flex flex-col">
                      <div className="flex items-start gap-3 flex-1">
                        <feature.icon className={`h-6 w-6 ${feature.color} mt-1 flex-shrink-0`} />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 text-[#253900]">{feature.title}</h3>
                          <p className="text-sm text-[#253900]/80 leading-relaxed mb-3">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <ArrowRight className="h-4 w-4 text-[#08CB00]" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* What Makes It Special */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#253900] font-mono">What Makes MediSpark Different?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                ✓ <strong>Works without internet</strong> - Use it anywhere, anytime
              </p>
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                ✓ <strong>Speaks your language</strong> - Available in local languages
              </p>
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                ✓ <strong>Works on any phone</strong> - Smart phones or basic phones with SMS
              </p>
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                ✓ <strong>Keeps data safe</strong> - Your health information stays private
              </p>
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                ✓ <strong>Made for villages</strong> - Designed for places with limited resources
              </p>
            </CardContent>
          </Card>

          {/* Example Story */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#253900] font-mono">Real Example: How Priya Used MediSpark</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#253900]/80 leading-relaxed font-sans">
                Priya's baby had a fever and wouldn't eat. She sent a text message to MediSpark describing the symptoms.
                The app told the health worker this was urgent. Within an hour, Priya was talking to a city doctor in
                her own language through the app. The doctor gave her a treatment plan, and MediSpark sent SMS reminders
                about when to give medicine. Her baby got better quickly, and she didn't have to travel 3 hours to the
                nearest hospital.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-[#253900]/80 leading-relaxed font-sans">
              MediSpark: Bringing quality healthcare to every village, in every language.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
