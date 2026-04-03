/**
 * 茶海虾王@金融交易所看板平台 - 移动端优化配置
 * 包含响应式设计、触摸优化、性能优化等
 */

const { logger } = require('./logger');

// 移动端优化配置
const mobileConfig = {
  // 响应式设计
  responsive: {
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400
    },
    layout: {
      mobile: {
        headerHeight: 56,
        footerHeight: 60,
        sidebarWidth: 280,
        contentPadding: 16
      },
      tablet: {
        headerHeight: 64,
        footerHeight: 70,
        sidebarWidth: 300,
        contentPadding: 20
      },
      desktop: {
        headerHeight: 72,
        footerHeight: 80,
        sidebarWidth: 320,
        contentPadding: 24
      }
    }
  },
  
  // 触摸优化
  touch: {
    touchTarget: {
      minSize: 44, // 最小触摸目标尺寸（像素）
      spacing: 8 // 触摸目标间距
    },
    gestures: {
      enabled: true,
      swipeThreshold: 50, // 滑动阈值
      longPressThreshold: 500, // 长按阈值
      doubleTapThreshold: 300 // 双击阈值
    },
    scroll: {
      momentum: true,
      bounce: true,
      deceleration: 0.001 // 滚动减速
    }
  },
  
  // 性能优化
  performance: {
    imageOptimization: {
      enabled: true,
      responsive: true,
      lazyLoading: true,
      formats: ['webp', 'avif', 'jpg'],
      compression: {
        quality: 85,
        maxWidth: 1200
      }
    },
    resourceHints: {
      preload: true,
      prefetch: true,
      preconnect: true
    },
    codeSplitting: {
      enabled: true,
      chunks: {
        vendor: true,
        runtime: true,
        common: true
      }
    },
    caching: {
      staticAssets: true,
      apiResponses: true,
      maxAge: 86400 // 24小时
    }
  },
  
  // PWA配置
  pwa: {
    enabled: true,
    manifest: {
      name: '茶海虾王金融交易所',
      short_name: '茶海虾王',
      description: '专业金融交易看板平台',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#007bff',
      icons: [
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    serviceWorker: {
      enabled: true,
      cache: {
        static: true,
        dynamic: true,
        maxSize: 50 * 1024 * 1024 // 50MB
      }
    }
  },
  
  // 安全配置
  security: {
    contentSecurityPolicy: {
      defaultSrc: "'self'",
      scriptSrc: "'self' 'unsafe-inline'",
      styleSrc: "'self' 'unsafe-inline'",
      imgSrc: "'self' data: https:",
      fontSrc: "'self' https: data:",
      connectSrc: "'self' https:",
      frameSrc: "'none'",
      objectSrc: "'none'",
      baseUri: "'self'",
      formAction: "'self'"
    },
    permissions: {
      notifications: {
        enabled: true,
        promptOnFirstVisit: false
      },
      location: {
        enabled: false,
        promptOnFirstVisit: false
      },
      camera: {
        enabled: false,
        promptOnFirstVisit: false
      },
      microphone: {
        enabled: false,
        promptOnFirstVisit: false
      }
    }
  },
  
  // 无障碍配置
  accessibility: {
    enabled: true,
    screenReader: {
      enabled: true,
      labels: true,
      roles: true
    },
    keyboardNavigation: {
      enabled: true,
      focusTrap: true,
      skipLinks: true
    },
    contrast: {
      minimum: 4.5, // WCAG AA标准
      enhanced: 7.0 // WCAG AAA标准
    }
  },
  
  // 国际化
  i18n: {
    enabled: true,
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en-US'],
    fallbackLocale: 'zh-CN'
  },
  
  // 分析和监控
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackEvents: true,
    trackPerformance: true,
    trackErrors: true
  }
};

// 移动端优化中间件
const mobileMiddleware = {
  // 响应式布局中间件
  responsiveLayout: (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    req.device = {
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      userAgent
    };
    
    res.locals.device = req.device;
    next();
  },
  
  // 图像优化中间件
  imageOptimization: (req, res, next) => {
    if (req.path.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
      // 这里可以添加图像优化逻辑
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
    next();
  },
  
  // 资源提示中间件
  resourceHints: (req, res, next) => {
    // 添加预连接提示
    res.setHeader('Link', [
      '<https://fonts.googleapis.com>; rel=preconnect',
      '<https://fonts.gstatic.com>; rel=preconnect',
      '<https://api.tea-sea-shrimp-king.com>; rel=preconnect'
    ].join(','));
    next();
  },
  
  // 安全头部中间件
  securityHeaders: (req, res, next) => {
    // Content Security Policy
    const csp = Object.entries(mobileConfig.security.contentSecurityPolicy)
      .map(([directive, value]) => `${directive} ${value}`)
      .join('; ');
    
    res.setHeader('Content-Security-Policy', csp);
    
    // 其他安全头部
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  },
  
  // PWA中间件
  pwa: (req, res, next) => {
    if (req.path === '/manifest.json') {
      res.setHeader('Content-Type', 'application/manifest+json');
      res.json(mobileConfig.pwa.manifest);
    } else if (req.path === '/service-worker.js') {
      res.setHeader('Content-Type', 'application/javascript');
      const serviceWorkerContent = generateServiceWorker();
      res.send(serviceWorkerContent);
    } else {
      next();
    }
  },
  
  // 性能监控中间件
  performance: (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // 记录性能指标
      if (mobileConfig.analytics.enabled && mobileConfig.analytics.trackPerformance) {
        console.log(`⏱️ ${req.method} ${req.path} - ${duration}ms`);
      }
    });
    
    next();
  },
  
  // 错误处理中间件
  errorHandler: (err, req, res, next) => {
    console.error('❌ 错误:', err);
    
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// 生成Service Worker
function generateServiceWorker() {
  return `
// Service Worker for 茶海虾王金融交易所

const CACHE_NAME = 'tea-sea-shrimp-king-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

//  fetch事件
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// 同步数据
async function syncData() {
  try {
    // 同步数据逻辑
    console.log('Syncing data...');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
`;
}

// 移动端优化管理器
const mobileOptimizationManager = {
  mobileConfig,
  mobileMiddleware,
  
  // 初始化
  initialize(app) {
    // 应用中间件
    app.use(mobileMiddleware.responsiveLayout);
    app.use(mobileMiddleware.imageOptimization);
    app.use(mobileMiddleware.resourceHints);
    app.use(mobileMiddleware.securityHeaders);
    app.use(mobileMiddleware.pwa);
    app.use(mobileMiddleware.performance);
    app.use(mobileMiddleware.errorHandler);
    
    // 确保图标目录存在
    const fs = require('fs');
    const path = require('path');
    const iconsDir = path.join(__dirname, '..', 'public', 'icons');
    
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
      console.log('✅ 图标目录已创建');
    }
    
    console.log('✅ 移动端优化系统已初始化');
  },
  
  // 获取设备信息
  getDeviceInfo(req) {
    return req.device || {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      userAgent: req.headers['user-agent'] || ''
    };
  },
  
  // 生成响应式配置
  getResponsiveConfig(deviceType) {
    return mobileConfig.responsive.layout[deviceType] || mobileConfig.responsive.layout.desktop;
  },
  
  // 检查是否为移动设备
  isMobile(userAgent) {
    return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  },
  
  // 检查是否为平板
  isTablet(userAgent) {
    return /iPad|Android(?!.*Mobile)/i.test(userAgent);
  }
};