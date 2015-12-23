require('./exitHandler')();
require('colors');

var requireCwd = function (aPath) {
        return require(process.cwd() + aPath);
    },
    hooks,
    fs = require('fs'),
    config = requireCwd('/config'),
    globalReport = require('./globalReport'),
    exposeGlobals = requireCwd('/globals'),
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    app = express(),
    server = require('http').Server(app),
    middleware = requireCwd('/middleware'),
    cookieParser = require('cookie-parser'),
    policies = requireCwd('/policies'),
    verbose = require('./logger').onVerbose,
    routes_path = path.join(process.cwd(),  'routes'),
    controllers_path = path.join(process.cwd(), 'controllers'),
    models_path = path.join(process.cwd(), 'models'),
    routes = {},
    controllers={},
    showLogo = require('./logo'),
    errors = [];

function buildFileSystems(files_path, container, capitalize) {
    var files = fs.readdirSync(files_path);
    files.forEach(function(file) {
        if (file.match(/(\.js)$/)) {
            var file_ref = path.join (files_path, file),
                cap = file.replace ('.js', '')[0].toUpperCase();
            try {
                if (capitalize) {
                    container[cap + file.slice(1, file.length).replace ('.js', '')] = require(file_ref);
                } else {
                    container[file.replace ('.js', '')] = require(file_ref);
                }
            } catch (err) {
                console.log('\n');
                console.log("MAIN ERROR".red);
                console.log((err.stack).red);
                console.log('\n');
                errors.push({
                    message : "> Could Not Bind " + files_path.split('/').pop().toString() + '::' + file.replace ('.js', '') + " To Any Route!",
                    err : err
                });
            }
        }
    });
}

function applyPolicy (policy, method) {
    return function (req, res) {

        var accept = function () {
                method(req, res);
            },
            reject = function (custom) {
                policies.onFailure(req, res, custom);
            };

        if (policy) {
            if (policies[policy]) {
                policies[policy](req, res, accept, reject);
            } else {
                console.log(("Glad: The Policy '" + policy + "' Does Not exist, therefore the request was denied").red);
                reject();
            }
        } else { // No Policy, Allow it
            method(req, res);
        }
    };
}

module.exports = function (callback, conf) {

    if (conf) {
      (function () {
        for (var key in conf) {
          if (conf.hasOwnProperty(key)) {
            console.log("Extending", key);
            config[key] = conf[key];
          }
        }
      }());
    }

    // Prevent Version Issue
    if (fs.existsSync(process.cwd() +'/hooks.js')) {
        hooks = require(process.cwd() +'/hooks');
    } else {
        console.log("Glad supports a hooks file. Grab one from our github at http://raw.githubusercontent.com/charliemitchell/nimble/master/blueprint/hooks.js");
        hooks = {};
    }

    // Support Hiding the logo
    if (config.hideLogo !== true) {
        showLogo();
    } else {
        console.log("  > Service Starting...".green);
    }

    if (config.exposeModels) {
        buildFileSystems(models_path, global, true);
    }

    buildFileSystems(routes_path, routes);
    buildFileSystems(controllers_path, controllers);

    if (hooks.app) {
        verbose("Glad: Configuring App");
        hooks.app(server, app, express);
    }

    verbose("Glad: Exposing Global Objects".yellow);

    // Expose any Globals
    exposeGlobals(global, function () {

        verbose('Glad: Globals Registered ::'.magenta, (globalReport()).magenta);

        if (hooks.onBeforeMongoose) {
            verbose("Glad: Configuring Mongoose");
            hooks.onBeforeMongoose(mongoose, server, app, express);
        }

        if (config.mongodb) {
            // Connect To MongoDB using our ORM
            mongoose.connect('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database);
            verbose("Glad: Connecting To".yellow, ('mongodb://'+config.mongodb.host+':'+config.mongodb.port + '/' + config.mongodb.database).yellow);
        } else {
            verbose("Glad: Bypassing Connection To Mongo DB.".yellow);
        }

        verbose("Glad: Configuring Express Server".yellow);
        // Config

        if (hooks.onBeforeBodyParser) {
            verbose("Glad: Hooks :: onBeforeBodyParser");
            hooks.onBeforeBodyParser(server, app, express);
        }

        app.use(require('body-parser')[config.bodyParser]({limit: config.maxBodySize || '1mb'}));


        if (hooks.onBeforeMethodOverride) {
            verbose("Glad: Hooks :: onBeforeMethodOverride");
            hooks.onBeforeMethodOverride(server, app, express);
        }

        app.use(require('method-override')());

        if (hooks.onBeforeCookieParser) {
            verbose("Glad: Hooks :: onBeforeCookieParser");
            hooks.onBeforeCookieParser(server, app, express);
        }

        app.use(cookieParser());


        if (hooks.onBeforeReadSession) {
            verbose("Glad: Hooks :: onBeforeReadSession");
            hooks.onBeforeReadSession(server, app, express);
        }

        // Support Users Who don't need a session
        if (!config.sessionless) {
            verbose("Glad: Middleware :: Using Session Middleware");
            middleware.session(app);
        } else {
            verbose("Glad: Middleware :: Skipping Session Middleware");
        }

        app.use(middleware.onRequest);

        app.use(function (req, res, next) {
            req.on("end", function() {
                middleware.onAfterResponse(req, res);
            });
            next();
        });

        if (hooks.onBeforeRouter) {
            verbose("Glad: Hooks :: onBeforeRouter");
            hooks.onBeforeRouter(server, app, express);
        }

        app.use(function (req, res, next) {
            app.disable( 'x-powered-by' );
            res.setHeader( 'X-Powered-By', 'Express/Glad' );
            next();
        });

        app.use(require('errorhandler')({ dumpExceptions: true, showStack: true }));

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

        // Bind The Routes
        Object.keys(routes).forEach(function (key) {
            var router = routes[key];
            //GET
            if (router.GET) {
                router.GET.forEach(function (route) {
                    verbose("Glad: Binding Route :: GET".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                    if (controllers[key]) {
                        if (controllers[key][route.action]) {
                            app.get(route.path, applyPolicy(route.policy, controllers[key][route.action]));
                        } else {
                            throw("Error Binding Route: GET: " + route.path + "\nController for " + key + " has no method " + route.action);
                        }
                    } else {
                        console.log(errors);

                        console.log("Dumping Stack:".red);
                        console.log("Running in " + process.cwd());
                        console.log("Error binding route " + route);
                        console.log("Was expecting controllers["+key+"] to be a controller. instead found " + controllers[key]);
                        console.log("The following was the result of loading all of your controllers into a hash...");
                        console.log(controllers);
                        throw("Error Binding Route: GET: " + route.path + "\n Could not locate a controller for " + key);
                    }
                });
            }

            // POST
            if (router.POST) {
                router.POST.forEach(function (route) {
                    verbose("Glad: Binding Route :: POST".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                    if (controllers[key]) {
                        if (controllers[key][route.action]) {
                            app.post(route.path, applyPolicy(route.policy, controllers[key][route.action]));
                        } else {
                            throw("Error Binding Route: POST: " + route.path + "\nController for " + key + " has no method " + route.action);
                        }
                    } else {
                        throw("Error Binding Route: POST: " + route.path + "\n Could not locate a controller for " + key);
                    }
                });
            }

            // PUT
            if (router.PUT) {
                router.PUT.forEach(function (route) {
                    verbose("Glad: Binding Route :: PUT".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                    if (controllers[key]) {
                        if (controllers[key][route.action]) {
                            app.put(route.path, applyPolicy(route.policy, controllers[key][route.action]));
                        } else {
                            throw("Error Binding Route: PUT: " + route.path + "\nController for " + key + " has no method " + route.action);
                        }
                    } else {
                        throw("Error Binding Route: PUT: " + route.path + "\n Could not locate a controller for " + key);
                    }
                });
            }

            // DELETE
            if (router.DELETE) {
                router.DELETE.forEach(function (route) {
                    verbose("Glad: Binding Route :: DELETE".grey, (route.path).grey/*, " #action".grey, (route.action).grey*/);
                    if (controllers[key]) {
                        if (controllers[key][route.action]) {
                            app.delete(route.path, applyPolicy(route.policy, controllers[key][route.action]));
                        } else {
                            throw("Error Binding Route: DELETE: " + route.path + "\nController for " + key + " has no method " + route.action);
                        }
                    } else {
                        throw("Error Binding Route: DELETE: " + route.path + "\n Could not locate a controller for " + key);
                    }
                });
            }
        });


        // Allow Using Custom Middleware
        if (middleware.custom) {
            middleware.custom(app, express);
        }

        if (config.listen !== false) {
          
          if (hooks.onBeforeListen) {
              verbose("Glad: Hooks :: onBeforeListen");
              hooks.onBeforeListen(server, app, express);
          }

          // Launch server
          server.listen(config.port || 4242);

          if (hooks.onAfterListen) {
              verbose("Glad: Hooks :: onAfterListen");
              hooks.onAfterListen(server, app, express);
          }
          
          require('dns').lookup(require('os').hostname(), function (err, add) {
            console.log(' :) Glad: Server Listening On:'.green, (add + ':' + config.port.toString()).green);
            if (errors.length) {
                console.log(" :( Glad: Server is up with the following errors".red);
                errors.forEach(function (err) {
                    console.log((err.message).red);
                });
            }
	  });

        } else {
            console.log('Application is not bound to any port because config.listen is set to false'.green)
        }

        if (callback && typeof callback === "function") {
            callback(app, express, server);
        }
    });
};
