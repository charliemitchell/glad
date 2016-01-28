var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeCookieParser) {
        timer = hook_timer(hooks.onBeforeCookieParser, 'onBeforeCookieParser');
        verbose("Glad: Hooks :: onBeforeCookieParser");
        hooks.onBeforeCookieParser(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};