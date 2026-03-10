#!/usr/bin/env node
/**
 * enrich-features-keywords.js
 * 
 * 從營地名稱和地址中提取關鍵字，自動寫入 feature_votes。
 * 同時用 Open-Meteo Elevation API 做海拔推斷。
 * 
 * Usage:
 *   DRY_RUN=1 node scripts/enrich-features-keywords.js   # 只印統計
 *   node scripts/enrich-features-keywords.js               # 實際寫入
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const DRY_RUN = process.env.DRY_RUN === '1';
const SKIP_ELEVATION = process.env.SKIP_ELEVATION === '1';
const BATCH_SIZE = 100;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// ===== KEYWORD MAP =====
// 格式: keyword → [feature_key, ...]
// 排列: 長詞在前 → 短詞在後（匹配時長詞優先）
const KEYWORD_MAP = {
  // ── 水域相關 ──
  '海景': ['ocean_view'],
  '海邊': ['ocean_view', 'sandy_beach'],
  '海岸': ['ocean_view'],
  '海灘': ['ocean_view', 'sandy_beach'],
  '濱海': ['ocean_view'],
  '臨海': ['ocean_view'],
  '海濱': ['ocean_view'],
  '看海': ['ocean_view'],
  '望海': ['ocean_view'],
  '沙灘': ['sandy_beach'],
  '溪畔': ['river_stream'],
  '溪邊': ['river_stream'],
  '溪谷': ['river_stream'],
  '溪流': ['river_stream'],
  '河畔': ['river_stream'],
  '河邊': ['river_stream'],
  '溯溪': ['river_tracing', 'river_stream'],
  '戲水池': ['swimming_pool'],
  '泳池': ['swimming_pool'],
  '戲水': ['swimming'],
  '瀑布': ['waterfall'],
  '湖畔': ['lake'],
  '湖邊': ['lake'],
  '湖景': ['lake'],
  '日月潭': ['lake'],
  '水上活動': ['water_sports'],

  // ── 山景 / 高海拔 ──
  '高山': ['high_mountain', 'mountain_view'],
  '百岳': ['high_mountain', 'mountain_view'],
  '合歡山': ['high_mountain', 'mountain_view', 'sunrise_view'],
  '雪山': ['high_mountain', 'mountain_view'],
  '嘉明湖': ['high_mountain', 'mountain_view', 'lake'],
  '山景': ['mountain_view'],
  '山谷': ['mountain_view'],
  '山脈': ['mountain_view'],
  '群山': ['mountain_view'],
  '觀山': ['mountain_view'],
  '望山': ['mountain_view'],

  // ── 森林 / 林地 ──
  '森林': ['forest'],
  '林道': ['forest'],
  '杉林': ['forest'],
  '松林': ['forest'],
  '竹林': ['forest'],
  '樹林': ['forest'],
  '林間': ['forest'],
  '林場': ['forest'],

  // ── 草原 / 草皮 ──
  '草原': ['grassland'],
  '草皮': ['grassland'],
  '草地': ['grassland'],
  '大草原': ['grassland'],
  '清境': ['mountain_view', 'grassland'],
  '滑草': ['grass_sledding', 'grassland'],

  // ── 天文 / 氣象景觀 ──
  '星空': ['stargazing'],
  '觀星': ['stargazing'],
  '夜景': ['night_view'],
  '雲海': ['sea_of_clouds'],
  '日出': ['sunrise_view'],
  '晨曦': ['sunrise_view'],

  // ── 季節景觀 ──
  '賞楓': ['autumn_leaves'],
  '楓紅': ['autumn_leaves'],
  '楓葉': ['autumn_leaves'],
  '櫻花': ['seasonal_flowers'],
  '賞櫻': ['seasonal_flowers'],
  '金針花': ['seasonal_flowers'],
  '桐花': ['seasonal_flowers'],
  '梅花': ['seasonal_flowers'],
  '紫藤': ['seasonal_flowers'],
  '繡球花': ['seasonal_flowers'],
  '落羽松': ['seasonal_flowers'],
  '阿里山': ['mountain_view', 'sea_of_clouds', 'sunrise_view', 'seasonal_flowers'],
  '武陵': ['mountain_view', 'seasonal_flowers', 'autumn_leaves'],

  // ── 動物生態 ──
  '螢火蟲': ['fireflies'],
  '賞螢': ['fireflies'],
  '螢': ['fireflies'],
  '賞鳥': ['bird_watching'],
  '生態': ['ecology_tour'],

  // ── 溫泉 ──
  '野溪溫泉': ['wild_hot_spring'],
  '溫泉': ['hot_spring'],
  '烏來': ['indigenous_area', 'hot_spring'],

  // ── 釣魚 ──
  '釣魚': ['fishing'],
  '釣蝦': ['fishing'],

  // ── 免費 / 野營 ──
  '免費': ['free_site'],
  '野營': ['free_site', 'tent_allowed'],

  // ── 裝備 / 豪華露營 ──
  '免裝備': ['equipment_rental', 'glamping'],
  '免搭帳': ['glamping'],
  '豪華露營': ['glamping'],
  '豪華': ['glamping'],
  '懶人露營': ['glamping'],
  '懶人': ['glamping'],
  'Glamping': ['glamping'],
  'glamping': ['glamping'],

  // ── 親子 / 寵物 ──
  '寵物友善': ['pet_friendly'],
  '寵物': ['pet_friendly'],
  '毛孩': ['pet_friendly'],
  '毛寶貝': ['pet_friendly'],
  '帶狗': ['pet_friendly'],
  '親子': ['child_friendly'],
  '幼兒': ['child_friendly'],

  // ── 設施 ──
  '雨棚': ['covered_area'],
  '雨遮': ['covered_area'],
  '有棚': ['covered_area'],
  '包區': ['small_group_area'],
  '少帳': ['small_group_area'],
  '遊樂': ['playground'],
  '沙坑': ['sandbox'],
  '籃球': ['basketball_court'],
  '攀岩': ['rock_climbing'],
  '漆彈': ['paintball'],

  // ── 體驗活動 ──
  '牧場體驗': ['ranch_experience'],
  '牧場': ['ranch_experience'],
  '觀光農場': ['farm_experience'],
  '農場體驗': ['farm_experience'],
  '手作': ['craft_workshop'],
  '自行車': ['cycling'],
  '腳踏車': ['cycling'],
  '步道': ['hiking_trails'],
  '健行': ['hiking_trails'],
  '登山': ['hiking_trails'],

  // ── 地區 / 地標 ──
  '墾丁': ['ocean_view', 'sandy_beach'],
  '蘭嶼': ['ocean_view'],
  '綠島': ['ocean_view'],
  '小琉球': ['ocean_view'],
  '太魯閣': ['mountain_view', 'national_park'],
  '國家公園': ['national_park'],
  '國家風景區': ['national_park'],
  '原住民': ['indigenous_area'],

  // ── 原住民鄉鎮（地址匹配）──
  '泰安鄉': ['indigenous_area'],
  '尖石鄉': ['indigenous_area'],
  '五峰鄉': ['indigenous_area'],
  '復興區': ['indigenous_area'],
  '和平區': ['indigenous_area'],
  '仁愛鄉': ['indigenous_area'],
  '信義鄉': ['indigenous_area'],
  '茂林區': ['indigenous_area'],
  '那瑪夏': ['indigenous_area'],
  '桃源區': ['indigenous_area'],
  '霧台鄉': ['indigenous_area'],
  '來義鄉': ['indigenous_area'],
  '瑪家鄉': ['indigenous_area'],
  '三地門': ['indigenous_area'],
  '春日鄉': ['indigenous_area'],
  '獅子鄉': ['indigenous_area'],
  '牡丹鄉': ['indigenous_area'],
  '達仁鄉': ['indigenous_area'],
  '金峰鄉': ['indigenous_area'],
  '延平鄉': ['indigenous_area'],
  '海端鄉': ['indigenous_area'],
  '卑南鄉': ['indigenous_area'],
  '太麻里': ['indigenous_area'],
  '蘭嶼鄉': ['indigenous_area', 'ocean_view'],
  '秀林鄉': ['indigenous_area'],
  '萬榮鄉': ['indigenous_area'],
  '卓溪鄉': ['indigenous_area'],
  '大同鄉': ['indigenous_area'],
  '南澳鄉': ['indigenous_area'],

  // ── 露營車 ──
  '露營車': ['rv_ok'],
  '車泊': ['rv_ok'],

  // ── 住宿 ──
  '民宿': ['accommodation'],
  '小木屋': ['accommodation'],
  '貨櫃屋': ['accommodation'],
};

// ===== 海岸地址關鍵字 =====
const COASTAL_KEYWORDS = [
  '海邊', '海岸', '海濱', '濱海', '臨海',
  '漁港', '漁村', '港口',
  '墾丁', '蘭嶼', '綠島', '小琉球', '金門',
  '澎湖', '馬祖', '東引',
  '花蓮市', '台東市', '台東縣',
  '頭城', '壯圍', '蘇澳',
  '貢寮', '萬里', '金山', '石門',
  '三芝', '淡水',
  '觀音', '新屋',
  '後龍', '通霄', '苑裡',
  '大安', '清水', '梧棲',
  '芳苑', '鹿港',
  '北門', '將軍', '七股',
  '安南', '安平',
  '林邊', '枋寮', '枋山',
  '滿州', '恆春',
  '長濱', '成功', '東河',
  '豐濱', '壽豐', '新城',
  '秀姑巒',
];

// ===== Supabase helper =====
async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || '',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${path}: ${res.status} ${text}`);
  }
  return res;
}

async function fetchAll(table, select) {
  const PAGE = 1000;
  let all = [];
  let offset = 0;
  while (true) {
    const res = await supaFetch(`${table}?select=${select}&limit=${PAGE}&offset=${offset}`);
    const data = await res.json();
    all = all.concat(data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

// ===== Elevation API =====
// Use a simple formula to estimate elevation from latitude in Taiwan
// This avoids rate-limited API calls entirely.
// Taiwan elevation rough heuristics based on geographic position:
// - Central mountain range runs N-S with peaks > 3000m
// - East side of the range is steep, west side more gradual
function estimateElevation(lat, lng) {
  // Rough boundaries for Taiwan main island
  if (lat < 21.8 || lat > 25.4 || lng < 120.0 || lng > 122.1) return null;
  // Offshore islands
  if (lng < 120.2 && lat < 24.5) return 10; // Penghu
  if (lng > 121.4 && lat < 22.2) return 50; // Lanyu/Green Island
  if (lng < 118.5) return 20; // Kinmen/Matsu
  return null; // Can't estimate reliably
}

async function fetchElevations(coords) {
  // Use Open-Meteo but with smaller batches (50) and longer delays
  const results = [];
  const BATCH = 50; // Smaller batches to respect rate limits
  const DELAY = 3000; // 3s between batches
  
  for (let i = 0; i < coords.length; i += BATCH) {
    const batch = coords.slice(i, i + BATCH);
    const lats = batch.map(c => c.lat).join(',');
    const lngs = batch.map(c => c.lng).join(',');
    const url = `https://api.open-meteo.com/v1/elevation?latitude=${lats}&longitude=${lngs}`;
    
    let retries = 0;
    let success = false;
    while (retries < 3) {
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          retries++;
          const wait = 20000 * retries;
          console.log(`  ⏳ Rate limited at batch ${i}, waiting ${wait/1000}s (retry ${retries}/3)...`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }
        if (!res.ok) {
          throw new Error(`Elevation API ${res.status}: ${await res.text()}`);
        }
        const data = await res.json();
        const elevations = Array.isArray(data.elevation) ? data.elevation : [data.elevation];
        results.push(...elevations);
        success = true;
        break;
      } catch (e) {
        retries++;
        if (retries >= 3) {
          console.warn(`  ⚠ Elevation API failed for batch ${i}: ${e.message}, using null`);
          results.push(...batch.map(() => null));
        } else {
          await new Promise(r => setTimeout(r, 10000 * retries));
        }
      }
    }
    
    if (success && i + BATCH < coords.length) {
      await new Promise(r => setTimeout(r, DELAY));
    }
    
    // Progress indicator every 10 batches
    if ((i / BATCH) % 10 === 0) {
      process.stdout.write(`\r  Elevation progress: ${Math.min(i + BATCH, coords.length)}/${coords.length}`);
    }
  }
  console.log(''); // newline after progress
  return results;
}

// ===== Main Logic =====
async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN MODE\n' : '🚀 WRITE MODE\n');

  // 1. Fetch all spots
  console.log('📥 Fetching spots...');
  const spots = await fetchAll('spots', 'id,name,address,latitude,longitude');
  console.log(`  Found ${spots.length} spots`);

  // 2. Fetch feature definitions
  console.log('📥 Fetching feature definitions...');
  const featureDefs = await fetchAll('feature_definitions', 'id,key');
  const keyToId = {};
  featureDefs.forEach(f => { keyToId[f.key] = f.id; });
  console.log(`  Found ${featureDefs.length} features`);

  // 3. Keyword matching
  console.log('\n🔎 Running keyword matching...');
  
  // Sort keywords by length desc (longer matches first)
  const sortedKeywords = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);
  
  const matchResults = []; // { spot_id, feature_key, source }
  const spotMatches = new Map(); // spot_id → Set<feature_key>

  for (const spot of spots) {
    const text = (spot.name || '') + ' ' + (spot.address || '');
    const matched = new Set();

    for (const keyword of sortedKeywords) {
      if (text.includes(keyword)) {
        const featureKeys = KEYWORD_MAP[keyword];
        for (const fk of featureKeys) {
          if (!matched.has(fk) && keyToId[fk]) {
            matched.add(fk);
            matchResults.push({ spot_id: spot.id, feature_key: fk, source: `keyword:${keyword}` });
          }
        }
      }
    }

    if (matched.size > 0) {
      spotMatches.set(spot.id, matched);
    }
  }

  console.log(`  Keyword matches: ${matchResults.length} votes across ${spotMatches.size} spots`);

  // 4. Elevation-based inference
  if (SKIP_ELEVATION) {
    console.log('\n🏔 Skipping elevation (SKIP_ELEVATION=1)');
  } else {
    console.log('\n🏔 Fetching elevations...');
  }
  const validCoords = SKIP_ELEVATION ? [] : spots.filter(s => s.latitude && s.longitude);
  if (!SKIP_ELEVATION) console.log(`  ${validCoords.length} spots with coordinates`);

  const elevations = SKIP_ELEVATION ? [] : await fetchElevations(
    validCoords.map(s => ({ lat: s.latitude, lng: s.longitude }))
  );

  let elevationVotes = 0;
  for (let i = 0; i < validCoords.length; i++) {
    const spot = validCoords[i];
    const elev = elevations[i];
    if (elev === null || elev === undefined) continue;

    const existingMatches = spotMatches.get(spot.id) || new Set();
    const text = (spot.name || '') + ' ' + (spot.address || '');

    // High mountain > 3000m
    if (elev > 3000) {
      if (!existingMatches.has('high_mountain') && keyToId['high_mountain']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'high_mountain', source: `elevation:${elev}m` });
        existingMatches.add('high_mountain');
        elevationVotes++;
      }
      if (!existingMatches.has('mountain_view') && keyToId['mountain_view']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'mountain_view', source: `elevation:${elev}m` });
        existingMatches.add('mountain_view');
        elevationVotes++;
      }
    }
    // Mountain > 1500m
    else if (elev > 1500) {
      if (!existingMatches.has('mountain_view') && keyToId['mountain_view']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'mountain_view', source: `elevation:${elev}m` });
        existingMatches.add('mountain_view');
        elevationVotes++;
      }
      if (!existingMatches.has('sea_of_clouds') && keyToId['sea_of_clouds']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'sea_of_clouds', source: `elevation:${elev}m` });
        existingMatches.add('sea_of_clouds');
        elevationVotes++;
      }
    }
    // Mountain > 800m
    else if (elev > 800) {
      if (!existingMatches.has('mountain_view') && keyToId['mountain_view']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'mountain_view', source: `elevation:${elev}m` });
        existingMatches.add('mountain_view');
        elevationVotes++;
      }
    }

    // Low altitude + coastal address → ocean_view
    if (elev < 50) {
      const isCoastal = COASTAL_KEYWORDS.some(kw => text.includes(kw));
      if (isCoastal && !existingMatches.has('ocean_view') && keyToId['ocean_view']) {
        matchResults.push({ spot_id: spot.id, feature_key: 'ocean_view', source: `elevation:${elev}m+coastal` });
        existingMatches.add('ocean_view');
        elevationVotes++;
      }
    }

    if (existingMatches.size > 0) {
      spotMatches.set(spot.id, existingMatches);
    }
  }

  console.log(`  Elevation-based votes: ${elevationVotes}`);

  // 5. Statistics
  console.log('\n📊 Statistics:');
  console.log(`  Total votes to upsert: ${matchResults.length}`);
  console.log(`  Spots with matches: ${spotMatches.size} / ${spots.length}`);

  // Feature breakdown
  const featureCount = {};
  matchResults.forEach(r => {
    featureCount[r.feature_key] = (featureCount[r.feature_key] || 0) + 1;
  });
  const sorted = Object.entries(featureCount).sort((a, b) => b[1] - a[1]);
  console.log('\n  Top features:');
  sorted.forEach(([key, count]) => {
    console.log(`    ${key}: ${count}`);
  });

  // Sample matches
  console.log('\n  Sample matches (first 10):');
  matchResults.slice(0, 10).forEach(r => {
    const spot = spots.find(s => s.id === r.spot_id);
    console.log(`    ${spot?.name} → ${r.feature_key} (${r.source})`);
  });

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete. Set DRY_RUN=0 or remove DRY_RUN to write.');
    return;
  }

  // 6. Write to DB
  console.log('\n✏️ Writing to database...');
  
  const records = matchResults.map(r => ({
    spot_id: r.spot_id,
    feature_id: keyToId[r.feature_key],
    user_id: SYSTEM_USER_ID,
    vote: true,
  }));

  let written = 0;
  let errors = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    try {
      await supaFetch('feature_votes?on_conflict=spot_id,feature_id,user_id', {
        method: 'POST',
        body: JSON.stringify(batch),
        prefer: 'resolution=ignore-duplicates',
      });
      written += batch.length;
      process.stdout.write(`\r  Progress: ${written}/${records.length}`);
    } catch (e) {
      console.error(`\n  ❌ Batch error at ${i}: ${e.message}`);
      errors++;
      if (errors >= 3) {
        console.error('  Too many errors, stopping.');
        break;
      }
    }
  }

  console.log(`\n\n✅ Done!`);
  console.log(`  Written: ${written} feature_votes`);
  console.log(`  Covering: ${spotMatches.size} spots`);
  console.log(`  Errors: ${errors}`);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
