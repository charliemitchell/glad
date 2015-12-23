#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    api =  require('./lib/api'),
    prefs =  require('./lib/preferences'),
    config = {};

require('colors');

// IF Running `glad -h`
if (argv.h || argv.help || (argv._[0] && _.contains(['h', 'help'], argv._[0]))) {
  console.log("Available Commands:".green)
  console.log("glad api [name]        # Creates a new API".yellow);
  console.log("glad serve [i]         # Starts the server, pass in i for interactive mode".yellow);
  console.log("glad run   [i]         # Runs a job or script in the same process as a new application server (without binding to a port). Pass in i for interactive mode".yellow);
  console.log("glad -v                # Displays The Version of Glad".yellow);
  console.log("glad list [m|r]        # Displays All of the controllers, models, routes in your application. Run glad list for controllers".yellow);
  console.log("glad destroy [name]    # Destroys an API, removes the model, route, controller, and test".yellow);
  console.log("glad p --editor [bin]  # Sets your preferred editor, pass in the command that opens your editor from terminal".yellow);
  console.log("                         examples include subl, wstorm, atom, etc...".yellow);

  console.log('\nALIASES:'.green);
  console.log("glad a [name]          # glad api [name]".yellow);
  console.log("glad s [i]             # glad serve [i]".yellow);
  console.log("glad r [i]             # glad run [i]".yellow);
  console.log("glad l [m|r]           # glad list [m|r]".yellow);
  console.log("glad d [name]          # glad destroy [name]".yellow);
}

// Get the glad version
var version = JSON.parse(fs.readFileSync(path.join((__dirname).replace('bin', ""), '/package.json'))).version;

// IF Running `glad -v`
if (argv.v || argv.version || (argv._[0] && _.contains(['v', 'version'], argv._[0]))) {
    console.log('v' + version);
}

// IF Running `glad list`
if (argv.l || argv.list || (argv._[0] && _.contains(['l', 'list'], argv._[0]))) {
    var files_path = process.cwd() + '/controllers',
        files = fs.readdirSync(files_path),
        mode = "Controllers";

    if (argv._[1]) {
        if (_.contains(['m', 'model', 'models'], argv._[1])) {
            files_path = process.cwd() + '/models';
            mode = "Models";
        } else if (_.contains(['r', 'route', 'routes'], argv._[1])) {
            files_path = process.cwd() + '/routes';
            mode = "Routes"
        }
    }

    console.log("Showing all " + mode);

    files.forEach(function(file, idx) {
        if (!file.match(/^\./)) {
            console.log( String(idx).green +  ((idx <=9) ? "   " : (idx <=99) ? "  " : " ") + (file.replace('.js', '')).blue);
        }
    });
}


// Glad Run
if (argv.r || argv.run || (argv._[0] && _.contains(['r', 'run'], argv._[0]))) {
  var interactive = (argv.i || argv.interactive || (argv._[2] && _.contains(['i', 'interactive'], argv._[2])));

  try {

    require(process.cwd() + '/node_modules/glad/service')(false, {
      port : 4243,
      listen : false,
      interactive : interactive
    });

    setTimeout(function () {
      try {
        require(path.join(process.cwd(), argv._[1]))();
      } catch (e) {
        console.error("Could Not Load Job", path.join(process.cwd() , argv._[1]))
      }
    }, 5000);
  } catch (e) {
    console.error(e);
  }
}


// If Running Glad with out any args
else if (argv._.length === 0) {
    console.log('');
    console.log('Welcome to Glad! (v' + version + ')');
    console.log('');
}

// If setting preferences
else if (argv.p || argv.prefs || argv.preferences || argv.pref || (argv._[0] && _.contains(['p', 'prefs', 'preferences', 'pref'], argv._[0]))) {
    prefs(argv);
}

// If starting the server
else if (argv.s || argv.server || argv.up || argv.u || (argv._[0] && _.contains(['s', 'server', 'up', 'u'], argv._[0]))) {
  var interactive = (argv.i || argv.interactive || (argv._[1] && _.contains(['i', 'interactive'], argv._[1])));
  require(process.cwd() + '/node_modules/glad/service')(config, {
    interactive : interactive
  });
}

// If Creating an API
else if (argv.a || argv.api || (argv._[0] && _.contains(['a', 'api'], argv._[0]))) {
    api(argv);
}

// If Destroying an API
else if (argv.d || argv.destroy || (argv._[0] && _.contains(['d', 'destroy'], argv._[0]))) {
    api(argv, true);
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

    //         cpr(pathToStub, process.cwd(), function(err) {

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
