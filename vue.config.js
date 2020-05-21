module.exports = {
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
