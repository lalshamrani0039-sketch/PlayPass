/* PlayPass service worker — clean version */
const CACHE = "playpass-v4";
const CORE = [
  "./",
  "index.html",
  "about.html",
  "offline.html",
  "manifest.webmanifest",
  "icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png",
  "css/style.css",
  "js/seed.js",
  "js/store.js",
  "js/app.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  
  // network-first للصفحات HTML (دائماً contenu حديث)
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(m => m || caches.match("offline.html")))
    );
    return;
  }
  
  // cache-first للأصول الثابتة (CSS/JS/صور)
  e.respondWith(
    caches.match(req).then(m => m || fetch(req))
  );
});
