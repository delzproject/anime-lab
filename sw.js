const CACHE = "neon-lab-v8";
const FILES = ["./manifest.json","./animasi2.mp4","./icon4.jpg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE ? caches.delete(k) : null))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (!e.request.url.includes(self.location.host)) return;
  // index.html JANGAN DI-CACHE, biar selalu ambil yang baru
  if (e.request.url.endsWith("/") || e.request.url.includes("index.html")) {
    e.respondWith(fetch(e.request).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request)));
});
