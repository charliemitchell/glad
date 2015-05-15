module.exports = {
    server : function (callback) {
        require('../service')(callback);
    },
    middleware : require('../middleware'),
    validate : require('../validate'),
    setter : require('../setter'),
    logger : require('../logger'),
    mongoose : require('mongoose'),
    colors : require('colors'),
    lodash : require('lodash'),
    express : require('express'),
    promise : require('bluebird'),
    moment : require('moment'),
    utility : require('../utility'),
    session : require('express-session'),
    ncp : require('ncp'),
    redis : require('redis'),
    connectRedis : require('connect-redis'),
    errorHandler : require('errorHandler'),
    cookieParser : require('cookie-parser'),
    methodOverride : require('method-override'),
    optimist : require('optimist'),
    sanitizer : require('sanitizer')
}
