const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const entry = { example: './example/index.copy' };

const devConfig = merge(baseConfig, {
    entry,
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './',
        hot: true
    },
    output: {
        publicPath: '/'
    },
    mode: 'development',
    plugins: [
        // HMR
        new webpack.HotModuleReplacementPlugin(),

        new HTMLWebpackPlugin({
            title: 'Output Management',
            template: './example/index.html'
        })
    ]
});

module.exports = devConfig;
