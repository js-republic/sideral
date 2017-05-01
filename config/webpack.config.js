const webpack   = require("webpack"),
    path        = require("path");


module.exports = {
    output: {
        path: path.join(__dirname, "../public/"),
        filename: "[name].js"
    },

    entry: {
        "projects/balljammers/sideral":"./public/projects/balljammers/src"
    },

    resolve: {
        extensions: [".js", ".json", ".jsx"],
        modules: [path.resolve("./"), "node_modules"]
    },

    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader"
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
        contentBase : path.join(__dirname, "../public/projects/balljammers"),
        compress    : true,
        port        : 3332,
    },

    plugins: [
        new webpack.ProvidePlugin({
            PIXI: path.join(__dirname, "../node_modules/pixi.js")
        })
    ]
};
