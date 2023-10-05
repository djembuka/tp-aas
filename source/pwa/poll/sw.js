/*const staticCacheName = 'static-cache-v2';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  './',
  './index.html',
  '/template/images/logo-aas-small.svg',
  '/components/pwa/images/android-icon-144x144.png',
  '/components/pwa/images/apple-icon-180x180.png',
  '/components/pwa/style.css',
  '/components/pwa/script.js',
  '/components/poll/style.css',
  '/components/poll/script.js',
  'https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js',
  'https://unpkg.com/vuex@3',
  '/components/poll/store.js',
];*/

self.addEventListener('install', async (e) => {
  //const cache = await caches.open(staticCacheName);
  //await cache.addAll(staticAssets);
});

self.addEventListener('activate', async (e) => {
  /*const cachesKeys = await caches.keys();
  const checkKeys = cachesKeys.map(async (key) => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });
  await Promise.all(checkKeys);*/
});

self.addEventListener('fetch', async (e) => {
  //e.respondWith(checkCache(e.request));
});

/*async function checkCache(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}*/
