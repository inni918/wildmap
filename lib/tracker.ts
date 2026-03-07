'use client'

import { supabase } from './supabase'

// ====== 常量 ======
const BUFFER_KEY = 'wm_event_buffer'
const SESSION_KEY = 'wm_session_id'
const FLUSH_INTERVAL = 30_000 // 30 秒
const MAX_BUFFER_SIZE = 10 // 滿 10 筆就送

// map_move 節流：每 10 秒最多 1 筆
const MAP_MOVE_THROTTLE = 10_000
let lastMapMoveTime = 0

// ====== Types ======
interface TrackEvent {
  event_type: string
  spot_id?: string
  metadata?: Record<string, unknown>
}

interface BufferedEvent {
  session_id: string
  event_type: string
  spot_id: string | null
  metadata: Record<string, unknown>
  device: Record<string, unknown>
  created_at: string
}

// ====== Session ID（per tab） ======
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

// ====== 裝置資訊（只算一次） ======
let deviceInfo: Record<string, unknown> | null = null
function getDeviceInfo(): Record<string, unknown> {
  if (deviceInfo) return deviceInfo
  if (typeof window === 'undefined') return {}
  const ua = navigator.userAgent
  deviceInfo = {
    type: /Mobile|Android/i.test(ua) ? 'mobile' : 'desktop',
    screen_width: window.innerWidth,
    is_pwa: window.matchMedia('(display-mode: standalone)').matches,
  }
  return deviceInfo
}

// ====== Buffer 操作 ======
function getBuffer(): BufferedEvent[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(BUFFER_KEY) || '[]')
  } catch {
    return []
  }
}

function setBuffer(buffer: BufferedEvent[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BUFFER_KEY, JSON.stringify(buffer))
  } catch {
    // localStorage 滿了就放棄
  }
}

function clearBuffer() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(BUFFER_KEY)
}

// ====== 核心：track ======
export function track(event: TrackEvent) {
  if (typeof window === 'undefined') return

  // 檢查 cookie consent
  if (!localStorage.getItem('wildmap_cookie_consent')) return

  // map_move 節流
  if (event.event_type === 'map_move') {
    const now = Date.now()
    if (now - lastMapMoveTime < MAP_MOVE_THROTTLE) return
    lastMapMoveTime = now
  }

  const entry: BufferedEvent = {
    session_id: getSessionId(),
    event_type: event.event_type,
    spot_id: event.spot_id || null,
    metadata: event.metadata || {},
    device: getDeviceInfo(),
    created_at: new Date().toISOString(),
  }

  const buffer = getBuffer()
  buffer.push(entry)
  setBuffer(buffer)

  if (buffer.length >= MAX_BUFFER_SIZE) {
    flush()
  }
}

// ====== Flush：批次寫入 Supabase ======
let flushing = false

async function flush() {
  if (typeof window === 'undefined') return
  if (flushing) return

  const buffer = getBuffer()
  if (buffer.length === 0) return

  flushing = true
  clearBuffer()

  try {
    // 取得當前登入用戶（如果有的話）
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id || null

    const events = buffer.map((e) => ({
      ...e,
      user_id: userId,
    }))

    const { error } = await supabase.from('user_events').insert(events)

    if (error) {
      // 寫入失敗，放回 buffer（避免資料遺失）
      const currentBuffer = getBuffer()
      setBuffer([...buffer, ...currentBuffer])
    }
  } catch {
    // 網路錯誤，放回 buffer
    const currentBuffer = getBuffer()
    setBuffer([...buffer, ...currentBuffer])
  } finally {
    flushing = false
  }
}

// ====== 初始化：定時 flush + 頁面離開 flush ======
let initialized = false

export function initTracker() {
  if (typeof window === 'undefined') return
  if (initialized) return
  initialized = true

  // 定時 flush
  setInterval(() => {
    flush()
  }, FLUSH_INTERVAL)

  // 頁面離開時 flush（visibilitychange 比 beforeunload 更可靠）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush()
    }
  })
}
