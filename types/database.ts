export type UserRole = 'user' | 'moderator' | 'admin'
export type SpotCategory = 'camping' | 'carcamp' | 'fishing' | 'diving' | 'surfing' | 'hiking'
export type SpotType = 'paid' | 'free' | 'wild'
export type SpotStatus = 'active' | 'hidden' | 'closed' | 'pending'
export type SpotQuality = 'new' | 'verified' | 'featured'
export type AchievementTier = 'none' | 'bronze' | 'silver' | 'gold'

export interface User {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  level: number
  total_score: number
  permissions_cache: string[]
  expert_scores: Record<string, number>
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Spot {
  id: string
  name: string
  description: string | null
  lat: number
  lng: number
  address: string | null
  city: string | null
  district: string | null
  category: SpotCategory
  spot_type: SpotType
  status: SpotStatus
  altitude: number | null
  website: string | null
  facebook: string | null
  instagram: string | null
  line_id: string | null
  email: string | null
  google_maps_url: string | null
  gov_certified: boolean
  created_by: string | null
  quality_level: SpotQuality
  view_count: number
  created_at: string
  updated_at: string
}

export interface FeatureDefinition {
  id: string
  name: string
  description: string | null
  category: string
  icon_name: string | null
  color: string | null
  sort_order: number
  applicable_types: string[]
  is_active: boolean
}
