/**
 * 方案 C：全息 AI 界面（Holographic AI Interface）
 * 5 层：动态渐变底层 + 旋转弧线环 + 脉冲同心圆 + 数据节点 + HUD 元素
 */
const MatrixStreamBg = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Layer 1: Rotating conic gradient base — slow color flow */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-15%' }}>
      <div className="animate-holo-base-rotate" style={{
        width: '140vw', height: '140vh',
        background: 'conic-gradient(from 0deg, hsl(252 75% 30% / 0.15), hsl(174 60% 35% / 0.1), hsl(227 67% 35% / 0.12), hsl(160 100% 35% / 0.08), hsl(30 100% 50% / 0.05), hsl(252 75% 30% / 0.15))',
        filter: 'blur(80px)',
        willChange: 'transform',
      }} />
    </div>

    {/* Layer 2: Rotating arc rings — 3 arcs at different speeds */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      {/* Arc 1 — purple, clockwise */}
      <div className="absolute animate-arc-spin-1" style={{
        width: '350px', height: '350px', borderRadius: '50%',
        border: '1.5px solid transparent',
        borderTopColor: 'hsl(252 75% 63% / 0.4)',
        borderRightColor: 'hsl(252 75% 63% / 0.15)',
        boxShadow: '0 0 20px 5px hsl(252 75% 63% / 0.08)',
        willChange: 'transform',
      }} />
      {/* Arc 2 — cyan, counter-clockwise */}
      <div className="absolute animate-arc-spin-2" style={{
        width: '260px', height: '260px', borderRadius: '50%',
        border: '1px solid transparent',
        borderBottomColor: 'hsl(174 60% 55% / 0.35)',
        borderLeftColor: 'hsl(174 60% 55% / 0.12)',
        boxShadow: '0 0 15px 4px hsl(174 60% 55% / 0.06)',
        willChange: 'transform',
      }} />
      {/* Arc 3 — green, clockwise slow */}
      <div className="absolute animate-arc-spin-3" style={{
        width: '450px', height: '450px', borderRadius: '50%',
        border: '1px solid transparent',
        borderTopColor: 'hsl(160 100% 45% / 0.25)',
        borderLeftColor: 'hsl(160 100% 45% / 0.08)',
        boxShadow: '0 0 25px 6px hsl(160 100% 45% / 0.05)',
        willChange: 'transform',
      }} />
    </div>

    {/* Layer 3: Pulse concentric circles — radar scan effect */}
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-radar-ping-1" style={{
        width: '150px', height: '150px', borderRadius: '50%',
        border: '1px solid hsl(252 75% 63% / 0.3)',
        willChange: 'transform, opacity',
      }} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-radar-ping-2" style={{
        width: '150px', height: '150px', borderRadius: '50%',
        border: '1px solid hsl(174 60% 55% / 0.25)',
        willChange: 'transform, opacity',
      }} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-10%' }}>
      <div className="animate-radar-ping-3" style={{
        width: '150px', height: '150px', borderRadius: '50%',
        border: '1px solid hsl(160 100% 45% / 0.2)',
        willChange: 'transform, opacity',
      }} />
    </div>

    {/* Layer 4: Data node dots — small glowing points */}
    <div className="absolute animate-node-float-1" style={{
      width: '4px', height: '4px', borderRadius: '50%', top: '30%', left: '35%',
      background: 'hsl(252 75% 70% / 0.8)',
      boxShadow: '0 0 15px 5px hsl(252 75% 63% / 0.3)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-node-float-2" style={{
      width: '3px', height: '3px', borderRadius: '50%', top: '25%', left: '65%',
      background: 'hsl(174 60% 65% / 0.7)',
      boxShadow: '0 0 12px 4px hsl(174 60% 55% / 0.25)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-node-float-3" style={{
      width: '3.5px', height: '3.5px', borderRadius: '50%', top: '55%', left: '45%',
      background: 'hsl(160 100% 55% / 0.6)',
      boxShadow: '0 0 12px 4px hsl(160 100% 45% / 0.2)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-node-float-1" style={{
      width: '3px', height: '3px', borderRadius: '50%', top: '50%', left: '25%',
      background: 'hsl(30 100% 60% / 0.5)',
      boxShadow: '0 0 10px 3px hsl(30 100% 50% / 0.15)',
      willChange: 'transform',
    }} />
    <div className="absolute animate-node-float-2" style={{
      width: '2.5px', height: '2.5px', borderRadius: '50%', top: '40%', left: '80%',
      background: 'hsl(227 67% 70% / 0.6)',
      boxShadow: '0 0 10px 3px hsl(227 67% 60% / 0.2)',
      willChange: 'transform',
    }} />

    {/* Layer 5: HUD corner elements — decorative sci-fi UI */}
    {/* Top-left corner bracket */}
    <div className="absolute top-[8%] left-[5%] opacity-[0.12]" style={{ willChange: 'opacity' }}>
      <div style={{ width: '40px', height: '40px', borderLeft: '1px solid hsl(174 60% 55%)', borderTop: '1px solid hsl(174 60% 55%)' }} />
      <div className="animate-hud-blink" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'hsl(174 60% 55%)', marginTop: '8px', marginLeft: '2px' }} />
    </div>
    {/* Top-right corner bracket */}
    <div className="absolute top-[8%] right-[5%] opacity-[0.1]">
      <div style={{ width: '40px', height: '40px', borderRight: '1px solid hsl(252 75% 63%)', borderTop: '1px solid hsl(252 75% 63%)' }} />
    </div>
    {/* Bottom-left scale marks */}
    <div className="absolute bottom-[12%] left-[5%] opacity-[0.08] flex gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ width: '1px', height: `${12 + i * 4}px`, background: 'hsl(160 100% 45%)' }} />
      ))}
    </div>
    {/* Bottom-right mini arc */}
    <div className="absolute bottom-[12%] right-[5%] opacity-[0.1]">
      <div className="animate-hud-blink" style={{
        width: '30px', height: '30px', borderRadius: '50%',
        border: '1px solid transparent', borderTopColor: 'hsl(30 100% 55%)', borderRightColor: 'hsl(30 100% 55% / 0.3)',
      }} />
    </div>

    {/* Ambient glow */}
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse 50% 40% at 50% 35%, hsl(252 75% 45% / 0.08) 0%, transparent 70%)',
    }} />
  </div>
);

export default MatrixStreamBg;
