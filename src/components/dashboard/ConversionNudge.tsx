import { Sparkles, Gift, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ConversionNudge = () => {
  const { authState, signIn } = useAuth();

  if (authState !== "anonymous-post-diagnosis") return null;

  return (
    <div className="w-full">
      <div
        className="glass-card p-6 md:p-8 relative overflow-hidden"
        style={{
          border: "1px solid hsla(252, 75%, 63%, 0.25)",
          boxShadow:
            "0 0 60px -15px hsla(252, 75%, 63%, 0.15), inset 0 1px 0 0 hsl(0 0% 100% / 0.1)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsla(252, 75%, 63%, 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center">
              <Gift className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-[17px]">
                Your diagnosis is ready — save it forever
              </h3>
              <p className="text-xs text-muted-foreground">
                Plus unlock 2 more free analyses
              </p>
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: "hsl(0 0% 100% / 0.03)" }}>
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Save this diagnosis</p>
                <p className="text-xs text-muted-foreground">Access it anytime, track changes</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: "hsl(0 0% 100% / 0.03)" }}>
              <TrendingUp className="w-4 h-4 text-profit mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">2 more free analyses</p>
                <p className="text-xs text-muted-foreground">Analyze any wallet, no cost</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg" style={{ background: "hsl(0 0% 100% / 0.03)" }}>
              <Clock className="w-4 h-4 text-info mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">Track over time</p>
                <p className="text-xs text-muted-foreground">Compare portfolio snapshots</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={signIn}
              className="glass-button-primary text-primary-foreground text-sm font-semibold rounded-full px-8 py-2.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Sign in to save & unlock more
            </button>
            <span className="text-xs text-muted-foreground">
              Email, wallet, or social login · takes 10 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionNudge;
