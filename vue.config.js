module.exports = {
     // 修改的配置
     publicPath: '/',
     devServer: {
         proxy: "http://127.0.0.1:5000/v1"
     }
 }