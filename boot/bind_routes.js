var verbose = require('./../logger').onVerbose;

module.exports = function (app, routes, controllers, applyPolicy) {

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
                    console.log("Was expecting controllers[" + key + "] to be a controller. instead found " + controllers[key]);
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

};