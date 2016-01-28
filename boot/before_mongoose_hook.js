var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (mongoose, hooks, server, app, express, next) {

    var timer;

    if (hooks.onBeforeMongoose) {
        timer = hook_timer(hooks.onBeforeMongoose, 'onBeforeMongoose');
        verbose("Glad: Hooks :: onBeforeMongoose");
        hooks.onBeforeMongoose(mongoose, server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        next();
    }

};