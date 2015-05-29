var config = require(process.cwd() + '/config'),
    verbose = require('./logger').onVerbose,
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    store = new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        prefix: config.redis.key
    });

require('colors');

var middleware = {

    extend: function(obj) {
        Object.keys(obj).forEach(function(key) {
            verbose("Glad: Registering Middleware:".grey, (key).grey);
            this[key] = obj[key];
        }.bind(middleware));
        return middleware;
    },

    onRequest: function(req, res, next) {
        next();
    },

    // Private, best not to edit this, instead use onAfterPost, onAfterGet, onAfterController, etc...
    onAfterResponse: function(req, res) {
        var type = req.method;
        middleware.onAfterController(req, res);
        if (middleware["onAfter" + type]) {
            middleware["onAfter" + type](req, res)
        }
    },

    // Gets The Session Object from Redis
    session : function (app) {
        app.set('trust proxy', 1);
        app.use(session({
            store : store,
            secret: config.cookie.secret,
            resave: false,
            saveUninitialized: true,
            name : config.cookie.name
        }));
    },

    onAfterController : function() {},
    onAfterGET : function() {},
    onAfterPOST : function() {},
    onAfterPUT : function() {},
    onAfterDELETE : function() {}
};

module.exports = middleware;
