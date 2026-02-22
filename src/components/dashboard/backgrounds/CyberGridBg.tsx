const CyberGridBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Upper purple nebula glow */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 20%, hsl(252 75% 30% / 0.4) 0%, transparent 70%)',
      }}
    />

    {/* Horizon glow line */}
    <div
      className="absolute left-0 right-0"
      style={{
        top: '55%',
        height: '2px',
        background:
          'linear-gradient(90deg, transparent 5%, hsl(174 60% 55% / 0.6) 30%, hsl(252 75% 63% / 0.8) 50%, hsl(174 60% 55% / 0.6) 70%, transparent 95%)',
        boxShadow:
          '0 0 30px 10px hsl(252 75% 63% / 0.3), 0 0 80px 20px hsl(174 60% 55% / 0.15)',
      }}
    />

    {/* 3D perspective grid */}
    <div
      className="absolute left-[-20%] right-[-20%] animate-cyber-grid-scroll"
      style={{
        top: '55%',
        bottom: '-20%',
        perspective: '400px',
        perspectiveOrigin: '50% 0%',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: 'rotateX(65deg)',
          transformOrigin: 'top center',
          backgroundImage: `
            repeating-linear-gradient(90deg, hsl(252 75% 63% / 0.25) 0px, transparent 1px, transparent 80px),
            repeating-linear-gradient(0deg, hsl(174 60% 55% / 0.15) 0px, transparent 1px, transparent 80px)
          `,
          backgroundSize: '80px 80px',
          maskImage:
            'linear-gradient(to bottom, white 0%, transparent 85%), linear-gradient(to right, transparent 0%, white 15%, white 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, white 0%, transparent 85%), linear-gradient(to right, transparent 0%, white 15%, white 85%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />
    </div>

    {/* Bottom fade to black */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[30%]"
      style={{
        background: 'linear-gradient(to top, hsl(240 33% 4%) 0%, transparent 100%)',
      }}
    />
  </div>
);

export default CyberGridBg;
