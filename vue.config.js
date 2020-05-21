module.exports = {
  publicPath: '/norad-visualization/',
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.csv$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
  }
}
