// LIFE OS service worker — offline-first
const CACHE = 'lifeos-v1';
const CORE = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png',
  'learning/krish-ml-6h/index.html', 'learning/ai-arena/index.html',
  'learning/ai-arena/data/quotes.js', 'learning/life-os/routines.md', 'learning/life-os/evidence_time.md',
  'learning/life-os/evidence_psychology.md', 'learning/life-os/evidence_health.md'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks =>
  Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./')))
  );
});
