#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    ncp = require('ncp').ncp,
    path = require('path'),
    child = require('child_process'),
    argv = require('optimist').argv,
    Api =  require('./lib/api'),
    Pref =  require('./lib/preferences'),
    config = {};

require('colors')

// Get the glad version
var version = JSON.parse(fs.readFileSync(path.join((__dirname).replace('bin', ""), '/package.json'))).version;

// IF Running `glad -v`
if (argv.v || argv.version || (argv._[0] && _.contains(['v', 'version'], argv._[0]))) {
    console.log('v' + version);
}

// If Running Glad with out any args
else if (argv._.length === 0) {
    console.log('');
    console.log('Welcome to Glad! (v' + version + ')');
    console.log('');
}

// If setting preferences
else if (argv.p || argv.prefs || argv.preferences || argv.pref || (argv._[0] && _.contains(['p', 'prefs', 'preferences', 'pref'], argv._[0]))) {
    Pref(argv);
}

// If starting the server
else if (argv.s || argv.server || argv.up || argv.u || (argv._[0] && _.contains(['s', 'server', 'up', 'u'], argv._[0]))) {
    require(process.cwd() + '/node_modules/glad/service')(config);
}

// If Creating an API
else if (argv.a || argv.api || (argv._[0] && _.contains(['a', 'api'], argv._[0]))) {
    Api(argv);
}

// If Creating a new directory
else if (argv.new || argv.n || (argv._[0] && _.contains(['n', 'new'], argv._[0]))) {
    if (argv._[1]) {
        var folder = path.join(process.cwd(), argv._[1]);
        fs.mkdirSync(folder);
        fs.writeFileSync(path.join(folder, 'glad.txt'), "This Service initialized by " + process.env.USER || "glad");
        console.log('Creating service.. cd into ' + argv._[1] + ' and run "glad api yourapi"');
    }
}

// If Running The Set Command
else if (argv.set || (argv._[0] && _.contains(['set'], argv._[0]))) {
    if (argv.port || (argv._[1] && _.contains(['port'], argv._[1]))) {
        var config,
            Dockerfile;

        try {
            config = fs.readFileSync('./config.js', 'utf8');

            if (config.match(/(port).*(\/\*ns-port\*\/)/)) {
                config = config.replace(/(port).*(\/\*ns-port\*\/)/, 'port : ' + argv._[2] + ', /*ns-port*/');
                fs.writeFileSync('./config.js', config);
            } else {
                console.log("Error: Can not set port in config.js because either it is not in the config.js file or it is missing the /*ns-port*/ comment".red);
                console.log("Example: \n port : 4242, /*ns-port*/");
                console.log("Eventually you will not need the comment, but for now, it is needed");
            }

        } catch (err) {
            console.log("Are you sure you are in a glad project?\nBe sure you cd into the src directory before running this command".red);
            process.exit(0);
        }

        try {
            Dockerfile = fs.readFileSync('../Dockerfile', 'utf8');
            if (Dockerfile.match(/(EXPOSE).*(#ns-port)/)) {
                Dockerfile = Dockerfile.replace(/(EXPOSE).*(#ns-port)/, 'EXPOSE ' + argv._[2] + ' #ns-port');
                fs.writeFileSync('../Dockerfile', Dockerfile);
            } else {
                console.log("Error: Can not set port in the Dockerfile because either it was never exposed or it is missing the #ns-port comment".red);
                console.log("Example: \n EXP 4242 #ns-port");
                console.log("Eventually you will not need the comment, but for now, it is needed");
            }

        } catch (err) {
            console.log("Only Updating config.js because a Dockerfile was not detected");
        }
    }
}

// If running the stub command
else if (argv.stub || (argv._[0] && _.contains(['stub'], argv._[0]))) {
    console.log("Coming Soon");
    // (function() {
    //     var pathToStub = argv._[1],
    //         model = argv.model,
    //         package,
    //         npm;

    //     if (fs.existsSync(path.join(process.cwd(), '/package.json'))) {
    //         console.log("It looks like you already created an api. Glad will refuse to overwrite an existing Api.".red);
    //         return;
    //     }

    //     if (!model) {
    //         console.log('Error: You need to specify the model, --model users'.red);
    //         console.log('Try Again'.red);
    //         return;
    //     }

    //     if (!pathToStub) {
    //         console.log('Error: You need to specify the path to the stub, glad stub /path/to/stub --model users'.red);
    //         console.log('Try Again'.red);
    //         return;
    //     }

    //     if (fs.existsSync(pathToStub)) {

    //         ncp(pathToStub, process.cwd(), function(err) {

    //             npm = child.spawn('npm', ['install'], {
    //                 cwd: process.cwd() + '/src'
    //             });

    //             fs.writeFileSync('./src/model.js', fs.readFileSync('./src/model.js', 'utf-8').replace(/{{model}}/g, model));
    //             fs.writeFileSync('./src/router.js', fs.readFileSync('./src/router.js', 'utf-8').replace(/{{api}}/g, model));
    //             package = fs.readFileSync('./src/package.json', 'utf-8');

    //             if (!package) {
    //                 console.log("Error: You must have a package.json file in your stub\nTry Again".red);
    //                 return;
    //             }

    //             // Try to write the author in
    //             if (process.env.USER) {
    //                 package = package.replace('"author": ""', '"author": "' + process.env.USER + '"');
    //                 fs.writeFileSync('./src/package.json', package);
    //             }

    //             if (fs.existsSync('./Vagrantfile')) {
    //                 console.log("Setting up a Vagrantfile...");
    //                 fs.writeFileSync('./Vagrantfile', fs.readFileSync('./Vagrantfile', 'utf-8').replace("{{synced-folder}}", process.cwd()));
    //             }


    //             console.log("Installing Packages...".yellow);

    //             // Install any Dependencies
    //             npm.stdout.setEncoding('utf8');
    //             npm.stdout.on('data', function(stdout) {
    //                 console.log(('NPM >  ' + stdout).yellow);
    //             });

    //             npm.on('close', function(code) {

    //                 if (code === 0) {
    //                     console.log("All Done! ".green);
    //                 } else {
    //                     console.log("ERROR: NPM could not install required packages, You will have to do it manually".red)
    //                 }
    //             });

    //         });

    //     } else {

    //         console.log('The Path ' + pathToStub + ' Does Not Exist'.red);
    //         if (pathToStub.charAt(0) === '/') {
    //             console.log("Absolute Path: ", pathToStub);
    //         } else {
    //             console.log("Absolute Path: ", path.join(process.cwd(), pathToStub));
    //         }
    //     }

    // }());
}