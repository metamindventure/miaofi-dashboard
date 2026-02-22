import { Share2 } from "lucide-react";
import { toast } from "sonner";

const ShareStrip = () => {
  return (
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
        onClick={() => toast("Report card generated! (demo)")}
        className="glass-button text-sm text-primary font-medium rounded-lg px-4 py-2"
      >
        Generate Report Card →
      </button>
    </div>
  );
};

export default ShareStrip;
