const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const vantTheme = path.resolve(__dirname, './src/assets/css/theme.less')

module.exports = {
    // 禁用eslint+prettier
  lintOnSave: false,
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    }
  },
  //处理sass
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('network', resolve('src/network'))
      .set('common', resolve('src/common'))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        path.resolve(__dirname, './src/assets/css/*.scss') //你的.scss文件所在目录
      ]
    }
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // 可在此编写样式变量
          // 'blue': 'red',
          // 也可以引入我们创建好的theme.less文件
          hack: `true; @import "${vantTheme}";`
        }
      }
    }
  }
}
