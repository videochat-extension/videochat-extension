const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path')
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

const {readFileSync} = require('fs');
const manifestContent = readFileSync(`./manifest/${process.env.BROWSER}.json`);
const manifest = JSON.parse(manifestContent)

// could not find a way to sentry to recognize my uploaded source maps in non-minified files
// so I had to use this...
class DeleteSourceMapWebpackPlugin {
    constructor() {
    }

    apply(compiler) {
        let countMatchAssets = 0;

        compiler.hooks.done.tap('DeleteSourceMaps', (stats) => {
            const fs = require('fs');
            let countMatchMapAssets = 0;
            let outputPath = stats.compilation.outputOptions.path;
            Object.keys(stats.compilation.assets)
                .filter(name => /\.js\.map$/.test(name))
                .forEach((name) => {
                    countMatchMapAssets += 1
                    fs.unlinkSync(path.join(outputPath, name))
                })
            console.log(`⭐⭐⭐deleted map files: ${countMatchMapAssets} asset(s) processed`);
        })
    }
}

module.exports = merge(common, {
    mode: 'production',
    devtool: "source-map",
    optimization: {
        minimize: false
    },
    plugins: [
        new SentryWebpackPlugin({
            org: "cool-projects",
            project: "videochatru-extension",
            include: process.env.DIR,
            authToken: process.env.SENTRY_TOKEN,
            // this plugin should fail if a reviewer does not have my SENTRY_TOKEN,
            // but it will compile identical result anyway, so we just ignore it...
            errorHandler: (err, invokeErr, compilation) => {
                compilation.warnings.push('Sentry CLI Plugin: ' + err.message)
            },
            release: `videochat-extension@${manifest.version}`,
        }),
        new DeleteSourceMapWebpackPlugin()
    ],
});