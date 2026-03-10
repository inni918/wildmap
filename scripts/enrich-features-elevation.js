#!/usr/bin/env node
/**
 * enrich-features-elevation.js
 * 
 * Phase 2: Elevation-based feature enrichment.
 * Fetches elevations from Open-Meteo API with caching to avoid rate limits.
 * If cache incomplete, can be run multiple times to gradually fill.
 * 
 * Usage:
 *   DRY_RUN=1 node scripts/enrich-features-elevation.js   # dry run
 *   node scripts/enrich-features-elevation.js               # write
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';
const DRY_RUN = process.env.DRY_RUN === '1';
const BATCH_SIZE = 100;
const CACHE_FILE = path.join(__dirname, '.elevation-cache.json');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Coastal keywords for low-altitude ocean_view inference
const COASTAL_KEYWORDS = [
  '海邊', '海岸', '海濱', '濱海', '臨海',
  '漁港', '漁村', '港口',
  '墾丁', '蘭嶼', '綠島', '小琉球', '金門',
  '澎湖', '馬祖', '東引',
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
];

async function supaFetch(urlPath, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${urlPath}`, {
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
    throw new Error(`Supabase ${urlPath}: ${res.status} ${text.substring(0, 200)}`);
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

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch { return {}; }
}
function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache));
}

async function fetchElevationBatch(coords) {
  // Use opentopodata.org (SRTM 90m dataset, free, max 100 locations per request)
  // Rate limit: 1 request/second for the free tier
  const locations = coords.map(c => `${c.lat},${c.lng}`).join('|');
  const url = `https://api.opentopodata.org/v1/srtm90m?locations=${locations}`;
  const res = await fetch(url);
  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (data.status !== 'OK') throw new Error(`API error: ${data.error || data.status}`);
  return data.results.map(r => r.elevation);
}

async function main() {
  console.log(DRY_RUN ? '🔍 DRY RUN MODE\n' : '🚀 WRITE MODE\n');

  console.log('📥 Fetching data...');
  const spots = await fetchAll('spots', 'id,name,address,latitude,longitude');
  const featureDefs = await fetchAll('feature_definitions', 'id,key');
  const keyToId = {};
  featureDefs.forEach(f => { keyToId[f.key] = f.id; });
  console.log(`  ${spots.length} spots, ${featureDefs.length} features`);

  // Load cache
  const cache = loadCache();
  console.log(`  Elevation cache: ${Object.keys(cache).length} entries`);

  // Find uncached spots
  const uncached = spots.filter(s => {
    if (!s.latitude || !s.longitude) return false;
    return !((`${s.latitude},${s.longitude}`) in cache);
  });
  console.log(`  Need to fetch: ${uncached.length} spots`);

  // Fetch elevations with careful rate limiting
  if (uncached.length > 0) {
    console.log('\n🏔 Fetching elevations from opentopodata.org (batches of 100, 1.5s delay)...');
    const ELEV_BATCH = 100;
    let fetched = 0;
    let rateLimitStreak = 0;
    
    for (let i = 0; i < uncached.length; i += ELEV_BATCH) {
      const batch = uncached.slice(i, i + ELEV_BATCH);
      const coords = batch.map(s => ({ lat: s.latitude, lng: s.longitude }));
      
      try {
        const elevations = await fetchElevationBatch(coords);
        batch.forEach((s, idx) => {
          cache[`${s.latitude},${s.longitude}`] = elevations[idx];
        });
        fetched += batch.length;
        rateLimitStreak = 0;
        process.stdout.write(`\r  Progress: ${fetched}/${uncached.length}`);
        
        if (fetched % 200 === 0) saveCache(cache);
        if (i + ELEV_BATCH < uncached.length) {
          await new Promise(r => setTimeout(r, 1500)); // 1.5s between batches
        }
      } catch (e) {
        if (e.message === 'RATE_LIMITED') {
          rateLimitStreak++;
          if (rateLimitStreak >= 3) {
            console.log(`\n  ⚠ Persistent rate limiting. Saved ${fetched} entries. Run again later.`);
            break;
          }
          console.log(`\n  ⏳ Rate limited, waiting 70s... (${rateLimitStreak}/3)`);
          await new Promise(r => setTimeout(r, 70000));
          i -= ELEV_BATCH; // retry
          continue;
        }
        console.warn(`\n  ⚠ Error: ${e.message}`);
      }
    }
    console.log('');
    saveCache(cache);
    console.log(`  Cache: ${Object.keys(cache).length} entries total`);
  }

  // Build elevation votes (only for cached spots)
  console.log('\n📊 Processing elevation data...');
  
  // Get existing votes
  const existingVotes = await fetchAll('feature_votes', 'spot_id,feature_id,user_id');
  const existingSet = new Set(existingVotes.map(v => `${v.spot_id}:${v.feature_id}:${v.user_id}`));
  console.log(`  Existing votes: ${existingVotes.length}`);

  const matchResults = [];
  const spotIds = new Set();

  for (const spot of spots) {
    if (!spot.latitude || !spot.longitude) continue;
    const elev = cache[`${spot.latitude},${spot.longitude}`];
    if (elev === undefined || elev === null) continue;

    const text = (spot.name || '') + ' ' + (spot.address || '');
    
    const addVote = (featureKey) => {
      if (!keyToId[featureKey]) return;
      const k = `${spot.id}:${keyToId[featureKey]}:${SYSTEM_USER_ID}`;
      if (existingSet.has(k)) return;
      existingSet.add(k);
      matchResults.push({ spot_id: spot.id, feature_id: keyToId[featureKey], feature_key: featureKey, elevation: elev });
      spotIds.add(spot.id);
    };

    if (elev > 3000) {
      addVote('high_mountain');
      addVote('mountain_view');
    } else if (elev > 1500) {
      addVote('mountain_view');
      addVote('sea_of_clouds');
    } else if (elev > 800) {
      addVote('mountain_view');
    }

    if (elev < 50 && COASTAL_KEYWORDS.some(kw => text.includes(kw))) {
      addVote('ocean_view');
    }
  }

  // Stats
  const featureCount = {};
  matchResults.forEach(r => { featureCount[r.feature_key] = (featureCount[r.feature_key] || 0) + 1; });
  
  console.log(`\n  New elevation votes: ${matchResults.length} across ${spotIds.size} spots`);
  Object.entries(featureCount).sort((a,b) => b[1]-a[1]).forEach(([k,c]) => console.log(`    ${k}: ${c}`));

  if (matchResults.length === 0) {
    console.log('\n✅ No new votes to write.');
    return;
  }

  // Samples
  console.log('\n  Samples:');
  matchResults.slice(0, 10).forEach(r => {
    const s = spots.find(sp => sp.id === r.spot_id);
    console.log(`    ${s?.name} → ${r.feature_key} (${r.elevation}m)`);
  });

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete.');
    return;
  }

  // Write
  console.log('\n✏️ Writing...');
  const records = matchResults.map(r => ({
    spot_id: r.spot_id, feature_id: r.feature_id, user_id: SYSTEM_USER_ID, vote: true
  }));

  let written = 0, errors = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    try {
      await supaFetch('feature_votes?on_conflict=spot_id,feature_id,user_id', {
        method: 'POST', body: JSON.stringify(batch), prefer: 'resolution=ignore-duplicates',
      });
      written += batch.length;
      process.stdout.write(`\r  ${written}/${records.length}`);
    } catch (e) {
      console.error(`\n  ❌ ${e.message}`);
      if (++errors >= 3) break;
    }
  }

  console.log(`\n\n✅ Written ${written} elevation votes across ${spotIds.size} spots (errors: ${errors})`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
