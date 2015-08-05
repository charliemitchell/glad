module.exports = {
    app : function (server, app, express) {
        
    },

    onBeforeMongoose : function (mongoose, app, express) {

    },

    onBeforeBodyParser : function (server, app, express) {
        /* Hint:
            If you would like to add add additional body parsers before the one in your config file,
            Do it here.
         */
    },

    onBeforeMethodOverride : function (server, app, express) {

    },
    
    onBeforeCookieParser : function (server, app, express) {

    },

    onBeforeRouter : function (server, app, express) {

    },
    onBeforeListen : function (server, app, express) {

    },
    onAfterListen : function (server, app, express) {

    }
};