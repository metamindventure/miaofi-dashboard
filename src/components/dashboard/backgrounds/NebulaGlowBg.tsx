const NebulaGlowBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Blob 1 - Purple */}
    <div
      className="absolute animate-nebula-blob-1"
      style={{
        width: '60vw',
        height: '60vh',
        top: '-10%',
        left: '-10%',
        background: 'radial-gradient(circle, hsl(252 75% 50% / 0.25) 0%, transparent 70%)',
        filter: 'blur(120px)',
        willChange: 'transform',
      }}
    />

    {/* Blob 2 - Cyan */}
    <div
      className="absolute animate-nebula-blob-2"
      style={{
        width: '50vw',
        height: '50vh',
        top: '10%',
        right: '-15%',
        background: 'radial-gradient(circle, hsl(174 60% 45% / 0.2) 0%, transparent 70%)',
        filter: 'blur(150px)',
        willChange: 'transform',
      }}
    />

    {/* Blob 3 - Deep blue */}
    <div
      className="absolute animate-nebula-blob-3"
      style={{
        width: '55vw',
        height: '45vh',
        bottom: '0%',
        left: '20%',
        background: 'radial-gradient(circle, hsl(227 67% 40% / 0.2) 0%, transparent 70%)',
        filter: 'blur(130px)',
        willChange: 'transform',
      }}
    />

    {/* AI Scan line */}
    <div
      className="absolute left-0 right-0 animate-scan-line"
      style={{
        height: '1px',
        background:
          'linear-gradient(90deg, transparent 10%, hsl(174 60% 55% / 0.5) 30%, hsl(252 75% 63% / 0.7) 50%, hsl(174 60% 55% / 0.5) 70%, transparent 90%)',
        boxShadow:
          '0 0 20px 6px hsl(252 75% 63% / 0.2), 0 0 60px 15px hsl(174 60% 55% / 0.1)',
        willChange: 'transform',
      }}
    />

    {/* Subtle grain overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  </div>
);

export default NebulaGlowBg;
