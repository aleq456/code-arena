// Navbar - shows different buttons depending on if user is logged in or not

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Code2, Swords, LogOut, User } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  
  // Auth modal state
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  
  // Current logged in user (null if not logged in)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  // Check if user is already logged in when navbar loads
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for login/logout events and update the navbar
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Cleanup listener when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  function openSignIn() {
    setAuthMode("signin")
    setShowAuth(true)
  }

  function openSignUp() {
    setAuthMode("signup")
    setShowAuth(true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Swords className="w-8 h-8 text-neon-purple" />
                <div className="absolute inset-0 w-8 h-8 text-neon-purple blur-sm opacity-50">
                  <Swords className="w-8 h-8" />
                </div>
              </div>
              <span className="font-mono text-xl font-bold text-glow-purple text-foreground">
                CODE_ARENA
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#lobby" className="font-mono text-sm text-muted-foreground hover:text-neon-purple transition-colors">LOBBY</a>
              <a href="#dashboard" className="font-mono text-sm text-muted-foreground hover:text-neon-purple transition-colors">RANKINGS</a>
              <a href="#" className="font-mono text-sm text-muted-foreground hover:text-neon-purple transition-colors">TOURNAMENTS</a>
              <a href="#" className="font-mono text-sm text-muted-foreground hover:text-neon-purple transition-colors">DOCS</a>
            </div>

            {/* Desktop CTA - changes based on login state */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                // User is logged in - show their email and logout button
                <>
                  <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground">
                    <User className="w-4 h-4 text-neon-cyan" />
                    <span className="text-neon-cyan">
                      {user.user_metadata?.username || user.email?.split("@")[0]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="font-mono text-sm text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                // User is not logged in - show sign in and join buttons
                <>
                  <Button
                    variant="ghost"
                    onClick={openSignIn}
                    className="font-mono text-sm text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={openSignUp}
                    className="font-mono text-sm bg-neon-purple hover:bg-neon-purple/80 text-white glow-purple"
                  >
                    <Code2 className="w-4 h-4 mr-2" />
                    Join Arena
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden glass-strong border-t border-border">
            <div className="px-4 py-4 space-y-4">
              <a href="#lobby" className="block font-mono text-sm text-muted-foreground hover:text-neon-purple">LOBBY</a>
              <a href="#dashboard" className="block font-mono text-sm text-muted-foreground hover:text-neon-purple">RANKINGS</a>
              <a href="#" className="block font-mono text-sm text-muted-foreground hover:text-neon-purple">TOURNAMENTS</a>
              <a href="#" className="block font-mono text-sm text-muted-foreground hover:text-neon-purple">DOCS</a>
              <div className="pt-4 border-t border-border space-y-2">
                {user ? (
                  <Button onClick={handleSignOut} variant="ghost" className="w-full font-mono text-sm justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button onClick={openSignIn} variant="ghost" className="w-full font-mono text-sm justify-start">Sign In</Button>
                    <Button onClick={openSignUp} className="w-full font-mono text-sm bg-neon-purple hover:bg-neon-purple/80 text-white">
                      <Code2 className="w-4 h-4 mr-2" />
                      Join Arena
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal - rendered outside navbar so it overlays everything */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode={authMode}
      />
    </>
  )
}