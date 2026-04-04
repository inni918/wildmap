import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SpotDetail from '@/components/spots/SpotDetail'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: spot } = await supabase.from('spots').select('name, city').eq('id', id).single()
  if (!spot) return { title: 'Wildmap' }
  return {
    title: `${spot.name} - Wildmap`,
    description: `${spot.city || '台灣'}的露營地點`
  }
}

export default async function SpotPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: spot, error } = await supabase.from('spots').select('*').eq('id', id).single()
  if (error || !spot) notFound()
  return <SpotDetail spot={spot} />
}
