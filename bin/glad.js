#!/usr/bin/env node

var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    api =  require('./lib/api'),
    prefs =  require('./lib/preferences'),
    blueprint = path.resolve((__dirname).replace('bin', ""), 'blueprint'),
    child = require('child_process'),
    config = {},
    cpr = require('cpr');

require('colors');

process.glad = {
    console : false,
    run     : false,
    aux     : false
};

function help() {
    console.log("Available Commands:".green)
    console.log("glad api   [name]                   # Creates a new API".yellow);
    console.log("glad stub  [path] --model [model]   # Creates a new API".yellow);
    console.log("glad serve [-i]                     # Starts the server, pass in i for interactive mode".yellow);
    console.log("glad run   [-i]                     # Runs a job or script in the same process as a new application server (without binding to a port). Pass in i for interactive mode".yellow);
    console.log("glad -v                             # Displays The Version of Glad".yellow);
    console.log("glad list [m|r]                     # Displays All of the controllers, models, routes in your application. Run glad list for controllers".yellow);
    console.log("glad destroy [name]                 # Destroys an API, removes the model, route, controller, and test".yellow);
    console.log("glad p --editor [bin]               # Sets your preferred editor, pass in the command that opens your editor from terminal".yellow);
    console.log("                                      examples include subl, wstorm, atom, etc...".yellow);

    console.log('\nALIASES:'.green);
    console.log("glad a [name]          # glad api [name]".yellow);
    console.log("glad s [i]             # glad serve [i]".yellow);
    console.log("glad r [i]             # glad run [i]".yellow);
    console.log("glad l [m|r]           # glad list [m|r]".yellow);
    console.log("glad d [name]          # glad destroy [name]".yellow);
}
// IF Running `glad -h`
if (argv.h || argv.help || (argv._[0] && _.contains(['h', 'help'], argv._[0]))) {
  help();
}

// Get the glad version
var version = JSON.parse(fs.readFileSync(path.join((__dirname).replace('bin', ""), '/package.json'))).version;

// IF Running `glad -v`
if (argv.v || argv.version || (argv._[0] && _.contains(['v', 'version'], argv._[0]))) {
    console.log('v' + version);
}

// IF Running `glad list`
else if (argv.l || argv.list || (argv._[0] && _.contains(['l', 'list'], argv._[0]))) {
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
else if (argv.r || argv.run || (argv._[0] && _.contains(['r', 'run'], argv._[0]))) {
  var interactive = (argv.i || argv.interactive || (argv._[2] && _.contains(['i', 'interactive'], argv._[2])));
  process.glad.run = true;
  process.glad.aux = true;

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
        console.error(e);
        console.error("Could Not Load Job", path.join(process.cwd() , argv._[1]))
      }
    }, 5000);

  } catch (e) {
    console.error(e);
  }
}

// Glad Console
else if (argv.c || argv.console || (argv._[0] && _.contains(['c', 'console'], argv._[0]))) {
    process.glad.console = true;
    process.glad.aux = true;
    try {
        require(process.cwd() + '/node_modules/glad/service')(false, {
            port : 4243,
            listen : false,
            interactive : true
        });
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

// If running init
else if (argv.init || argv.i ||(argv._[0] && _.contains(['i', 'init'], argv._[0]))) {
    var cwd = process.cwd(),
        package_path = path.join(cwd, 'src', 'package.json');
    if (fs.existsSync(package_path)) {
        console.log("It seems like there is already an application in here. If you wish to overwrite the existing app with a new one, you must first delete it. Exiting...");
        return process.exit(0);
    }

    cpr(blueprint, process.cwd(), function(err) {

        var package = fs.readFileSync(package_path, 'utf-8');

        // Try to write the author in
        if (process.env.USER) {
            package = package.replace('"author": ""', '"author": "' + process.env.USER + '"');
            fs.writeFileSync(package_path, package);
        }

        console.log("Setting up a Vagrantfile...");
        fs.writeFileSync(path.join(cwd, 'Vagrantfile'), fs.readFileSync(path.join(cwd, 'Vagrantfile'), 'utf-8').replace("{{synced-folder}}", cwd));


        console.log("Installing Packages...".yellow);

        // Install any Dependencies
        npm = child.spawn('npm', ['install'], {
            cwd: path.join(cwd , 'src')
        });

        npm.stdout.setEncoding('utf8');
        npm.stdout.on('data', function(stdout) {
            console.log(('NPM >  ' + stdout).yellow);
        });

        npm.on('close', function(code) {

            if (code === 0) {
                console.log("All Done! ".green);

                if (prefs.editor) {
                    child.exec(prefs.editor + " .");
                }

            } else {
                console.log("ERROR: NPM could not install required packages, You will have to do it manually".red);

                if (prefs.editor) {
                    child.exec(prefs.editor + " .");
                }
            }
        });
    });
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
    //console.log("Coming Soon");
     (function() {
         var pathToStub = argv._[1],
             model = argv.model,
             package,
             npm,
             projectExists = false;

         if (!fs.existsSync(path.join(process.cwd(), '/package.json'))) {
             return console.log("OOPS! You must be in a project in order to run glad stub");
         }

         if (!model) {
             console.log('Error: You need to specify the model, --model users'.red);
             console.log('Try Again'.red);
             return;
         }

         if (!pathToStub) {
             console.log('Error: You need to specify the path to the stub, glad stub /path/to/stub --model users'.red);
             console.log('Try Again'.red);
             return;
         }

         if (fs.existsSync(pathToStub)) {

             var template_dir = path.join(__dirname, "template"),
                 src_model_path = path.join(pathToStub, "model.js"),
                 src_controller_path = path.join(pathToStub, "controller.js"),
                 src_route_path = path.join(pathToStub, "route.js"),
                 src_test_path = path.join(pathToStub, "test.js"),

                 dest_file = (model.toLowerCase() + ".js"),
                 dest_model_path = path.join(process.cwd(), "models" , dest_file),
                 dest_controller_path = path.join(process.cwd(), "controllers", dest_file),
                 dest_route_path = path.join(process.cwd(), "routes", dest_file),
                 dest_test_path = path.join(process.cwd(), "tests", dest_file),

                 src_model,
                 src_controller,
                 src_route,
                 src_test,

                 model_exists = fs.existsSync(src_model_path),
                 controller_exists = fs.existsSync(src_controller_path),
                 route_exists = fs.existsSync(src_route_path),
                 test_exists = fs.existsSync(src_test_path);

             if (model_exists) {
                src_model = fs.readFileSync(src_model_path, "utf-8");
             } else {
                console.log("Since there was no model.js blueprint found in " + pathToStub + " Glad automatically used the default model blueprint");
                src_model = fs.readFileSync(path.join(template_dir, "model.js"), "utf-8");
             }

             if (controller_exists) {
                 src_controller = fs.readFileSync(src_controller_path, "utf-8");
             } else {
                 console.log("Since there was no controller.js blueprint found in " + pathToStub + " Glad automatically used the default controller blueprint");
                 src_controller = fs.readFileSync(path.join(template_dir, "controller.js"), "utf-8");
             }

             if (route_exists) {
                 src_route = fs.readFileSync(src_route_path, "utf-8");
             } else {
                 console.log("Since there was no route.js blueprint found in " + pathToStub + " Glad automatically used the default route blueprint");
                 src_route = fs.readFileSync(path.join(template_dir, "route.js"), "utf-8");
             }

             if (test_exists) {
                 src_test = fs.readFileSync(src_test_path, "utf-8");
             } else {
                 console.log("Since there was no test.js blueprint found in " + pathToStub + " Glad automatically used the default test blueprint");
                 src_test = fs.readFileSync(path.join(template_dir, "test.js"), "utf-8");
             }


             fs.writeFileSync(dest_model_path, src_model.replace(/\{\{model}}/g, model));
             fs.writeFileSync(dest_route_path, src_route.replace(/\{\{model}}/g, model));
             fs.writeFileSync(dest_test_path, src_test.replace(/\{\{model}}/g, model));
             fs.writeFileSync(dest_controller_path,
                 src_controller
                     .replace(/\{\{model}}/g, model)
                     .replace(/\{\{model_cap}}/g, (model[0].toUpperCase() + model.slice(1, (model.length - 1)))));


         } else {

             console.log('The Path ' + pathToStub + ' Does Not Exist'.red);
             if (pathToStub.charAt(0) === '/') {
                 console.log("Absolute Path: ", pathToStub);
             } else {
                 console.log("Absolute Path: ", path.join(process.cwd(), pathToStub));
             }
         }

     }());
}
