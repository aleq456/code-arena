"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Swords, Play, Terminal } from "lucide-react"

const codeSnippetLeft = `function solve(arr) {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(arr[i], i);
  }
  return [];
}`

const codeSnippetRight = `def solve(arr):
    seen = {}
    for i, num in enumerate(arr):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`

export function DuelLobby() {
  const [timer, setTimer] = useState(127)
  const [typing, setTyping] = useState({ left: 0, right: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 127))
    }, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setTyping((prev) => ({
        left: Math.min(prev.left + 2, codeSnippetLeft.length),
        right: Math.min(prev.right + 1, codeSnippetRight.length),
      }))
    }, 100)
    return () => clearInterval(interval)
  }, [mounted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <section id="lobby" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge className="font-mono bg-neon-purple/20 text-neon-purple border-neon-purple/30 mb-4">
            LIVE DUEL
          </Badge>
          <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 text-balance">
            <span className="text-foreground">BATTLE</span>
            <span className="text-muted-foreground">_</span>
            <span className="text-neon-cyan">PREVIEW</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Watch real-time coding duels or jump into the arena yourself
          </p>
        </div>

        {/* Duel Arena */}
        <div className="glass-strong rounded-2xl p-4 sm:p-6 border border-neon-purple/30">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Swords className="w-5 h-5 text-neon-purple" />
              <span className="font-mono text-sm text-muted-foreground">CHALLENGE:</span>
              <span className="font-mono text-sm text-foreground">Two Sum Problem</span>
              <Badge variant="outline" className="font-mono text-xs border-neon-cyan/50 text-neon-cyan">
                MEDIUM
              </Badge>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 bg-destructive/20 rounded-lg border border-destructive/30">
              <Clock className="w-4 h-4 text-destructive" />
              <span className="font-mono text-lg font-bold text-destructive">
                {formatTime(timer)}
              </span>
            </div>
          </div>

          {/* Players and Editors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Player 1 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-neon-purple">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=player1" />
                    <AvatarFallback className="bg-neon-purple/20 text-neon-purple font-mono">NK</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-mono text-sm font-bold text-foreground">NightKoder</div>
                    <div className="font-mono text-xs text-neon-purple">ELO: 2,145</div>
                  </div>
                </div>
                <Badge className="font-mono text-xs bg-neon-purple/20 text-neon-purple border-0">
                  JavaScript
                </Badge>
              </div>
              
              {/* Code Editor */}
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">solution.js</span>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="p-4 h-48 overflow-hidden">
                  <pre className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <code>
                      {codeSnippetLeft.slice(0, typing.left)}
                      <span className="animate-pulse text-neon-purple">|</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Player 2 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 border-2 border-neon-blue">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=player2" />
                    <AvatarFallback className="bg-neon-blue/20 text-neon-blue font-mono">PY</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-mono text-sm font-bold text-foreground">PyMaster</div>
                    <div className="font-mono text-xs text-neon-blue">ELO: 2,089</div>
                  </div>
                </div>
                <Badge className="font-mono text-xs bg-neon-blue/20 text-neon-blue border-0">
                  Python
                </Badge>
              </div>
              
              {/* Code Editor */}
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">solution.py</span>
                  <div className="ml-auto flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-destructive/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="p-4 h-48 overflow-hidden">
                  <pre className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <code>
                      {codeSnippetRight.slice(0, typing.right)}
                      <span className="animate-pulse text-neon-blue">|</span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-neon-purple">NightKoder - 3/5 tests</span>
              <span className="font-mono text-xs text-muted-foreground">VS</span>
              <span className="font-mono text-xs text-neon-blue">PyMaster - 2/5 tests</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-neon-purple rounded-full transition-all" style={{ width: "60%" }} />
              </div>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-neon-blue rounded-full transition-all" style={{ width: "40%" }} />
              </div>
            </div>
          </div>

          {/* Watch button */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-neon-cyan transition-colors">
              <Play className="w-4 h-4" />
              WATCH FULL MATCH
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
