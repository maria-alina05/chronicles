const CACHE_NAME = 'zanuff-marabeige-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/game.js',
  './src/constants.js',
  './src/sprites/Player.js',
  './src/sprites/Enemy.js',
  './src/sprites/SpriteFactory.js',
  './src/scenes/BootScene.js',
  './src/scenes/TitleScene.js',
  './src/scenes/CharacterSelectScene.js',
  './src/scenes/LevelSelectScene.js',
  './src/scenes/StoryScene.js',
  './src/scenes/BaseLevel.js',
  './src/scenes/Level1Scene.js',
  './src/scenes/Level2Scene.js',
  './src/scenes/Level3Scene.js',
  './src/scenes/Level4Scene.js',
  './src/scenes/Level5Scene.js',
  './src/scenes/Level6Scene.js',
  './src/scenes/EndingScene.js',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for CDN resources, cache-first for local assets
  if (event.request.url.includes('cdn.jsdelivr.net') || event.request.url.includes('fonts.googleapis.com') || event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
  }
});
