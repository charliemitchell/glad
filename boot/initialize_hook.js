var verbose = require('./../logger').onVerbose,
    hook_timer = require('./hook_timer'),
    initialize;


module.exports = function (server, app, express, next) {

    try {
        initialize = require(process.cwd() + '/init');
    } catch (err) {
        initialize = false;
    }

    if (initialize) {
        verbose("Glad: Running Initialize Hook".yellow);
        var timer = hook_timer(initialize, 'initialize');
        initialize(server, app, express, function () {
            clearTimeout(timer);
            next();
        });
    } else {
        console.log("Glad Now Supports init.js in your working directory.".grey);
        next();
    }

};