var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeBodyParser) {
        timer = hook_timer(hooks.onBeforeBodyParser, 'onBeforeBodyParser');
        verbose("Glad: Hooks :: onBeforeBodyParser");
        hooks.onBeforeBodyParser(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};