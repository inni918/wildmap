// scripts/run-migration-045.mjs
// 使用 pg 套件直連 PostgreSQL 執行 Migration 045
import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set')
  process.exit(1)
}

// Supabase PostgreSQL 連線
// 格式：postgresql://postgres.[project-ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
// project-ref: gwopbfqgtwrqgrhgpepx
// 嘗試用 service_role JWT 作為密碼（Supabase 允許此方式）
const connectionString = `postgresql://postgres.gwopbfqgtwrqgrhgpepx:${SERVICE_ROLE_KEY}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

const sqlFile = join(__dirname, '../supabase/migrations/045_comment_likes_and_rating_unique.sql')
const sql = readFileSync(sqlFile, 'utf8')

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

try {
  console.log('🔌 連接 PostgreSQL...')
  await client.connect()
  console.log('✅ 已連接')

  console.log('🚀 執行 Migration 045...')
  await client.query(sql)
  console.log('✅ Migration 045 完成！')
} catch (err) {
  console.error('❌ 錯誤:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
