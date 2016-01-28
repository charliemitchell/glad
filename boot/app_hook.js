var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.app) {
        timer = hook_timer(hooks.app, 'app');
        verbose("Glad: Hooks :: App");
        hooks.app(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};