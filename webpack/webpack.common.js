const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
        injection_ip: path.join(srcDir, 'injection/ip-api.ts'),
        background: path.join(srcDir, 'background.ts'),
        content_script: path.join(srcDir, 'content.ts'),
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: (chunkData) => {
            if(chunkData.chunk.name === 'injection_ip') return "injection/ip-api.js";
            return "[name].js";
        },
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name === 'content_script';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            { test: require.resolve('arrive') },
            { test: require.resolve('tooltipster') }
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "", context: "public" }],
            options: {},
        }),
    ],
};
