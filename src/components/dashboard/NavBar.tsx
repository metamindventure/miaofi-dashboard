import { Sparkles, Globe, LogOut, Copy, Settings, ChevronDown, User, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const WALLET = "0x7a3B…9f4E";
const WALLET_FULL = "0x7a3B1c8D2e5F6a9b0C4d3E8f1A2b5c7D9e4F9f4E";

const NavBar = () => {
  const { toast } = useToast();
  const { authState, credits, totalCredits, signIn, signOut: authSignOut, setUpgradeModalOpen } = useAuth();

  const isSignedIn = authState === "signed-in-free" || authState === "signed-in-paid";
  const showUpgrade = authState === "signed-in-free" && credits === 0;

  const copyAddress = () => {
    navigator.clipboard.writeText(WALLET_FULL);
    toast({ title: "Address copied" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-8"
      style={{
        background: "rgba(10, 10, 15, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.06)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center">
          <span className="text-primary-foreground font-display font-bold text-sm">M</span>
        </div>
        <span className="font-display font-semibold text-foreground text-[15px]">MiaoFi</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Language */}
        <button className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground glass-button rounded-lg px-3 py-1.5">
          <Globe className="w-3.5 h-3.5" />
          EN
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* === Anonymous states: Sign In button === */}
        {!isSignedIn && (
          <button
            onClick={signIn}
            className="glass-button text-foreground text-xs font-semibold rounded-full px-5 py-2 flex items-center gap-1.5 hover:border-primary/30"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* === Signed in: Credit display === */}
        {isSignedIn && (
          <div className="flex items-center gap-2.5">
            {/* Credits chip */}
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                background: credits === 0
                  ? "hsla(350, 100%, 65%, 0.12)"
                  : "hsl(0 0% 100% / 0.04)",
                border: credits === 0
                  ? "1px solid hsla(350, 100%, 65%, 0.25)"
                  : "1px solid hsl(0 0% 100% / 0.10)",
              }}
            >
              <Zap className={`w-3 h-3 ${credits === 0 ? "text-loss" : "text-primary"}`} />
              <span className={credits === 0 ? "text-loss" : "text-foreground"}>
                {credits}
              </span>
              <span className="text-muted-foreground">/ {totalCredits}</span>
            </div>

            {/* Upgrade CTA — only when credits are 0 or paid user wants more */}
            {(showUpgrade || authState === "signed-in-paid") && (
              <button
                onClick={() => setUpgradeModalOpen(true)}
                className="glass-button-primary text-primary-foreground text-xs font-semibold rounded-full px-5 py-2 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {credits === 0 ? "Buy Credits" : "Buy More"}
                </span>
                <span className="sm:hidden">Buy</span>
              </button>
            )}

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full glass-button pl-1 pr-2.5 py-1">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-accent text-[10px] font-mono font-bold text-muted-foreground">
                      0x
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-xs text-muted-foreground font-mono">
                    {WALLET}
                  </span>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                <DropdownMenuLabel className="font-mono text-xs text-muted-foreground truncate">
                  {WALLET_FULL.slice(0, 20)}…{WALLET_FULL.slice(-6)}
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
                  <Copy className="w-3.5 h-3.5" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={authSignOut}
                  className="gap-2 cursor-pointer text-muted-foreground focus:text-muted-foreground"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
