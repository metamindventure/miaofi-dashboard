import { useState, useEffect } from "react";
import NavBar from "@/components/dashboard/NavBar";
import LoadingState from "@/components/dashboard/LoadingState";
import PLHero from "@/components/dashboard/PLHero";
import AIDiagnosis from "@/components/dashboard/AIDiagnosis";
import ShareStrip from "@/components/dashboard/ShareStrip";
import PortfolioBento from "@/components/dashboard/PortfolioBento";
import WalletSummary from "@/components/dashboard/WalletSummary";
import Holdings from "@/components/dashboard/Holdings";
import DashboardFooter from "@/components/dashboard/DashboardFooter";
import CyberGridBg from "@/components/dashboard/backgrounds/CyberGridBg";
import NebulaGlowBg from "@/components/dashboard/backgrounds/NebulaGlowBg";
import MatrixStreamBg from "@/components/dashboard/backgrounds/MatrixStreamBg";

type BgTheme = "cyber" | "nebula" | "matrix";

const bgLabels: Record<BgTheme, string> = {
  cyber: "A · 赛博网格",
  nebula: "B · 星云扫描",
  matrix: "C · 数据流",
};

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [bgTheme, setBgTheme] = useState<BgTheme>("cyber");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => setShowDashboard(true), 50);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Dynamic backgrounds */}
      {bgTheme === "cyber" && <CyberGridBg />}
      {bgTheme === "nebula" && <NebulaGlowBg />}
      {bgTheme === "matrix" && <MatrixStreamBg />}

      {/* Background switcher (preview only) */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        {(Object.keys(bgLabels) as BgTheme[]).map((key) => (
          <button
            key={key}
            onClick={() => setBgTheme(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              bgTheme === key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "glass-chip hover:bg-[hsl(var(--glass-bg-hover))]"
            }`}
          >
            {bgLabels[key]}
          </button>
        ))}
      </div>

      <div className="relative z-10">
      <NavBar />

      {/* Loading → Dashboard crossfade */}
      <div className="relative">
        {/* Loading state */}
        <div
          className="transition-opacity duration-500"
          style={{
            opacity: loaded ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            position: loaded ? "absolute" : "relative",
            inset: 0,
          }}
        >
          <LoadingState />
        </div>

        {/* Dashboard */}
        {loaded && (
          <div
            className="transition-opacity duration-500"
            style={{ opacity: showDashboard ? 1 : 0 }}
          >
            <main className="max-w-[1120px] mx-auto px-4 md:px-6 space-y-6 pb-8">
              <PLHero animate={showDashboard} />
              <AIDiagnosis />
              <ShareStrip />
              <PortfolioBento />
              <WalletSummary />
              <Holdings />
              <DashboardFooter />
            </main>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Index;
