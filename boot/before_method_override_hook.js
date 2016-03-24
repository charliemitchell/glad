var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    injectPlugins = require('./../classes/injectPlugins'),
    initialize;


module.exports = function (hooks, server, app, express, plugins, next) {

    var timer;

    var onBeforeMethodOverridePlugins = plugins.filter(function (plugin) {
        return plugin.hook === 'onBeforeMethodOverride';
    });

    var onAfterHookInjections = function () {

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
    }

    injectPlugins(onBeforeMethodOverridePlugins, server, app, express, onAfterHookInjections);

};