import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "@/lib/fontawesome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wildmap - 台灣野營地圖",
  description: "探索台灣最棒的露營、釣魚、潛水、衝浪秘境",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="font-sans antialiased bg-bg text-text-main">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
