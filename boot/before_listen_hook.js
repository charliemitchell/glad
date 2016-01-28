var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeRouter) {
        timer = hook_timer(hooks.onBeforeListen, 'onBeforeListen');
        verbose("Glad: Hooks :: onBeforeListen");
        hooks.onBeforeListen(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};