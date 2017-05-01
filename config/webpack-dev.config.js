const webpack   = require("webpack"),
    path        = require("path");


module.exports = {
    devServer: {
        contentBase : path.join(__dirname, "../public/dev"),
        compress    : true,
        port        : 3332
    },

    output: {
        path: path.join(__dirname, "../public/"),
        filename: "[name].js"
    },

    entry: {
        "projects/balljammers/sideral":"./public/projects/balljammers/src"
    },

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

    plugins: [
        new webpack.ProvidePlugin({
            PIXI: path.join(__dirname, "../node_modules/pixi.js")
        })
    ]
};
