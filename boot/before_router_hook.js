var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeRouter) {
        timer = hook_timer(hooks.onBeforeRouter, 'onBeforeRouter');
        verbose("Glad: Hooks :: onBeforeRouter");
        hooks.onBeforeRouter(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};