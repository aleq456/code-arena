"use client"

import { Button } from "@/components/ui/button"
import { Zap, Trophy, Users, ChevronRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass rounded-full border border-neon-purple/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
          </span>
          <span className="font-mono text-sm text-neon-cyan">2,847 DEVS ONLINE</span>
        </div>

        {/* Main title */}
        <h1 className="font-mono text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="text-glow-purple text-neon-purple">CODE</span>
          <span className="text-foreground">_</span>
          <span className="text-glow-blue text-neon-blue">ARENA</span>
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-xl sm:text-2xl text-muted-foreground mb-4">
          {">"} DUEL DEVS REALTIME_
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Prove your coding skills in real-time 1v1 battles. Solve challenges faster than your opponent, 
          climb the global leaderboard, and become a legend.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="font-mono text-lg px-8 py-6 bg-neon-purple hover:bg-neon-purple/80 text-white glow-purple group"
          >
            <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
            START DUEL
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="font-mono text-lg px-8 py-6 border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue"
          >
            WATCH LIVE
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="glass rounded-xl p-6 border border-neon-purple/20 hover:border-neon-purple/40 transition-colors">
            <Trophy className="w-8 h-8 text-neon-purple mx-auto mb-3" />
            <div className="font-mono text-3xl font-bold text-foreground mb-1">50K+</div>
            <div className="font-mono text-sm text-muted-foreground">DUELS FOUGHT</div>
          </div>
          <div className="glass rounded-xl p-6 border border-neon-blue/20 hover:border-neon-blue/40 transition-colors">
            <Users className="w-8 h-8 text-neon-blue mx-auto mb-3" />
            <div className="font-mono text-3xl font-bold text-foreground mb-1">12K+</div>
            <div className="font-mono text-sm text-muted-foreground">WARRIORS</div>
          </div>
          <div className="glass rounded-xl p-6 border border-neon-cyan/20 hover:border-neon-cyan/40 transition-colors">
            <Zap className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
            <div className="font-mono text-3xl font-bold text-foreground mb-1">{"<"}30s</div>
            <div className="font-mono text-sm text-muted-foreground">AVG QUEUE</div>
          </div>
        </div>
      </div>

    </section>
  )
}
