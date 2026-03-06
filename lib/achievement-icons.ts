/**
 * 成就系統 SVG icon 路徑對應表
 * key: achievement key (snake_case, from DB)
 * value: SVG icon path
 */
export const ACHIEVEMENT_ICONS: Record<string, string> = {
  // === 探索類 ===
  first_explore: '/icons/achievements/first-explore.svg',
  region_north: '/icons/achievements/region-north.svg',
  region_central: '/icons/achievements/region-central.svg',
  region_south: '/icons/achievements/region-south.svg',
  region_east: '/icons/achievements/region-east.svg',
  region_island: '/icons/achievements/region-island.svg',
  region_mountain: '/icons/achievements/region-mountain.svg',
  all_counties: '/icons/achievements/all-counties.svg',
  camping_beginner: '/icons/achievements/camping-beginner.svg',
  carcamp_beginner: '/icons/achievements/carcamp-beginner.svg',
  explore_expert: '/icons/achievements/explore-expert.svg',
  explore_master: '/icons/achievements/explore-master.svg',

  // === 貢獻類 ===
  first_spot: '/icons/achievements/first-spot.svg',
  photographer: '/icons/achievements/photographer.svg',
  prolific_photographer: '/icons/achievements/prolific-photographer.svg',
  first_comment: '/icons/achievements/first-comment.svg',
  comment_100: '/icons/achievements/comment-100.svg',
  first_vote: '/icons/achievements/first-vote.svg',
  vote_expert: '/icons/achievements/vote-expert.svg',
  vote_master: '/icons/achievements/vote-master.svg',
  first_edit: '/icons/achievements/first-edit.svg',
  edit_guardian: '/icons/achievements/edit-guardian.svg',
  star_collector: '/icons/achievements/star-collector.svg',
  rating_expert: '/icons/achievements/rating-expert.svg',
  five_star: '/icons/achievements/five-star.svg',
  strict_judge: '/icons/achievements/strict-judge.svg',
  spot_pioneer: '/icons/achievements/spot-pioneer.svg',

  // === 社群類 ===
  social_butterfly: '/icons/achievements/social-butterfly.svg',
  collector: '/icons/achievements/collector.svg',
  super_collector: '/icons/achievements/super-collector.svg',
  popular_spot: '/icons/achievements/popular-spot.svg',
  hot_comment: '/icons/achievements/hot-comment.svg',
  share_expert: '/icons/achievements/share-expert.svg',
  good_neighbor: '/icons/achievements/good-neighbor.svg',
  community_guardian: '/icons/achievements/community-guardian.svg',

  // === 特殊類 ===
  genesis: '/icons/achievements/genesis.svg',
  night_owl: '/icons/achievements/night-owl.svg',
  early_bird: '/icons/achievements/early-bird.svg',
  weekend_warrior: '/icons/achievements/weekend-warrior.svg',
  perfect_attendance: '/icons/achievements/perfect-attendance.svg',
  season_explorer: '/icons/achievements/season-explorer.svg',
  mountain_challenge: '/icons/achievements/mountain-challenge.svg',
  beach_person: '/icons/achievements/beach-person.svg',
}

/**
 * 分類 SVG icon 路徑
 */
export const CATEGORY_SVG_ICONS: Record<string, string> = {
  exploration: '/icons/achievements/first-explore.svg',
  contribution: '/icons/achievements/first-edit.svg',
  community: '/icons/achievements/social-butterfly.svg',
  special: '/icons/achievements/genesis.svg',
}

/**
 * 取得成就的 SVG icon 路徑
 * 如果找不到對應的 SVG，回傳 null（fallback 到 emoji）
 */
export function getAchievementIconPath(key: string): string | null {
  return ACHIEVEMENT_ICONS[key] || null
}
