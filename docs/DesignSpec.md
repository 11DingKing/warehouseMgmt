# 设计规范 (Design Specification)
**项目名称**: 仓库管理系统  
**设计风格**: 未来科技感 | 深色模式  
**参考模板**: Bootstrap 5.3 高级管理后台  
**协议版本**: Alkaid-SOP 3.0  
**创建日期**: 2026-01-30  
**状态**: 已确认

---

## 🎨 1. 色彩系统 (Color Palette)

### 主色调 (Primary Colors)
```css
--color-primary: #0066FF;           /* 主蓝色 - 主按钮、链接 */
--color-primary-light: #3385FF;     /* 浅蓝色 - Hover 状态 */
--color-primary-dark: #0052CC;      /* 深蓝色 - Active 状态 */
--color-primary-alpha-10: rgba(0, 102, 255, 0.1);   /* 10% 透明度 */
--color-primary-alpha-20: rgba(0, 102, 255, 0.2);   /* 20% 透明度 */
```

### 背景色 (Background Colors)
```css
--color-bg-primary: #0A0E27;        /* 主背景色 - 页面底色 */
--color-bg-secondary: #141932;      /* 次背景色 - 卡片/面板 */
--color-bg-tertiary: #1E2439;       /* 三级背景色 - Hover 效果 */
--color-bg-elevated: #252B45;       /* 悬浮背景 - 模态框/下拉菜单 */
```

### 强调色 (Accent Colors)
```css
--color-accent-cyan: #00D9FF;       /* 青色 - 科技感元素 */
--color-accent-purple: #8B5CF6;     /* 紫色 - 高级功能标识 */
--color-accent-pink: #EC4899;       /* 粉色 - 特殊标记 */
--color-gradient-primary: linear-gradient(135deg, #0066FF 0%, #00D9FF 100%);
--color-gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

### 状态色 (Status Colors)
```css
--color-success: #10B981;           /* 成功 - 绿色 */
--color-success-light: #34D399;
--color-success-dark: #059669;

--color-warning: #F59E0B;           /* 警告 - 橙色 */
--color-warning-light: #FBBF24;
--color-warning-dark: #D97706;

--color-error: #EF4444;             /* 错误 - 红色 */
--color-error-light: #F87171;
--color-error-dark: #DC2626;

--color-info: #3B82F6;              /* 信息 - 蓝色 */
--color-info-light: #60A5FA;
--color-info-dark: #2563EB;
```

### 文本色 (Text Colors)
```css
--color-text-primary: #FFFFFF;      /* 主要文本 - 标题 */
--color-text-secondary: #A0AEC0;    /* 次要文本 - 描述 */
--color-text-tertiary: #718096;     /* 三级文本 - 辅助信息 */
--color-text-disabled: #4A5568;     /* 禁用文本 */
--color-text-link: #3385FF;         /* 链接文本 */
```

### 边框与分割线 (Border & Divider)
```css
--color-border: rgba(255, 255, 255, 0.1);     /* 默认边框 */
--color-border-hover: rgba(255, 255, 255, 0.2); /* Hover 边框 */
--color-divider: rgba(255, 255, 255, 0.05);   /* 分割线 */
```

---

## 🔤 2. 字体系统 (Typography)

### 字体族 (Font Family)
```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                    'Roboto', 'Helvetica Neue', Arial, sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-family-display: 'Inter', sans-serif;
```

### 字体大小 (Font Size)
```css
--font-size-xs: 12px;      /* 辅助文本 */
--font-size-sm: 14px;      /* 正文小字 */
--font-size-base: 16px;    /* 正文默认 */
--font-size-lg: 18px;      /* 小标题 */
--font-size-xl: 20px;      /* 二级标题 */
--font-size-2xl: 24px;     /* 一级标题 */
--font-size-3xl: 30px;     /* 大标题 */
--font-size-4xl: 36px;     /* 超大标题 */
```

### 字体粗细 (Font Weight)
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 行高 (Line Height)
```css
--line-height-tight: 1.25;    /* 标题行高 */
--line-height-normal: 1.5;    /* 正文行高 */
--line-height-relaxed: 1.75;  /* 宽松行高 */
```

### 字体应用规范
```css
/* 页面大标题 */
.title-page {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

/* 卡片标题 */
.title-card {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

/* 表单标签 */
.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* 正文内容 */
.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
}
```

---

## 📏 3. 间距系统 (Spacing)

### 间距单位 (Spacing Scale)
```css
--spacing-0: 0;
--spacing-1: 4px;      /* 0.25rem */
--spacing-2: 8px;      /* 0.5rem */
--spacing-3: 12px;     /* 0.75rem */
--spacing-4: 16px;     /* 1rem */
--spacing-5: 20px;     /* 1.25rem */
--spacing-6: 24px;     /* 1.5rem */
--spacing-8: 32px;     /* 2rem */
--spacing-10: 40px;    /* 2.5rem */
--spacing-12: 48px;    /* 3rem */
--spacing-16: 64px;    /* 4rem */
--spacing-20: 80px;    /* 5rem */
```

### 应用规范
- **组件内边距**: 使用 `--spacing-4` (16px) 作为基准
- **卡片间距**: 使用 `--spacing-6` (24px)
- **页面边距**: 使用 `--spacing-8` (32px)
- **表单元素间距**: 使用 `--spacing-5` (20px)

---

## 🔲 4. 圆角与阴影 (Border Radius & Shadow)

### 圆角 (Border Radius)
```css
--radius-none: 0;
--radius-sm: 4px;       /* 小圆角 - 按钮/标签 */
--radius-md: 8px;       /* 中圆角 - 卡片/输入框 */
--radius-lg: 12px;      /* 大圆角 - 面板 */
--radius-xl: 16px;      /* 超大圆角 - 模态框 */
--radius-full: 9999px;  /* 完全圆形 - 头像/徽章 */
```

### 阴影 (Box Shadow)
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
             0 2px 4px -1px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4),
             0 4px 6px -2px rgba(0, 0, 0, 0.3);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4),
             0 10px 10px -5px rgba(0, 0, 0, 0.3);
--shadow-glow: 0 0 20px rgba(0, 102, 255, 0.3);  /* 发光效果 */
--shadow-glow-cyan: 0 0 20px rgba(0, 217, 255, 0.4);
```

---

## ⚡ 5. 动画与过渡 (Animation & Transition)

### 过渡时长 (Transition Duration)
```css
--duration-instant: 0s;
--duration-fast: 0.15s;
--duration-normal: 0.3s;
--duration-slow: 0.5s;
--duration-slower: 0.75s;
```

### 缓动函数 (Easing Function)
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 标准过渡
```css
--transition-fast: all var(--duration-fast) var(--ease-out);
--transition-normal: all var(--duration-normal) var(--ease-in-out);
--transition-slow: all var(--duration-slow) var(--ease-in-out);
```

### 动画效果示例

#### Fade In (淡入)
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

#### Slide In (滑入)
```css
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-right {
  animation: slideInRight var(--duration-normal) var(--ease-out);
}
```

#### Pulse Glow (脉冲发光)
```css
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.6);
  }
}

.pulse-glow {
  animation: pulseGlow 2s var(--ease-in-out) infinite;
}
```

#### Spin (旋转 - 加载动画)
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 1s linear infinite;
}
```

---

## 🎯 6. 组件样式规范

### 6.1 按钮 (Button)

#### 主按钮 (Primary Button)
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-glow);
  transform: translateY(-1px);
}

.btn-primary:active {
  background: var(--color-primary-dark);
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--color-bg-tertiary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}
```

#### 次要按钮 (Secondary Button)
```css
.btn-secondary {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-secondary:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-hover);
}
```

#### 危险按钮 (Danger Button)
```css
.btn-danger {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  background: var(--color-error);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-danger:hover {
  background: var(--color-error-light);
}
```

#### 按钮尺寸变体
```css
.btn-sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
}
```

---

### 6.2 表单元素 (Form Elements)

#### 输入框 (Input)
```css
.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha-10);
}

.form-input::placeholder {
  color: var(--color-text-tertiary);
}

.form-input:disabled {
  background: var(--color-bg-tertiary);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.form-input.error {
  border-color: var(--color-error);
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### 标签 (Label)
```css
.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.form-label.required::after {
  content: '*';
  margin-left: var(--spacing-1);
  color: var(--color-error);
}
```

#### 错误提示 (Error Message)
```css
.form-error {
  display: block;
  margin-top: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-error);
}
```

#### 表单组 (Form Group)
```css
.form-group {
  margin-bottom: var(--spacing-5);
}
```

---

### 6.3 卡片 (Card)

```css
.card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-5) var(--spacing-6);
  border-bottom: 1px solid var(--color-divider);
}

.card-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card-body {
  padding: var(--spacing-6);
}

.card-footer {
  padding: var(--spacing-4) var(--spacing-6);
  background: var(--color-bg-tertiary);
  border-top: 1px solid var(--color-divider);
}
```

---

### 6.4 表格 (Table)

```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table thead {
  background: var(--color-bg-tertiary);
}

.table th {
  padding: var(--spacing-4) var(--spacing-5);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border-top: 1px solid var(--color-divider);
}

.table tbody tr {
  transition: var(--transition-fast);
}

.table tbody tr:hover {
  background: var(--color-bg-tertiary);
}
```

---

### 6.5 模态框 (Modal)

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn var(--duration-fast) var(--ease-out);
}

.modal {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideInRight var(--duration-normal) var(--ease-out);
}

.modal-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.modal-close {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: var(--font-size-xl);
  padding: var(--spacing-2);
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.modal-close:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-6);
}

.modal-footer {
  padding: var(--spacing-5) var(--spacing-6);
  border-top: 1px solid var(--color-divider);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
}
```

---

### 6.6 提示框 (Toast)

```css
.toast-container {
  position: fixed;
  top: var(--spacing-6);
  right: var(--spacing-6);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 300px;
  animation: slideInRight var(--duration-normal) var(--ease-out);
}

.toast.success {
  border-left: 4px solid var(--color-success);
}

.toast.error {
  border-left: 4px solid var(--color-error);
}

.toast.warning {
  border-left: 4px solid var(--color-warning);
}

.toast.info {
  border-left: 4px solid var(--color-info);
}

.toast-icon {
  font-size: var(--font-size-xl);
}

.toast-content {
  flex: 1;
}

.toast-title {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.toast-message {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
```

---

### 6.7 加载动画 (Loading)

```css
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 14, 39, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-bg-tertiary);
  border-top-color: var(--color-primary);
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

.loading-text {
  margin-top: var(--spacing-4);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}
```

---

## 🧭 7. 布局系统 (Layout)

### 7.1 主框架布局

```css
.layout {
  display: flex;
  height: 100vh;
  background: var(--color-bg-primary);
}

.sidebar {
  width: 260px;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: var(--transition-normal);
}

.sidebar.collapsed {
  width: 70px;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 64px;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-6);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-8);
}
```

### 7.2 侧边栏菜单

```css
.sidebar-logo {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-divider);
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.sidebar-logo-icon {
  width: 32px;
  height: 32px;
  background: var(--color-gradient-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.sidebar-logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.sidebar-menu {
  flex: 1;
  padding: var(--spacing-4) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-6);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
  cursor: pointer;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.menu-item.active {
  background: var(--color-primary-alpha-10);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}

.menu-item-icon {
  font-size: var(--font-size-xl);
  width: 24px;
  text-align: center;
}

.menu-item-text {
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.menu-item-arrow {
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
}

.menu-item.expanded .menu-item-arrow {
  transform: rotate(90deg);
}

.menu-submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-in-out);
}

.menu-submenu.expanded {
  max-height: 500px;
}

.menu-submenu-item {
  display: block;
  padding: var(--spacing-3) var(--spacing-6) var(--spacing-3) var(--spacing-16);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
}

.menu-submenu-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.menu-submenu-item.active {
  color: var(--color-primary);
  background: var(--color-primary-alpha-10);
}
```

---

## 🌟 8. 特殊效果 (Special Effects)

### 8.1 科技感背景（登录页）

```css
.tech-background {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--color-bg-primary);
  overflow: hidden;
}

/* 静态方块网格 */
.tech-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
}

/* 动态光效 */
.tech-background::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(
    circle at center,
    rgba(0, 102, 255, 0.1) 0%,
    transparent 70%
  );
  animation: floatingLight 8s ease-in-out infinite;
}

@keyframes floatingLight {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}
```

### 8.2 发光边框效果

```css
.glow-border {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.glow-border::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  background: var(--color-gradient-primary);
  border-radius: var(--radius-lg);
  opacity: 0;
  transition: var(--transition-normal);
  z-index: -1;
}

.glow-border:hover::before {
  opacity: 0.3;
}
```

### 8.3 渐变文本

```css
.text-gradient {
  background: var(--color-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 📱 9. 响应式断点 (Breakpoints)

```css
--breakpoint-sm: 640px;   /* 移动端 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 小屏电脑 */
--breakpoint-xl: 1280px;  /* 标准电脑 */
--breakpoint-2xl: 1536px; /* 大屏电脑 */
```

### 响应式规则
```css
/* 最小支持 1280x720 */
@media (max-width: 1280px) {
  .sidebar {
    width: 200px;
  }
  
  .main-content {
    padding: var(--spacing-6);
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    z-index: 999;
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
}
```

---

## ✅ 10. 设计检查清单

### 视觉一致性
- [ ] 所有页面使用统一的色彩变量
- [ ] 字体大小严格按照规范
- [ ] 间距使用统一的 spacing scale
- [ ] 圆角和阴影保持一致

### 交互体验
- [ ] 所有可点击元素有 Hover 状态
- [ ] 按钮有 Active 和 Disabled 状态
- [ ] 表单输入有 Focus 状态
- [ ] 加载状态有明确反馈

### 动画效果
- [ ] 过渡动画时长统一（0.3s 为主）
- [ ] 页面切换有淡入动画
- [ ] 菜单展开有平滑过渡
- [ ] 无生硬的状态跳变

### 可访问性
- [ ] 色彩对比度符合 WCAG AA 标准
- [ ] 表单元素有明确的 Label
- [ ] 错误提示清晰可见
- [ ] 禁用状态有视觉区分

---

## 📦 11. CSS 变量完整导出

将以下变量复制到 `static/css/base.css`：

```css
:root {
  /* ===== 色彩系统 ===== */
  /* 主色调 */
  --color-primary: #0066FF;
  --color-primary-light: #3385FF;
  --color-primary-dark: #0052CC;
  --color-primary-alpha-10: rgba(0, 102, 255, 0.1);
  --color-primary-alpha-20: rgba(0, 102, 255, 0.2);
  
  /* 背景色 */
  --color-bg-primary: #0A0E27;
  --color-bg-secondary: #141932;
  --color-bg-tertiary: #1E2439;
  --color-bg-elevated: #252B45;
  
  /* 强调色 */
  --color-accent-cyan: #00D9FF;
  --color-accent-purple: #8B5CF6;
  --color-accent-pink: #EC4899;
  --color-gradient-primary: linear-gradient(135deg, #0066FF 0%, #00D9FF 100%);
  --color-gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
  
  /* 状态色 */
  --color-success: #10B981;
  --color-success-light: #34D399;
  --color-success-dark: #059669;
  --color-warning: #F59E0B;
  --color-warning-light: #FBBF24;
  --color-warning-dark: #D97706;
  --color-error: #EF4444;
  --color-error-light: #F87171;
  --color-error-dark: #DC2626;
  --color-info: #3B82F6;
  --color-info-light: #60A5FA;
  --color-info-dark: #2563EB;
  
  /* 文本色 */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A0AEC0;
  --color-text-tertiary: #718096;
  --color-text-disabled: #4A5568;
  --color-text-link: #3385FF;
  
  /* 边框与分割线 */
  --color-border: rgba(255, 255, 255, 0.1);
  --color-border-hover: rgba(255, 255, 255, 0.2);
  --color-divider: rgba(255, 255, 255, 0.05);
  
  /* ===== 字体系统 ===== */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                      'Roboto', 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* ===== 间距系统 ===== */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  
  /* ===== 圆角与阴影 ===== */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
               0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4),
               0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4),
               0 10px 10px -5px rgba(0, 0, 0, 0.3);
  --shadow-glow: 0 0 20px rgba(0, 102, 255, 0.3);
  --shadow-glow-cyan: 0 0 20px rgba(0, 217, 255, 0.4);
  
  /* ===== 动画与过渡 ===== */
  --duration-instant: 0s;
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-slower: 0.75s;
  
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  --transition-fast: all var(--duration-fast) var(--ease-out);
  --transition-normal: all var(--duration-normal) var(--ease-in-out);
  --transition-slow: all var(--duration-slow) var(--ease-in-out);
  
  /* ===== 响应式断点 ===== */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* ===== 全局重置 ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-secondary);
  background: var(--color-bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== 滚动条样式 ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-border-hover);
}
```

---

## 🎓 设计原则总结

1. **一致性优先**: 所有组件必须使用统一的 CSS 变量
2. **性能为先**: 优先使用 CSS 过渡，避免 JavaScript 动画
3. **移动优先**: 从小屏幕开始设计，逐步增强
4. **可访问性**: 确保色彩对比度和键盘导航
5. **可维护性**: 组件模块化，样式可复用

---

**✅ 设计规范已完成，可进入开发阶段。**
