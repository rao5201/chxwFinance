/**
 * 茶海虾王@金融交易所看板平台 - 跨平台客户端配置
 * 包含桌面端、移动端、Web端的跨平台开发配置
 */

const { logger } = require('./logger');

// 跨平台配置
const crossPlatformConfig = {
  // 平台支持
  platforms: {
    web: {
      enabled: true,
      features: {
        responsiveDesign: true,
        pwa: true,
        webSocket: true,
        pushNotifications: true,
        offlineMode: true
      }
    },
    desktop: {
      enabled: true,
      features: {
        nativeNotifications: true,
        systemTray: true,
        fileSystemAccess: true,
        autoStart: true,
        multiWindow: true
      },
      platforms: {
        windows: true,
        macos: true,
        linux: true
      }
    },
    mobile: {
      enabled: true,
      features: {
        nativeCamera: true,
        locationServices: false,
        pushNotifications: true,
        biometricAuth: true,
        offlineMode: true
      },
      platforms: {
        ios: true,
        android: true
      }
    }
  },
  
  // 技术栈
  techStack: {
    frontend: {
      framework: 'vue', // vue, react, angular
      stateManagement: 'pinia', // pinia, vuex, redux
      uiLibrary: 'element-plus', // element-plus, ant-design, material-ui
      buildTool: 'vite', // vite, webpack, rollup
      language: 'typescript' // typescript, javascript
    },
    crossPlatform: {
      framework: 'electron', // electron, capacitor, react-native, flutter
      version: '29.0.0',
      autoUpdate: true
    },
    backend: {
      apiVersion: 'v1',
      authStrategy: 'jwt', // jwt, oauth2, session
      cors: true
    }
  },
  
  // 构建配置
  build: {
    output: {
      web: 'dist/web',
      desktop: 'dist/desktop',
      mobile: 'dist/mobile'
    },
    assets: {
      publicPath: '/',
      outputDir: 'assets',
      cacheBusting: true
    },
    optimization: {
      splitChunks: true,
      minify: true,
      sourceMap: false,
      gzip: true
    }
  },
  
  // 部署配置
  deployment: {
    web: {
      hosting: 'github-pages', // github-pages, vercel, netlify, aws-s3
      domain: 'https://rao5201.github.io/chxwFinance/',
      ssl: true,
      cdn: false
    },
    desktop: {
      autoUpdate: true,
      updateServer: 'https://update.tea-sea-shrimp-king.com',
      publishing: {
        windows: {
          store: false,
          installer: true
        },
        macos: {
          appStore: false,
          dmg: true
        },
        linux: {
          snap: false,
          deb: true,
          rpm: true
        }
      }
    },
    mobile: {
      appStores: {
        ios: false,
        android: false
      },
      enterprise: true,
      betaTesting: true
    }
  },
  
  // 功能模块
  modules: {
    auth: {
      enabled: true,
      methods: ['password', 'google', 'wechat', 'github'],
      twoFactor: true
    },
    trading: {
      enabled: true,
      features: ['real-time-data', 'charting', 'order-execution', 'portfolio-management']
    },
    analysis: {
      enabled: true,
      features: ['technical-analysis', 'fundamental-analysis', 'ai-prediction', 'backtesting']
    },
    social: {
      enabled: true,
      features: ['chat', 'comments', 'following', 'communities']
    },
    settings: {
      enabled: true,
      features: ['user-preferences', 'notifications', 'appearance', 'security']
    }
  },
  
  // 性能配置
  performance: {
    web: {
      bundleSize: {
        max: 2 * 1024 * 1024, // 2MB
        gzip: true
      },
      loadingTime: {
        firstContentfulPaint: 2000, // 2秒
        timeToInteractive: 3000 // 3秒
      },
      caching: {
        staticAssets: true,
        apiResponses: true,
        maxAge: 86400 // 24小时
      }
    },
    desktop: {
      memoryUsage: {
        max: 512 * 1024 * 1024, // 512MB
        warning: 256 * 1024 * 1024 // 256MB
      },
      startupTime: 3000, // 3秒
      updateFrequency: 'daily'
    },
    mobile: {
      appSize: {
        max: 50 * 1024 * 1024, // 50MB
        warning: 30 * 1024 * 1024 // 30MB
      },
      batteryUsage: {
        optimization: true,
        backgroundSync: true
      },
      network: {
        offlineMode: true,
        retryStrategy: true
      }
    }
  },
  
  // 安全配置
  security: {
    web: {
      csp: true,
      xssProtection: true,
      cors: true,
      secureHeaders: true
    },
    desktop: {
      sandbox: true,
      contentSecurityPolicy: true,
      updateSignature: true
    },
    mobile: {
      appSigning: true,
      networkSecurity: true,
      dataEncryption: true
    }
  }
};

// 跨平台开发工具配置
const devTools = {
  // 开发服务器
  devServer: {
    web: {
      port: 3000,
      host: 'localhost',
      hot: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
    desktop: {
      port: 3001,
      host: 'localhost',
      hot: true,
      open: true
    },
    mobile: {
      port: 3002,
      host: 'localhost',
      hot: true,
      open: true
    }
  },
  
  // 构建工具
  buildTools: {
    vite: {
      config: {
        base: './',
        build: {
          outDir: 'dist',
          assetsDir: 'assets',
          minify: 'terser',
          sourcemap: false
        },
        server: {
          port: 3000,
          host: true
        }
      }
    },
    electron: {
      config: {
        appId: 'com.tea-sea-shrimp-king.finance',
        productName: '茶海虾王金融交易所',
        version: '1.0.0',
        copyright: 'Copyright © 2024 海南茶海虾王管理有限责任公司',
        directories: {
          output: 'dist/desktop'
        },
        files: [
          'dist/web/**/*',
          'electron/main.js',
          'electron/preload.js'
        ],
        extraResources: [
          {
            from: 'resources',
            to: 'resources'
          }
        ],
        mac: {
          target: ['dmg', 'zip']
        },
        win: {
          target: ['nsis', 'portable']
        },
        linux: {
          target: ['deb', 'rpm', 'AppImage']
        }
      }
    }
  },
  
  // 测试工具
  testing: {
    unit: {
      framework: 'vitest', // vitest, jest, mocha
      coverage: true
    },
    e2e: {
      framework: 'cypress', // cypress, playwright, puppeteer
      browser: 'chrome'
    }
  },
  
  // 代码质量工具
  codeQuality: {
    lint: {
      enabled: true,
      tools: ['eslint', 'prettier', 'stylelint']
    },
    typeCheck: {
      enabled: true,
      tool: 'tsc'
    },
    commitLint: {
      enabled: true,
      config: 'conventional'
    }
  }
};

// 跨平台API配置
const apiConfig = {
  // API基础配置
  base: {
    version: 'v1',
    prefix: '/api',
    timeout: 30000, // 30秒
    retry: 3
  },
  
  // 认证API
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  
  // 交易API
  trading: {
    markets: '/trading/markets',
    symbols: '/trading/symbols',
    quotes: '/trading/quotes',
    orderbook: '/trading/orderbook',
    trades: '/trading/trades',
    orders: '/trading/orders',
    balance: '/trading/balance'
  },
  
  // 分析API
  analysis: {
    indicators: '/analysis/indicators',
    patterns: '/analysis/patterns',
    prediction: '/analysis/prediction',
    backtest: '/analysis/backtest'
  },
  
  // 社交API
  social: {
    posts: '/social/posts',
    comments: '/social/comments',
    messages: '/social/messages',
    notifications: '/social/notifications',
    users: '/social/users',
    communities: '/social/communities'
  },
  
  // 实时数据API
  realtime: {
    ws: 'ws://localhost:8080/ws',
    sse: '/realtime/sse'
  }
};

// 跨平台客户端管理器
const crossPlatformManager = {
  crossPlatformConfig,
  devTools,
  apiConfig,
  
  // 初始化
  initialize() {
    console.log('✅ 跨平台客户端配置已初始化');
  },
  
  // 获取平台配置
  getPlatformConfig(platform) {
    return crossPlatformConfig.platforms[platform] || null;
  },
  
  // 获取技术栈配置
  getTechStackConfig() {
    return crossPlatformConfig.techStack;
  },
  
  // 获取构建配置
  getBuildConfig() {
    return crossPlatformConfig.build;
  },
  
  // 获取部署配置
  getDeploymentConfig() {
    return crossPlatformConfig.deployment;
  },
  
  // 获取功能模块配置
  getModulesConfig() {
    return crossPlatformConfig.modules;
  },
  
  // 获取性能配置
  getPerformanceConfig(platform) {
    return crossPlatformConfig.performance[platform] || null;
  },
  
  // 获取安全配置
  getSecurityConfig(platform) {
    return crossPlatformConfig.security[platform] || null;
  },
  
  // 获取开发工具配置
  getDevToolsConfig() {
    return devTools;
  },
  
  // 获取API配置
  getApiConfig() {
    return apiConfig;
  },
  
  // 生成项目结构
  generateProjectStructure() {
    return {
      root: {
        files: [
          'package.json',
          'vite.config.ts',
          'tsconfig.json',
          '.eslintrc.js',
          '.prettierrc.js',
          'README.md'
        ],
        directories: [
          'src',
          'public',
          'electron',
          'capacitor',
          'tests',
          'resources'
        ]
      },
      src: {
        files: [
          'main.ts',
          'App.vue',
          'router.ts',
          'store.ts'
        ],
        directories: [
          'components',
          'views',
          'composables',
          'services',
          'utils',
          'assets',
          'styles'
        ]
      },
      electron: {
        files: [
          'main.js',
          'preload.js',
          'electron-builder.json'
        ]
      },
      capacitor: {
        files: [
          'capacitor.config.ts'
        ],
        directories: [
          'ios',
          'android'
        ]
      }
    };
  },
  
  // 生成package.json配置
  generatePackageJson() {
    return {
      name: 'tea-sea-shrimp-king',
      version: '1.0.0',
      description: '茶海虾王金融交易所看板平台',
      author: '海南茶海虾王管理有限责任公司',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore',
        type-check: 'vue-tsc --noEmit',
        electron: 'electron .',
        electron:build: 'electron-builder',
        electron:dev: 'vite dev --port 3000 & electron .',
        test: 'vitest',
        test:e2e: 'cypress run'
      },
      dependencies: {
        vue: '^3.4.0',
        vue-router: '^4.2.0',
        pinia: '^2.1.0',
        element-plus: '^2.5.0',
        axios: '^1.6.0',
        socket.io-client: '^4.7.0',
        chart.js: '^4.4.0',
        dayjs: '^1.11.0',
        lodash: '^4.17.0',
        jwt-decode: '^4.0.0'
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.0.0',
        vite: '^5.0.0',
        typescript: '^5.3.0',
        vue-tsc: '^1.8.0',
        eslint: '^8.50.0',
        prettier: '^3.0.0',
        vitest: '^0.34.0',
        cypress: '^13.0.0',
        electron: '^29.0.0',
        electron-builder: '^24.0.0',
        '@electron/asar': '^3.2.0'
      }
    };
  },
  
  // 生成Vite配置
  generateViteConfig() {
    return {
      base: './',
      plugins: [
        '@vitejs/plugin-vue'
      ],
      resolve: {
        alias: {
          '@': '/src'
        }
      },
      server: {
        port: 3000,
        host: true,
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            pathRewrite: {
              '^/api': ''
            }
          }
        }
      },
      build: {
        outDir: 'dist/web',
        assetsDir: 'assets',
        minify: 'terser',
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['vue', 'vue-router', 'pinia'],
              ui: ['element-plus'],
              chart: ['chart.js']
            }
          }
        }
      }
    };
  },
  
  // 生成Electron主进程配置
  generateElectronMain() {
    return `
const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    title: '茶海虾王金融交易所',
    icon: path.join(__dirname, '../public/icons/icon-512x512.png')
  });

  const isDev = process.env.NODE_ENV === 'development';
  const loadURL = isDev 
    ? 'http://localhost:3000' 
    : url.format({
        pathname: path.join(__dirname, '../dist/web/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(loadURL);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, '../public/icons/icon-72x72.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        } else {
          createWindow();
        }
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('茶海虾王金融交易所');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

// IPC通信
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-platform', () => {
  return process.platform;
});
`;
  },
  
  // 生成Electron预加载脚本
  generateElectronPreload() {
    return `
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  isElectron: true
});
`;
  },
  
  // 生成Capacitor配置
  generateCapacitorConfig() {
    return `
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tea-sea-shrimp-king.finance',
  appName: '茶海虾王金融交易所',
  webDir: 'dist/web',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#007bff',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    }
  }
};

export default config;
`;
  }
};

module.exports = crossPlatformManager;