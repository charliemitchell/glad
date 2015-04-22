
# NIMBLE-API
##### Currently this project is under heavy development...
Expect there to be a bit of version-itus until v1.0.0

## Required
* [Node.js](http://nodejs.org/) (with NPM)
* [Mongo DB](http://mongodb.org/)


## Optional
* [Redis](http://redis.io/) (No longer a requirement unless you are using a session)


## Installation

* `(sudo) npm install -g nimbleapi`

## Running / Development

*  to create a new nimble server
 * Create a Folder Named foo: `nimble-api new foo` OR  `mkdir foo`
 * Go Inside the folder: `cd foo`
 * Generate a Service that listens to the route bar: `nimble-api api bar && cd src`
 * Start The Server: `nimble-api s` Or run the tests `npm test`
* Visit your app at [http://localhost:4242/bar](http://localhost:4242/bar).

## Some Built In Validations
Nimble comes packaged with some built in validations for your model. We use Google's Caja (the sanitize package) as the default sanitizer, furthermore we have built in some really nice features around the mongoose setter. So far we have provided some common transformations.
* sentence case
 * lor ipsom. dol amore. --> Lor ipsom. Dol amore. 
* lower case
 * Myemail@Mail.com --> myemail@mail.com
* upper case
 * acme inc --> ACME INC
* title case
 * acme inc --> Acme Inc
* number
 * '1234' --> 1234 
* sanitize

## Mimimal setup required...
### Open your config file...
```js
    module.exports = {
            
        port : 4242,  // <--------- What port should this service handle
        
        redis : {
          host: 'localhost',
          port: 6379,
          key : 'sess:' // <-------- Change this to match your session key in redis
        },

        cookie : {
          name : 'yourcookie.sid',  // <---- Change this to match your cookie name
        },
        
        mongodb : {
            host : 'localhost',
            port : 27017,
            database : 'yourdatabase' // <-- CHANGE THIS to match your database
        }

        // etc...
    }
```

### Now Open Up your Model File 
(This will be pre-generated, all you have to do is define your model)

```js
    var Bar = new Schema({
        // <--- Define your model in here
        /* Example
            name : {
                type : String,
                set : setter.titleCase
            },
            address : {
                type : String
            }
        */
    });
```

### Lastly Setup your Policy,
(this is also pre-generated)
```js
module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"}); // <---- What do you do when they are not logged in
    },

    authenticated : function (req, res, accept, reject) {
        if (req.session) {
            if (req.session.loggedin) { // <--- what key on the session say's they are logged in ?
                accept(); // accept the request, all is good
            } else {
                reject(); // reject the request, this will end up calling the above onFailure method
            }
        } else {
            reject(); 
        }
    }

    // <--- add additional policies if needed
};
```

### More fine grained control.
The Hooks File Provides hooks that fire while your server is being constructed. You can acess the app object as well as the express object using these hooks. This way if you need to extend the app object before or after a specific "app.use" you can do this here. The hooks object will fire sequentially from top to bottom so it makes it easy to figure out in what order the app is being configured, as well as at what point you would like to extend the app object.

## Routing
Routing is centered around REST. In the routes.js file you will see the routes object. It is organized by request method. this will eventually make it's way to the express router.
```js
module.exports = {
    GET: [{
        path: '/users',
        action: 'getUserList',
        policy: 'authenticated'
    },{
        path: '/users/:id',
        action: 'getUserById',
        policy: 'authenticated'
    }],

    POST: [{
        path: '/users',
        action: 'createUser',
        policy: 'authenticated'
    }],


    PUT: [{
        path: '/users/:id',
        action: 'updateUser',
        policy: 'authenticated'
    }],

    DELETE: [{
        path: '/users/:id',
        action: 'deleteUser',
        policy: 'authenticated'
    }]
}
```
As you can see you have an array of Get, Post, Put, Delete methods. the combination of request method and url are used to determine the action to take, and the policy to implement. 
* path : matching url
* action : the controller method to call when this route is matched
* policy : the policy method to call in order to determine if the action is allowed. * see policies.js


### Nimble Service Exposes any of it's dependencies to you via the nimbleservice object.
This way we don't need to have duplicate dependencies.
```
    require('nimbleservice').mongoose  // <-- the mongoose ODM
    require('nimbleservice').colors    // <-- colors for your logs
    require('nimbleservice').lodash    // <-- similar to underscore, with a few enhancements
    require('nimbleservice').express   // <-- express js
    require('nimbleservice').promise   // <-- bluebird (async awesomeness)
    require('nimbleservice').moment    // <-- awesome date library
```

## Docker
If you are using docker, nimble will automatically generate a Dockerfile for you. If Not, Just ignore it.
## Vagrant
Nimble will auto generate a Vagrant file with Ubuntu as part of the default blueprint. It also includes a bootstrap.sh file that will run when Vagrant Creates your VM. By Default it installs docker.
## Stubs (Blueprinting)
With Nimble you can create stubs and generate new services based on any template you would like. The templating is very straight forward. See the blueprints folder to see what a blueprint looks like.
* To Generate a service from a blueprint
* `nimble stub /path/to/stub/ --model users`

This will (recursively) copy all files from the path given to the current working directory, and fill in all of the template variables with the name of the model given.

## Testing
Some basic tests are written for you, any route that you define in the router will be tested when running npm test. You should run your tests from the src directory.

## Additional Commands
`nimble set port 1234` will change the port to 1234 in your config file, (and your dockerfile if you have one). (you can pass in any number for your port)

`nimble-api p --editor=subl` will set the default editor for your projects to sublime. (This should be the bash command used to open your editor) (in bash: subl .)

`nimble-api p --editor=atom` will set the default editor for your projects to atom (provided that atom's binary is symlinked). (This should be the bash command used to open your editor) (in bash: atom .)

## Common Mistakes
You must use a Content-Type header in your request, otherwise the body will never get parsed. (Talking to you POSTMAN people who forget to use headers)

## GITHUB
* [nimbleservice](https://www.github.com/charliemitchell/nimble) 