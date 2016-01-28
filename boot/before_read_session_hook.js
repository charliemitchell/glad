var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeReadSession) {
        timer = hook_timer(hooks.onBeforeReadSession, 'onBeforeReadSession');
        verbose("Glad: Hooks :: onBeforeReadSession");
        hooks.onBeforeReadSession(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};