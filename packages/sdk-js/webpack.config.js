const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/** @typedef {import("webpack/declarations/WebpackOptions").WebpackOptions} WebpackOptions */

/**
 * @type {WebpackOptions}
 */
module.exports = {
    entry: path.join(__dirname, 'example/index.js'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/, use: 'babel-loader'
            }
        ]
    },
    devServer: {

    },
    plugins: [new HtmlWebpackPlugin()]
}
