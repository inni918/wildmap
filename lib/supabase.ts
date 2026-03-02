import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Spot = {
  id: string
  name: string
  description: string
  category: 'camping' | 'fishing' | 'diving' | 'surfing' | 'hiking' | 'carcamp'
  latitude: number
  longitude: number
  created_at: string
}
