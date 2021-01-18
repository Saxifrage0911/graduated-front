// const webpack = require('webpack')
// module.exports = {
//     configureWebpack: {
//         plugins: [
//             new webpack.ProvidePlugin({
//                 $:"jquery",
     
//                 jQuery:"jquery",
//                 "windows.jQuery":"jquery"
//             })
//         ]
//     },
// }
module.exports = {
    publicPath: "./",
    lintOnSave: false, //关闭eslint
    outputDir: process.env.outputDir, 
  };