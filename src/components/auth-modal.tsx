// Auth modal - handles both login and signup in one component
// Shows as a popup when user clicks "Sign In" or "Join Arena"

"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Swords, Loader2 } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "signin" | "signup"
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  // Track which mode we're in - signing in or signing up
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode)
  
  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  
  // UI states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Don't render anything if modal is closed
  if (!isOpen) return null

  async function handleSubmit() {
    setLoading(true)
    setError("")
    setSuccess("")

    if (mode === "signup") {
      // --- SIGN UP ---
      if (!username.trim()) {
        setError("Username is required")
        setLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Account created! You can now sign in.")
        setMode("signin")
      }

    } else {
      // --- SIGN IN ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setError(error.message)
      } else {
        onClose() // Close modal on successful login
      }
    }

    setLoading(false)
  }

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal box */}
      <div className="relative glass-strong rounded-2xl border border-neon-purple/30 p-8 w-full max-w-md">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <Swords className="w-10 h-10 text-neon-purple mx-auto mb-4" />
          <h2 className="font-mono text-2xl font-bold text-foreground">
            {mode === "signin" ? "WELCOME BACK" : "JOIN THE ARENA"}
          </h2>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            {mode === "signin" 
              ? "Sign in to continue your battles" 
              : "Create your account and start dueling"}
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          
          {/* Username field - only shown on signup */}
          {mode === "signup" && (
            <div className="space-y-2">
              <Label className="font-mono text-sm text-muted-foreground">USERNAME</Label>
              <Input
                placeholder="e.g. CodeNinja42"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="font-mono bg-input border-border focus:border-neon-purple"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-mono text-sm text-muted-foreground">EMAIL</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-mono bg-input border-border focus:border-neon-purple"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-sm text-muted-foreground">PASSWORD</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-mono bg-input border-border focus:border-neon-purple"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="font-mono text-sm text-destructive text-center">{error}</p>
          )}

          {/* Success message */}
          {success && (
            <p className="font-mono text-sm text-neon-cyan text-center">{success}</p>
          )}

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-mono bg-neon-purple hover:bg-neon-purple/80 text-white mt-2"
          >
            {loading 
              ? <Loader2 className="w-4 h-4 animate-spin" /> 
              : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"
            }
          </Button>

          {/* Switch between signin and signup */}
          <p className="font-mono text-sm text-center text-muted-foreground">
            {mode === "signin" ? "No account yet? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError("") }}
              className="text-neon-purple hover:underline"
            >
              {mode === "signin" ? "Join Arena" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
