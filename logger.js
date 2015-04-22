require('colors');
var config = require(process.cwd() + '/config')
module.exports.onVerbose = function () {
    if (config.verbose) {
        console.log.apply(console, arguments);
    }
};