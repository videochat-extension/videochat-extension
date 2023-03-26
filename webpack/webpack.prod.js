const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    devtool: "source-map",
    plugins: [
        new SentryWebpackPlugin({
            org: "cool-projects",
            project: "videochatru-extension",
            include: process.env.DIR,
            authToken: process.env.SENTRY_TOKEN,
            release: `videochat-extension@${process.env.VERSION}`,
        }),
    ],
});