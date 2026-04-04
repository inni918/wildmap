import { MetadataRoute } from 'next'
import { adminSupabase } from '@/lib/supabase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wildmap.tw'

  const { data: spots } = await adminSupabase
    .from('spots')
    .select('id, updated_at')
    .eq('status', 'active')
    .limit(5000)

  const spotUrls: MetadataRoute.Sitemap = (spots || []).map(spot => ({
    url: `${baseUrl}/spots/${spot.id}`,
    lastModified: new Date(spot.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...spotUrls,
  ]
}
