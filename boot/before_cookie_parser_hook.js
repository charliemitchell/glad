var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    injectPlugins = require('./../classes/injectPlugins'),
    initialize;


module.exports = function (hooks, server, app, express, plugins, next) {

    var timer;

    var onBeforeCookieParserPlugins = plugins.filter(function (plugin) {
        return plugin.hook === 'onBeforeCookieParser';
    });

    var onAfterHookInjections = function () {
        if (hooks.onBeforeCookieParser) {
            timer = hook_timer(hooks.onBeforeCookieParser, 'onBeforeCookieParser');
            verbose("Glad: Hooks :: onBeforeCookieParser");
            hooks.onBeforeCookieParser(server, app, express, function () {
                clearTimeout(timer);
                next();
            });
        } else {
            next();
        }
    }

    injectPlugins(onBeforeCookieParserPlugins, server, app, express, onAfterHookInjections);

};