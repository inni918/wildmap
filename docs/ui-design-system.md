# Wildmap UI Design System

台灣戶外活動地圖平台 — 三套設計方案完整定義

---

## 方案 A：自然戶外感 🌿

### 風格描述
大地色系，溫暖有質感。以森林綠與大地棕為基調，搭配米色暖底，彷彿置身山林之中。靈感來自 AllTrails。

### 色彩系統

| 用途 | 色碼 | 說明 |
|------|------|------|
| Primary | `#2D6A4F` | 森林綠 |
| Primary Light | `#52B788` | 淺綠 |
| Primary Dark | `#1B4332` | 深林綠 |
| Secondary | `#8B6914` | 大地棕 |
| Secondary Light | `#D4A843` | 淺金棕 |
| Accent | `#D4A843` | 暖金色強調 |
| Background | `#FEFAF3` | 米色暖底 |
| Surface | `#FFFFFF` | 白色卡片 |
| Surface Alt | `#F5EFE4` | 淺米色 |
| Text | `#1A1A1A` | 主文字 |
| Text Secondary | `#5C5C5C` | 次要文字 |
| Text on Primary | `#FFFFFF` | 主色上文字 |
| Border | `#D9CDB8` | 邊框 |
| Success | `#2D6A4F` | 成功 |
| Warning | `#D4A843` | 警告 |
| Error | `#C1292E` | 錯誤 |

### 字型

| 用途 | 字型 |
|------|------|
| 標題 | Noto Sans TC (Weight: 600-800) |
| 內文 | Noto Sans TC (Weight: 400-500) |
| 等寬 | Fira Code |

### 圓角

| 層級 | 值 |
|------|-----|
| sm | 6px |
| md | 10px |
| lg | 16px |
| xl | 24px |
| full | 9999px |

### 間距系統

基礎單位：4px

| Token | 值 |
|-------|-----|
| space-xs | 4px |
| space-sm | 8px |
| space-md | 16px |
| space-lg | 24px |
| space-xl | 32px |
| space-2xl | 48px |

### 按鈕

- **主要按鈕**：`bg: #2D6A4F`, `text: #FFF`, `radius: 10px`, `font-weight: 600`
- **次要按鈕**：`bg: transparent`, `border: 2px solid #2D6A4F`, `text: #2D6A4F`
- **危險按鈕**：`bg: #C1292E`, `text: #FFF`
- **尺寸**：大 `14px 28px` / 中 `10px 20px` / 小 `6px 14px`

### 卡片

- `bg: #FFFFFF`
- `border: 1px solid #D9CDB8`
- `border-radius: 16px`
- `shadow: 0 2px 8px rgba(0,0,0,0.06)`

### 導航列

- 淺色模式
- Logo 顏色：`#2D6A4F`
- 底部 Tab Bar：圓角外觀，活躍項使用 Primary 色

### 圖示風格

- 偏好使用 emoji 或填充式（filled）圖示
- 搭配大地暖色調
- 建議圖示庫：Lucide Icons（filled style）

---

## 方案 B：現代簡潔風 ✨

### 風格描述
乾淨白底，資訊清晰。以純白底搭配鮮明的藍綠色強調色，大量留白與清晰的層次感。靈感來自 Klook / Airbnb。

### 色彩系統

| 用途 | 色碼 | 說明 |
|------|------|------|
| Primary | `#0891B2` | 藍綠色 |
| Primary Light | `#22D3EE` | 淺藍綠 |
| Primary Dark | `#0E7490` | 深藍綠 |
| Secondary | `#F97316` | 活力橘 |
| Secondary Light | `#FB923C` | 淺橘 |
| Accent | `#F97316` | 橘色強調 |
| Background | `#FAFAFA` | 極淺灰 |
| Surface | `#FFFFFF` | 白色 |
| Surface Alt | `#F3F4F6` | 淺灰 |
| Text | `#111827` | 深色文字 |
| Text Secondary | `#6B7280` | 灰色文字 |
| Text on Primary | `#FFFFFF` | 主色上文字 |
| Border | `#E5E7EB` | 邊框 |
| Success | `#059669` | 成功 |
| Warning | `#D97706` | 警告 |
| Error | `#DC2626` | 錯誤 |

### 字型

| 用途 | 字型 |
|------|------|
| 標題 | Inter + Noto Sans TC (Weight: 600-800) |
| 內文 | Inter + Noto Sans TC (Weight: 400-500) |
| 等寬 | JetBrains Mono |

### 圓角

| 層級 | 值 |
|------|-----|
| sm | 4px |
| md | 8px |
| lg | 12px |
| xl | 16px |
| full | 9999px |

### 間距系統

基礎單位：4px（同方案 A）

### 按鈕

- **主要按鈕**：`bg: #0891B2`, `text: #FFF`, `radius: 8px`, `font-weight: 600`
- **次要按鈕**：`bg: transparent`, `border: 2px solid #0891B2`, `text: #0891B2`
- **危險按鈕**：`bg: #DC2626`, `text: #FFF`
- **尺寸**：大 `14px 28px` / 中 `10px 20px` / 小 `6px 14px`

### 卡片

- `bg: #FFFFFF`
- `border: 1px solid #E5E7EB`
- `border-radius: 12px`
- `shadow: 0 1px 3px rgba(0,0,0,0.06)`

### 導航列

- 淺色模式、極簡設計
- Logo 顏色：`#0891B2`
- 底部 Tab Bar：簡潔線條風格

### 圖示風格

- 線條式（outline）圖示
- 2px stroke
- 建議圖示庫：Lucide Icons（outline style）

---

## 方案 C：探險冒險風 🔥

### 風格描述
深色主題，充滿活力。大膽的暗色調搭配電光橘紅色，營造出強烈的運動冒險感。靈感來自 Strava。

### 色彩系統

| 用途 | 色碼 | 說明 |
|------|------|------|
| Primary | `#FC4C02` | 電光橘紅（Strava 橘） |
| Primary Light | `#FF7043` | 淺橘紅 |
| Primary Dark | `#D84315` | 深橘紅 |
| Secondary | `#00E676` | 螢光綠 |
| Secondary Light | `#69F0AE` | 淺螢光綠 |
| Accent | `#00E676` | 綠色強調 |
| Background | `#0F172A` | 深藍灰（Slate 900） |
| Surface | `#1E293B` | 深色卡片（Slate 800） |
| Surface Alt | `#334155` | 稍淺深色（Slate 700） |
| Text | `#F1F5F9` | 淺色文字 |
| Text Secondary | `#94A3B8` | 灰色文字 |
| Text on Primary | `#FFFFFF` | 主色上文字 |
| Border | `#475569` | 深色邊框 |
| Success | `#00E676` | 成功 |
| Warning | `#FFB300` | 警告 |
| Error | `#FF5252` | 錯誤 |

### 字型

| 用途 | 字型 |
|------|------|
| 標題 | Inter + Noto Sans TC (Weight: 600-800) |
| 內文 | Inter + Noto Sans TC (Weight: 400-500) |
| 等寬 | Fira Code |

### 圓角

| 層級 | 值 |
|------|-----|
| sm | 4px |
| md | 6px |
| lg | 8px |
| xl | 12px |
| full | 9999px |

### 間距系統

基礎單位：4px（同方案 A）

### 按鈕

- **主要按鈕**：`bg: #FC4C02`, `text: #FFF`, `radius: 6px`, `font-weight: 600`
- **次要按鈕**：`bg: transparent`, `border: 2px solid #FC4C02`, `text: #FC4C02`
- **危險按鈕**：`bg: #FF5252`, `text: #FFF`
- **尺寸**：大 `14px 28px` / 中 `10px 20px` / 小 `6px 14px`

### 卡片

- `bg: #1E293B`
- `border: 1px solid #475569`
- `border-radius: 8px`
- `shadow: 0 4px 12px rgba(0,0,0,0.3)`

### 導航列

- 深色模式
- Logo 顏色：`#FC4C02`
- 底部 Tab Bar：暗色背景、活躍項使用 Primary 色

### 圖示風格

- 粗線條或雙色（duotone）圖示
- 搭配螢光色點綴
- 建議圖示庫：Phosphor Icons（duotone style）

---

## TailwindCSS 配置建議

```typescript
// 方案決定後，在 globals.css 加入對應的 CSS 變數
// 以方案 A 為例：

:root {
  --color-primary: #2D6A4F;
  --color-primary-light: #52B788;
  --color-primary-dark: #1B4332;
  --color-secondary: #8B6914;
  --color-accent: #D4A843;
  --color-background: #FEFAF3;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F5EFE4;
  --color-text: #1A1A1A;
  --color-text-secondary: #5C5C5C;
  --color-border: #D9CDB8;
  --color-success: #2D6A4F;
  --color-warning: #D4A843;
  --color-error: #C1292E;
}
```

## 比較摘要

| 特性 | 方案 A 自然戶外 | 方案 B 現代簡潔 | 方案 C 探險冒險 |
|------|----------------|----------------|----------------|
| 色調 | 暖色（綠棕米） | 中性（白藍綠） | 冷暗（深藍橘紅） |
| 氛圍 | 溫馨、自然 | 專業、友善 | 活力、大膽 |
| 圓角 | 較大（10-24px） | 中等（8-16px） | 較小（6-12px） |
| 適合 | 露營、登山為主 | 全面型平台 | 運動型、年輕族群 |
| 靈感來源 | AllTrails | Klook / Airbnb | Strava |
| 字型 | Noto Sans TC | Inter + Noto Sans TC | Inter + Noto Sans TC |
| 圖示 | 填充式 | 線條式 | 雙色式 |

---

## 展示頁面

線上預覽：https://wildmap-dusky.vercel.app/design-preview

頁面功能：
- 切換方案 A / B / C
- 色彩板展示
- 字型與排版
- 圓角風格
- 按鈕樣式（大/中/小 × 主要/次要/危險/圓角）
- 導航列（頂部 + 底部 Tab Bar）
- 地標卡片列表
- 地標詳情頁模擬
- 表單元件
