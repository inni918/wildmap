import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/', // ← 正式上線後改為 allow: '/'
      },
    ],
    sitemap: 'https://wildmap-dusky.vercel.app/sitemap.xml',
  }
}
