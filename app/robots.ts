import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/', // 上線前保持封閉，改為 allow: '/' 即可開放
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wildmap.tw'}/sitemap.xml`,
  }
}
