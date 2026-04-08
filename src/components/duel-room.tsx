// The main duel room where two players compete
// Has a code editor, problem description, timer, and submit button

"use client"

import { useState, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, Swords, Send, CheckCircle, 
  XCircle, Loader2, Trophy, ChevronLeft 
} from "lucide-react"

// The starter code shown in the editor for each language
const STARTER_CODE: Record<string, string> = {
  javascript: `// Write your solution here
function solution(input) {
  // Your code here
  
}`,
  python: `# Write your solution here
def solution(input):
    # Your code here
    pass`,
}

// Judge0 language IDs (we need these to tell Judge0 which language to run)
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
}

interface Problem {
  id: number
  title: string
  description: string
  difficulty: string
  examples: string
  constraints: string
  test_cases: Array<{ input: string; expected_output: string }>
}

interface DuelRoomProps {
  problem: Problem
  duelId: string
  onExit: () => void
}

export function DuelRoom({ problem, duelId, onExit }: DuelRoomProps) {
  // Code editor state
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(STARTER_CODE.javascript)
  
  // Timer state - 30 minutes per duel
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  
  // Submission state
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<Array<{
    passed: boolean
    input: string
    expected: string
    got: string
  }>>([])
  const [submitted, setSubmitted] = useState(false)
  const [won, setWon] = useState<boolean | null>(null)

  // Opponent progress (comes from Supabase realtime)
  const [opponentTests, setOpponentTests] = useState(0)
  const totalTests = problem.test_cases.length

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Listen for opponent progress via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`duel:${duelId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'duels',
        filter: `id=eq.${duelId}`
      }, (payload) => {
        // Update opponent's test count when their row changes
        const duel = payload.new as any
        setOpponentTests(duel.opponent_tests_passed || 0)
        
        // Check if opponent already won
        if (duel.winner_id && !won) {
          setWon(false)
          setSubmitted(true)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [duelId])

  // Format timer as MM:SS
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Switch language and reset editor code
  function handleLanguageChange(lang: string) {
    setLanguage(lang)
    setCode(STARTER_CODE[lang])
  }

  // Submit code to Judge0 and check results
  async function handleSubmit() {
    setSubmitting(true)
    setResults([])

    try {
      const testResults = []
      let passedCount = 0

      // Run each test case one by one
      for (const testCase of problem.test_cases) {
        
        // Wrap the user's code with test case input
        const fullCode = language === "python"
          ? `${code}\nprint(solution(${testCase.input}))`
          : `${code}\nconsole.log(JSON.stringify(solution(${testCase.input})))`

        // Send to Judge0 free public instance
        const submitRes = await fetch("https://ce.judge0.com/submissions?wait=true", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_code: fullCode,
            language_id: LANGUAGE_IDS[language],
            stdin: testCase.input,
          })
        })

        const result = await submitRes.json()
        
        // Clean up the output for comparison
        const actualOutput = (result.stdout || "").trim()
        const expectedOutput = testCase.expected_output.trim()
        const passed = actualOutput === expectedOutput

        if (passed) passedCount++

        testResults.push({
          passed,
          input: testCase.input,
          expected: expectedOutput,
          got: actualOutput || result.stderr || "No output"
        })
      }

      setResults(testResults)

      // Update our progress in the database so opponent can see it
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const allPassed = passedCount === problem.test_cases.length

        // Update the duel record with our progress
        await supabase
          .from("duels")
          .update({
            player1_tests_passed: passedCount,
            // If we passed all tests, mark us as winner
            ...(allPassed ? { winner_id: user.id, status: "completed" } : {})
          })
          .eq("id", duelId)

        if (allPassed) {
          setWon(true)
          setSubmitted(true)
          // Update ELO - we'll add this function next
          await updateElo(user.id, true)
        }
      }

    } catch (err) {
      console.error("Judge0 error:", err)
    }

    setSubmitting(false)
  }

  // Update ELO rating after a duel
  async function updateElo(userId: string, won: boolean) {
    // Get current ELO
    const { data: profile } = await supabase
      .from("profiles")
      .select("elo, wins, losses, streak")
      .eq("id", userId)
      .single()

    if (!profile) return

    // Simple ELO calculation
    // Win = +25 ELO, Loss = -15 ELO
    const eloChange = won ? 25 : -15
    const newElo = Math.max(0, profile.elo + eloChange) // Can't go below 0

    await supabase
      .from("profiles")
      .update({
        elo: newElo,
        wins: won ? profile.wins + 1 : profile.wins,
        losses: won ? profile.losses : profile.losses + 1,
        streak: won ? profile.streak + 1 : 0, // Reset streak on loss
      })
      .eq("id", userId)
  }

  // My tests passed count
  const myTestsPassed = results.filter(r => r.passed).length

  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      
      {/* Top bar - timer, problem info, players */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Exit button */}
          <button
            onClick={onExit}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            EXIT
          </button>

          {/* Problem info */}
          <div className="flex items-center gap-3">
            <Swords className="w-4 h-4 text-neon-purple" />
            <span className="text-sm text-foreground">{problem.title}</span>
            <Badge className={`text-xs font-mono ${
              problem.difficulty === "EASY" ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30" :
              problem.difficulty === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
              "bg-destructive/20 text-destructive border-destructive/30"
            }`}>
              {problem.difficulty}
            </Badge>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
            timeLeft < 300 
              ? "bg-destructive/20 border-destructive/30 text-destructive" 
              : "bg-muted/30 border-border text-foreground"
          }`}>
            <Clock className="w-4 h-4" />
            <span className="text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>

          {/* Progress bars */}
          <div className="hidden md:flex items-center gap-4">
            {/* My progress */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neon-purple">YOU</span>
              <div className="flex gap-1">
                {problem.test_cases.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${
                    results[i]?.passed ? "bg-neon-cyan" :
                    results[i] ? "bg-destructive" :
                    "bg-muted"
                  }`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {myTestsPassed}/{totalTests}
              </span>
            </div>

            <span className="text-xs text-muted-foreground">VS</span>

            {/* Opponent progress */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neon-blue">OPP</span>
              <div className="flex gap-1">
                {problem.test_cases.map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${
                    i < opponentTests ? "bg-neon-blue" : "bg-muted"
                  }`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {opponentTests}/{totalTests}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Win/Loss overlay */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-strong rounded-2xl border border-neon-purple/30 p-12 text-center">
            {won ? (
              <>
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-neon-purple mb-2">VICTORY!</h2>
                <p className="text-muted-foreground mb-2">+25 ELO</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <h2 className="text-4xl font-bold text-destructive mb-2">DEFEATED</h2>
                <p className="text-muted-foreground mb-2">-15 ELO</p>
              </>
            )}
            <Button
              onClick={onExit}
              className="mt-6 font-mono bg-neon-purple hover:bg-neon-purple/80 text-white"
            >
              BACK TO LOBBY
            </Button>
          </div>
        </div>
      )}

      {/* Main content - problem + editor side by side */}
      <div className="pt-16 flex h-screen">
        
        {/* LEFT SIDE - Problem description */}
        <div className="w-2/5 border-r border-border overflow-y-auto p-6 space-y-6">
          
          <h1 className="text-xl font-bold text-foreground">{problem.title}</h1>
          
          {/* Description */}
          <div>
            <h3 className="text-sm text-neon-cyan mb-2">// DESCRIPTION</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Examples */}
          <div>
            <h3 className="text-sm text-neon-cyan mb-2">// EXAMPLES</h3>
            <pre className="text-xs bg-muted/30 rounded-lg p-4 text-muted-foreground overflow-x-auto whitespace-pre-wrap">
              {problem.examples}
            </pre>
          </div>

          {/* Constraints */}
          <div>
            <h3 className="text-sm text-neon-cyan mb-2">// CONSTRAINTS</h3>
            <pre className="text-xs bg-muted/30 rounded-lg p-4 text-muted-foreground whitespace-pre-wrap">
              {problem.constraints}
            </pre>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div>
              <h3 className="text-sm text-neon-cyan mb-2">// TEST RESULTS</h3>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`rounded-lg p-3 border text-xs ${
                    r.passed 
                      ? "bg-neon-cyan/10 border-neon-cyan/30" 
                      : "bg-destructive/10 border-destructive/30"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {r.passed 
                        ? <CheckCircle className="w-3 h-3 text-neon-cyan" />
                        : <XCircle className="w-3 h-3 text-destructive" />
                      }
                      <span className={r.passed ? "text-neon-cyan" : "text-destructive"}>
                        Test {i + 1} {r.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>
                    {!r.passed && (
                      <div className="text-muted-foreground space-y-1 mt-2">
                        <div>Input: {r.input}</div>
                        <div>Expected: {r.expected}</div>
                        <div>Got: {r.got}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - Code editor */}
        <div className="flex-1 flex flex-col">
          
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
            {/* Language selector */}
            <div className="flex gap-2">
              {["javascript", "python"].map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-xs px-3 py-1 rounded border transition-all ${
                    language === lang
                      ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {lang === "javascript" ? "JavaScript" : "Python"}
                </button>
              ))}
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className="font-mono text-sm bg-neon-purple hover:bg-neon-purple/80 text-white"
            >
              {submitting 
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />RUNNING...</>
                : <><Send className="w-4 h-4 mr-2" />SUBMIT</>
              }
            </Button>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: false },  // Hide the minimap (too small)
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "all",
                automaticLayout: true,         // Auto-resize with window
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
