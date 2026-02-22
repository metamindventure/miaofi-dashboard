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
      {/* Dot Grid + Radial Fade Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(252 60% 63% / 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 40%, black 20%, transparent 70%)',
          }}
        />
        {/* Purple radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 30%, hsl(252 75% 63% / 0.08) 0%, transparent 70%)',
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
