

## 给 "High Risk" 摘要横幅添加毛玻璃立体效果

### 当前状态

截图中的 "High Risk" 横幅目前使用简单的半透明背景 + 左边框，没有毛玻璃效果，看起来比较平。

### 修改内容

**文件：`src/components/dashboard/AIDiagnosis.tsx`（第 219-225 行）**

将横幅的样式从内联 style 改为使用 `glass-card` 类，同时保留左侧红色边框作为风险标识：

- 添加 `glass-card` class 获得毛玻璃背景、模糊、内发光、hover 浮起等全部效果
- 保留 `borderLeft: 3px solid hsl(var(--loss))` 红色左边框
- 添加极微弱的红色内发光（`box-shadow: inset`），呼应"高风险"语义

这样横幅就会和页面上其他卡片保持一致的立体毛玻璃质感，同时通过红色边框保持风险提示的辨识度。

