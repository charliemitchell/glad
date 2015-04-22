var path = require('path'),
    join = path.join,
    fs = require('fs'),
    copy = require('ncp'),
    blueprint = path.resolve((__dirname).replace('bin/lib', ""), 'blueprint'),
    template = (__dirname).replace('lib', 'template'),
    glad,
    node_modules = join(process.cwd() , join('src', 'node_modules')),
    package,
    npm,
    model,
    model_cap,
    cwd = process.cwd(),
    child = require('child_process'),
    prefs = require((__dirname).replace('lib', "preferences")),
    readline = require('readline'),
    generate,
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

require("colors");

function exists (question, callback) {
    rl.question(question.red, function(answer) {
      callback(answer);
    });
}

module.exports = function (argv) {

    if (argv._[1]) {
        
        model = argv._[1].toLowerCase();
        model_cap = model.charAt(0).toUpperCase() + model.slice(1);

        generate = {
            
            model : function () {
                fs.writeFileSync('./models/' + model + '.js', fs.readFileSync(join(template, 'model.js'), 'utf-8').replace(/{{model}}/g, model));
                console.log('Generated src/models/' + model + '.js');
            },
            route : function () {
                fs.writeFileSync('./routes/' + model + '.js', fs.readFileSync(join(template, 'route.js'), 'utf-8').replace(/{{api}}/g, model));
                console.log('Generated src/routes/' + model + '.js');
            },
            controller : function () {
                fs.writeFileSync('./controllers/' + model + '.js', fs.readFileSync(join(template, 'controller.js'), 'utf-8').replace(/{{model}}/g, model).replace(/{{model_cap}}/g, model_cap));
                console.log('Generated src/controllers/' + model + '.js');
            },
            test : function () {
                fs.writeFileSync('./tests/' + model + '.js', fs.readFileSync(join(template, 'test.js'), 'utf-8').replace(/{{model}}/g, model));
                console.log('Generated src/tests/' + model + '.js');
            },

            queue : {

                model : function (next) {
                    if (fs.existsSync('./models/' + model + '.js')) {
                        exists("Overwrite " + 'models/' + model + '.js ? [y/n] ', function (answer) {
                            if (answer === "y") {
                                generate.model();
                            } else {
                                console.log("Ignoring Model");
                            }
                            next();
                        });
                    } else {
                        generate.model();
                        next();
                    }
                },
                route : function (next) {
                     if (fs.existsSync('./routes/' + model + '.js')) {
                        exists("Overwrite " + 'routes/' + model + '.js ? [y/n] ', function (answer) {
                            if (answer === "y") {
                                generate.route();
                            } else {
                                console.log("Ignoring Route");
                            }
                            next();
                        });
                    } else {
                        generate.route();
                        next();
                    }

                },
                controller : function (next) {
                    if (fs.existsSync('./controllers/' + model + '.js')) {

                        exists("Overwrite " + 'controllers/' + model + '.js ? [y/n] ', function (answer) {
                            if (answer === "y") {
                                generate.controller();
                            } else {
                                console.log("Ignoring Controller");
                            }
                             next();
                        });
                    } else {
                        generate.controller();
                         next();
                    }
                },
                test : function (next) {
                    if (fs.existsSync('./tests/' + model + '.js')) {
                        exists("Overwrite " + 'tests/' + model + '.js ? [y/n] ', function (answer) {
                            if (answer === "y") {
                                generate.test();
                            } else {
                                console.log("Ignoring Test");
                            }
                            next();
                        });
                    } else {
                        generate.test();
                        next();
                    }
                }
            }
            
        };



        if (fs.existsSync("./package.json")) {
            
            generate.queue.model(function () {
                generate.queue.controller(function () {
                    generate.queue.route(function () {
                        generate.queue.test(function () {
                            console.log("All Done!");
                            rl.close();
                        });
                    });
                });
            });

        } else {
            copy(blueprint, cwd, function(err) {

                fs.writeFileSync('./src/models/' + model + '.js', fs.readFileSync(join(template, 'model.js'), 'utf-8').replace(/{{model}}/g, model));
                fs.writeFileSync('./src/routes/' + model + '.js', fs.readFileSync(join(template, 'route.js'), 'utf-8').replace(/{{api}}/g, model));
                fs.writeFileSync('./src/controllers/' + model + '.js', fs.readFileSync(join(template, 'controller.js'), 'utf-8').replace(/{{model}}/g, model).replace(/{{model_cap}}/g, model_cap));
                fs.writeFileSync('./src/tests/' + model + '.js', fs.readFileSync(join(template, 'test.js'), 'utf-8').replace(/{{model}}/g, model));

                glad = (__dirname).replace(join('bin', 'lib'), "");

                fs.mkdirSync(node_modules);
                fs.mkdirSync(join(node_modules, 'glad'));

                package = fs.readFileSync('./src/package.json', 'utf-8');

                // Try to write the author in
                if (process.env.USER) {
                    package = package.replace('"author": ""', '"author": "' + process.env.USER + '"');
                    fs.writeFileSync('./../src/package.json', package);
                }

                console.log("Setting up a Vagrantfile...");
                fs.writeFileSync('./Vagrantfile', fs.readFileSync('./Vagrantfile', 'utf-8').replace("{{synced-folder}}", process.cwd()));


                console.log("Installing Packages...".yellow);

                // Install any Dependencies
                npm = child.spawn('npm', ['install'], {
                    cwd: cwd + '/src'
                });

                npm.stdout.setEncoding('utf8');
                npm.stdout.on('data', function(stdout) {
                    console.log(('NPM >  ' + stdout).yellow);
                });

                npm.on('close', function(code) {

                    if (code === 0) {
                        console.log("All Done! ".green);

                        if (prefs.editor) {
                            child.exec(prefs.editor + " .")
                        }

                    } else {
                        console.log("ERROR: NPM could not install required packages, You will have to do it manually".red);
                        
                        if (prefs.editor) {
                            child.exec(prefs.editor + " .")
                        }
                    }

                    rl.close();
                });

            });
        }
        
    } else {
        console.log("You need to choose a name for the api you wish to generate");
        rl.close();
    }
}