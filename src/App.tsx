import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { DuelLobby } from "@/components/duel-lobby"
import { ReplaysSection } from "@/components/replays-section"
import { DashboardSection } from "@/components/dashboard-section"
import { Footer } from "@/components/footer"

export default function App() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-cyan/15 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <DuelLobby />
        <ReplaysSection />
        <DashboardSection />
        <Footer />
      </div>
    </main>
  )
}