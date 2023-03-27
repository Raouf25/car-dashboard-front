const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/cars': {
        target: 'https://spring-boot-efficient-search-api.fly.dev/api',
        changeOrigin: true
      },
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/car-dashboard-front/'
    : '/'
})
