var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    injectPlugins = require('./../classes/injectPlugins'),
    initialize;


module.exports = function (hooks, server, app, express, plugins, next) {

    var timer;

    var onBeforeRouterPlugins = plugins.filter(function (plugin) {
        return plugin.hook === 'onBeforeRouter';
    });

    var onAfterHookInjections = function () {

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

    injectPlugins(onBeforeRouterPlugins, server, app, express, onAfterHookInjections);


};