const DashboardFooter = () => {
  return (
    <footer className="py-8 flex flex-col items-center gap-2 text-xs text-muted-foreground text-center">
      <p>
        MiaoFi provides AI-powered analysis for informational purposes only. Not financial
        advice.
      </p>
      <p>P&L calculations are estimates based on available on-chain data.</p>
      <div className="flex items-center gap-3 mt-2">
        <span>© 2026 MiaoFi</span>
        <span>·</span>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        <span>·</span>
        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        <span>·</span>
        <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
      </div>
    </footer>
  );
};

export default DashboardFooter;
