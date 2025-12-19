module.exports = {
  transpileDependencies: ['vuetify'],
  lintOnSave: false, // ESLint 에러를 빌드 시 무시
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '<Your new title>'; // Replace your title here
      return args;
    });
  },
  // publicPath: "./",
  // productionSourceMap: false,
  // assetsDir: "../static",
  // outputDir: "../static",
  // indexPath: "../templates/index.html",

  // 개발 서버 설정 추가
  devServer: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 8080,
    server: 'http',
    hot: process.env.NODE_ENV === 'local',
    liveReload: process.env.NODE_ENV === 'local',
    webSocketServer: process.env.NODE_ENV === 'local' ? 'ws' : false,
  },

  // PWA 설정 추가
  pwa: {
    name: '두기고',
    themeColor: '#7EA394',
    msTileColor: '#7EA394',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // Workbox 모드 설정 (GenerateSW로 명시적 설정)
    workboxPluginMode: 'GenerateSW',

    // Workbox 옵션
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,

      // 버전 정보는 캐싱에서 제외
      navigateFallback: '/index.html',

      // 런타임 캐싱 설정
      runtimeCaching: [
        // 1. Members API는 항상 네트워크에서 최신 데이터 가져오기
        {
          urlPattern: new RegExp('.*/organizations/.*/members.*'),
          handler: 'NetworkOnly',
        },
        // 2. 이미지 파일은 적극적으로 캐싱 (CacheFirst)
        {
          urlPattern: new RegExp('^https://.*\\.(png|jpg|jpeg|svg|gif|webp)$'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
            },
          },
        },
        // 3. 기타 API는 NetworkFirst로 최신 데이터 우선, 오프라인 대응
        {
          urlPattern: new RegExp('^https://'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10, // 10초 타임아웃
            expiration: {
              maxAgeSeconds: 5 * 60, // 5분으로 단축 (기존 1시간에서 변경)
              maxEntries: 50,
            },
          },
        },
      ],

      // version.json 파일은 항상 네트워크에서 가져오도록 설정
      exclude: [/version\.json$/],
    },

    // manifest.json 설정
    manifestOptions: {
      background_color: '#FFFFFF',
    },
  },

  // 파일명에 해시 추가하여 캐시 무효화
  filenameHashing: true,
};
