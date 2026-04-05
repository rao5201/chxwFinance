// 缓存名称
const CACHE_NAME = 'tea-sea-shrimp-king-v1';

// 需要缓存的资源
const urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.8/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap'
];

// 不缓存的请求路径
const noCachePaths = [
  '/api/',
  '/auth/',
  '/login',
  '/register',
  '/logout',
  '*.json',
  '*.xml',
  '*.pdf'
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  // 立即激活，跳过等待
  self.skipWaiting();
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 控制所有客户端
  event.waitUntil(
    clients.claim()
  );
});

// 检查是否需要缓存
function shouldCache(request) {
  const url = new URL(request.url);
  
  // 不缓存非GET请求
  if (request.method !== 'GET') {
    return false;
  }
  
  // 不缓存敏感路径
  for (const path of noCachePaths) {
    if (url.pathname.includes(path) || url.href.includes(path)) {
      return false;
    }
  }
  
  return true;
}

// 处理网络请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有响应，则返回缓存
        if (response) {
          return response;
        }
        
        // 否则，发起网络请求
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 检查是否需要缓存
            if (shouldCache(event.request)) {
              // 克隆响应，因为响应流只能使用一次
              const responseToCache = response.clone();
              
              // 将响应添加到缓存
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return response;
          })
          .catch(() => {
            // 如果网络请求失败，返回离线页面或其他默认内容
            if (event.request.mode === 'navigate') {
              return caches.match('index.html');
            }
          });
      })
  );
});

// 处理消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 定期清理过期缓存
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cleanup') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  }
});