const path = require('path');
const copy = require('copy-webpack-plugin')

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';

module.exports = {
    entry: './src/game.ts',
    mode,
    devtool,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {

            }
        ],
    },
    plugins: [
        new copy({
            patterns: [
                { from: "assets", to: "assets" },
                { from: "src/index.html", to: "index.html" }
            ]
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 10000
    }
};