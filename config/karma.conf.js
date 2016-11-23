var karmaConf = {
    basePath: "./../",
    browsers: ["PhantomJS"],
    exclude: ["/node_modules/"],
    frameworks: ["jasmine", "source-map-support"],

    files: [
        "node_modules/babel-polyfill/dist/polyfill.js",
        "test/**/*.js"
    ],

    phantomjsLauncher: {
        exitOnResourceError: true
    },

    plugins: [
        require("karma-jasmine"),
        require("karma-coverage"),
        require("karma-phantomjs-launcher"),
        require("karma-webpack"),
        require("karma-source-map-support")
    ],

    preprocessors: {
        "src/**/*.js": ["webpack"],
        "test/**/*.js": ["webpack"]
    },

    // Webpack
    webpack: {
        resolve: {
            extensions: ["", ".js"]
        },

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    query: {
                        presets: ["es2015"]
                    }
                }
            ],

            postLoaders: [
                {
                    test: /\.js$/,
                    loader: "istanbul-instrumenter-loader",
                    exclude: [/node_modules/, /\.(test|spec)\.js$/, /lib/]
                }
            ]
        },

        devtool: "inline-source-map"
    },

    // Reporters
    reporters: ["progress", "coverage"],
    coverageReporter: {
        sbudir: ".",
        type: "html"
    },

    colors: true,
    port: 9876
};

module.export = module.exports = karmaConf;
