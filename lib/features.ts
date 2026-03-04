import { supabase, type FeatureDefinition, type FeatureGroup, type SpotCategory, FEATURE_GROUP_CONFIG } from './supabase'

// === Types ===

export type FeatureWithVotes = FeatureDefinition & {
  yes_count: number
  no_count: number
  total: number
  ratio: number
  status: 'confirmed' | 'pending' | 'absent'
  user_vote?: boolean | null
}

export type GroupedFeatures = {
  group_key: FeatureGroup
  group_name: string
  color: string
  features: FeatureWithVotes[]
}

// === Feature status logic ===

export function getFeatureStatus(yes: number, no: number): 'confirmed' | 'pending' | 'absent' {
  const total = yes + no
  if (total < 3) return 'pending'
  const ratio = yes / total
  if (ratio >= 0.6) return 'confirmed'
  return 'absent'
}

// === Data fetching ===

export async function fetchSpotFeatures(
  spotId: string,
  category: SpotCategory,
  userId?: string
): Promise<GroupedFeatures[]> {
  // Fetch feature definitions for this category
  const { data: definitions, error: defError } = await supabase
    .from('feature_definitions')
    .select('*')
    .contains('applicable_categories', [category])
    .order('sort_order')

  if (defError || !definitions) {
    console.error('Error fetching feature definitions:', defError)
    return []
  }

  // Fetch all votes for this spot
  const { data: votes, error: voteError } = await supabase
    .from('feature_votes')
    .select('*')
    .eq('spot_id', spotId)

  if (voteError) {
    console.error('Error fetching votes:', voteError)
  }

  const voteMap = new Map<string, { yes: number; no: number; userVote?: boolean | null }>()

  for (const v of (votes || [])) {
    const existing = voteMap.get(v.feature_id) || { yes: 0, no: 0, userVote: null }
    if (v.vote) existing.yes++
    else existing.no++
    if (userId && v.user_id === userId) {
      existing.userVote = v.vote
    }
    voteMap.set(v.feature_id, existing)
  }

  // Build features with vote data
  const featuresWithVotes: FeatureWithVotes[] = definitions.map((def: FeatureDefinition) => {
    const voteData = voteMap.get(def.id) || { yes: 0, no: 0, userVote: null }
    const total = voteData.yes + voteData.no
    return {
      ...def,
      yes_count: voteData.yes,
      no_count: voteData.no,
      total,
      ratio: total > 0 ? voteData.yes / total : 0,
      status: getFeatureStatus(voteData.yes, voteData.no),
      user_vote: voteData.userVote ?? null,
    }
  })

  // Group by category
  const groupMap = new Map<FeatureGroup, FeatureWithVotes[]>()
  for (const f of featuresWithVotes) {
    const list = groupMap.get(f.group_key) || []
    list.push(f)
    groupMap.set(f.group_key, list)
  }

  const groups: GroupedFeatures[] = []
  for (const [key, features] of groupMap) {
    const config = FEATURE_GROUP_CONFIG[key]
    groups.push({
      group_key: key,
      group_name: config.name,
      color: config.color,
      features,
    })
  }

  return groups
}

// === Voting ===

export async function castVote(
  spotId: string,
  featureId: string,
  userId: string,
  vote: boolean
): Promise<{ success: boolean; error?: string }> {
  // Check if user already voted
  const { data: existing } = await supabase
    .from('feature_votes')
    .select('id, vote')
    .eq('spot_id', spotId)
    .eq('feature_id', featureId)
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    if (existing.vote === vote) {
      // Same vote: remove it (toggle off)
      const { error } = await supabase
        .from('feature_votes')
        .delete()
        .eq('id', existing.id)
      return error ? { success: false, error: error.message } : { success: true }
    } else {
      // Different vote: update
      const { error } = await supabase
        .from('feature_votes')
        .update({ vote })
        .eq('id', existing.id)
      return error ? { success: false, error: error.message } : { success: true }
    }
  } else {
    // New vote
    const { error } = await supabase
      .from('feature_votes')
      .insert({ spot_id: spotId, feature_id: featureId, user_id: userId, vote })
    return error ? { success: false, error: error.message } : { success: true }
  }
}
