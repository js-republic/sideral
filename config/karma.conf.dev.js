var conf = require("./karma.conf");


module.exports = function configurate (config) {
    conf.autoWatch  = true;
    conf.logLevel   = config.LOG_DEBUG;
    conf.singleRun  = false;

    config.set(conf);
};
