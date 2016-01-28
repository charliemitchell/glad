var fs = require('fs');

module.exports = function () {

    if (fs.existsSync(process.cwd() +'/hooks.js')) {
        hooks = require(process.cwd() +'/hooks');
    } else {
        console.log("Glad supports a hooks file. Grab one from our github at http://raw.githubusercontent.com/charliemitchell/nimble/master/blueprint/hooks.js");
        hooks = {};
    }

    return {
        hooks : hooks
    };
};