var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    injectPlugins = require('./../classes/injectPlugins'),
    initialize;


module.exports = function (hooks, server, app, express, plugins, next) {

    var timer;

    var onBeforeReadSessionPlugins = plugins.filter(function (plugin) {
        return plugin.hook === 'onBeforeReadSession';
    });

    var onAfterHookInjections = function () {

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

    injectPlugins(onBeforeReadSessionPlugins, server, app, express, onAfterHookInjections);


};

