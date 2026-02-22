import { ChevronDown, Sparkles } from "lucide-react";

const NavBar = () => {
  return (
    <nav
      className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 md:px-8"
      style={{
        background: "rgba(10, 10, 15, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid hsl(0 0% 100% / 0.06)",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center">
          <span className="text-primary-foreground font-display font-bold text-sm">M</span>
        </div>
        <span className="font-display font-semibold text-foreground text-[15px]">MiaoFi</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
            English <ChevronDown className="w-3 h-3" />
          </button>
          <span>metamind.v...</span>
          <button className="hover:text-foreground transition-colors">Sign Out</button>
        </div>
        <button className="brand-gradient text-primary-foreground text-xs font-semibold rounded-full px-5 py-2 flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade to Pro
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
