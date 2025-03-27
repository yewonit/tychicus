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
};
