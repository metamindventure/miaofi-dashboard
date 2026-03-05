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
  Info,
  Coins,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/* ─── Types ─── */
type PayMethod = "stripe" | "crypto";
type PayToken = "USDC" | "USDT";
type Step = "select-pack" | "select-token" | "select-chain" | "confirming" | "success" | "error";

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

/* Token+Chain support matrix (mock of GET /api/payment/crypto/supported-chains) */
const TOKEN_CHAIN_SUPPORT: Record<PayToken, string[]> = {
  USDC: ["solana", "base", "arbitrum", "ethereum"],
  USDT: ["ethereum", "arbitrum", "base"], // USDT not on Solana in this mock
};

/* ─── Component ─── */
interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

const UpgradeModal = ({ open, onClose }: UpgradeModalProps) => {
  const { setCredits, setTotalCredits, setAuthState } = useAuth();

  const [payMethod, setPayMethod] = useState<PayMethod>("crypto");
  const [payToken, setPayToken] = useState<PayToken>("USDC");
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [step, setStep] = useState<Step>("select-pack");
  const [walletConnected] = useState(true);
  const [walletType] = useState<"solana" | "evm">("evm");
  const [confirmProgress, setConfirmProgress] = useState(0);
  const [txHash] = useState("0x7a3b...9f4e");

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep("select-pack");
      setSelectedPack(null);
      setSelectedChain(null);
      setPayToken("USDC");
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
      setStep("select-token");
    }
  }, [payMethod]);

  const handleSelectToken = useCallback((token: PayToken) => {
    setPayToken(token);
    setStep("select-chain");
  }, []);

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
    if (step === "select-token") {
      setStep("select-pack");
    } else if (step === "select-chain") {
      setStep("select-token");
      setSelectedChain(null);
    } else if (step === "error") {
      setStep("select-chain");
    }
  }, [step]);

  const supportedChainIds = TOKEN_CHAIN_SUPPORT[payToken];
  const availableChains = CHAINS
    .filter((c) => supportedChainIds.includes(c.id))
    .filter((c) => walletType === "solana" ? true : c.type === "evm" || c.type === "solana")
    .sort((a, b) => a.gasUsd - b.gasUsd);

  const stepTitle: Record<Step, string> = {
    "select-pack": "Get More Diagnoses",
    "select-token": "Select Token",
    "select-chain": "Select Network",
    confirming: "Confirm in Wallet",
    success: "Payment Confirmed",
    error: "Transaction Failed",
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

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
            {(step === "select-token" || step === "select-chain" || step === "error") && (
              <button onClick={goBack} className="text-muted-foreground hover:text-foreground transition-colors mr-1">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display font-semibold text-foreground text-lg">
              {stepTitle[step]}
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
                    USDC / USDT
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
                      MiaoFi uses standard transfers only — we never request Token Approval. Your wallet shows the exact amount and recipient before you confirm. We cannot access or spend your tokens.
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

          {/* ═══════ STEP: SELECT TOKEN ═══════ */}
          {step === "select-token" && selectedPack && (
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
                <span className="text-sm font-bold text-foreground">${selectedPack.price}</span>
              </div>

              {/* Token options */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pay with</p>

                {(["USDC", "USDT"] as PayToken[]).map((token) => {
                  const chainCount = TOKEN_CHAIN_SUPPORT[token].length;
                  return (
                    <button
                      key={token}
                      onClick={() => handleSelectToken(token)}
                      className="w-full text-left group"
                    >
                      <div
                        className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:translate-y-[-1px]"
                        style={{
                          background: "hsl(0 0% 100% / 0.03)",
                          border: "1px solid hsl(0 0% 100% / 0.06)",
                        }}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                              background: token === "USDC"
                                ? "hsl(217 91% 50% / 0.15)"
                                : "hsl(152 69% 41% / 0.15)",
                              color: token === "USDC"
                                ? "hsl(217 91% 65%)"
                                : "hsl(152 69% 55%)",
                              border: `1px solid ${token === "USDC" ? "hsl(217 91% 50% / 0.25)" : "hsl(152 69% 41% / 0.25)"}`,
                            }}
                          >
                            <Coins className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-foreground">{token}</span>
                            <p className="text-[11px] text-muted-foreground">
                              {token === "USDC" ? "USD Coin" : "Tether USD"} · {chainCount} network{chainCount > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-medium text-foreground">
                            {selectedPack.price} {token}
                          </span>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Trust messaging */}
              <div
                className="flex items-start gap-2.5 rounded-lg p-3"
                style={{ background: "hsl(var(--profit) / 0.04)", border: "1px solid hsl(var(--profit) / 0.08)" }}
              >
                <Shield className="w-3.5 h-3.5 text-profit mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Standard transfer only — no Token Approval. Your wallet shows the exact amount before you confirm.
                </p>
              </div>
            </>
          )}

          {/* ═══════ STEP: SELECT CHAIN ═══════ */}
          {step === "select-chain" && selectedPack && (
            <>
              {/* Selected pack + token summary */}
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
                <span className="text-sm font-bold text-foreground">{selectedPack.price} {payToken}</span>
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

              {/* Risk warning — supported tokens only */}
              <div
                className="rounded-lg p-3 space-y-1.5"
                style={{ background: "hsl(var(--warning) / 0.05)", border: "1px solid hsl(var(--warning) / 0.12)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-warning shrink-0" />
                  <p className="text-[11px] text-foreground font-medium">Before you pay</p>
                </div>
                <ul className="text-[11px] text-muted-foreground leading-relaxed space-y-0.5 pl-5 list-disc">
                  <li>Only <span className="text-foreground font-mono">USDC</span> and <span className="text-foreground font-mono">USDT</span> are accepted</li>
                  <li>Complete payment through MiaoFi's payment page</li>
                  <li>Sending other tokens to this address <span className="text-warning">cannot be recovered</span></li>
                </ul>
              </div>

              {/* Trust reminder */}
              <div className="flex items-center gap-2 justify-center pt-1">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  Direct {payToken} transfer · No token approval · You control every step
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
                  <span className="text-foreground font-mono">{selectedPack.price} {payToken}</span>{" "}
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
                  <span className="text-foreground font-mono font-medium">{selectedPack.price} {payToken}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Token</span>
                  <span className="text-foreground">{payToken}</span>
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
                    <span className="text-foreground font-mono">{selectedPack.price} {payToken}</span>
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
                  The transaction was rejected or failed. Your funds are safe — no {payToken} was transferred.
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
