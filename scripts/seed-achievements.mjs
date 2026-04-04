import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const achievements = JSON.parse(
  readFileSync(join(__dirname, '../supabase/seed-achievements.json'), 'utf-8')
)

const { error } = await supabase
  .from('achievements')
  .upsert(achievements, { onConflict: 'code' })

if (error) {
  console.error('Error:', error)
  process.exit(1)
}
console.log(`✅ 匯入 ${achievements.length} 個成就`)
