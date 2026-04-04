import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth-context'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Wildmap - 台灣最完整的露營地圖',
    template: '%s | Wildmap'
  },
  description: '找到你的完美營地。台灣最完整的露營地圖，含 1,900+ 個地點、特性投票、用戶評分。',
  keywords: ['露營', '台灣露營', '露營地圖', '營地', '野營'],
  openGraph: {
    title: 'Wildmap - 台灣最完整的露營地圖',
    description: '找到你的完美營地',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
