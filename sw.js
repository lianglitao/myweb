// 缓存名称（可自定义，更新时修改版本号）
const CACHE_NAME = 'my-profile-v1';
// 需要缓存的资源列表
const CACHE_RESOURCES = [
  '/myweb/index.html',
  '/myweb/intro.html',
  '/myweb/myphoto.jpg',
  '/myweb/manifest.json'
];

// 安装阶段：缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_RESOURCES))
      .then(() => self.skipWaiting()) // 立即激活新的SW
  );
});

// 激活阶段：清除旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // 控制所有打开的页面
  );
});

// 拦截请求：优先从缓存获取，无缓存则联网
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
