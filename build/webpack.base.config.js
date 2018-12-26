const path = require('path');

function joinPath(dir) {
    return path.join(__dirname, '..',  dir);
}

module.exports = {
    entry: {
        index: './example/main.js'
    },
    output: {
        filename: '[name].js',
        library: 'copyReact',
        libraryTarget: 'umd',
        path: joinPath('dist')
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                exclude: /node_modules/,
                include: [joinPath('src'), joinPath('example')],
                use: ['babel-loader']
            },
            {
                test: /\.copy$/,
                exclude: /node_modules/,
                include: [joinPath('src'), joinPath('example')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-copy']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            '@': joinPath('src'),
            'example': joinPath('example')
        }
    }
};
