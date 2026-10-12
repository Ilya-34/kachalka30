/* Офлайн-кэш: страница берётся из сети (чтобы обновления доходили сразу), без сети открывается из кэша. */
const V = 'k30-v13';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-g-192.png",
  "./fonts/ps2p-cyrillic.woff2",
  "./fonts/ps2p-latin.woff2",
  "./fonts/rubik-cyrillic.woff2",
  "./fonts/rubik-latin.woff2",
  "./img/boris_flex.png",
  "./img/boris_flex_s.png",
  "./img/boris_idle_s.png",
  "./img/boris_phone_s.png",
  "./img/boris_point_s.png",
  "./img/boris_walk_s.png",
  "./img/girl_flex.png",
  "./img/girl_flex_s.png",
  "./img/girl_idle_s.png",
  "./img/girl_phone_s.png",
  "./img/girl_point_s.png",
  "./img/girl_walk_s.png",
  "./img/gscene_bench_m.png",
  "./img/gscene_pull_m.png",
  "./img/gscene_squat_m.png",
  "./img/gscene_tired_m.png",
  "./img/scene_bench_m.png",
  "./img/scene_pull_m.png",
  "./img/scene_squat_m.png",
  "./img/scene_tired_m.png"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  const same = u.origin === location.origin;
  if (!same) return;

  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then(res => { const cp = res.clone(); caches.open(V).then(c => c.put('./index.html', cp)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(hit => hit || fetch(r).then(res => {
      if (res.ok || res.type === 'opaque') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    }))
  );
});
