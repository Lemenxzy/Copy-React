// const path = require('path');
// const webpack = require('webpack');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const prodConfig = merge(baseConfig, {
    entry: {
        index: './src/Copy.js'
    },
    devtool: 'source-map',
    mode: 'production'
    // 设置了 mode 会自动启用这些优化插件
    // plugins: [
    // 两个都是为了压缩文件
    // new UglifyJsPlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin()
    // ]
});

module.exports = prodConfig;
