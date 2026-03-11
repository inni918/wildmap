import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let _client: SupabaseClient | null = null

function getSupabaseBrowserClient(): SupabaseClient {
  if (!_client) {
    _client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return _client
}

export const supabase = getSupabaseBrowserClient()

// === Types ===

export type SpotCategory = 'camping' | 'fishing' | 'diving' | 'surfing' | 'hiking' | 'carcamp'

export type Spot = {
  id: string
  name: string
  name_en?: string
  description?: string
  description_en?: string
  category: SpotCategory
  latitude: number
  longitude: number
  address?: string
  status: string
  quality: string
  is_free?: boolean
  is_private: boolean
  created_by?: string
  managed_by?: string
  phone?: string
  website?: string
  facebook?: string
  instagram?: string
  line_id?: string
  email?: string
  google_maps_url?: string
  gov_certified?: boolean
  claimed_by?: string
  claimed_at?: string
  is_claimed?: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export type BusinessClaim = {
  id: string
  spot_id: string
  user_id: string
  business_name: string
  contact_phone?: string
  contact_email?: string
  proof_url?: string
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  reviewed_at?: string
  reviewed_by?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export type FeatureGroup = 'camp_traits' | 'facilities' | 'environment' | 'activities' | 'restrictions' | 'warnings'

export type FeatureDefinition = {
  id: string
  key: string
  name_zh: string
  name_en?: string
  icon: string
  color: string
  group_key: FeatureGroup
  group_name_zh: string
  applicable_categories: SpotCategory[]
  sort_order: number
}

export type FeatureVote = {
  id: string
  spot_id: string
  feature_id: string
  user_id: string
  vote: boolean
  weight: number
  created_at: string
}

export type UserProfile = {
  id: string
  email: string
  display_name: string
  avatar_url?: string
  role: string
  level: number
  points: number
  credit_score: number
  created_at: string
}

// === Feature group display config ===
export const FEATURE_GROUP_CONFIG: Record<FeatureGroup, { name: string; color: string }> = {
  camp_traits:  { name: '營地特性', color: '#FF6347' },    // tomato
  facilities:   { name: '設施與服務', color: '#40E0D0' },  // turquoise
  environment:  { name: '周邊環境', color: '#228B22' },    // forestgreen
  activities:   { name: '可進行活動', color: '#000080' },  // navy
  restrictions: { name: '區域與限制', color: '#FF00FF' },  // fuchsia
  warnings:     { name: '注意事項', color: '#800000' },    // maroon
}

export const CATEGORY_EMOJI: Record<SpotCategory, string> = {
  camping: '🏕️',
  fishing: '🎣',
  diving: '🤿',
  surfing: '🏄',
  hiking: '🏔️',
  carcamp: '🚐',
}

export const CATEGORY_LABEL: Record<SpotCategory, string> = {
  camping: '露營',
  fishing: '釣魚',
  diving: '潛水',
  surfing: '衝浪',
  hiking: '登山',
  carcamp: '車宿',
}
