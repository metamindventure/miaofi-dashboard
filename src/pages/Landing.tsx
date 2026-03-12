import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Upload, ArrowRight, Sparkles, Shield, Zap, Cat } from "lucide-react";
import NavBar from "@/components/dashboard/NavBar";
import MatrixStreamBg from "@/components/dashboard/backgrounds/MatrixStreamBg";

const chains = [
  { name: "Solana", color: "var(--chain-solana)" },
  { name: "Ethereum", color: "var(--chain-ethereum)" },
  { name: "Arbitrum", color: "var(--chain-arbitrum)" },
  { name: "Optimism", color: "var(--chain-optimism)" },
  { name: "Base", color: "var(--chain-base)" },
  { name: "BSC", color: "var(--chain-bsc)" },
];

const Landing = () => {
  const [walletInput, setWalletInput] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (walletInput.trim()) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MatrixStreamBg />
      <div className="relative z-10">
        <NavBar />

        {/* Hero */}
        <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-14 pb-20">
          {/* Cat logo */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 rounded-full brand-gradient flex items-center justify-center animate-pulse-logo">
              <Cat className="w-10 h-10 text-primary-foreground" />
            </div>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, hsla(252, 75%, 63%, 0.3) 0%, transparent 70%)",
                transform: "scale(2.5)",
                pointerEvents: "none",
              }}
            />
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl text-center text-foreground leading-tight mb-3">
            Your Crypto <span className="brand-gradient-text">Behavioral</span>
            <br />Diagnosis
          </h1>
          <p className="text-secondary-foreground text-base md:text-lg text-center max-w-[520px] mb-10">
            AI-powered analysis of your trading patterns, behavioral biases, and portfolio health — across every chain.
          </p>

          {/* Wallet input */}
          <div className="w-full max-w-[560px] mb-4">
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-3 transition-all focus-within:border-primary/40"
              style={{
                background: "hsl(var(--glass-bg))",
                border: "1px solid hsl(var(--glass-border))",
                boxShadow: "0 4px 24px -4px hsl(0 0% 0% / 0.4), 0 0 60px -20px hsl(252 75% 63% / 0.15)",
              }}
            >
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder="Paste wallet address (SOL / EVM / …)"
                className="flex-1 bg-transparent text-foreground text-sm placeholder:text-muted-foreground outline-none font-mono"
              />
              <button
                onClick={handleAnalyze}
                disabled={!walletInput.trim()}
                className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-xl px-5 py-2 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                Analyze
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Supported chains */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-muted-foreground">Supports:</span>
              {chains.map((c) => (
                <span
                  key={c.name}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    background: `hsl(${c.color} / 0.12)`,
                    color: `hsl(${c.color})`,
                  }}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* CEX secondary action */}
          <div className="flex items-center gap-2 mt-2 mb-12">
            <span className="text-sm text-muted-foreground">No wallet?</span>
            <button
              onClick={() => navigate("/cex-upload")}
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 transition-colors group"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload your exchange trade history
              <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[700px] w-full">
            {[
              { icon: Sparkles, title: "AI Diagnosis", desc: "Detects FOMO, overtrading, concentration risk & more" },
              { icon: Shield, title: "Risk Score", desc: "Portfolio health rating with actionable fixes" },
              { icon: Zap, title: "Instant", desc: "Results in seconds across 6+ chains" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-4 text-center hover:translate-y-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
