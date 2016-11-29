require("webpack");
const path = require("path");


module.exports = {
    output: {
        path: path.join(__dirname, "../public/src"),
        filename: "[name].js"
    },

    entry: {
        hub: path.join(__dirname, "../features/hub/client")
    },

    resolve: {
        extensions: ["", ".js", ".jsx"]
    },

    devtool: "source-map",

    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json"
        }, {
            test: /\.jsx?$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            query: {
                presets: ["es2015", "react"]
            }
        }]
    }
};
