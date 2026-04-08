import { Swords, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-6 h-6 text-neon-purple" />
              <span className="font-mono text-lg font-bold text-foreground">CODE_ARENA</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The ultimate platform for competitive coding battles.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-neon-purple transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-neon-blue transition-colors">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-sm font-bold text-foreground mb-4">ARENA</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Quick Match</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Tournaments</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Practice</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-purple transition-colors">Challenges</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-sm font-bold text-foreground mb-4">COMMUNITY</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-blue transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-blue transition-colors">Discord</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-blue transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-blue transition-colors">Events</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-sm font-bold text-foreground mb-4">SUPPORT</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted-foreground">
            &copy; 2025 CODE_ARENA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              TERMS
            </a>
            <a href="#" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              PRIVACY
            </a>
            <a href="#" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              COOKIES
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
