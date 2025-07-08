module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "<Your new title>"; // Replace your title here
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
    allowedHosts: "all",
    host: "0.0.0.0",
    port: 8080,
    server: "http",
    hot: process.env.NODE_ENV === "local",
    liveReload: process.env.NODE_ENV === "local",
    webSocketServer: process.env.NODE_ENV === "local",
  },

  // PWA 설정 추가
  pwa: {
    name: "두기고",
    themeColor: "#7EA394",
    msTileColor: "#7EA394",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // Workbox 모드 설정 (GenerateSW로 명시적 설정)
    workboxPluginMode: "GenerateSW",

    // Workbox 옵션
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,

      // 버전 정보는 캐싱에서 제외
      navigateFallback: "/index.html",

      // 런타임 캐싱 설정
      runtimeCaching: [
        {
          urlPattern: new RegExp("^https://"),
          handler: "NetworkFirst",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxAgeSeconds: 60 * 60, // 1시간 캐싱
            },
          },
        },
      ],

      // version.json 파일은 항상 네트워크에서 가져오도록 설정
      exclude: [/version\.json$/],
    },

    // manifest.json 설정
    manifestOptions: {
      background_color: "#FFFFFF",
    },
  },

  // 파일명에 해시 추가하여 캐시 무효화
  filenameHashing: true,
};
