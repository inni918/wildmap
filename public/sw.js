// Wildmap Service Worker
const CACHE_NAME = 'wildmap-v1';
const OFFLINE_URL = '/offline.html';

// 靜態資源 — cache-first
const PRECACHE_URLS = [
  '/',
  '/map',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/logo/wildmap-logo.svg',
];

// Install: 預先快取靜態資源 + 離線頁面
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: 清除舊版本快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch 策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理 GET 請求
  if (request.method !== 'GET') return;

  // ─── 網路優先：Supabase API ───
  if (url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ─── 網路優先：地圖瓦片（常見 tile server 域名）───
  if (
    url.hostname.includes('tile') ||
    url.hostname.includes('openstreetmap') ||
    url.hostname.includes('mapbox') ||
    url.hostname.includes('maptiler') ||
    url.hostname.includes('googleapis.com/maps') ||
    url.pathname.includes('/tiles/')
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // ─── Cache-first：靜態資源（JS、CSS、圖片、字型）───
  event.respondWith(cacheFirst(request));
});

// Cache-first 策略
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // 快取成功的同源回應
    if (response.ok && new URL(request.url).origin === self.location.origin) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // 導覽請求失敗時回傳離線頁面
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Offline', { status: 503 });
  }
}

// 網路優先策略（短暫快取，5 分鐘過期檢查）
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // 快取一份，但下次仍優先用網路
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Offline', { status: 503 });
  }
}
