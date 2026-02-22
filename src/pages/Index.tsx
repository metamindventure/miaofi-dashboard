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

const Index = () => {
  const [loaded, setLoaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      // Small delay for crossfade
      setTimeout(() => setShowDashboard(true), 50);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.10]"
          style={{
            background: 'radial-gradient(circle, hsl(252 75% 63%) 0%, transparent 70%)',
            top: '-10%',
            left: '-5%',
            filter: 'blur(120px)',
            animation: 'mesh-blob-1 25s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, hsl(174 60% 55%) 0%, transparent 70%)',
            top: '30%',
            right: '-8%',
            filter: 'blur(140px)',
            animation: 'mesh-blob-2 30s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[550px] h-[550px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, hsl(227 67% 50%) 0%, transparent 70%)',
            bottom: '-15%',
            left: '30%',
            filter: 'blur(130px)',
            animation: 'mesh-blob-3 28s ease-in-out infinite',
          }}
        />
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
