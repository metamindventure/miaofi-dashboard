/**
 * 方案 A：神经网络脉冲（Neural Pulse）
 * 5 层：星云光斑 + 脉冲光环 + 网格底纹 + 浮动微粒 + 光线扫描
 */
const CyberGridBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Layer 1: Deep nebula blobs — 3 large blurred blobs drifting slowly */}
    <div
      className="absolute animate-nebula-blob-1"
      style={{
        width: '65vw', height: '65vh', top: '-15%', left: '-10%',
        background: 'radial-gradient(circle, hsl(252 75% 50% / 0.3) 0%, hsl(252 75% 50% / 0.05) 50%, transparent 70%)',
        filter: 'blur(100px)', willChange: 'transform',
      }}
    />
    <div
      className="absolute animate-nebula-blob-2"
      style={{
        width: '55vw', height: '55vh', top: '5%', right: '-15%',
        background: 'radial-gradient(circle, hsl(174 60% 45% / 0.25) 0%, hsl(174 60% 45% / 0.05) 50%, transparent 70%)',
        filter: 'blur(120px)', willChange: 'transform',
      }}
    />
    <div
      className="absolute animate-nebula-blob-3"
      style={{
        width: '50vw', height: '50vh', bottom: '-5%', left: '25%',
        background: 'radial-gradient(circle, hsl(227 67% 45% / 0.25) 0%, hsl(160 100% 45% / 0.05) 50%, transparent 70%)',
        filter: 'blur(110px)', willChange: 'transform',
      }}
    />

    {/* Layer 2: Center pulse rings — expanding concentric circles */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-pulse-ring-1" style={{
        width: '300px', height: '300px', borderRadius: '50%',
        border: '1px solid hsl(252 75% 63% / 0.3)',
        boxShadow: '0 0 40px 10px hsl(252 75% 63% / 0.08), inset 0 0 40px 10px hsl(174 60% 55% / 0.05)',
        willChange: 'transform, opacity',
      }} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-pulse-ring-2" style={{
        width: '300px', height: '300px', borderRadius: '50%',
        border: '1px solid hsl(174 60% 55% / 0.25)',
        boxShadow: '0 0 30px 8px hsl(174 60% 55% / 0.06)',
        willChange: 'transform, opacity',
      }} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-pulse-ring-3" style={{
        width: '300px', height: '300px', borderRadius: '50%',
        border: '1px solid hsl(160 100% 45% / 0.2)',
        boxShadow: '0 0 25px 5px hsl(160 100% 45% / 0.05)',
        willChange: 'transform, opacity',
      }} />
    </div>

    {/* Layer 3: Subtle grid texture */}
    <div className="absolute inset-0" style={{
      backgroundImage: `
        repeating-linear-gradient(90deg, hsl(252 75% 63% / 0.04) 0px, transparent 1px, transparent 60px),
        repeating-linear-gradient(0deg, hsl(174 60% 55% / 0.03) 0px, transparent 1px, transparent 60px)
      `,
      backgroundSize: '60px 60px',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, white 0%, transparent 70%)',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, white 0%, transparent 70%)',
    }} />

    {/* Layer 4: Floating particles — small glowing dots */}
    <div className="absolute animate-particle-drift-1" style={{
      width: '3px', height: '3px', borderRadius: '50%', top: '20%', left: '15%',
      background: 'hsl(252 75% 70% / 0.8)', boxShadow: '0 0 12px 4px hsl(252 75% 63% / 0.4)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-2" style={{
      width: '2px', height: '2px', borderRadius: '50%', top: '35%', left: '70%',
      background: 'hsl(174 60% 65% / 0.7)', boxShadow: '0 0 10px 3px hsl(174 60% 55% / 0.3)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-3" style={{
      width: '2.5px', height: '2.5px', borderRadius: '50%', top: '60%', left: '40%',
      background: 'hsl(160 100% 55% / 0.6)', boxShadow: '0 0 10px 3px hsl(160 100% 45% / 0.3)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-4" style={{
      width: '2px', height: '2px', borderRadius: '50%', top: '15%', left: '55%',
      background: 'hsl(227 67% 70% / 0.7)', boxShadow: '0 0 8px 3px hsl(227 67% 60% / 0.3)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-1" style={{
      width: '1.5px', height: '1.5px', borderRadius: '50%', top: '75%', left: '25%',
      background: 'hsl(252 75% 75% / 0.5)', boxShadow: '0 0 8px 2px hsl(252 75% 63% / 0.2)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-3" style={{
      width: '2px', height: '2px', borderRadius: '50%', top: '45%', left: '85%',
      background: 'hsl(174 60% 60% / 0.6)', boxShadow: '0 0 8px 2px hsl(174 60% 55% / 0.2)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-2" style={{
      width: '3px', height: '3px', borderRadius: '50%', top: '80%', left: '60%',
      background: 'hsl(160 100% 50% / 0.5)', boxShadow: '0 0 12px 4px hsl(160 100% 45% / 0.2)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-particle-drift-4" style={{
      width: '1.5px', height: '1.5px', borderRadius: '50%', top: '50%', left: '10%',
      background: 'hsl(252 75% 80% / 0.6)', boxShadow: '0 0 6px 2px hsl(252 75% 63% / 0.2)',
      willChange: 'transform',
    }} />

    {/* Layer 5: Diagonal scan line */}
    <div className="absolute inset-0 animate-diagonal-scan" style={{
      background: 'linear-gradient(135deg, transparent 40%, hsl(174 60% 55% / 0.15) 49.5%, hsl(252 75% 63% / 0.25) 50%, hsl(160 100% 45% / 0.15) 50.5%, transparent 60%)',
      backgroundSize: '200% 200%',
      willChange: 'background-position',
    }} />

    {/* Center radial glow accent */}
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse 40% 35% at 50% 35%, hsl(252 75% 50% / 0.12) 0%, transparent 70%)',
    }} />
  </div>
);

export default CyberGridBg;
