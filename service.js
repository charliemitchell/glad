require('./exitHandler')();
require('colors');

var initialize_hook = require('./boot/initialize_hook'),
    express = require("express"),
    app = express(),
    server = require('http').Server(app);

module.exports = function (callback, conf) {
    initialize_hook(server, app, express, function () {
        after_init_hook(callback, conf);
    });
};

function after_init_hook (callback, conf) {

    var requireCwd = function (aPath) {
            return require(process.cwd() + aPath);
        },
        version_notifications = require('./boot/version_notifications'),
        version_polyfills = version_notifications(),
        hooks = version_polyfills.hooks,
        config = requireCwd('/config'),
        globalReport = require('./globalReport'),
        exposeGlobals = requireCwd('/globals'),
        path = require("path"),
        mongoose = require('mongoose'),
        middleware = requireCwd('/middleware'),
        cookieParser = require('cookie-parser'),
        verbose = require('./logger').onVerbose,
        routes_path = path.join(process.cwd(), 'routes'),
        controllers_path = path.join(process.cwd(), 'controllers'),
        models_path = path.join(process.cwd(), 'models'),
        routes = {},
        controllers = {},
        showLogo = require('./logo'),
        errors = [],
        buildFileSystems = require('./boot/build_file_systems'),
        applyPolicy = require('./boot/apply_policy'),
        bind_routes = require('./boot/bind_routes'),
        app_hook = require('./boot/app_hook'),
        before_mongoose_hook = require('./boot/before_mongoose_hook'),
        before_body_parser_hook = require('./boot/before_body_parser_hook'),
        before_method_override_hook = require('./boot/before_method_override_hook'),
        before_cookie_parser_hook = require('./boot/before_cookie_parser_hook'),
        before_read_session_hook = require('./boot/before_read_session_hook'),
        before_router_hook = require('./boot/before_router_hook'),
        before_listen_hook = require('./boot/before_listen_hook'),
        tokenizer = require('./classes/tokenizer'),
        scan_plugins = require('./boot/scan_glad_plugins'),
        finalize;

    /**
     * Extend Developer Config with Defaults
     */
    if (conf) {
        (function () {
            for (var key in conf) {
                if (conf.hasOwnProperty(key)) {
                    config[key] = conf[key];
                }
            }
        }());
    }

    // Show The Logo, or not (depending on config)
    showLogo(config);

    // ID each request and possibly log it as well.
    app.use(function (req, res, next) {
        req.id = tokenizer.timeCoded();
        if (config.logHTTP) {
            console.log(
                ("Request   " + req.id + "  <<").cyan,
                (req.method + ":").cyan, (req.url).cyan
            );
        }
        next();
    });

    /**
     * If the developer has chosen to make the models available globally
     */
    if (config.exposeModels) {
        buildFileSystems(models_path, global, true, errors);
    }

    /**
     * Require in all of the routes and controllers
     */
    buildFileSystems(routes_path, routes, false, errors);
    buildFileSystems(controllers_path, controllers, false, errors);

    scan_plugins(function (plugins) {

        app_hook(hooks, server, app, express, function () {

            var appHookInjections = plugins.filter(function (plugin) {
                return plugin.hook === 'app';
            });

            var nextInjection = function () {

                appHookInjections.shift();

                if (appHookInjections[0] && appHookInjections[0].method) {
                    verbose("Injecting", appHookInjections[0].name, "Plugin");
                    appHookInjections[0].method(server, app, express, nextInjection);
                } else {
                    onAfterAppHookInjections();
                }

            };

            if (appHookInjections.length) {
                verbose("Injecting", appHookInjections[0].name, "Plugin");
                appHookInjections[0].method(server, app, express, nextInjection);
            } else {
                onAfterAppHookInjections();
            }


            function onAfterAppHookInjections () {

                verbose("Glad: Exposing Global Objects".yellow);

                exposeGlobals(global, function () {

                    verbose('Glad: Globals Registered ::'.magenta, (globalReport()).magenta);

                    before_mongoose_hook(mongoose, hooks, server, app, express, plugins, function () {

                        if (config.mongodb) {
                            mongoose.connect('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database);
                            verbose("Glad: Connecting To".yellow, ('mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.database).yellow);
                        } else {
                            verbose("Glad: Bypassing Connection To Mongo DB.".yellow);
                        }

                        before_body_parser_hook(hooks, server, app, express, plugins,  function () {

                            app.use(require('body-parser')[config.bodyParser]({limit : config.maxBodySize || '1mb'}));

                            before_method_override_hook(hooks, server, app, express, plugins, function () {

                                app.use(require('method-override')());

                                before_cookie_parser_hook(hooks, server, app, express, plugins, function () {

                                    app.use(cookieParser());

                                    before_read_session_hook(hooks, server, app, express, plugins,  function () {

                                        // Support Users Who don't need a session
                                        if (!config.sessionless) {
                                            verbose("Glad: Middleware :: Using Session Middleware");
                                            middleware.session(app);
                                        } else {
                                            verbose("Glad: Middleware :: Skipping Session Middleware");
                                        }

                                        app.use(middleware.onRequest);

                                        app.use(function (req, res, next) {
                                            req.on("end", function () {

                                                var color = "green";

                                                if (config.logHTTP) {
                                                    if (res.statusCode >= 400 && res.statusCode < 500) {
                                                        color = "yellow";
                                                    } else if (res.statusCode >= 500) {
                                                        color = "red";
                                                    }

                                                    console.log(
                                                        ("Response  " + req.id + "  >>")[color],
                                                        String(res.statusCode)[color],
                                                        String(res.statusMessage)[color],
                                                        String((res._headers['content-length'] || 0) + " bytes").black
                                                    );
                                                }

                                                middleware.onAfterResponse(req, res);
                                            });
                                            next();
                                        });

                                        app.use(function (req, res, next) {
                                            app.disable('x-powered-by');
                                            res.setHeader('X-Powered-By', 'Glad');
                                            next();
                                        });

                                        app.use(require('errorhandler')({dumpExceptions : true, showStack : true}));

                                        app.use(function (req, res, next) {
                                            var send = res.send;
                                            res.send = function () {

                                                if (req.route.methods.put) {
                                                    middleware.onAfterPUT(req);
                                                } else if (req.route.methods.get) {
                                                    middleware.onAfterGET(req);
                                                } else if (req.route.methods.post) {
                                                    middleware.onAfterPOST(req);
                                                } else if (req.route.methods.delete) {
                                                    middleware.onAfterDELETE(req);
                                                }

                                                send.apply(res, arguments);
                                            };
                                            next();
                                        });

                                        before_router_hook(hooks, server, app, express, plugins,  function () {

                                            // Bind The Routes
                                            bind_routes(app, routes, controllers, applyPolicy);


                                            // Allow Using Custom Middleware
                                            if (middleware.custom) {
                                                middleware.custom(app, express);
                                            }

                                            finalize = function (listen) {

                                                if (hooks.onAfterListen && listen !== false) {
                                                    verbose("Glad: Hooks :: onAfterListen");
                                                    hooks.onAfterListen(server, app, express);
                                                }

                                                require('dns').lookup(require('os').hostname(), function (err, add) {

                                                    if (listen !== false) {
                                                        console.log(' :) Glad: Server Listening On:'.green, (add + ':' + config.port.toString()).green);
                                                    }

                                                    if (errors.length) {
                                                        console.log(" :( Glad: Server is up with the following errors".red);
                                                        errors.forEach(function (err) {
                                                            console.log((err.message).red);
                                                        });
                                                    }
                                                });

                                                if (config.interactive) {
                                                    setTimeout(function () {
                                                        console.log("Application will now run in interactive mode".green);
                                                        var repl = require("repl");
                                                        repl.start("Glad > ".yellow);
                                                    }, 1000);
                                                }

                                                if (callback && typeof callback === "function") {
                                                    callback(app, express, server);
                                                }
                                            };

                                            if (config.listen !== false) {
                                                before_listen_hook(hooks, server, app, express, function () {
                                                    server.listen(config.port || 4242);
                                                    finalize();
                                                });
                                            } else {
                                                console.log('Application is not bound to any port because config.listen is set to false'.green);
                                                finalize(false);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }

        });
    });
}
