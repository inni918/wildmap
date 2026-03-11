import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { AchievementProvider } from "@/lib/achievement-context";
import { LevelProvider } from "@/lib/level-context";
import PWARegister from "@/components/PWARegister";
import CookieConsent from "@/components/CookieConsent";
import TrackerInit from "@/components/TrackerInit";
import ConditionalFooter from "@/components/ConditionalFooter";
import "@/lib/fontawesome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://wildmap-dusky.vercel.app'),
  title: "Wildmap - 台灣最完整的露營地圖",
  description: "從露營開始，探索台灣每一個角落。1,900+ 個露營場、106 項特性投票、社群真實評價。",
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Wildmap - 台灣最完整的露營地圖',
    description: '從露營開始，探索台灣每一個角落。1,900+ 個露營場、106 項特性投票。',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
    locale: 'zh_TW',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D6A4F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Wildmap',
              url: 'https://wildmap-dusky.vercel.app',
              logo: 'https://wildmap-dusky.vercel.app/logo/wildmap-logo.svg',
              description:
                '從露營開始，探索台灣每一個角落。台灣最完整的露營地圖，1,900+ 個露營場、106 項特性投票、社群真實評價。',
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-bg text-text-main">
        <AuthProvider>
          <LevelProvider>
            <AchievementProvider>
              {children}
              <ConditionalFooter />
            </AchievementProvider>
          </LevelProvider>
        </AuthProvider>
        <PWARegister />
        <CookieConsent />
        <TrackerInit />
      </body>
    </html>
  );
}
