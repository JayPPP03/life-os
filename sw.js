// LIFE OS service worker — v2: network-first for pages so updates arrive immediately
const CACHE = 'lifeos-v2';
const CORE = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png',
  'learning/krish-ml-6h/index.html', 'learning/ai-arena/index.html',
  'learning/ai-arena/data/quotes.js', 'learning/ai-arena/data/quotes_extra.js',
  'learning/life-os/routines.md', 'learning/life-os/evidence_time.md',
  'learning/life-os/evidence_psychology.md', 'learning/life-os/evidence_health.md',
  'learning/life-os/life_pillars.md', 'learning/life-os/vision_evidence.md'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.mode === 'navigate') {
    // pages: network-first, cache as offline fallback
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then(h => h || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});
