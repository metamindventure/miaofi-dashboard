import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";

const steps = [
  "Scanning wallets across 6 chains...",
  "Found 13 assets · Calculating P&L...",
  "AI is analyzing your portfolio...",
  "Generating personalized insights...",
];

const LoadingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 1500);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 6000;
    const frame = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center relative">
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, hsla(252, 75%, 63%, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col items-center gap-8 z-10">
        {/* Pulsing logo */}
        <div className="animate-pulse-logo w-16 h-16 rounded-full brand-gradient flex items-center justify-center">
          <span className="text-primary-foreground font-display font-bold text-2xl">M</span>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3 min-w-[320px]">
          {steps.map((step, i) => {
            if (i > currentStep) return null;
            const completed = i < currentStep;
            return (
              <div
                key={i}
                className="flex items-center gap-3 transition-all duration-300"
                style={{
                  opacity: completed ? 0.6 : 1,
                }}
              >
                {completed ? (
                  <Check className="w-4 h-4 text-profit shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin-slow shrink-0 text-foreground" />
                )}
                <span
                  className={`text-sm font-body ${
                    completed ? "text-profit" : "text-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-[320px] h-[2px] rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-profit transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
