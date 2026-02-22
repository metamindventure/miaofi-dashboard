

## 增强毛玻璃卡片效果 — 让卡片在暗色背景下"浮起来"

### 设计思路

当前的 glass-card 效果太微弱（背景仅 3% 白色不透明度，边框 10%），在深色背景下几乎不可见。需要大幅增强，让每张卡片有"浮在空中、想拿起来"的触感。

采用 **增强毛玻璃** 方案，原因：
- 深色背景 + 全息动画底层 → 毛玻璃的 `backdrop-filter: blur()` 会自然捕捉背后的彩色光效，让每张卡片呈现微妙的色彩变化
- 加上内发光、边缘高光、hover 时的微抬起效果，营造"想触摸/划走"的物理质感

### 具体效果

1. **提升背景不透明度**：从 3% → 6-8%，让卡片更"实"
2. **增强模糊**：blur 从 20px → 30px，更强的毛玻璃质感
3. **边框高光**：顶部/左侧边框稍亮（模拟光源从左上方照射），用渐变边框实现
4. **内发光**：用 `box-shadow: inset` 添加极微弱的白色内发光（模拟玻璃边缘折射）
5. **外发光**：添加微弱的紫色/青色外发光阴影，呼应背景色调
6. **Hover 效果**：hover 时微微上移（translateY -2px）+ 阴影增强 + 背景稍亮，模拟"拿起"的感觉
7. **过渡动画**：所有变化用 0.3s ease 过渡，流畅自然

### 修改文件

**`src/index.css`** — 更新 `.glass-card` 样式：

```css
.glass-card {
  background: hsl(0 0% 100% / 0.06);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid hsl(0 0% 100% / 0.12);
  border-top-color: hsl(0 0% 100% / 0.18);
  border-left-color: hsl(0 0% 100% / 0.15);
  border-radius: var(--radius);
  box-shadow:
    inset 0 1px 0 0 hsl(0 0% 100% / 0.08),
    inset 0 0 20px 0 hsl(0 0% 100% / 0.02),
    0 4px 24px -4px hsl(0 0% 0% / 0.3),
    0 0 40px -10px hsl(252 75% 63% / 0.08);
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: hsl(0 0% 100% / 0.09);
  border-top-color: hsl(0 0% 100% / 0.22);
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 0 hsl(0 0% 100% / 0.10),
    inset 0 0 20px 0 hsl(0 0% 100% / 0.03),
    0 8px 32px -4px hsl(0 0% 0% / 0.4),
    0 0 60px -10px hsl(252 75% 63% / 0.12);
}
```

同时更新 CSS 变量以匹配新的基础值：

```css
--glass-bg: 0 0% 100% / 0.06;
--glass-bg-hover: 0 0% 100% / 0.09;
--glass-border: 0 0% 100% / 0.12;
```

### 效果预期

- 卡片在全息背景上会呈现微妙的彩色折射效果（因为 backdrop-blur 会模糊背后的动画）
- 顶部/左侧边框更亮，模拟自然光照方向
- 内发光让卡片边缘有"玻璃厚度感"
- Hover 时微微浮起 + 阴影加深 = "想拿起来"的触感
- 紫色外发光与品牌色呼应，增加高级感
