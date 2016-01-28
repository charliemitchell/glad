var fs = require('fs'),
    path = require('path');

module.exports = buildFileSystems;

function buildFileSystems(files_path, container, capitalize, errors) {
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