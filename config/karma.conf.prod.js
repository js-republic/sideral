var conf = require("./karma.conf");


module.exports = function configurate (config) {
    conf.autoWatch  = false;
    conf.logLevel   = config.LOG_DISABLE;
    conf.singleRun  = true;

    config.set(conf);
};
