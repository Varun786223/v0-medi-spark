"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge as BadgeComponent } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import VoiceAssist, { speak } from "@/components/voice-assist" // add voice controls
import {
  Heart,
  Users,
  ArrowLeft,
  Play,
  CheckCircle,
  Award,
  BookOpen,
  Clock,
  Star,
  Menu,
  X,
  Download,
  Volume2,
  FileText,
  Video,
} from "lucide-react"
import Link from "next/link"

interface TrainingModule {
  id: string
  title: string
  titleHindi: string
  description: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  progress: number
  completed: boolean
  language: string
  type: "video" | "interactive" | "quiz" | "practical"
  badge?: string
  topics: string[]
}

interface TrainingBadge {
  id: string
  name: string
  nameHindi: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  requirements: string[]
}

export default function CHWTrainingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"modules" | "badges" | "progress">("modules")
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")

  const [trainingModules] = useState<TrainingModule[]>([
    {
      id: "TM001",
      title: "Basic First Aid",
      titleHindi: "प्राथमिक चिकित्सा",
      description: "Essential first aid techniques for common emergencies in rural settings",
      duration: 45,
      difficulty: "beginner",
      progress: 100,
      completed: true,
      language: "hindi",
      type: "video",
      badge: "First Aid Expert",
      topics: ["Wound care", "CPR basics", "Choking response", "Burns treatment"],
    },
    {
      id: "TM002",
      title: "Maternal Health Care",
      titleHindi: "मातृ स्वास्थ्य देखभाल",
      description: "Prenatal and postnatal care for mothers in rural communities",
      duration: 60,
      difficulty: "intermediate",
      progress: 65,
      completed: false,
      language: "hindi",
      type: "interactive",
      topics: ["Prenatal checkups", "Safe delivery", "Postpartum care", "Breastfeeding support"],
    },
    {
      id: "TM003",
      title: "Child Health & Nutrition",
      titleHindi: "बाल स्वास्थ्य और पोषण",
      description: "Comprehensive child healthcare and nutrition guidance",
      duration: 50,
      difficulty: "intermediate",
      progress: 30,
      completed: false,
      language: "hindi",
      type: "video",
      topics: ["Vaccination schedules", "Malnutrition signs", "Growth monitoring", "Common illnesses"],
    },
    {
      id: "TM004",
      title: "Infectious Disease Management",
      titleHindi: "संक्रामक रोग प्रबंधन",
      description: "Prevention and management of common infectious diseases",
      duration: 40,
      difficulty: "advanced",
      progress: 0,
      completed: false,
      language: "hindi",
      type: "practical",
      topics: ["Disease prevention", "Isolation protocols", "Treatment guidelines", "Community education"],
    },
    {
      id: "TM005",
      title: "Mental Health Awareness",
      titleHindi: "मानसिक स्वास्थ्य जागरूकता",
      description: "Recognizing and supporting mental health issues in rural communities",
      duration: 35,
      difficulty: "beginner",
      progress: 80,
      completed: false,
      language: "hindi",
      type: "interactive",
      topics: ["Depression signs", "Anxiety management", "Counseling basics", "Referral process"],
    },
    {
      id: "TM006",
      title: "Chronic Disease Management",
      titleHindi: "पुरानी बीमारी प्रबंधन",
      description: "Managing diabetes, hypertension, and other chronic conditions",
      duration: 55,
      difficulty: "advanced",
      progress: 15,
      completed: false,
      language: "hindi",
      type: "quiz",
      topics: ["Diabetes care", "Blood pressure monitoring", "Medication adherence", "Lifestyle counseling"],
    },
  ])

  const [badges] = useState<TrainingBadge[]>([
    {
      id: "B001",
      name: "First Aid Expert",
      nameHindi: "प्राथमिक चिकित्सा विशेषज्ञ",
      description: "Completed basic first aid training with 90% score",
      icon: "🏥",
      earned: true,
      earnedDate: "2024-01-10",
      requirements: ["Complete Basic First Aid module", "Score 90% or higher on quiz"],
    },
    {
      id: "B002",
      name: "Maternal Care Specialist",
      nameHindi: "मातृ देखभाल विशेषज्ञ",
      description: "Expert in maternal and child health practices",
      icon: "👶",
      earned: false,
      requirements: ["Complete Maternal Health Care module", "Complete Child Health & Nutrition module"],
    },
    {
      id: "B003",
      name: "Community Health Leader",
      nameHindi: "सामुदायिक स्वास्थ्य नेता",
      description: "Demonstrated leadership in community health initiatives",
      icon: "🌟",
      earned: false,
      requirements: ["Complete 5 training modules", "Conduct 10 community sessions", "Maintain 95% attendance"],
    },
    {
      id: "B004",
      name: "Disease Prevention Champion",
      nameHindi: "रोग निवारण चैंपियन",
      description: "Specialized in infectious disease prevention and management",
      icon: "🛡️",
      earned: false,
      requirements: ["Complete Infectious Disease Management module", "Complete practical assessment"],
    },
  ])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-[#08CB00] text-white"
      case "intermediate":
        return "bg-yellow-500 text-black"
      case "advanced":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video
      case "interactive":
        return BookOpen
      case "quiz":
        return FileText
      case "practical":
        return Users
      default:
        return BookOpen
    }
  }

  const startModule = (moduleId: string) => {
    // Simulate starting a training module
    alert(`Starting training module: ${moduleId}`)
  }

  const downloadCertificate = (badgeId: string) => {
    // Simulate certificate download
    alert(`Downloading certificate for badge: ${badgeId}`)
  }

  const selectedModuleData = trainingModules.find((m) => m.id === selectedModule)

  const completedModules = trainingModules.filter((m) => m.completed).length
  const totalProgress = Math.round(trainingModules.reduce((acc, m) => acc + m.progress, 0) / trainingModules.length)
  const earnedBadges = badges.filter((b) => b.earned).length

  const handleTrainingVoice = (text: string) => {
    const t = text.toLowerCase()
    if (t.includes("badge")) {
      setActiveTab("badges")
      speak("Opening badges and certificates.", "en-US")
      return
    }
    if (t.includes("progress") || t.includes("my progress")) {
      setActiveTab("progress")
      speak("Opening progress.", "en-US")
      return
    }
    if (t.includes("module") || t.includes("training")) {
      setActiveTab("modules")
    }
    // try to start a module by name
    const found = trainingModules.find(
      (m) => t.includes(m.title.toLowerCase()) || t.includes(m.titleHindi.toLowerCase()),
    )
    if (found) {
      setSelectedModule(found.id)
      speak(`Opening ${found.title}.`, "en-US")
    } else {
      speak("Say badges, progress, or a module name like Basic First Aid.", "en-US")
    }
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
          <p className="text-sm text-white/90 mt-1">CHW Training</p>
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
              <Users className="h-8 w-8 text-[#08CB00]" />
              <h1 className="text-3xl sm:text-4xl font-bold text-[#253900]">CHW Training Platform</h1>
            </div>
            <p className="text-lg text-[#253900] max-w-2xl mx-auto text-balance leading-relaxed">
              Localized offline training modules with badges to enhance Community Health Worker skills.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#08CB00]">{completedModules}</div>
                <div className="text-sm text-[#253900]/60">Modules Completed</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#253900]">{totalProgress}%</div>
                <div className="text-sm text-[#253900]/60">Overall Progress</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">{earnedBadges}</div>
                <div className="text-sm text-[#253900]/60">Badges Earned</div>
              </CardContent>
            </Card>
            <Card className="border-[#08CB00]/30 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#253900]">
                  {trainingModules.reduce((acc, m) => acc + m.duration, 0)}
                </div>
                <div className="text-sm text-[#253900]/60">Total Hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setActiveTab("modules")}
              variant={activeTab === "modules" ? "default" : "outline"}
              className={
                activeTab === "modules"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Training Modules
            </Button>
            <Button
              onClick={() => setActiveTab("badges")}
              variant={activeTab === "badges" ? "default" : "outline"}
              className={
                activeTab === "badges"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <Award className="h-4 w-4 mr-2" />
              Badges & Certificates
            </Button>
            <Button
              onClick={() => setActiveTab("progress")}
              variant={activeTab === "progress" ? "default" : "outline"}
              className={
                activeTab === "progress"
                  ? "bg-[#08CB00] hover:bg-[#253900] text-white"
                  : "border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
              }
            >
              <Star className="h-4 w-4 mr-2" />
              My Progress
            </Button>
            <VoiceAssist onTranscript={handleTrainingVoice} className="w-full md:w-auto" />
          </div>

          {/* Training Modules Tab */}
          {activeTab === "modules" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#253900]">Available Training Modules</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#253900]/60">Language:</span>
                  <BadgeComponent
                    variant="secondary"
                    className="bg-[#08CB00]/10 text-[#253900] border border-[#08CB00]/20"
                  >
                    हिंदी (Hindi)
                  </BadgeComponent>
                </div>
              </div>

              <div className="grid gap-4">
                {trainingModules.map((module) => {
                  const TypeIcon = getTypeIcon(module.type)
                  return (
                    <Card
                      key={module.id}
                      className="border-[#08CB00]/30 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedModule(module.id === selectedModule ? null : module.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-[#08CB00]/10 rounded-full flex items-center justify-center border border-[#08CB00]/20">
                              <TypeIcon className="h-6 w-6 text-[#08CB00]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-[#253900]">
                                  {selectedLanguage === "hindi" ? module.titleHindi : module.title}
                                </h3>
                                {module.completed && <CheckCircle className="h-4 w-4 text-[#08CB00]" />}
                                {module.badge && (
                                  <BadgeComponent
                                    variant="secondary"
                                    className="bg-yellow-100 text-yellow-800 border border-yellow-200"
                                  >
                                    <Award className="h-3 w-3 mr-1" />
                                    Badge
                                  </BadgeComponent>
                                )}
                              </div>
                              <p className="text-sm text-[#253900]/80 mb-3">{module.description}</p>
                              <div className="flex items-center gap-4 text-xs text-[#253900]/60">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{module.duration} minutes</span>
                                </div>
                                <BadgeComponent className={getDifficultyColor(module.difficulty)} size="sm">
                                  {module.difficulty}
                                </BadgeComponent>
                                <span className="capitalize">{module.type}</span>
                              </div>
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-[#253900]">Progress</span>
                                  <span className="text-sm text-[#253900]">{module.progress}%</span>
                                </div>
                                <Progress value={module.progress} className="h-2 bg-[#08CB00]/20" />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                startModule(module.id)
                              }}
                              className="bg-[#08CB00] hover:bg-[#253900] text-white"
                            >
                              {module.progress > 0 ? (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Continue
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Start
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {selectedModule === module.id && (
                          <div className="mt-4 pt-4 border-t border-[#08CB00]/20">
                            <h4 className="font-medium text-[#253900] mb-2">Topics Covered:</h4>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {module.topics.map((topic, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-[#253900]/80">
                                  <CheckCircle className="h-3 w-3 text-[#08CB00]" />
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                                className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download Materials
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                                className="border-[#08CB00]/30 hover:bg-[#08CB00] hover:text-white bg-transparent"
                              >
                                <Volume2 className="h-4 w-4 mr-1" />
                                Audio Version
                              </Button>
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

          {/* Badges Tab */}
          {activeTab === "badges" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#253900]">Badges & Certificates</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <Card
                    key={badge.id}
                    className={`border-[#08CB00]/30 shadow-sm ${badge.earned ? "bg-[#08CB00]/5" : "opacity-60"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                            badge.earned
                              ? "bg-yellow-100 border-2 border-yellow-400"
                              : "bg-gray-100 border-2 border-gray-300"
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-[#253900]">
                              {selectedLanguage === "hindi" ? badge.nameHindi : badge.name}
                            </h3>
                            {badge.earned && <CheckCircle className="h-4 w-4 text-[#08CB00]" />}
                          </div>
                          <p className="text-sm text-[#253900]/80 mb-3">{badge.description}</p>
                          {badge.earned && badge.earnedDate && (
                            <p className="text-xs text-[#08CB00] mb-3">Earned on {badge.earnedDate}</p>
                          )}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-[#253900]">Requirements:</p>
                            {badge.requirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs text-[#253900]/60">
                                {badge.earned ? (
                                  <CheckCircle className="h-3 w-3 text-[#08CB00]" />
                                ) : (
                                  <div className="w-3 h-3 border border-[#253900]/30 rounded-full" />
                                )}
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                          {badge.earned && (
                            <Button
                              size="sm"
                              onClick={() => downloadCertificate(badge.id)}
                              className="mt-3 bg-[#08CB00] hover:bg-[#253900] text-white"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download Certificate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#253900]">My Learning Progress</h2>

              {/* Overall Progress */}
              <Card className="border-[#08CB00]/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#253900]">Overall Training Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#253900]">Total Progress</span>
                      <span className="font-bold text-[#253900]">{totalProgress}%</span>
                    </div>
                    <Progress value={totalProgress} className="h-3 bg-[#08CB00]/20" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-[#08CB00]">{completedModules}</div>
                        <div className="text-sm text-[#253900]/60">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-500">
                          {trainingModules.filter((m) => m.progress > 0 && !m.completed).length}
                        </div>
                        <div className="text-sm text-[#253900]/60">In Progress</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-[#253900]">
                          {trainingModules.filter((m) => m.progress === 0).length}
                        </div>
                        <div className="text-sm text-[#253900]/60">Not Started</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-500">{earnedBadges}</div>
                        <div className="text-sm text-[#253900]/60">Badges</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Module Progress */}
              <Card className="border-[#08CB00]/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#253900]">Module Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingModules.map((module) => (
                      <div key={module.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#253900]">
                            {selectedLanguage === "hindi" ? module.titleHindi : module.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#253900]">{module.progress}%</span>
                            {module.completed && <CheckCircle className="h-4 w-4 text-[#08CB00]" />}
                          </div>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-[#08CB00]/20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-[#08CB00]/30 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#253900]">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#08CB00]/5 rounded-lg border border-[#08CB00]/20">
                      <CheckCircle className="h-5 w-5 text-[#08CB00]" />
                      <div>
                        <p className="text-sm font-medium text-[#253900]">Completed Basic First Aid</p>
                        <p className="text-xs text-[#253900]/60">January 10, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Play className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium text-[#253900]">Started Maternal Health Care</p>
                        <p className="text-xs text-[#253900]/60">January 12, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#08CB00]/5 rounded-lg border border-[#08CB00]/20">
                      <Award className="h-5 w-5 text-[#08CB00]" />
                      <div>
                        <p className="text-sm font-medium text-[#253900]">Earned First Aid Expert Badge</p>
                        <p className="text-xs text-[#253900]/60">January 10, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* How CHW Training Works */}
          <Card className="bg-[#08CB00]/5 border-[#08CB00]/30 shadow-sm">
            <CardHeader>
              <CardTitle className="text-[#253900]">How CHW Training Platform Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <p className="text-sm text-[#253900]/80">
                  Access training modules offline in local languages (Hindi, Tamil, Punjabi, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <p className="text-sm text-[#253900]/80">
                  Complete interactive modules with videos, quizzes, and practical exercises
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <p className="text-sm text-[#253900]/80">
                  Earn badges and certificates for completed modules and skill demonstrations
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#08CB00] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <p className="text-sm text-[#253900]/80">
                  Track progress and receive personalized recommendations for continued learning
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
