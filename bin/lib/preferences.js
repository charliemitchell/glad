var fs = require('fs'),
    path = require('path'),
    prefs = require(path.join(__dirname,  '../preferences.js'), "utf-8");

module.exports = function (argv) {
    if (argv.editor) {
        prefs.editor = argv.editor
    }

    fs.writeFileSync(path.join(__dirname,  '../preferences.js'), "module.exports = " + JSON.stringify(prefs));
}