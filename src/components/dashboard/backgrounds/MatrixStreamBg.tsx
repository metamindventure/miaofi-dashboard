const MatrixStreamBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Data stream columns - green/profit color */}
    <div
      className="absolute inset-0 animate-matrix-stream-1"
      style={{
        backgroundImage: `
          linear-gradient(180deg, hsl(160 100% 45% / 0.12) 0%, transparent 60%),
          repeating-linear-gradient(90deg,
            transparent 0px, transparent 39px,
            hsl(160 100% 45% / 0.08) 39px, hsl(160 100% 45% / 0.08) 40px,
            transparent 40px, transparent 119px,
            hsl(160 100% 45% / 0.05) 119px, hsl(160 100% 45% / 0.05) 120px
          )
        `,
        backgroundSize: '120px 200%, 120px 100%',
        maskImage: 'linear-gradient(to bottom, white 0%, transparent 70%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 70%)',
        willChange: 'background-position',
      }}
    />

    {/* Data stream columns - purple accent */}
    <div
      className="absolute inset-0 animate-matrix-stream-2"
      style={{
        backgroundImage: `
          linear-gradient(180deg, hsl(252 75% 63% / 0.1) 0%, transparent 50%),
          repeating-linear-gradient(90deg,
            transparent 0px, transparent 59px,
            hsl(252 75% 63% / 0.06) 59px, hsl(252 75% 63% / 0.06) 60px,
            transparent 60px, transparent 179px,
            hsl(252 75% 63% / 0.04) 179px, hsl(252 75% 63% / 0.04) 180px
          )
        `,
        backgroundSize: '180px 200%, 180px 100%',
        maskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)',
        WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)',
        willChange: 'background-position',
      }}
    />

    {/* Bottom fog / ground glow */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[40%]"
      style={{
        background:
          'linear-gradient(to top, hsl(252 75% 20% / 0.15) 0%, hsl(252 75% 30% / 0.05) 40%, transparent 100%)',
      }}
    />

    {/* Center radial glow */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 50% 40% at 50% 20%, hsl(160 100% 45% / 0.06) 0%, transparent 70%)',
      }}
    />
  </div>
);

export default MatrixStreamBg;
