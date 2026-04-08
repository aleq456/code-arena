"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Flame, Target, TrendingUp, Medal, Zap, ChevronRight } from "lucide-react"

const leaderboardData = [
  { rank: 1, name: "AlgoKing", elo: 2847, wins: 342, streak: 12, avatar: "king" },
  { rank: 2, name: "ByteQueen", elo: 2791, wins: 298, streak: 8, avatar: "queen" },
  { rank: 3, name: "CodeNinja", elo: 2756, wins: 276, streak: 5, avatar: "ninja" },
  { rank: 4, name: "DevStorm", elo: 2698, wins: 251, streak: 3, avatar: "storm" },
  { rank: 5, name: "HackMaster", elo: 2654, wins: 234, streak: 7, avatar: "hack" },
]

export function DashboardSection() {
  return (
    <section id="dashboard" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge className="font-mono bg-neon-blue/20 text-neon-blue border-neon-blue/30 mb-4">
            RANKINGS
          </Badge>
          <h2 className="font-mono text-3xl sm:text-4xl font-bold mb-4 text-balance">
            <span className="text-foreground">GLOBAL</span>
            <span className="text-muted-foreground">_</span>
            <span className="text-neon-purple">LEADERBOARD</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Track your progress and compete with the best coders worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-6 border border-neon-cyan/30 h-full">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 border-4 border-neon-cyan">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=you" />
                    <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan font-mono text-2xl">YOU</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <Badge className="font-mono text-xs bg-neon-cyan text-background border-0">
                      LVL 42
                    </Badge>
                  </div>
                </div>
                <h3 className="font-mono text-xl font-bold mt-6 mb-1 text-foreground">YourHandle</h3>
                <p className="font-mono text-sm text-muted-foreground">Joined Dec 2024</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass rounded-lg p-4 text-center">
                  <Trophy className="w-5 h-5 text-neon-purple mx-auto mb-2" />
                  <div className="font-mono text-2xl font-bold text-foreground">1,892</div>
                  <div className="font-mono text-xs text-muted-foreground">ELO</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <Target className="w-5 h-5 text-neon-blue mx-auto mb-2" />
                  <div className="font-mono text-2xl font-bold text-foreground">67%</div>
                  <div className="font-mono text-xs text-muted-foreground">WIN RATE</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <Flame className="w-5 h-5 text-destructive mx-auto mb-2" />
                  <div className="font-mono text-2xl font-bold text-foreground">5</div>
                  <div className="font-mono text-xs text-muted-foreground">STREAK</div>
                </div>
                <div className="glass rounded-lg p-4 text-center">
                  <TrendingUp className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
                  <div className="font-mono text-2xl font-bold text-foreground">#847</div>
                  <div className="font-mono text-xs text-muted-foreground">RANK</div>
                </div>
              </div>

              <Button className="w-full font-mono bg-neon-cyan hover:bg-neon-cyan/80 text-background">
                <Zap className="w-4 h-4 mr-2" />
                FIND MATCH
              </Button>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="lg:col-span-2">
            <div className="glass-strong rounded-2xl border border-neon-purple/30 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/30 border-b border-border">
                <div className="col-span-1 font-mono text-xs text-muted-foreground">#</div>
                <div className="col-span-5 font-mono text-xs text-muted-foreground">PLAYER</div>
                <div className="col-span-2 font-mono text-xs text-muted-foreground text-right">ELO</div>
                <div className="col-span-2 font-mono text-xs text-muted-foreground text-right hidden sm:block">WINS</div>
                <div className="col-span-2 font-mono text-xs text-muted-foreground text-right">STREAK</div>
              </div>

              {/* Table Body */}
              {leaderboardData.map((player, index) => (
                <div
                  key={player.rank}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-border/50 hover:bg-muted/20 transition-colors items-center"
                >
                  <div className="col-span-1">
                    {player.rank === 1 && <Medal className="w-5 h-5 text-yellow-500" />}
                    {player.rank === 2 && <Medal className="w-5 h-5 text-gray-400" />}
                    {player.rank === 3 && <Medal className="w-5 h-5 text-amber-600" />}
                    {player.rank > 3 && (
                      <span className="font-mono text-sm text-muted-foreground">{player.rank}</span>
                    )}
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.avatar}`} />
                      <AvatarFallback className="font-mono text-xs">{player.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="font-mono text-sm text-foreground truncate">{player.name}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span 
                      className={`font-mono text-sm font-bold ${
                        index === 0 ? "text-neon-purple text-glow-purple" : 
                        index === 1 ? "text-neon-blue" : 
                        index === 2 ? "text-neon-cyan" : 
                        "text-foreground"
                      }`}
                    >
                      {player.elo.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 text-right hidden sm:block">
                    <span className="font-mono text-sm text-muted-foreground">{player.wins}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Flame className="w-3 h-3 text-destructive" />
                      <span className="font-mono text-sm text-foreground">{player.streak}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* View All */}
              <div className="px-6 py-4 text-center">
                <button className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-neon-purple transition-colors">
                  VIEW FULL RANKINGS
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
