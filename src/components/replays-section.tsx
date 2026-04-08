"use client"

import { useState } from "react"
import { Play, Eye, Clock, Trophy, Zap, ChevronRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const REPLAYS = [
  {
    id: 1,
    player1: { name: "0xNova", elo: 2841, avatar: "N", color: "neon-purple" },
    player2: { name: "ByteWitch", elo: 2790, avatar: "B", color: "neon-blue" },
    winner: "player1",
    duration: "14:22",
    problem: "Merge K Sorted Lists",
    difficulty: "HARD",
    views: 4821,
    tags: ["Heap", "LinkedList"],
    timeAgo: "2h ago",
  },
  {
    id: 2,
    player1: { name: "NullPtr", elo: 2601, avatar: "N", color: "neon-blue" },
    player2: { name: "SegFault", elo: 2588, avatar: "S", color: "neon-cyan" },
    winner: "player2",
    duration: "08:47",
    problem: "LRU Cache",
    difficulty: "MEDIUM",
    views: 2103,
    tags: ["HashMap", "DLL"],
    timeAgo: "5h ago",
  },
  {
    id: 3,
    player1: { name: "GigaChad.js", elo: 2455, avatar: "G", color: "neon-purple" },
    player2: { name: "r3cursion", elo: 2410, avatar: "R", color: "neon-blue" },
    winner: "player1",
    duration: "06:03",
    problem: "Two Sum",
    difficulty: "EASY",
    views: 987,
    tags: ["Array", "HashMap"],
    timeAgo: "1d ago",
  },
  {
    id: 4,
    player1: { name: "async_await", elo: 2312, avatar: "A", color: "neon-cyan" },
    player2: { name: "O(1)Enjoyer", elo: 2299, avatar: "O", color: "neon-purple" },
    winner: "player2",
    duration: "19:55",
    problem: "Serialize Binary Tree",
    difficulty: "HARD",
    views: 3340,
    tags: ["Tree", "BFS"],
    timeAgo: "1d ago",
  },
  {
    id: 5,
    player1: { name: "v8_turbo", elo: 2190, avatar: "V", color: "neon-blue" },
    player2: { name: "rustacean", elo: 2177, avatar: "R", color: "neon-cyan" },
    winner: "player1",
    duration: "11:34",
    problem: "Valid Parentheses",
    difficulty: "EASY",
    views: 654,
    tags: ["Stack"],
    timeAgo: "2d ago",
  },
  {
    id: 6,
    player1: { name: "heap_queen", elo: 2760, avatar: "H", color: "neon-purple" },
    player2: { name: "dp_wizard", elo: 2744, avatar: "D", color: "neon-blue" },
    winner: "player2",
    duration: "22:10",
    problem: "Edit Distance",
    difficulty: "HARD",
    views: 5910,
    tags: ["DP", "String"],
    timeAgo: "3d ago",
  },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  EASY: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10",
  MEDIUM: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  HARD: "text-red-400 border-red-400/40 bg-red-400/10",
}

const FILTERS = ["ALL", "EASY", "MEDIUM", "HARD"]

export function ReplaysSection() {
  const [activeFilter, setActiveFilter] = useState("ALL")

  const filtered = activeFilter === "ALL"
    ? REPLAYS
    : REPLAYS.filter((r) => r.difficulty === activeFilter)

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <p className="font-mono text-sm text-neon-cyan mb-2">// RECENTLY PLAYED</p>
            <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
              GAME <span className="text-neon-purple text-glow-purple">REPLAYS</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`font-mono text-xs px-3 py-1.5 rounded border transition-all ${
                    activeFilter === f
                      ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
                      : "border-muted-foreground/20 text-muted-foreground hover:border-muted-foreground/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Replay cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((replay) => (
            <ReplayCard key={replay.id} replay={replay} />
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            className="font-mono border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple"
          >
            LOAD MORE REPLAYS
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}

function ReplayCard({ replay }: { replay: typeof REPLAYS[0] }) {
  const winner = replay.winner === "player1" ? replay.player1 : replay.player2
  const loser = replay.winner === "player1" ? replay.player2 : replay.player1

  return (
    <div className="glass rounded-xl border border-neon-purple/20 hover:border-neon-purple/50 transition-all group overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className={`font-mono text-xs px-2 py-0.5 rounded border ${DIFFICULTY_COLORS[replay.difficulty]}`}>
          {replay.difficulty}
        </span>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="font-mono text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {replay.duration}
          </span>
          <span className="font-mono text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {replay.views.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Players */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Winner */}
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full glass border border-neon-purple/40 flex items-center justify-center font-mono text-xs font-bold text-neon-purple shrink-0`}>
              {winner.avatar}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-sm text-foreground truncate flex items-center gap-1">
                {winner.name}
                <Trophy className="w-3 h-3 text-yellow-400 shrink-0" />
              </div>
              <div className="font-mono text-xs text-neon-purple">{winner.elo} ELO</div>
            </div>
          </div>

          {/* VS divider */}
          <div className="font-mono text-xs text-muted-foreground/50 shrink-0 px-1">VS</div>

          {/* Loser */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <div className="min-w-0 text-right">
              <div className="font-mono text-sm text-muted-foreground truncate">{loser.name}</div>
              <div className="font-mono text-xs text-muted-foreground/60">{loser.elo} ELO</div>
            </div>
            <div className="w-8 h-8 rounded-full glass border border-muted-foreground/20 flex items-center justify-center font-mono text-xs font-bold text-muted-foreground shrink-0">
              {loser.avatar}
            </div>
          </div>
        </div>

        {/* Problem */}
        <div className="font-mono text-xs text-muted-foreground mb-3 truncate">
          {">"} {replay.problem}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
          {replay.tags.map((tag) => (
            <span key={tag} className="font-mono text-xs px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 text-neon-blue/80">
              {tag}
            </span>
          ))}
          <span className="font-mono text-xs text-muted-foreground/40 ml-auto">{replay.timeAgo}</span>
        </div>

        {/* Watch button */}
        <button className="w-full flex items-center justify-center gap-2 font-mono text-xs py-2 rounded border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple transition-all group-hover:border-neon-purple/60">
          <Play className="w-3 h-3 fill-neon-purple" />
          WATCH REPLAY
          <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  )
}
