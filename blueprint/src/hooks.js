module.exports = {

    app : function (server, app, express, next) {
        next();
    },

    onBeforeMongoose : function (mongoose, server, app, express, next) {
        next();
    },

    onBeforeBodyParser : function (server, app, express, next) {
        next();
    },

    onBeforeMethodOverride : function (server, app, express, next) {
        next();
    },

    onBeforeCookieParser : function (server, app, express, next) {
        next();
    },

    onBeforeReadSession : function (server, app, express, next) {
        next();
    },

    onBeforeRouter : function (server, app, express, next) {
        next();
    },

    onBeforeListen : function (server, app, express, next) {
        next();
    },
    onAfterListen : function (server, app, express) {

    }
};