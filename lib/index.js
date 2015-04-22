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
    moment : require('moment')
}