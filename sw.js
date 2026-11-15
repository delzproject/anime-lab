const CACHE = "neon-lab-v7";
const FILES = ["./","./index.html","./manifest.json","./animasi2.mp4","./icon4.jpg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE ? caches.delete(k) : null))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.url.startsWith("http") && !e.request.url.includes(self.location.host)) return;
  e.respondWith(caches.match(e.request).then((cached) => {
    if (cached) return cached;
    return fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(e.request, copy));
      return res;
    }).catch(() => caches.match("./index.html"));
  }));
});
