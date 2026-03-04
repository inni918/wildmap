#!/usr/bin/env node
// Generate migration SQL to import ~1,663 unregistered campsites from gov-campsites.csv
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'data', 'gov-campsites.csv');
const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '016_import_unregistered_campsites.sql');

const raw = fs.readFileSync(csvPath, 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());

// Skip header
const rows = lines.slice(1);

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function escSql(s) {
  if (!s) return null;
  return s.replace(/'/g, "''");
}

function fullToHalf(s) {
  if (!s) return s;
  return s.replace(/[\uff10-\uff19]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
          .replace(/\uff0d/g, '-')
          .replace(/\uff08/g, '(')
          .replace(/\uff09/g, ')')
          .replace(/\u3000/g, ' ')
          .trim();
}

function isValidUrl(s) {
  return s && /^https?:\/\//i.test(s.trim());
}

// Detect if a value looks like the legal/illegal status field
function isLegalStatus(s) {
  return s === '符合相關法規露營場' || s === '違反相關法規露營場';
}

const sql = [];
sql.push('-- 016: 匯入未登記（違反相關法規）露營場');
sql.push('-- 來源：gov-campsites.csv 中「違反相關法規露營場」且營業中有經緯度的資料');
sql.push('-- 使用 ON CONFLICT 防止重複匯入');
sql.push('');

// Add unique constraint for dedup (name + lat + lng)
sql.push('-- 加入唯一約束用於防重複（如果不存在）');
sql.push('DO $$ BEGIN');
sql.push("  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'spots_name_lat_lng_unique') THEN");
sql.push('    ALTER TABLE spots ADD CONSTRAINT spots_name_lat_lng_unique UNIQUE (name, latitude, longitude);');
sql.push('  END IF;');
sql.push('END $$;');
sql.push('');

let count = 0;
let skipped = 0;
const seen = new Set();

for (const line of rows) {
  const f = parseCsvLine(line);
  if (f.length < 12) { skipped++; continue; }
  
  const name = f[0].trim();
  const city = f[1].trim();
  const district = f[3].trim();
  const status = f[4].trim();
  const lngStr = f[5].trim();
  const latStr = f[6].trim();
  let address = f[7].trim();
  let phone = fullToHalf(f[8]);
  const mobile = fullToHalf(f[9]);
  let website = (f[10] || '').trim();
  let legalField = (f[11] || '').trim();
  
  // Fix: if website field is empty but field 11 (which should be legal status) contains a URL,
  // that means the website is in field 11 and legal status shifted to field 12
  if (!website && isValidUrl(legalField)) {
    website = legalField;
    legalField = (f[12] || '').trim();
  }
  
  // Also handle: website field has URL concatenated with another URL
  // Take only the first URL if it's valid
  if (website && isValidUrl(website)) {
    // Some URLs are concatenated like "https://a.com/pagehttps://b.com/page"
    // Try to split at the second http
    const secondHttp = website.indexOf('http', 1);
    if (secondHttp > 0) {
      website = website.substring(0, secondHttp);
    }
  }
  
  // Only include 違反相關法規露營場
  if (legalField !== '違反相關法規露營場') continue;
  
  // Only include 營業中
  if (status !== '營業中') continue;
  
  // Must have lat/lng
  const lng = parseFloat(lngStr);
  const lat = parseFloat(latStr);
  if (isNaN(lng) || isNaN(lat) || lng === 0 || lat === 0) { skipped++; continue; }
  
  // Dedup by name + lat + lng
  const key = `${name}|${lat}|${lng}`;
  if (seen.has(key)) { skipped++; continue; }
  seen.add(key);
  
  // Phone: use mobile if phone is empty
  if (!phone && mobile) phone = mobile;
  
  // Address: use city + district if empty
  if (!address) address = `${city}${district}`;
  
  // Website: validate
  if (website && !isValidUrl(website)) website = '';
  
  // Description
  const desc = `${city}${district} — 未登記露營場`;
  
  // Build VALUES
  const nameEsc = escSql(name);
  const addrEsc = escSql(address);
  const descEsc = escSql(desc);
  const phoneEsc = phone ? `'${escSql(phone)}'` : 'NULL';
  const websiteEsc = website ? `'${escSql(website)}'` : 'NULL';
  
  sql.push(`INSERT INTO spots (name, category, latitude, longitude, address, description, phone, website, status, quality, is_free, is_private, gov_certified, view_count)`);
  sql.push(`VALUES ('${nameEsc}', 'camping', ${lat}, ${lng}, '${addrEsc}', '${descEsc}', ${phoneEsc}, ${websiteEsc}, 'published', 'new', false, false, false, 0)`);
  sql.push(`ON CONFLICT (name, latitude, longitude) DO NOTHING;`);
  
  count++;
}

sql.push('');
sql.push(`-- Total: ${count} unregistered campsites imported (${skipped} skipped)`);

fs.writeFileSync(outPath, sql.join('\n') + '\n', 'utf-8');
console.log(`Generated ${outPath}`);
console.log(`  - ${count} INSERT statements`);
console.log(`  - ${skipped} rows skipped`);
