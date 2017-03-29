const webpack   = require("webpack"),
    entries     = require("./webpack.entries.json"),
    path        = require("path");


module.exports = {
    output: {
        path: path.join(__dirname, "../public/"),
        filename: "[name].js"
    },

    entry: entries,

    resolve: {
        extensions: ["", ".js", ".json", ".jsx"],
        root: [
            path.resolve("./")
        ]
    },

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json"
            },

            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["es2015", "react"]
                }
            }
        ]
    },

    devServer: {

    },

    plugins: [
        new webpack.ProvidePlugin({
            PIXI: path.join(__dirname, "../node_modules/pixi.js")
        })
    ]
};
