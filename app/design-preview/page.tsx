"use client";

import { useState } from "react";

/* ============================================================
   Wildmap Design System Preview — 三套方案展示頁
   ============================================================ */

// ---------- 設計方案定義 ----------

interface DesignTheme {
  id: string;
  name: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    accent: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    text: string;
    textSecondary: string;
    textOnPrimary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  navStyle: "light" | "dark" | "transparent";
}

const themes: Record<string, DesignTheme> = {
  nature: {
    id: "nature",
    name: "方案 A：自然戶外感",
    tagline: "大地色系，溫暖有質感",
    description:
      "以森林綠與大地棕為基調，搭配米色暖底。圓潤的元件設計帶來溫馨、自然的使用體驗，彷彿置身山林之中。靈感來自 AllTrails 的戶外探索氛圍。",
    colors: {
      primary: "#2D6A4F",
      primaryLight: "#52B788",
      primaryDark: "#1B4332",
      secondary: "#8B6914",
      secondaryLight: "#D4A843",
      accent: "#D4A843",
      background: "#FEFAF3",
      surface: "#FFFFFF",
      surfaceAlt: "#F5EFE4",
      text: "#1A1A1A",
      textSecondary: "#5C5C5C",
      textOnPrimary: "#FFFFFF",
      border: "#D9CDB8",
      success: "#2D6A4F",
      warning: "#D4A843",
      error: "#C1292E",
    },
    fonts: {
      heading: "'Noto Sans TC', sans-serif",
      body: "'Noto Sans TC', sans-serif",
      mono: "'Fira Code', monospace",
    },
    radius: { sm: "6px", md: "10px", lg: "16px", xl: "24px", full: "9999px" },
    navStyle: "light",
  },
  modern: {
    id: "modern",
    name: "方案 B：現代簡潔風",
    tagline: "乾淨白底，資訊清晰",
    description:
      "以純白底搭配鮮明的藍綠色強調色，用大量留白與清晰的層次感營造專業而友善的介面。靈感來自 Klook 和 Airbnb 的設計理念，讓資訊一目了然。",
    colors: {
      primary: "#0891B2",
      primaryLight: "#22D3EE",
      primaryDark: "#0E7490",
      secondary: "#F97316",
      secondaryLight: "#FB923C",
      accent: "#F97316",
      background: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceAlt: "#F3F4F6",
      text: "#111827",
      textSecondary: "#6B7280",
      textOnPrimary: "#FFFFFF",
      border: "#E5E7EB",
      success: "#059669",
      warning: "#D97706",
      error: "#DC2626",
    },
    fonts: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    radius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
    navStyle: "light",
  },
  adventure: {
    id: "adventure",
    name: "方案 C：探險冒險風",
    tagline: "深色主題，充滿活力",
    description:
      "大膽的暗色調搭配電光橘紅色，營造出強烈的運動冒險感。靈感來自 Strava 的活力氛圍，適合追求刺激與突破極限的戶外愛好者。",
    colors: {
      primary: "#FC4C02",
      primaryLight: "#FF7043",
      primaryDark: "#D84315",
      secondary: "#00E676",
      secondaryLight: "#69F0AE",
      accent: "#00E676",
      background: "#0F172A",
      surface: "#1E293B",
      surfaceAlt: "#334155",
      text: "#F1F5F9",
      textSecondary: "#94A3B8",
      textOnPrimary: "#FFFFFF",
      border: "#475569",
      success: "#00E676",
      warning: "#FFB300",
      error: "#FF5252",
    },
    fonts: {
      heading: "'Inter', 'Noto Sans TC', sans-serif",
      body: "'Inter', 'Noto Sans TC', sans-serif",
      mono: "'Fira Code', monospace",
    },
    radius: { sm: "4px", md: "6px", lg: "8px", xl: "12px", full: "9999px" },
    navStyle: "dark",
  },
};

// ---------- 假資料 ----------

const sampleSpot = {
  name: "松蘿湖野營地",
  location: "宜蘭縣大同鄉",
  category: "露營",
  rating: 4.7,
  reviews: 128,
  difficulty: "中等",
  description:
    "隱藏在山林深處的夢幻湖泊，被稱為「十七歲少女之湖」。四周環繞著原始林，湖面常年雲霧繚繞，是台灣最美的野營聖地之一。",
  tags: ["野營", "湖泊", "登山", "攝影"],
  elevation: "1280m",
  duration: "單程約 3.5 小時",
  bestSeason: "10月 - 4月",
  imageUrl: "",
};

const sampleSpots = [
  {
    name: "松蘿湖野營地",
    location: "宜蘭縣大同鄉",
    category: "露營",
    rating: 4.7,
    reviews: 128,
  },
  {
    name: "蘭嶼朗島潛水點",
    location: "台東縣蘭嶼鄉",
    category: "潛水",
    rating: 4.9,
    reviews: 256,
  },
  {
    name: "金山磺港衝浪區",
    location: "新北市金山區",
    category: "衝浪",
    rating: 4.5,
    reviews: 89,
  },
];

// ---------- 元件 ----------

function ColorSwatch({
  color,
  label,
  textColor,
}: {
  color: string;
  label: string;
  textColor?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          backgroundColor: color,
          border: "1px solid rgba(128,128,128,0.2)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      />
      <span style={{ fontSize: 11, color: textColor || "#666", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 10, color: textColor || "#999", fontFamily: "monospace" }}>
        {color}
      </span>
    </div>
  );
}

function StarRating({ rating, theme }: { rating: number; theme: DesignTheme }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <span style={{ color: theme.colors.accent, fontSize: 14, letterSpacing: 1 }}>
      {"★".repeat(fullStars)}
      {hasHalf ? "½" : ""}
      {"☆".repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      <span
        style={{
          color: theme.colors.textSecondary,
          fontSize: 13,
          marginLeft: 6,
          fontWeight: 500,
        }}
      >
        {rating}
      </span>
    </span>
  );
}

function CategoryBadge({ category, theme }: { category: string; theme: DesignTheme }) {
  const categoryIcons: Record<string, string> = {
    露營: "🏕️",
    潛水: "🤿",
    衝浪: "🏄",
    釣魚: "🎣",
    登山: "🥾",
    車宿: "🚐",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.primaryLight + "22",
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {categoryIcons[category] || "📍"} {category}
    </span>
  );
}

// ---------- Section: 色彩板 ----------

function ColorPaletteSection({ theme }: { theme: DesignTheme }) {
  const groups = [
    { label: "主色", items: [
      { color: theme.colors.primary, label: "Primary" },
      { color: theme.colors.primaryLight, label: "Primary Light" },
      { color: theme.colors.primaryDark, label: "Primary Dark" },
    ]},
    { label: "輔色 / 強調", items: [
      { color: theme.colors.secondary, label: "Secondary" },
      { color: theme.colors.secondaryLight, label: "Sec. Light" },
      { color: theme.colors.accent, label: "Accent" },
    ]},
    { label: "背景 / 表面", items: [
      { color: theme.colors.background, label: "Background" },
      { color: theme.colors.surface, label: "Surface" },
      { color: theme.colors.surfaceAlt, label: "Surface Alt" },
    ]},
    { label: "文字 / 邊框", items: [
      { color: theme.colors.text, label: "Text" },
      { color: theme.colors.textSecondary, label: "Text Sec." },
      { color: theme.colors.border, label: "Border" },
    ]},
    { label: "狀態色", items: [
      { color: theme.colors.success, label: "Success" },
      { color: theme.colors.warning, label: "Warning" },
      { color: theme.colors.error, label: "Error" },
    ]},
  ];

  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        🎨 色彩系統
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.colors.textSecondary,
                marginBottom: 8,
              }}
            >
              {group.label}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {group.items.map((item) => (
                <ColorSwatch
                  key={item.label}
                  color={item.color}
                  label={item.label}
                  textColor={theme.colors.textSecondary}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Section: 按鈕 ----------

function ButtonSection({ theme }: { theme: DesignTheme }) {
  const btnBase: React.CSSProperties = {
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: theme.fonts.body,
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  };

  const sizes = {
    大: { padding: "14px 28px", fontSize: 16 },
    中: { padding: "10px 20px", fontSize: 14 },
    小: { padding: "6px 14px", fontSize: 12 },
  };

  const variants = {
    主要: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textOnPrimary,
      borderRadius: theme.radius.md,
    },
    次要: {
      backgroundColor: "transparent",
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
      borderRadius: theme.radius.md,
    },
    危險: {
      backgroundColor: theme.colors.error,
      color: "#FFFFFF",
      borderRadius: theme.radius.md,
    },
    圓角: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.textOnPrimary,
      borderRadius: theme.radius.full,
    },
  };

  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        🔘 按鈕樣式
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {Object.entries(variants).map(([vName, vStyle]) => (
          <div key={vName}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.colors.textSecondary,
                marginBottom: 8,
              }}
            >
              {vName}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              {Object.entries(sizes).map(([sName, sStyle]) => (
                <button
                  key={sName}
                  style={{ ...btnBase, ...sStyle, ...vStyle } as React.CSSProperties}
                >
                  {vName === "圓角" ? `📍 ${sName}按鈕` : `${sName}按鈕`}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Section: 導航列 ----------

function NavbarSection({ theme }: { theme: DesignTheme }) {
  const isDark = theme.navStyle === "dark";
  const navBg = isDark ? theme.colors.surface : theme.colors.surface;
  const navText = theme.colors.text;

  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        📱 導航列
      </h3>
      {/* 頂部導航 */}
      <div
        style={{
          backgroundColor: navBg,
          padding: "12px 20px",
          borderRadius: theme.radius.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: `1px solid ${theme.colors.border}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🗺️</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: theme.colors.primary,
              fontFamily: theme.fonts.heading,
            }}
          >
            Wildmap
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          {["探索", "地圖", "收藏"].map((item) => (
            <span
              key={item}
              style={{
                color: navText,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: theme.fonts.body,
              }}
            >
              {item}
            </span>
          ))}
          <button
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              border: "none",
              padding: "8px 16px",
              borderRadius: theme.radius.full,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            登入
          </button>
        </div>
      </div>
      {/* 底部 Tab Bar */}
      <div
        style={{
          backgroundColor: navBg,
          padding: "8px 0",
          borderRadius: theme.radius.lg,
          display: "flex",
          justifyContent: "space-around",
          border: `1px solid ${theme.colors.border}`,
          marginTop: 12,
          maxWidth: 380,
        }}
      >
        {[
          { icon: "🏠", label: "首頁", active: true },
          { icon: "🗺️", label: "地圖", active: false },
          { icon: "🔍", label: "搜尋", active: false },
          { icon: "❤️", label: "收藏", active: false },
          { icon: "👤", label: "我的", active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: tab.active ? 700 : 400,
                color: tab.active ? theme.colors.primary : theme.colors.textSecondary,
              }}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Section: 地標卡片 ----------

function SpotCardSection({ theme }: { theme: DesignTheme }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        🏕️ 地標卡片
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260, 1fr))",
          gap: 16,
        }}
      >
        {sampleSpots.map((spot) => (
          <div
            key={spot.name}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.border}`,
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              maxWidth: 300,
            }}
          >
            {/* 圖片佔位 */}
            <div
              style={{
                height: 160,
                backgroundColor: theme.colors.surfaceAlt,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <span style={{ fontSize: 40, opacity: 0.3 }}>
                {spot.category === "露營" ? "🏕️" : spot.category === "潛水" ? "🤿" : "🏄"}
              </span>
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <CategoryBadge category={spot.category} theme={theme} />
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ♡
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: theme.colors.text,
                  fontFamily: theme.fonts.heading,
                  marginBottom: 4,
                }}
              >
                {spot.name}
              </h4>
              <div
                style={{
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  marginBottom: 8,
                }}
              >
                📍 {spot.location}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <StarRating rating={spot.rating} theme={theme} />
                <span
                  style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {spot.reviews} 則評論
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Section: 地標詳情頁 ----------

function SpotDetailSection({ theme }: { theme: DesignTheme }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        📋 地標詳情頁（模擬）
      </h3>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
          overflow: "hidden",
          maxWidth: 420,
        }}
      >
        {/* Header Image */}
        <div
          style={{
            height: 200,
            backgroundColor: theme.colors.surfaceAlt,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span style={{ fontSize: 64, opacity: 0.2 }}>🏕️</span>
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              right: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <CategoryBadge category={sampleSpot.category} theme={theme} />
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.accent + "22",
                  color: theme.colors.accent,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {sampleSpot.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: theme.colors.text,
              fontFamily: theme.fonts.heading,
              marginBottom: 4,
            }}
          >
            {sampleSpot.name}
          </h2>
          <div
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              marginBottom: 12,
            }}
          >
            📍 {sampleSpot.location}
          </div>

          <div style={{ marginBottom: 16 }}>
            <StarRating rating={sampleSpot.rating} theme={theme} />
            <span
              style={{
                fontSize: 13,
                color: theme.colors.textSecondary,
                marginLeft: 8,
              }}
            >
              ({sampleSpot.reviews} 則評論)
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.colors.textSecondary,
              margin: 0,
              marginBottom: 16,
              fontFamily: theme.fonts.body,
            }}
          >
            {sampleSpot.description}
          </p>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              { label: "海拔", value: sampleSpot.elevation, icon: "⛰️" },
              { label: "步程", value: sampleSpot.duration, icon: "🥾" },
              { label: "最佳季節", value: sampleSpot.bestSeason, icon: "🗓️" },
              { label: "難度", value: sampleSpot.difficulty, icon: "💪" },
            ].map((info) => (
              <div
                key={info.label}
                style={{
                  backgroundColor: theme.colors.surfaceAlt,
                  padding: 12,
                  borderRadius: theme.radius.md,
                }}
              >
                <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
                  {info.icon} {info.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {info.value}
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {sampleSpot.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 12px",
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.surfaceAlt,
                  color: theme.colors.textSecondary,
                  fontSize: 12,
                  fontWeight: 500,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              style={{
                flex: 1,
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                border: "none",
                padding: "12px 0",
                borderRadius: theme.radius.md,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: theme.fonts.body,
              }}
            >
              🗺️ 查看地圖
            </button>
            <button
              style={{
                width: 48,
                backgroundColor: "transparent",
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
                borderRadius: theme.radius.md,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Section: 表單 ----------

function FormSection({ theme }: { theme: DesignTheme }) {
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: 6,
    display: "block",
    fontFamily: theme.fonts.body,
  };

  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        📝 表單元件
      </h3>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: 24,
          maxWidth: 400,
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: theme.colors.text,
            fontFamily: theme.fonts.heading,
            marginBottom: 20,
          }}
        >
          新增地標
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>地標名稱</label>
            <input style={inputStyle} placeholder="輸入地標名稱..." />
          </div>
          <div>
            <label style={labelStyle}>分類</label>
            <select style={{ ...inputStyle, cursor: "pointer" }}>
              <option>露營</option>
              <option>車宿</option>
              <option>釣魚</option>
              <option>潛水</option>
              <option>衝浪</option>
              <option>登山</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>描述</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
              placeholder="描述這個地標..."
            />
          </div>
          <div>
            <label style={labelStyle}>難度</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["簡單", "中等", "困難"].map((level, i) => (
                <button
                  key={level}
                  style={{
                    flex: 1,
                    padding: "8px 0",
                    borderRadius: theme.radius.md,
                    border:
                      i === 1
                        ? `2px solid ${theme.colors.primary}`
                        : `1px solid ${theme.colors.border}`,
                    backgroundColor: i === 1 ? theme.colors.primary + "11" : "transparent",
                    color: i === 1 ? theme.colors.primary : theme.colors.textSecondary,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button
            style={{
              width: "100%",
              padding: "12px 0",
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              border: "none",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Section: 字型展示 ----------

function TypographySection({ theme }: { theme: DesignTheme }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        🔤 字型與排版
      </h3>
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
          padding: 24,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
            標題字型：{theme.fonts.heading}
          </div>
          <div
            style={{
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 800 }}>探索台灣野外秘境</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>松蘿湖野營地</span>
            <span style={{ fontSize: 18, fontWeight: 600 }}>宜蘭最美的高山湖泊</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
            內文字型：{theme.fonts.body}
          </div>
          <p
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 14,
              lineHeight: 1.7,
              color: theme.colors.textSecondary,
              margin: 0,
            }}
          >
            Wildmap 是一個專為台灣戶外愛好者打造的地圖平台，涵蓋露營、車宿、釣魚、潛水、衝浪、登山等多元活動類型。
          </p>
        </div>
        <div>
          <div style={{ fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4 }}>
            等寬字型：{theme.fonts.mono}
          </div>
          <code
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 13,
              color: theme.colors.primary,
              backgroundColor: theme.colors.surfaceAlt,
              padding: "4px 8px",
              borderRadius: theme.radius.sm,
            }}
          >
            lat: 24.5937, lng: 121.4838
          </code>
        </div>
      </div>
    </div>
  );
}

// ---------- 圓角展示 ----------

function RadiusSection({ theme }: { theme: DesignTheme }) {
  return (
    <div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 16,
          fontFamily: theme.fonts.heading,
        }}
      >
        ◻️ 圓角風格
      </h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(theme.radius).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: value,
                backgroundColor: theme.colors.primary + "22",
                border: `2px solid ${theme.colors.primary}`,
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text }}>{key}</span>
            <span style={{ fontSize: 10, color: theme.colors.textSecondary }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function DesignPreviewPage() {
  const [activeTheme, setActiveTheme] = useState<string>("nature");
  const theme = themes[activeTheme];

  return (
    <>
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          transition: "background-color 0.4s",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: theme.colors.surface,
            borderBottom: `1px solid ${theme.colors.border}`,
            backdropFilter: "blur(12px)",
            transition: "all 0.4s",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 800,
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  🗺️ Wildmap Design System
                </h1>
                <p
                  style={{
                    margin: 0,
                    marginTop: 4,
                    fontSize: 14,
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  台灣戶外活動地圖平台 — UI 設計方案比較
                </p>
              </div>

              {/* Theme Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {Object.values(themes).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTheme(t.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: theme.radius.full,
                      border:
                        activeTheme === t.id
                          ? `2px solid ${t.colors.primary}`
                          : `1px solid ${theme.colors.border}`,
                      backgroundColor:
                        activeTheme === t.id ? t.colors.primary : "transparent",
                      color:
                        activeTheme === t.id ? t.colors.textOnPrimary : theme.colors.text,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: theme.fonts.body,
                      transition: "all 0.3s",
                    }}
                  >
                    {t.id === "nature" ? "🌿 " : t.id === "modern" ? "✨ " : "🔥 "}
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Description */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "24px 20px 0",
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.primary + "11",
              border: `1px solid ${theme.colors.primary}33`,
              borderRadius: theme.radius.lg,
              padding: "20px 24px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: theme.colors.primary,
                fontFamily: theme.fonts.heading,
                marginBottom: 4,
              }}
            >
              {theme.tagline}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                lineHeight: 1.7,
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
              }}
            >
              {theme.description}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "24px 20px 60px",
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          <ColorPaletteSection theme={theme} />
          <TypographySection theme={theme} />
          <RadiusSection theme={theme} />
          <ButtonSection theme={theme} />
          <NavbarSection theme={theme} />
          <SpotCardSection theme={theme} />
          <SpotDetailSection theme={theme} />
          <FormSection theme={theme} />

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              borderTop: `1px solid ${theme.colors.border}`,
              color: theme.colors.textSecondary,
              fontSize: 13,
            }}
          >
            Wildmap Design System Preview • 2025
          </div>
        </div>
      </div>
    </>
  );
}
