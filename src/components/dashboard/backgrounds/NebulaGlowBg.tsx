/**
 * 方案 B：量子数据涌流（Quantum Data Flow）
 * 5 层：多方向数据流 + 中心能量核心 + 辐射光线 + 漂浮碎片 + 色彩脉冲
 */
const NebulaGlowBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Layer 1: Multi-directional data streams converging to center */}
    {/* Top-left to center */}
    <div className="absolute inset-0 animate-stream-converge-1" style={{
      background: 'linear-gradient(135deg, hsl(252 75% 55% / 0.2) 0%, transparent 50%)',
      maskImage: 'linear-gradient(135deg, white 0%, transparent 60%)',
      WebkitMaskImage: 'linear-gradient(135deg, white 0%, transparent 60%)',
      willChange: 'opacity',
    }} />
    {/* Top-right to center */}
    <div className="absolute inset-0 animate-stream-converge-2" style={{
      background: 'linear-gradient(225deg, hsl(174 60% 50% / 0.18) 0%, transparent 50%)',
      maskImage: 'linear-gradient(225deg, white 0%, transparent 60%)',
      WebkitMaskImage: 'linear-gradient(225deg, white 0%, transparent 60%)',
      willChange: 'opacity',
    }} />
    {/* Bottom-left to center */}
    <div className="absolute inset-0 animate-stream-converge-3" style={{
      background: 'linear-gradient(45deg, hsl(227 67% 50% / 0.15) 0%, transparent 50%)',
      maskImage: 'linear-gradient(45deg, white 0%, transparent 60%)',
      WebkitMaskImage: 'linear-gradient(45deg, white 0%, transparent 60%)',
      willChange: 'opacity',
    }} />
    {/* Bottom-right to center */}
    <div className="absolute inset-0 animate-stream-converge-4" style={{
      background: 'linear-gradient(315deg, hsl(160 100% 40% / 0.12) 0%, transparent 50%)',
      maskImage: 'linear-gradient(315deg, white 0%, transparent 60%)',
      WebkitMaskImage: 'linear-gradient(315deg, white 0%, transparent 60%)',
      willChange: 'opacity',
    }} />

    {/* Layer 2: Center energy core — rotating conic gradient */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-core-rotate" style={{
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'conic-gradient(from 0deg, hsl(252 75% 50% / 0.2), hsl(174 60% 50% / 0.15), hsl(227 67% 50% / 0.2), hsl(160 100% 45% / 0.15), hsl(252 75% 50% / 0.2))',
        filter: 'blur(60px)',
        willChange: 'transform',
      }} />
    </div>

    {/* Layer 3: Radial rays from center — slowly rotating */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-rays-rotate" style={{
        width: '120vw', height: '120vh',
        background: 'conic-gradient(from 0deg, transparent 0deg, hsl(252 75% 63% / 0.04) 10deg, transparent 20deg, transparent 40deg, hsl(174 60% 55% / 0.03) 50deg, transparent 60deg, transparent 80deg, hsl(160 100% 45% / 0.03) 90deg, transparent 100deg, transparent 120deg, hsl(227 67% 60% / 0.04) 130deg, transparent 140deg, transparent 160deg, hsl(252 75% 63% / 0.03) 170deg, transparent 180deg, transparent 200deg, hsl(174 60% 55% / 0.04) 210deg, transparent 220deg, transparent 240deg, hsl(160 100% 45% / 0.03) 250deg, transparent 260deg, transparent 280deg, hsl(227 67% 60% / 0.03) 290deg, transparent 300deg, transparent 320deg, hsl(252 75% 63% / 0.04) 330deg, transparent 340deg, transparent 360deg)',
        willChange: 'transform',
      }} />
    </div>

    {/* Layer 4: Floating data fragments — small shapes drifting */}
    <div className="absolute animate-fragment-1" style={{
      width: '8px', height: '8px', top: '25%', left: '20%',
      background: 'hsl(252 75% 63% / 0.3)', transform: 'rotate(45deg)',
      boxShadow: '0 0 15px 5px hsl(252 75% 63% / 0.15)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-fragment-2" style={{
      width: '6px', height: '6px', top: '40%', left: '75%', borderRadius: '50%',
      background: 'hsl(174 60% 55% / 0.35)',
      boxShadow: '0 0 12px 4px hsl(174 60% 55% / 0.15)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-fragment-3" style={{
      width: '10px', height: '3px', top: '65%', left: '30%',
      background: 'hsl(160 100% 45% / 0.25)',
      boxShadow: '0 0 10px 3px hsl(160 100% 45% / 0.1)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-fragment-4" style={{
      width: '5px', height: '5px', top: '20%', left: '60%',
      background: 'hsl(227 67% 65% / 0.3)', transform: 'rotate(45deg)',
      boxShadow: '0 0 10px 3px hsl(227 67% 60% / 0.15)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-fragment-1" style={{
      width: '4px', height: '12px', top: '55%', left: '80%',
      background: 'hsl(252 75% 70% / 0.2)',
      boxShadow: '0 0 8px 2px hsl(252 75% 63% / 0.1)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-fragment-3" style={{
      width: '7px', height: '7px', top: '70%', left: '55%', borderRadius: '50%',
      background: 'hsl(174 60% 60% / 0.25)',
      boxShadow: '0 0 10px 3px hsl(174 60% 55% / 0.1)',
      willChange: 'transform',
    }} />

    {/* Layer 5: Color pulse — hue-rotate on entire bg overlay */}
    <div className="absolute inset-0 animate-hue-shift" style={{
      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, hsl(252 60% 40% / 0.1) 0%, hsl(200 50% 30% / 0.05) 40%, transparent 70%)',
      mixBlendMode: 'screen',
      willChange: 'filter',
    }} />

    {/* Extra: ambient bottom glow */}
    <div className="absolute bottom-0 left-0 right-0 h-[35%]" style={{
      background: 'linear-gradient(to top, hsl(252 75% 20% / 0.2) 0%, transparent 100%)',
    }} />
  </div>
);

export default NebulaGlowBg;
