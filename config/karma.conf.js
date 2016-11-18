module.exports = function configurate (config) {

    config.set({
        basePath: "./../",
        browsers: ["PhantomJS"],
        exclude: ["/node_modules/"],
        frameworks: ["jasmine"],

        files: [
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
            require("karma-sourcemap-loader")
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
                        exclude: ["node_modules", /\.(test|spec)\.js$/]
                    }
                ]
            },

            devtool: "inline-source-map"
        },

        // Reporters
        reporters: ["progress", "coverage"],
        coverageReporter: {
            dir: "coverage",
            instrumenterOptions: {
                istanbul: {noCompact: true}
            },
            type: "html"
        },

        // debug
        colors: true,
        autoWatch: false,
        logLevel: config.LOG_INFO,
        singleRun: true,

        port: 9876
    });

};
