var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    injectPlugins = require('./../classes/injectPlugins'),
    initialize;


module.exports = function (mongoose, hooks, server, app, express, plugins,  next) {

    var timer;

    var onBeforeMongoosePlugins = plugins.filter(function (plugin) {
        return plugin.hook === 'onBeforeMongoose';
    });

    var onAfterHookInjections = function () {

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

    injectPlugins(onBeforeMongoosePlugins, server, app, express, onAfterHookInjections);

};

