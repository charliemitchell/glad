[![Code Climate](https://codeclimate.com/github/charliemitchell/glad/badges/gpa.svg)](https://codeclimate.com/github/charliemitchell/glad)

# GLAD

## Required
* [Node.js](http://nodejs.org/) (with NPM)


## Optional
* [Redis](http://redis.io/)
* [Mongo DB](http://mongodb.org/)

## Installation

* `(sudo) npm install -g glad`

## Running / Development

*  to create a new glad server
 * Create a Folder Named foo: `glad new foo` OR  `mkdir foo`
 * Go Inside the folder: `cd foo`
 * Generate an endpoint for the route bar: `glad api bar && cd src`
 * Start The Server: `glad s` Or run the tests `npm test`
* Visit your app at [http://localhost:4242/bar](http://localhost:4242/bar).

## Some Built In Validations
Glad comes packaged with some built in validations for your model. We use Google's Caja (the sanitize package) as the default sanitizer, furthermore we have built in some really nice features around the mongoose setter. So far we have provided some common transformations.
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
### Open your config file... (Already set up to defaults)
```js
    //....

    port : 4242, //<--- Choose a Port (Defaults 4242) 

    sessionless : false, //<--- Set True if you don't want to use a session

    verbose : false, //<--- Level of logging
    
    // ...
    
    bodyParser : 'json', // What Kind of API is this 

    redis : {
      host: localhost,
      port: 6379
      key : 'sess:' // <---- Your Session Key
    },

    cookie : {
      name : 'yourcookie.id', //<--- Your Cookie Name
      secret: 'Your session secret' // <---- Your Session Secret
    },

    // MongoDB (Just Remove this entire key if you would like to run without mongo DB)
    mongodb : {
        host : localhost,
        port : 27017,
        database : 'yourdatabase'
    }
    
    // etc..
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
Routing is centered around REST. In the routes folder file you will find your routes. The routes object is organized by request method. this will eventually make it's way to the express router.
```js
module.exports = {
    GET: [{
        path: '/users',         // <--- what url does this entry match
        action: 'getUserList',  // <--- what controller method should handle this request
        policy: 'authenticated' // <--- what poily applies to this route
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


### Glad Exposes any of it's dependencies or tools to you via the glad object.
```js
    require('glad').mongoose  // <-- the mongoose ODM
    require('glad').colors    // <-- colors for your logs
    require('glad').lodash    // <-- similar to underscore, with a few enhancements
    require('glad').express   // <-- express js
    require('glad').promise   // <-- bluebird (async awesomeness)
    require('glad').moment    // <-- awesome date library
    require('glad').utility   // <-- utility class
    require('glad').setter    // <-- Model Transforms
    require('glad').logger    // <-- Logging Class
    require('glad').mongoose  // <-- ODM
    require('glad').promise   // <-- Bluebird (https://www.npmjs.com/package/bluebird)
    require('glad').session   // <-- Session (express-session)
    require('glad').ncp       // <-- NCP (https://www.npmjs.com/package/ncp)
    require('glad').redis     // <-- Redis Client (https://www.npmjs.com/package/redis)
    require('glad').connectRedis    // <-- Redis Store (https://www.npmjs.com/package/connect-redis)
    require('glad').errorHandler    // Express Error Handler
    require('glad').cookieParser    // <-- Redis Store (https://www.npmjs.com/package/cookie-parser)
    require('glad').methodOverride  // (https://www.npmjs.com/package/method-override)
    require('glad').optimist        // <-- process arguments utility (https://www.npmjs.com/package/optimist)
    require('glad').sanitizer       // <-- String Sanitization (Based on Google's Caja) (https://www.npmjs.com/package/sanitizer)
    require('glad').dataVersions    // <-- Data versioning class for model data.

```

### The Utility Class
For now, there are a few utility methods. I'll work on rollling out much more, soon. I take requests!
```js
    var utility = require('glad').utility,
        object = utility.object;

    var foo = {
        a: "a",
        b: "b",
        c: {
            a : [
                {
                    a : "a"
                }
            ]
        }
    };

    var fooClone = object.clone(foo); // <--- Fully Cloned Version Of foo.
    var fooLike = object.extend(foo, {a : "new a"}); // <--- Fully Cloned, Props Overwritten.

```

## Docker
If you are using docker, glad will automatically generate a Dockerfile for you. If Not, Just ignore it.
## Vagrant
Glad will auto generate a Vagrant file with Ubuntu as part of the default blueprint. It also includes a bootstrap.sh file that will run when Vagrant Creates your VM. By Default it installs docker.

## Stubs (Blueprinting) *NOT READY QUITE YET
With Glad you can create stubs and generate new services based on any template you would like. The templating is very straight forward. See the blueprints folder to see what a blueprint looks like.
* To Generate a service from a blueprint
* `glad stub /path/to/stub/ --model users`

This will (recursively) copy all files from the path given to the current working directory, and fill in all of the template variables with the name of the model given.

## Testing
Some basic tests are written for you, any route that you define in the router will be tested when running npm test. You should run your tests from the src directory.

## Additional Commands
`glad set port 1234` will change the port to 1234 in your config file, (and your dockerfile if you have one). (you can pass in any number for your port)

`glad p --editor=subl` will set the default editor for your projects to sublime. (This should be the bash command used to open your editor) (in bash: subl .)

`glad p --editor=atom` will set the default editor for your projects to atom (provided that atom's binary is symlinked). (This should be the bash command used to open your editor) (in bash: atom .)

## Common Mistakes
* You must use a Content-Type header in your request, otherwise the body will never get parsed.


## How To's
#### Create a session

```js
// controllers/login.js
/*
Users Model Gets Required in, 
sanitizer gets required in, 
bcrypt get's installed and required in if you use it) 
etc...
*/
POST : function (req, res) {

        Users.find({
            email : sanitize(req.body.email),
        }).exec(function (err, users) {

            if (users.length) {

                var user = users[0];

                if (bcrypt.compare(sanitize(req.body.password))) {
                    req.session.authenticated = true; // Create A Valid Session
                    req.session.user = user; // Store Some Data on the session
                    res.json(user);

                } else {
                    res.json({
                        err : "The password does not match our records."
                    });
                }
            } else {
                res.json({
                   err : "The Email " +  sanitize(req.body.email) + " Does Not Exist."
                });
            }
        });
    }
    //etc...
```

## Using Your Own Session Logic
In The middleware.js file, simply add a method called session.
```js
{
    //etc...
    session : function (app) {
        // Create Your Session Here instead of the default provided by Glad (If you want to use something other than redis, or your own implementation)
    }
    //etc...
}
```
## Using Your Own Session Implementation
In The hooks.js file, add something to the degree of
```js
module.exports = {
    app : function (server, app, express) {
        app.set('trust proxy', 1); // trust first proxy
        var session = glad.session,
            RedisStore = glad.connectRedis(session),
            sessions =  session({
                secret: config.cookie.secret,
                resave: false,
                store: new RedisStore(),
                saveUninitialized: true,
                cookie: { maxAge : 60 * 60 }
            });
        app.use(sessions);
    },
    // etc...
}
    
```

# Advanced Topics
#### Data Versioning using glad.dataVersions
In most cases you will find yourself transforming models to ensure only the allowed data gets sent out of a request. 
with `glad.dataVersions` you can compose these transforms very easily in the model. There are a few built in transforms, as well as some tools 
to assist you in creating your own. All with just a few lines of code. Please Read The following.

```
 /* Each Model Version should accept a boolean value as it's first parameter that determines whether or not to perform the operation or just return the keys
 * that would be excluded from it's resulting transform. This is so that the main method can chain multiple calls to transform the document.
 *
 * The instance methods must accept an array of keys in which to apply the transform to. The method must support dot delimited object path key naming.
 * This way an engineer will be able to pass in key names like ["foo.bar", "baz", "free.bee.tree.knee"]
 *
 * Also Be aware that a naming convention should be in place here. If you create a new "Version" Then the key to describe it should be Camel Cased.
 * Furthermore, the same name should be used as the filter name ("Version Name"), with the exception where the describing key (in the schema) defines data that should be removed.
 * For example:
 */
 
   var myModel = new Schema({
       name : { type : String },
       address : { type : String },
       password : { type : String},
       boost : { type : Number }
   });
 
   dataVersions({
      schema : myModel,
      versions : {
          minimalData : ["_id", "name", "address"],
          systemData  : ["boost"],
          privateData : ["password"]
      }
   });
 
   // For the "describing keys" minimalData, privateData, systemData
   // Then we would expect the schema methods to be named minimalData, removePrivateData, removeSystemData
   // This is so that it is clear what the method will be doing.
   // It will either remove the field that has the "describing key" or it will only include fields containing the describing key.
 
   // It is important to note that describing key array includes elements that "DESCRIBE" the key. For instance, systemData : ['boost']
   // suggests that boost is a computed property of the systemData data structure. Therefore a method named removeSystemData will provide
   // the inverse of the systemData data structure. Likewise, a method named toSystemData would provide just the systemData data structure.
 
  ```
 
  ## Example
  ```
   myModel.find().exec(function (err, docs) {
       docs = docs.map(function (doc) {
           return doc.removeSystemData();
       });
   });
 
  ```
 
  Example of Using The extend feature
 ```
   // Best to do this during bootstrapping
 
   var dataVersions = require('glad').dataVersions;
 
   // When Key Array points to keys that should be removed
   var myExtension = function (schema, keys) {
        schema.methods.removeStuff = new dataVersions.modelFromDeselectionArray(keys);
    };
    dataVersions.extend('removeStuff', myExtension);
 
 
   // When Keys Array points to keys that make up the version
   var myExtension = function (schema, keys) {
        var deselection = dataVersions.keyDifference (keys, schema.tree, 'getter');
        schema.methods.toProtected = new dataVersions.modelFromDeselectionArray(deselection);
    };
   dataVersions.extend('toProtected', myExtension);
 
 
   // ... Then Somewhere else, in some other file
 
   var dataVersions = require('glad').dataVersions;
   dataVersions.create({
      schema : mySchema,
      versions : {
          removeStuff : ["password", "address", "zipcode", "phone"],
          toProtected : ["_id", "name", "email", "city", "country"]
      }
   });
 
   removeStuff removes all fields that match the keys passed in,
   toProtected removes all fields that do not match the keys passed in
```



## GITHUB
* [glad](https://www.github.com/charliemitchell/glad) 
