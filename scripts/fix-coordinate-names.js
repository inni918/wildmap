#!/usr/bin/env node
/**
 * 修復車宿泊點名稱為座標格式的資料
 * 名稱符合 "數字.數字, 數字.數字" 格式的 → 用 address 或「車宿泊點 #N」替代
 *
 * 用法：node scripts/fix-coordinate-names.js [--dry-run]
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// 手動讀取 .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ 找不到 .env.local')
    process.exit(1)
  }
  const content = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    // 移除引號
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 NEXT_PUBLIC_SUPABASE_URL 或 SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 正則：名稱是座標格式（如 "23.456, 120.789" 或 "23.456,120.789"）
const COORD_REGEX = /^\s*-?\d+\.\d+\s*,\s*-?\d+\.\d+\s*$/

const dryRun = process.argv.includes('--dry-run')

async function main() {
  console.log(dryRun ? '🔍 DRY RUN 模式（不會實際修改）\n' : '🔧 開始修復座標格式名稱...\n')

  // 撈出所有 spots
  const { data: spots, error } = await supabase
    .from('spots')
    .select('id, name, address, category, latitude, longitude')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('❌ 查詢失敗:', error.message)
    process.exit(1)
  }

  // 篩選名稱為座標格式的
  const coordSpots = spots.filter(s => COORD_REGEX.test(s.name))

  if (coordSpots.length === 0) {
    console.log('✅ 沒有找到名稱為座標格式的地點，無需修改！')
    return
  }

  console.log(`找到 ${coordSpots.length} 筆名稱為座標格式的地點：\n`)

  let counter = 1
  const updates = []

  for (const spot of coordSpots) {
    let newName

    // 優先使用 address
    if (spot.address && spot.address.trim() && !COORD_REGEX.test(spot.address)) {
      newName = spot.address.trim()
    } else {
      // 用「車宿泊點 #N」或依照 category
      const categoryPrefix = spot.category === 'carcamp' ? '車宿泊點' : '野營點'
      newName = `${categoryPrefix} #${counter}`
      counter++
    }

    console.log(`  ${spot.id} | 舊：${spot.name} → 新：${newName}`)
    updates.push({ id: spot.id, newName })
  }

  if (dryRun) {
    console.log(`\n🔍 DRY RUN 完成，共 ${updates.length} 筆待修改`)
    console.log('移除 --dry-run 參數以實際執行修改')
    return
  }

  console.log(`\n正在更新 ${updates.length} 筆...`)

  let successCount = 0
  let failCount = 0

  for (const u of updates) {
    const { error: updateError } = await supabase
      .from('spots')
      .update({ name: u.newName })
      .eq('id', u.id)

    if (updateError) {
      console.error(`  ❌ ${u.id}: ${updateError.message}`)
      failCount++
    } else {
      successCount++
    }
  }

  console.log(`\n✅ 完成！成功 ${successCount} 筆，失敗 ${failCount} 筆`)
}

main().catch(console.error)
