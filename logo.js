var serverstart = require('./time'),
    this_package_json = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '/package.json'))),
    their_package = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), '/package.json'))),
    ascii = "\n GLAD Version " + (this_package_json.version) + ' (ツ)'.green  + "\n";

console.log(("\n\n  [ " + their_package.name.toUpperCase() + "  v" +  their_package.version + " ]"));
ascii += "  > Server Starting...\n";
ascii += "  > " + serverstart() + "\n";
ascii += "  > Working directory : " + process.cwd() + "\n";
ascii += "  > To shut down, press <CTRL> + C at any time.\n";

module.exports = function (config) {
    if (config.hideLogo !== true) {
        console.log(ascii.grey);
    } else {
        console.log("  > Service Starting...".green);
    }
};