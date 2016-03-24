var path = require('path');
var fs = require('fs');

module.exports = function (next) {

    var node_modules = path.join(process.cwd(), 'node_modules');
    var plugin;

    fs.readdir(node_modules, function (e, files) {

        if (e) {
            console.error('Error while trying to scan glad plugins');
            throw(e);
        }

        plugins = files.filter(function (file) {
            if (file.match(/^glad-/g)) {
                return true;
            } else {
                return false
            }
        }).map(function (fpath) {

            var _module;

            try {

                _module = require(fpath);

                if (_module.hook) {
                    return _module;
                } else {
                    return null;
                }
            } catch (e) {
                console.error('Error while trying to load glad plugin: ', fpath);
                throw(e);
            }
        }).filter(function (mod) {
            return mod;
        });

        next(plugins)
    });

};