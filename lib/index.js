module.exports = {
    __boot : function () {
        require('../bin/glad');
    },
    server : function (callback) {
        process.glad = process.glad || {};
        require('../service')(callback);
    },
    middleware      : require('../middleware'),
    validate        : require('../validate'),
    setter          : require('../setter'),
    logger          : require('../logger'),
    mongoose        : require('mongoose'),
    colors          : require('colors'),
    lodash          : require('lodash'),
    express         : require('express'),
    promise         : require('bluebird'),
    moment          : require('moment'),
    utility         : require('../utility'),
    session         : require('express-session'),
    cpr             : require('cpr'),
    ncp             : require('cpr'),     // --TODO Remove reference to ncp by version 0.6.0
    redis           : require('redis'),
    connectRedis    : require('connect-redis'),
    errorHandler    : require('errorhandler'),
    cookieParser    : require('cookie-parser'),
    methodOverride  : require('method-override'),
    optimist        : require('optimist'),
    sanitizer       : require('sanitizer'),
    dotObject       : require('dot-object'),
    versions        : {},
    dataVersions    : require('./../classes/dataVersioning'),
    tokenizer       : require('./../classes/tokenizer')
};
