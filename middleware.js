var redis = require("redis"),
    config = require(process.cwd() + '/config'),
    verbose = require('./logger').onVerbose,
    cookieparser = require('cookie-parser'),
    cookie = require('express/node_modules/cookie'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    client = redis.createClient(config.redis.port, config.redis.host),
    store = new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        prefix: config.redis.key,
        client: client
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
    readSession: function(req, res, next) {

        if (req.headers.cookie) {
            var cookieItem = cookie.parse(req.headers.cookie);
            if (cookieItem[config.cookie.name]) {
                var sessionId = cookieparser.signedCookie(cookieItem[config.cookie.name], config.cookie.secret);
                store.get(sessionId, function(err, thisSession) {
                    if (err) {
                        console.log(err);
                        next();
                    } else {
                        if (!thisSession) {
                            next();
                        } else {
                            req.session = thisSession;
                            next();
                        }
                    }
                });
            } else {
                next();
            }
        } else {
            next();
        }
    },

    onAfterController : function() {},
    onAfterGET : function() {},
    onAfterPOST : function() {},
    onAfterPUT : function() {},
    onAfterDELETE : function() {}
};

module.exports = middleware;
