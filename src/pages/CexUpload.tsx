import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/dashboard/NavBar";
import MatrixStreamBg from "@/components/dashboard/backgrounds/MatrixStreamBg";
import {
  Upload,
  FileSpreadsheet,
  Check,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  Loader2,
  X,
  HelpCircle,
} from "lucide-react";

/* ── Exchange list ── */
const exchanges = [
  { id: "binance", name: "Binance", available: true, logo: "🟡" },
  { id: "okx", name: "OKX", available: false, logo: "⚫" },
  { id: "bybit", name: "Bybit", available: false, logo: "🟠" },
  { id: "coinbase", name: "Coinbase", available: false, logo: "🔵" },
  { id: "kraken", name: "Kraken", available: false, logo: "🟣" },
];

/* ── Binance export steps ── */
const exportSteps = [
  "Log in to your Binance account on the web",
  'Go to "Orders" → "Spot Order" → "Trade History"',
  'Click "Export Trade History"',
  "Select time range (recommend last 90 days or more)",
  'Choose format: Excel (.xlsx) or CSV, then click "Generate"',
];

/* ── Mock parsed data ── */
const mockParsed = {
  tradeCount: 347,
  dateRange: "2025-06-12 → 2026-03-01",
  topPairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "DOGE/USDT", "XRP/USDT"],
  buyRatio: 58,
  sellRatio: 42,
  warnings: ["12 rows have missing price data — excluded from analysis"],
};

type Stage = "upload" | "preview" | "analyzing";

const CexUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("upload");
  const [selectedExchange, setSelectedExchange] = useState("binance");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") return;
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStage("preview");
    }, 1500);
  };

  const handleAnalyze = () => {
    setStage("analyzing");
    const start = Date.now();
    const duration = 4000;
    const tick = () => {
      const elapsed = Date.now() - start;
      setAnalyzeProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed < duration) requestAnimationFrame(tick);
      else setTimeout(() => navigate("/cex-results"), 400);
    };
    requestAnimationFrame(tick);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MatrixStreamBg />
      <div className="relative z-10">
        <NavBar />

        <main className="max-w-[720px] mx-auto px-4 pt-24 pb-20">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {(["Upload", "Preview", "Analyze"] as const).map((label, i) => {
              const stageIdx = stage === "upload" ? 0 : stage === "preview" ? 1 : 2;
              const isActive = i === stageIdx;
              const isDone = i < stageIdx;
              return (
                <div key={label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className="w-8 h-px"
                      style={{
                        background: isDone
                          ? "hsl(var(--primary))"
                          : "hsl(var(--glass-border))",
                      }}
                    />
                  )}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary/15 text-primary border border-primary/30"
                        : isDone
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : null}
                    {label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ════════ Stage 1: Upload ════════ */}
          {stage === "upload" && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
                  Upload Trade History
                </h1>
                <p className="text-sm text-muted-foreground">
                  Select your exchange and upload your trade export file
                </p>
              </div>

              {/* Exchange selector */}
              <div className="glass-card p-5">
                <h3 className="label-uppercase mb-3">Select Exchange</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {exchanges.map((ex) => (
                    <button
                      key={ex.id}
                      disabled={!ex.available}
                      onClick={() => setSelectedExchange(ex.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        !ex.available
                          ? "opacity-30 cursor-not-allowed"
                          : selectedExchange === ex.id
                          ? "bg-primary/15 border border-primary/30 text-foreground"
                          : "bg-secondary/30 border border-transparent text-secondary-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <span className="text-lg">{ex.logo}</span>
                      {ex.name}
                      {!ex.available && (
                        <span className="text-[10px] text-muted-foreground ml-auto">Soon</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* File upload area */}
              <div className="glass-card p-5">
                <h3 className="label-uppercase mb-3">Upload File</h3>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 px-6 cursor-pointer transition-all ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : file
                      ? "border-profit/30 bg-profit/5"
                      : "border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                  {file ? (
                    <>
                      <FileSpreadsheet className="w-10 h-10 text-profit" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground" />
                      <p className="text-sm text-secondary-foreground">
                        Drag & drop or <span className="text-primary font-medium">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground">.xlsx or .csv from Binance</p>
                    </>
                  )}
                </div>
              </div>

              {/* How to export guide */}
              <div className="glass-card overflow-hidden">
                <button
                  onClick={() => setGuideOpen(!guideOpen)}
                  className="w-full flex items-center gap-2 p-4 text-left hover:bg-secondary/20 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground">
                    How to export from Binance
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground ml-auto transition-transform ${
                      guideOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {guideOpen && (
                  <div className="px-4 pb-4 space-y-2">
                    {exportSteps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                          {i + 1}
                        </span>
                        <p className="text-sm text-secondary-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full glass-button-primary text-primary-foreground font-semibold rounded-xl py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  <>
                    Upload & Parse
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* ════════ Stage 2: Preview ════════ */}
          {stage === "preview" && (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
                  Parse Preview
                </h1>
                <p className="text-sm text-muted-foreground">
                  Review your data before we run the AI analysis
                </p>
              </div>

              {/* Summary stats */}
              <div className="glass-card p-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="label-uppercase block mb-1">Trades</span>
                    <span className="font-display font-bold text-2xl text-foreground">
                      {mockParsed.tradeCount}
                    </span>
                  </div>
                  <div>
                    <span className="label-uppercase block mb-1">Date Range</span>
                    <span className="text-sm font-mono text-foreground">
                      {mockParsed.dateRange}
                    </span>
                  </div>
                  <div>
                    <span className="label-uppercase block mb-1">Buy / Sell</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-profit">{mockParsed.buyRatio}%</span>
                      <span className="text-muted-foreground text-xs">/</span>
                      <span className="text-sm font-mono text-loss">{mockParsed.sellRatio}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="label-uppercase block mb-1">Exchange</span>
                    <span className="text-sm text-foreground font-medium">Binance</span>
                  </div>
                </div>
              </div>

              {/* Top pairs */}
              <div className="glass-card p-5">
                <h3 className="label-uppercase mb-3">Top Trading Pairs</h3>
                <div className="flex flex-wrap gap-2">
                  {mockParsed.topPairs.map((pair, i) => (
                    <span
                      key={pair}
                      className="glass-chip flex items-center gap-1.5"
                    >
                      <span className="text-xs font-mono text-foreground">{pair}</span>
                      {i === 0 && (
                        <span className="text-[10px] text-primary font-semibold">Most traded</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {mockParsed.warnings.length > 0 && (
                <div
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{
                    background: "hsla(30, 100%, 64%, 0.08)",
                    border: "1px solid hsla(30, 100%, 64%, 0.2)",
                  }}
                >
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {mockParsed.warnings.map((w, i) => (
                      <p key={i} className="text-sm text-warning">{w}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy/Sell ratio bar */}
              <div className="glass-card p-5">
                <h3 className="label-uppercase mb-3">Buy / Sell Distribution</h3>
                <div className="w-full h-3 rounded-full overflow-hidden flex">
                  <div
                    className="h-full rounded-l-full"
                    style={{
                      width: `${mockParsed.buyRatio}%`,
                      background: "hsl(var(--profit))",
                    }}
                  />
                  <div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${mockParsed.sellRatio}%`,
                      background: "hsl(var(--loss))",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-profit font-medium">Buy {mockParsed.buyRatio}%</span>
                  <span className="text-xs text-loss font-medium">Sell {mockParsed.sellRatio}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setStage("upload");
                    setFile(null);
                  }}
                  className="glass-button text-secondary-foreground font-medium rounded-xl px-6 py-3"
                >
                  Re-upload
                </button>
                <button
                  onClick={handleAnalyze}
                  className="flex-1 glass-button-primary text-primary-foreground font-semibold rounded-xl py-3 flex items-center justify-center gap-2"
                >
                  Start Analysis
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ════════ Stage 3: Analyzing ════════ */}
          {stage === "analyzing" && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsla(252, 75%, 63%, 0.06) 0%, transparent 70%)",
                }}
              />

              <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center animate-pulse-logo">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>

              <div className="text-center space-y-2">
                <h2 className="font-display font-bold text-xl text-foreground">
                  Analyzing your trades…
                </h2>
                <p className="text-sm text-muted-foreground">
                  AI is scanning {mockParsed.tradeCount} trades for behavioral patterns
                </p>
              </div>

              <div className="w-[320px] h-[2px] rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-none"
                  style={{
                    width: `${analyzeProgress}%`,
                    background: "hsl(var(--primary))",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2 min-w-[280px]">
                {[
                  { label: "Parsing trade records…", done: analyzeProgress > 20 },
                  { label: "Identifying patterns…", done: analyzeProgress > 50 },
                  { label: "Generating diagnosis…", done: analyzeProgress > 80 },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ opacity: analyzeProgress > i * 25 ? 1 : 0.3 }}>
                    {step.done ? (
                      <Check className="w-4 h-4 text-profit" />
                    ) : analyzeProgress > i * 25 ? (
                      <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={step.done ? "text-profit" : "text-foreground"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CexUpload;

// Re-export Sparkles locally used
import { Sparkles as SparklesIcon } from "lucide-react";
