// Main app - handles navigation between lobby and duel room

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { DuelLobby } from "@/components/duel-lobby"
import { ReplaysSection } from "@/components/replays-section"
import { DashboardSection } from "@/components/dashboard-section"
import { Footer } from "@/components/footer"
import { DuelRoom } from "@/components/duel-room"
import { supabase } from "@/lib/supabase"
import { findOrCreateDuel } from "@/lib/matchmaking"
import { Loader2, Swords } from "lucide-react"

// The two "pages" of our app
type AppView = "lobby" | "matchmaking" | "duel"

interface ActiveDuel {
  duelId: string
  problem: any
}

export default function App() {
  const [view, setView] = useState<AppView>("lobby")
  const [activeDuel, setActiveDuel] = useState<ActiveDuel | null>(null)
  const [matchmakingStatus, setMatchmakingStatus] = useState("")
  const [user, setUser] = useState<any>(null)

  // Track logged in user
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  async function handleStartDuel() {
    if (!user) {
      alert("Please sign in first!")
      return
    }

    setView("matchmaking")
    setMatchmakingStatus("Searching for opponent...")

    try {
      const { duelId, problem, isNewDuel } = await findOrCreateDuel(user.id)

      if (!isNewDuel) {
        // Joined someone else's duel - start immediately
        setActiveDuel({ duelId, problem })
        setView("duel")
        return
      }

      // We created a duel - poll until opponent joins
      setMatchmakingStatus("Waiting for opponent...")

      let found = false
      let attempts = 0
      const maxAttempts = 30 // 30 x 2 seconds = 60 seconds max

      const pollInterval = setInterval(async () => {
        attempts++

        // Stop if already found or timed out
        if (found || attempts >= maxAttempts) {
          clearInterval(pollInterval)
          if (!found) {
            await supabase.from("duels").delete().eq("id", duelId)
            setView("lobby")
            alert("No opponent found. Try again!")
          }
          return
        }

        const { data: duel } = await supabase
          .from("duels")
          .select("*")
          .eq("id", duelId)
          .single()

        console.log("🔄 Poll:", duel?.status, "player2:", duel?.player2_id)

        if (duel?.player2_id) {
          found = true
          clearInterval(pollInterval)
          setActiveDuel({ duelId, problem })
          setView("duel")
        }
      }, 2000)

    } catch (err) {
      console.error("Matchmaking error:", err)
      setView("lobby")
      alert("Something went wrong. Try again!")
    }
  }

  // Exit duel and go back to lobby
  function handleExitDuel() {
    setActiveDuel(null)
    setView("lobby")
  }

  // Show duel room
  if (view === "duel" && activeDuel) {
    return (
      <DuelRoom
        problem={activeDuel.problem}
        duelId={activeDuel.duelId}
        onExit={handleExitDuel}
      />
    )
  }

  // Show matchmaking screen
  if (view === "matchmaking") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <Swords className="w-16 h-16 text-neon-purple mx-auto animate-pulse" />
            <div className="absolute inset-0 w-16 h-16 mx-auto text-neon-purple blur-md opacity-50">
              <Swords className="w-16 h-16" />
            </div>
          </div>
          <h2 className="font-mono text-2xl font-bold text-foreground mb-4">
            FINDING OPPONENT
          </h2>
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-neon-purple" />
            <span className="font-mono text-sm">{matchmakingStatus}</span>
          </div>
          <button
            onClick={() => setView("lobby")}
            className="mt-8 font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    )
  }

  // Show main lobby
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-neon-blue/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-neon-cyan/15 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection onStartDuel={handleStartDuel} />
        <DuelLobby />
        <ReplaysSection />
        <DashboardSection />
        <Footer />
      </div>
    </main>
  )
}
