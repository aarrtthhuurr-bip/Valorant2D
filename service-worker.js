const CACHE_VERSION = "valorant2d-shell-v0.9.4";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest?v=0.9.4",
  "./styles.css?v=0.9.4",
  "./version-manager.js?v=0.9.4",
  "./game.js?v=0.9.4",
  "./updates.json?v=0.9.4",
  "./assets/Favicon/android-chrome-192x192.png",
  "./assets/Favicon/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.registration.navigationPreload?.enable?.(),
      caches.keys()
        .then((keys) => Promise.all(
          keys
            .filter((key) => key.startsWith("valorant2d-shell-") && key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        )),
    ])
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      event.preloadResponse
        .then((preloaded) => preloaded || fetch(request, { cache: "no-store" }))
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html")),
    );
    return;
  }

  // O changelog deve refletir a versão publicada mesmo que o jogador possua
  // uma instalação antiga do PWA.
  if (requestUrl.pathname.endsWith("/updates.json")) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (
          (await caches.match(request))
          || (await caches.match(request, { ignoreSearch: true }))
          || Response.error()
        )),
    );
    return;
  }

  // Arquivos que controlam toda a aparência e execução usam network-first.
  // Assim, uma entrada antiga ou incompleta nunca mantém o jogo preso ao HTML.
  if (request.destination === "style" || request.destination === "script") {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (
          (await caches.match(request))
          || (await caches.match(request, { ignoreSearch: true }))
          || Response.error()
        )),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
