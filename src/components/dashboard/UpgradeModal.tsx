import { useState, useEffect, useCallback } from "react";
import {
  X,
  CreditCard,
  Wallet,
  Check,
  Shield,
  ChevronRight,
  Loader2,
  Sparkles,
  AlertTriangle,
  ArrowLeft,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* ─── Types ─── */
type PayMethod = "stripe" | "crypto";
type Step = "select-pack" | "select-chain" | "confirming" | "success" | "error";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  perUnit: string;
  savings?: string;
  recommended?: boolean;
}

interface Chain {
  id: string;
  name: string;
  icon: string;
  gasEstimate: string;
  gasUsd: number;
  color: string;
  type: "solana" | "evm";
}

/* ─── Data ─── */
const PACKS: CreditPack[] = [
  { id: "starter", name: "Experience", credits: 5, price: 3.99, perUnit: "$0.80" },
  { id: "standard", name: "Standard", credits: 15, price: 8.99, perUnit: "$0.60", savings: "Save 25%", recommended: true },
  { id: "pro", name: "Professional", credits: 40, price: 15.99, perUnit: "$0.40", savings: "Save 50%" },
];

const CHAINS: Chain[] = [
  { id: "solana", name: "Solana", icon: "◎", gasEstimate: "~$0.001", gasUsd: 0.001, color: "var(--chain-solana)", type: "solana" },
  { id: "base", name: "Base", icon: "🔵", gasEstimate: "~$0.02", gasUsd: 0.02, color: "var(--chain-base)", type: "evm" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔷", gasEstimate: "~$0.08", gasUsd: 0.08, color: "var(--chain-arbitrum)", type: "evm" },
  { id: "ethereum", name: "Ethereum", icon: "⟠", gasEstimate: "~$2.50", gasUsd: 2.5, color: "var(--chain-ethereum)", type: "evm" },
];

/* ─── Component ─── */
interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  const { setCredits, setTotalCredits, setAuthState } = useAuth();

  const [payMethod, setPayMethod] = useState<PayMethod>("crypto");
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [step, setStep] = useState<Step>("select-pack");
  const [walletConnected] = useState(true); // mock: wallet is connected
  const [walletType] = useState<"solana" | "evm">("evm"); // mock
  const [confirmProgress, setConfirmProgress] = useState(0);
  const [txHash] = useState("0x7a3b...9f4e");

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("select-pack");
      setSelectedPack(null);
      setSelectedChain(null);
      setConfirmProgress(0);
    }
  }, [open]);

  // Mock confirmation progress
  useEffect(() => {
    if (step !== "confirming") return;
    const interval = setInterval(() => {
      setConfirmProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("success"), 300);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [step]);

  const handleSelectPack = useCallback((pack: CreditPack) => {
    setSelectedPack(pack);
    if (payMethod === "crypto") {
      setStep("select-chain");
    }
  }, [payMethod]);

  const handleSelectChain = useCallback((chain: Chain) => {
    setSelectedChain(chain);
    if (!walletConnected) {
      toast("Please connect your wallet first");
      return;
    }
    setStep("confirming");
  }, [walletConnected]);

  const handleStripeCheckout = useCallback(() => {
    if (!selectedPack) return;
    toast("Redirecting to Stripe Checkout...");
    // Mock: simulate success after delay
    setTimeout(() => {
      setStep("success");
    }, 1500);
  }, [selectedPack]);

  const handleSuccess = useCallback(() => {
    if (selectedPack) {
      setCredits(selectedPack.credits);
      setTotalCredits(selectedPack.credits);
      setAuthState("signed-in-paid");
    }
    onClose();
    toast.success(`${selectedPack?.credits} credits added to your account!`);
  }, [selectedPack, setCredits, setTotalCredits, setAuthState, onClose]);

  const goBack = useCallback(() => {
    if (step === "select-chain") {
      setStep("select-pack");
      setSelectedChain(null);
    } else if (step === "error") {
      setStep("select-chain");
    }
  }, [step]);

  const availableChains = CHAINS.filter((c) =>
    walletType === "solana" ? true : c.type === "evm" || c.type === "solana"
  ).sort((a, b) => a.gasUsd - b.gasUsd);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-full max-w-[520px] rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{
          background: "hsl(240 33% 6%)",
          border: "1px solid hsl(0 0% 100% / 0.08)",
          boxShadow: "0 24px 80px -12px hsl(0 0% 0% / 0.6), 0 0 80px -20px hsl(252 75% 63% / 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-2">
            {(step === "select-chain" || step === "error") && (
              <button onClick={goBack} className="text-muted-foreground hover:text-foreground transition-colors mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display font-semibold text-foreground text-lg">
              {step === "select-pack" && "Get More Diagnoses"}
              {step === "select-chain" && "Select Network"}
              {step === "confirming" && "Confirm in Wallet"}
              {step === "success" && "Payment Confirmed"}
              {step === "error" && "Transaction Failed"}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ═══════ STEP: SELECT PACK ═══════ */}
          {step === "select-pack" && (
            <>
              {/* Payment method toggle */}
              <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.06)" }}
              >
                <button
                  onClick={() => setPayMethod("stripe")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    payMethod === "stripe"
                      ? "bg-white/10 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button
                  onClick={() => setPayMethod("crypto")}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    payMethod === "crypto"
                      ? "bg-white/10 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Crypto
                  <span
                    className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "hsl(var(--profit) / 0.15)", color: "hsl(var(--profit))" }}
                  >
                    USDC
                  </span>
                </button>
              </div>

              {/* Trust badge — crypto only */}
              {payMethod === "crypto" && (
                <div
                  className="flex items-start gap-2.5 rounded-lg p-3"
                  style={{ background: "hsl(var(--profit) / 0.06)", border: "1px solid hsl(var(--profit) / 0.12)" }}
                >
                  <Shield className="w-4 h-4 text-profit mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-foreground font-medium">No Token Approval Required</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Standard USDC transfer only — MiaoFi never requests spending approval and cannot access your assets.
                    </p>
                  </div>
                </div>
              )}

              {/* Packs */}
              <div className="space-y-2.5">
                {PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => handleSelectPack(pack)}
                    className="w-full text-left group relative"
                  >
                    <div
                      className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
                      style={{
                        background: pack.recommended
                          ? "hsl(252 60% 63% / 0.08)"
                          : "hsl(0 0% 100% / 0.03)",
                        border: pack.recommended
                          ? "1px solid hsl(252 60% 63% / 0.25)"
                          : "1px solid hsl(0 0% 100% / 0.06)",
                        boxShadow: pack.recommended
                          ? "0 0 30px -10px hsl(252 75% 63% / 0.15)"
                          : "none",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center min-w-[48px]">
                          <span className="text-2xl font-bold text-foreground">{pack.credits}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">credits</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{pack.name}</span>
                            {pack.recommended && (
                              <span
                                className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full"
                                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                              >
                                Best Value
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {pack.perUnit} / diagnosis
                            {pack.savings && (
                              <span className="text-profit ml-1.5">· {pack.savings}</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">${pack.price}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Stripe CTA if card selected */}
              {payMethod === "stripe" && selectedPack && (
                <button
                  onClick={handleStripeCheckout}
                  className="w-full glass-button-primary text-primary-foreground text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay ${selectedPack.price} with Card
                </button>
              )}

              {/* Footer trust */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Check className="w-3 h-3 text-profit" /> Credits never expire
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Check className="w-3 h-3 text-profit" /> Instant activation
                </span>
              </div>
            </>
          )}

          {/* ═══════ STEP: SELECT CHAIN ═══════ */}
          {step === "select-chain" && selectedPack && (
            <>
              {/* Selected pack summary */}
              <div
                className="flex items-center justify-between rounded-xl p-3.5"
                style={{ background: "hsl(0 0% 100% / 0.04)", border: "1px solid hsl(0 0% 100% / 0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{selectedPack.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{selectedPack.credits} diagnoses</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-foreground">{selectedPack.price} USDC</span>
              </div>

              {/* Wallet type indicator */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Wallet detected: <span className="text-foreground font-mono">{walletType === "solana" ? "Phantom (Solana)" : "MetaMask (EVM)"}</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-profit" />
              </div>

              {/* Chain list */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Select Network</p>
                {availableChains.map((chain) => {
                  const isEthHighGas = chain.id === "ethereum" && chain.gasUsd >= 2;
                  return (
                    <button
                      key={chain.id}
                      onClick={() => handleSelectChain(chain)}
                      className="w-full text-left group"
                    >
                      <div
                        className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
                        style={{
                          background: "hsl(0 0% 100% / 0.03)",
                          border: isEthHighGas
                            ? "1px solid hsl(var(--warning) / 0.2)"
                            : "1px solid hsl(0 0% 100% / 0.06)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-8 text-center">{chain.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{chain.name}</span>
                              {chain.id === "solana" && (
                                <span
                                  className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full"
                                  style={{ background: "hsl(var(--profit) / 0.15)", color: "hsl(var(--profit))" }}
                                >
                                  Lowest Fee
                                </span>
                              )}
                            </div>
                            {isEthHighGas && (
                              <span className="text-[11px] text-warning flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                High gas — consider L2
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Est. gas</p>
                            <p className={`text-sm font-mono ${isEthHighGas ? "text-warning" : "text-foreground"}`}>
                              {chain.gasEstimate}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Trust reminder */}
              <div className="flex items-center gap-2 justify-center pt-1">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  Direct USDC transfer · No token approval · You control every step
                </span>
              </div>
            </>
          )}

          {/* ═══════ STEP: CONFIRMING ═══════ */}
          {step === "confirming" && selectedPack && selectedChain && (
            <div className="flex flex-col items-center text-center py-6 space-y-5">
              {/* Animated wallet icon */}
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "hsl(252 60% 63% / 0.1)",
                    border: "1px solid hsl(252 60% 63% / 0.2)",
                    boxShadow: "0 0 40px -10px hsl(252 75% 63% / 0.3)",
                  }}
                >
                  <Wallet className="w-9 h-9 text-primary animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
                  <Loader2 className="w-3.5 h-3.5 text-background animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-1">
                  Confirm in your wallet
                </h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  Your wallet should prompt you to sign a{" "}
                  <span className="text-foreground font-mono">{selectedPack.price} USDC</span>{" "}
                  transfer on {selectedChain.name}.
                </p>
              </div>

              {/* Transaction details */}
              <div
                className="w-full rounded-xl p-4 space-y-2.5 text-left"
                style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.06)" }}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-mono font-medium">{selectedPack.price} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground">{selectedChain.icon} {selectedChain.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. gas</span>
                  <span className="text-foreground font-mono">{selectedChain.gasEstimate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-foreground font-mono font-bold">
                    ~${(selectedPack.price + selectedChain.gasUsd).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full space-y-2">
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "hsl(0 0% 100% / 0.06)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: `${Math.min(confirmProgress, 100)}%`,
                      background: "linear-gradient(90deg, hsl(var(--brand-from)), hsl(var(--brand-to)))",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {confirmProgress < 30
                    ? "Waiting for wallet confirmation..."
                    : confirmProgress < 70
                    ? "Broadcasting transaction..."
                    : confirmProgress < 100
                    ? "Confirming on-chain..."
                    : "Confirmed!"}
                </p>
              </div>
            </div>
          )}

          {/* ═══════ STEP: SUCCESS ═══════ */}
          {step === "success" && selectedPack && (
            <div className="flex flex-col items-center text-center py-6 space-y-5">
              {/* Success icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: "hsl(var(--profit) / 0.12)",
                  border: "1px solid hsl(var(--profit) / 0.25)",
                  boxShadow: "0 0 50px -10px hsl(var(--profit) / 0.3)",
                }}
              >
                <Check className="w-10 h-10 text-profit" />
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground text-xl mb-1">
                  Payment Confirmed!
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">{selectedPack.credits} credits</span> have been added to your account
                </p>
              </div>

              {/* Tx receipt */}
              {selectedChain && (
                <div
                  className="w-full rounded-xl p-4 space-y-2 text-left"
                  style={{ background: "hsl(0 0% 100% / 0.03)", border: "1px solid hsl(0 0% 100% / 0.06)" }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tx Hash</span>
                    <span className="text-foreground font-mono text-xs flex items-center gap-1">
                      {txHash}
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <span className="text-foreground">{selectedChain.icon} {selectedChain.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-foreground font-mono">{selectedPack.price} USDC</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSuccess}
                className="w-full glass-button-primary text-primary-foreground text-sm font-semibold rounded-xl px-4 py-3 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Diagnosing
              </button>
            </div>
          )}

          {/* ═══════ STEP: ERROR ═══════ */}
          {step === "error" && (
            <div className="flex flex-col items-center text-center py-6 space-y-5">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: "hsl(var(--loss) / 0.12)",
                  border: "1px solid hsl(var(--loss) / 0.25)",
                }}
              >
                <X className="w-10 h-10 text-loss" />
              </div>

              <div>
                <h3 className="font-display font-semibold text-foreground text-lg mb-1">
                  Transaction Failed
                </h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  The transaction was rejected or failed. Your funds are safe — no USDC was transferred.
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={goBack}
                  className="flex-1 glass-button text-foreground text-sm font-medium rounded-xl px-4 py-2.5"
                >
                  Try Again
                </button>
                <button
                  onClick={() => { setPayMethod("stripe"); setStep("select-pack"); }}
                  className="flex-1 glass-button text-foreground text-sm font-medium rounded-xl px-4 py-2.5 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay with Card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
