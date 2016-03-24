var verbose = require('./../logger').onVerbose;

module.exports = function () {

    var args = Array.prototype.slice.apply(arguments);
    var injections = args[0];
    var next = args[args.length - 1];
    var params = args.slice(1, args.length - 1);

    var nextInjection = function () {

        injections.shift();

        if (injections[0] && injections[0].method) {
            verbose("Injecting", injections[0].name, "Plugin");
            injections[0].method.apply(injections[0].method, params);
        } else {
            next();
        }

    };

    params.push(nextInjection);

    if (injections.length) {
        verbose("Injecting", injections[0].name, "Plugin");
        injections[0].method.apply(injections[0].method, params);
    } else {
        next();
    }
};