#!/usr/bin/env node
// Generate migration SQL to update certified spots with gov_certified=true and contact info
const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'data', 'gov-campsites.csv');
const outPath = path.join(__dirname, '..', 'supabase', 'migrations', '015_update_certified_spots.sql');

const raw = fs.readFileSync(csvPath, 'utf-8');
const lines = raw.split('\n').filter(l => l.trim());

// Skip header
const header = lines[0];
const rows = lines.slice(1);

function parseCsvLine(line) {
  // Simple CSV parser that handles basic cases
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
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
          .replace(/\u3000/g, ' ');
}

function isValidUrl(s) {
  return s && /^https?:\/\//i.test(s.trim());
}

const sql = [];
sql.push('-- 015: 更新已匯入的合法露營場：設定 gov_certified = true 並補入聯絡資訊');
sql.push('-- 來源：gov-campsites.csv 中「符合相關法規露營場」的資料');
sql.push('');

// First: set all existing camping spots as gov_certified = false (default)
// Then update certified ones
sql.push('-- 先將已匯入的合法露營場（quality = official）標記為 gov_certified = true');
sql.push("UPDATE spots SET gov_certified = true WHERE quality = 'official' AND category = 'camping';");
sql.push('');

// Now update specific spots with phone/website from CSV
let updateCount = 0;
for (const line of rows) {
  const f = parseCsvLine(line);
  if (f.length < 12) continue;
  
  const legalStatus = f[11];
  if (legalStatus !== '符合相關法規露營場') continue;
  
  const name = f[0].trim();
  const phone = fullToHalf(f[8]) || fullToHalf(f[9]) || null; // phone or mobile
  let website = f[10] || null;
  
  // Check if field 11 (website) has URL that shifted to field 12
  if (!website && f[11] && isValidUrl(f[11])) {
    website = f[11];
  }
  
  // Validate website
  if (website && !isValidUrl(website)) {
    website = null;
  }
  
  // Only update if we have something to update
  if (!phone && !website) continue;
  
  const setClauses = [];
  if (phone) setClauses.push(`phone = '${escSql(phone)}'`);
  if (website) setClauses.push(`website = '${escSql(website)}'`);
  
  sql.push(`UPDATE spots SET ${setClauses.join(', ')} WHERE name = '${escSql(name)}' AND category = 'camping' AND quality = 'official';`);
  updateCount++;
}

sql.push('');
sql.push(`-- Total: ${updateCount} spots updated with contact info`);

fs.writeFileSync(outPath, sql.join('\n') + '\n', 'utf-8');
console.log(`Generated ${outPath} with ${updateCount} UPDATE statements`);
