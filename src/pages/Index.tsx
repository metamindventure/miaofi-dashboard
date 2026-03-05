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
import MatrixStreamBg from "@/components/dashboard/backgrounds/MatrixStreamBg";
import UpgradeModal from "@/components/dashboard/UpgradeModal";
import { useAuth } from "@/contexts/AuthContext";

import AuthStateSwitcher from "@/components/dashboard/AuthStateSwitcher";

const Index = () => {
  const { upgradeModalOpen, setUpgradeModalOpen } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      setTimeout(() => setShowDashboard(true), 50);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MatrixStreamBg />

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
            <main className="max-w-[1120px] mx-auto px-4 md:px-6 space-y-6 pb-20 pt-14">
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

      {/* Dev-only auth state switcher */}
      <AuthStateSwitcher />

      {/* Upgrade Modal */}
      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </div>
  );
};

export default Index;
