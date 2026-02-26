import { useState } from "react";
import { Share2 } from "lucide-react";
import ShareCardModal from "./ShareCardModal";

const ShareStrip = () => {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div
        className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3"
        style={{
          background: "hsla(252, 75%, 63%, 0.04)",
          borderTop: "1px solid hsl(var(--glass-divider))",
          borderBottom: "1px solid hsl(var(--glass-divider))",
        }}
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-primary" />
          <span className="text-sm text-secondary-foreground">
            Share your portfolio analysis
          </span>
        </div>
        <button
          onClick={() => setShareOpen(true)}
          className="glass-button text-sm text-primary font-medium rounded-lg px-4 py-2"
        >
          Generate Report Card →
        </button>
      </div>

      <ShareCardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        context="portfolio-pnl"
        data={{
          title: "Portfolio P&L · 30 Days",
          subtitle: "+6.9% across 2 wallets, 6 chains",
          highlight: "+$2,846",
          highlightColor: "profit",
          details: ["Total: $36,759", "2 Wallets", "6 Chains"],
        }}
      />
    </>
  );
};

export default ShareStrip;
