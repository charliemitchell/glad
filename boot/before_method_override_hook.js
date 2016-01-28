var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeMethodOverride) {
        timer = hook_timer(hooks.onBeforeMethodOverride, 'onBeforeMethodOverride');
        verbose("Glad: Hooks :: onBeforeMethodOverride");
        hooks.onBeforeMethodOverride(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};