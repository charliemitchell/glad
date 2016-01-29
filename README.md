<div style="width:100%; text-align:center; background-color:#F5BE0B;">
<img align="center" src="/media/glad_small.jpg" alt="glad">
</div>

# Glad
[![Code Climate](https://codeclimate.com/github/charliemitchell/glad/badges/gpa.svg)](https://codeclimate.com/github/charliemitchell/glad)

* [Glad JS Website](http://gladjs.com/)

## Required
* [Node.js](http://nodejs.org/) (with NPM)

## Optional
* [Redis](http://redis.io/)
* [Mongo DB](http://mongodb.org/)

## Installation

* `(sudo) npm install -g glad`

## Running / Development

## Quick Start
Step 1: `mkdir <your-app> && cd <your-app>`
<br>
Step 2: `glad api users && cd src`
<br>
Step 3: `glad s`
<br>
You're up and running

## Detailed Start
Step 1: Create a new directory for your app. We'll call it "widget-api" for now   `mkdir widget-api`
<br>
Step 2: Navigate inside the new directory you just created.                       `cd widget-api`
<br>
Step 3: Create a new Glad App                                                     `glad init`
<br>
Step 4: Navigate to the newly created src directory.                              `cd src`
<br>
Step 5: Generate a New API endpoint for your widgets app                          `glad api users`
<br>
Step 6: Boot up the server                                                        `glad s`
<br>
Visit your app at [http://localhost:4242/users](http://localhost:4242/users). You should get an empty JSON array back. 
This means that your users api is up and running, there is just no data in the database. See the section on defining your models to continue and be able to create new users.


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

### Now open up your model file 
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

### Lastly, setup your policy.
(this is also pre-generated) `src/policies.js`
```js
module.exports = {
    
    onFailure : function (req, res) {
        res.json({auth : false, error : "Not Logged In"}); 
    },
    
    // This method is intentionally overly verbose with the nested if/else statements. Hopefully this makes it clear what is happening.
    authenticated : function (req, res, accept, reject) {
        if (req.session) {
            if (req.session.authenticated) { // <--- What value on the session says they are logged in?
                accept(); // Accept the request. All is good
            } else {
                reject(); // Reject the request. This will end up calling the above on failure method.
            }
        } else {
            reject(); 
        }
    },

    // <--- Add additional policies if needed. Examples below....
    isDeveloper : function (req, res, accept, reject) { 
        if (req.session && req.session.developer) {
            accept();
        } else {
            reject("You are not allowed to access this API"); 
        }
    },
    
    // Note: This policy requires you to follow the convention /api/resource/:id
    resourceOwnerOrAdmin : function (req, res, accept, reject) {

        if (!req.params) {
            return reject("Incorrect Parameters: Missing Parameters");
        } else if (!req.params.id) {
            return reject("Incorrect Parameters: Missing ID");
        }

        if (req.session && req.session.authenticated) {
            if (req.session.user.admin) {
                accept();
            } else if (req.session.user.id === req.params.id) {
                accept();
            } else {
                reject("You don't have access to this content");
            }
        } else {
            reject("You must be logged in to do that.");
        }
    }
};
```

### Routing
Routing is centered around REST. In the routes folder file you will find your routes. The routes object is organized by request method.
```js
module.exports = {
    GET: [{
        path: '/users',         // <--- what url does this entry match?
        action: 'GET',  // <--- what controller method should handle this request?
        policy: 'authenticated' // <--- what policy applies to this route?
    },{
        path: '/users/:id',
        action: 'findOne',
        policy: 'resourceOwnerOrAdmin' // <--- Not built in, but in the policies example above.
    }],

    POST: [{
        path: '/users',
        action: 'POST',
        policy: 'authenticated'
    }],


    PUT: [{
        path: '/users/:id',
        action: 'PUT',
        policy: 'authenticated'
    }],

    DELETE: [{
        path: '/users/:id',
        action: 'DELETE',
        policy: 'authenticated'
    }]
}
```
As you can see, you have an array of Get, Post, Put, and Delete methods. 
The combination of request method and url are used to determine the action to take and the policy to implement. 

* path : matching url
* action : the controller method to call when this route is matched
* policy : the policy method to call in order to determine if the action is allowed. * see policies.js

---

## Fine Grained Control with Hooks.
The Hooks file provides hooks that fire while your server is being constructed. 
You can access the app object as well as the express object using these hooks. 
This way if you need to extend the app object before or after a specific "app.use" you can do this here. 
The hooks object template will fire sequentially from top to bottom so it makes it easy to figure out in what order the app is being configured, 
as well as at what point you would like to extend the app object. All of your hooks, with the exception of the `onAfterListen` hook, receive a callback
method that you must invoke in order for your app to finish its booting process.

---

## Run Command
Use `glad run jobs/myjob` to run a script in the context of your application. In this example, the file located at `jobs/myjob.js` will run after an instance of the server is booted up in a separate process.
This instance will not be bound to any port, so it can not be accessed from your network. I find that it is useful for debugging, as well as setting up chron jobs. If you do opt for chron jobs, be sure to 
terminate the process when you are finished.

---

## Interactive Mode
`glad serve -i` or `glad run jobs/myjob -i` will boot up the server in interactive mode (repl).

Once your application is in interactive mode you will have console access to your app so you can inspect globals, run queries in mongoose, debug, and do anything you want to.


#### Example of running a query in interactive mode
```
// Require in model
var Users = require('./models/users');
// Run a Query
Users.find().count().exec(console.log);
// Receive output
null 1209765
```
#### You can make this easier by setting exposeGlobals to true in your config file
```
// Run a Query
Users.find().count().exec(console.log);
// Receive output
null 1209765
```
---

## Console Mode
run `glad console` or `glad c` for short and you will enter into console mode which is similar to Interactive mode, But does not bind to any port or require a file to run.
If you are familiar with Rails, then this is similar to running the Rails console. Just like running `glad serve -i` you will have console access to your app. But this will behave more similarly to the `glad run` command because your application will not bind to any port. <b>You can run</b> `glad console` <b>while</b> `glad serve` <b>is running!</b> You can also have multiple Glad consoles open along with `glad run` jobs as well. They all run independently of each other.


## Built In Validations
Glad comes packaged with some built in validations for your models. 

We use Google's Caja *(the sanitize package)* as the default sanitizer. We have built in some really convienient transforms for you to use to help you reduce the time spent validating and transforming input. 

|setter| Input | Output|
|---:|:---|:---|
|`lowerCase`| <span style="font-size:12px">Myemail@Mail.com</span>| myemail@mail.com|
|`upperCase`| <span style="font-size:12px">acme inc</span>| ACME INC|
|`titleCase`| <span style="font-size:12px">acme inc</span>| Acme Inc|
|`sentenceCase`| <span style="font-size:12px">lor ipsom. dol amore.</span>| Lor ipsom. Dol amore.|
|`number`| <span style="font-size:12px">"36"</span>| 36|
|`sanitize`| <span style="font-size:12px">"foo bar &lt;script&gt;alert('XSS')&lt;/script&gt;"</span>| "foo bar"|
|`safe.lowerCase`| <span style="font-size:12px">Myemail@Mail.com&lt;script&gt;alert('XSS')&lt;/script&gt;</span>|myemail@mail.com|
|`safe.upperCase`| <span style="font-size:12px">acme inc &lt;script&gt;alert('XSS')&lt;/script&gt;</span>| ACME INC|
|`safe.titleCase`| <span style="font-size:12px">acme inc &lt;script&gt;alert('XSS')&lt;/script&gt;</span>|Acme Inc|
|`safe.sentenceCase`| <span style="font-size:12px">lor ipsom. dol amore. &lt;script&gt;alert('XSS')&lt;/script&gt;</span>| Lor ipsom. Dol amore.
|`safe.number`| <span style="font-size:12px">"36&lt;script&gt;alert('XSS')&lt;/script&gt;"</span>| 36|

---

 #### Using the sanitizer in your models
 ```javascript
 // Lets create a simple User Model
 var UserModel = new Schema({
   name : {
     type : String,
     set : setter.sanitize,
     required : true,
     policy : 'resourceOwnerOrAdmin' // <-- We'll get to this shortly
   },
   email : {
     type : String,
     set : setter.safe.lowerCase,
     required : true,
     policy : 'resourceOwnerOrAdmin'
   },
   active : {
     type : Boolean,
     policy : 'systemOnly'
   }
 });
 ```
 As you can see, to apply the transform you use the set key. From now on, whenever you update your model these transforms will automatcally ensure your data fits the mold.

---

### Glad Exposes any of its dependencies or tools to you via the glad object.
```

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
    require('glad').cpr       // <-- CPR Copy Recursively (https://www.npmjs.com/package/cpr)
    require('glad').redis     // <-- Redis Client (https://www.npmjs.com/package/redis)
    require('glad').connectRedis    // <-- Redis Store (https://www.npmjs.com/package/connect-redis)
    require('glad').errorHandler    // Express Error Handler
    require('glad').cookieParser    // <-- Redis Store (https://www.npmjs.com/package/cookie-parser)
    require('glad').methodOverride  // (https://www.npmjs.com/package/method-override)
    require('glad').optimist        // <-- process arguments utility (https://www.npmjs.com/package/optimist)
    require('glad').sanitizer       // <-- String Sanitization (Based on Google's Caja) (https://www.npmjs.com/package/sanitizer)
    require('glad').dataVersions    // <-- Data versioning class for model data.

```

---

### The Utility Class
For now, there are a few utility methods. We'll work on rollling out much more, soon. We take requests!
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
If you are using Docker, Glad will automatically generate a Dockerfile for you. If not, just ignore it.
## Vagrant
Glad will auto generate a Vagrant file with Ubuntu as part of the default blueprint. It also includes a bootstrap.sh file that will run when Vagrant Creates your VM. By Default it installs Docker.

## Stubs (Blueprinting) 
With Glad, you can create stubs and generate new APIs based on any template you would like. This is especially useful if you use a Javascript preprocessor. 
The template syntax is very straight forward. 
See the `blueprints_templates` folder to see what a blueprint looks like or copy the contents and use it as a starting place. 
In your blueprint folder you will have the option to include 4 files that Glad knows how to deal with.

```
--- myBlueprint
------ model.js
------ controller.js
------ route.js
------ test.js
```

All of the files are not required. If any of the files are missing, Glad will substitute it for the default template.  

### To Generate an API from a blueprint run... 

`glad stub [path] --model [model]`

### As an example 

`glad stub /path/to/stub/ --model users`

This would create a new API using your blueprint (stub) and pass in the model name `users ` to the stub compiler.

This will generate an API based on your blueprint.

## Testing
Some basic tests are written for you and any route that you generate will be tested when running `npm test`. You must run your tests from the src directory. 

`cd src && npm test` 
<i style="font-size:10px">(if your current working directory is in your project root)</i>

## Additional Commands

| | |
| ---: |:--- |
| `glad --help` | <span style="font-size:12px">will display a list of all available commands</span> |
| `glad list`   | <span style="font-size:12px">will display a list of all controllers</span>|
| `glad list m` | <span style="font-size:12px">will display a list of all models</span>|
| `glad list r`  | <span style="font-size:12px">will display a list of all routes</span>|
| `glad set port 1234` | <span style="font-size:12px">will change the port to 1234 in your config file,(and your dockerfile if you have one).</span>|
|`glad p --editor=subl` | <span style="font-size:12px">will set the default editor for your projects to sublime.)</span>|
|`glad p --editor=atom` | <span style="font-size:12px">will set the default editor for your projects to atom</span> |



## Don't Forget... 
* To use a Content-Type header in your POST and PUT requests, otherwise the body will never get parsed.


## How To:
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
to assist you in creating your own, all with just a few lines of code. Please read the following.

```
 /* Each Model Version should accept a boolean value as its first parameter that determines whether or not to perform the operation or just return the keys
 * that would be excluded from its resulting transform. This is so that the main method can chain multiple calls to transform the document.
 *
 * The instance methods must accept an array of keys in which to apply the transform to. The method must support dot delimited object path key naming.
 * This way an engineer will be able to pass in key names like ["foo.bar", "baz", "free.bee.tree.knee"]
 *
 * Also, be aware that a naming convention should be in place here. If you create a new "Version" then the key to describe it should be Camel Cased.
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
   // suggests that boost is a computed property of the systemData data structure. Therefore, a method named removeSystemData will provide
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
 
  #### Example of Using The extend feature 
  *Best to do this in your initializer*
 ```
   var dataVersions = require('glad').dataVersions;
 
   // When the keys array points to keys that should be removed
   var myExtension = function (schema, keys) {
        schema.methods.removeStuff = new dataVersions.modelFromDeselectionArray(keys);
    };
    dataVersions.extend('removeStuff', myExtension);
 
 
   // When the keys array points to keys that make up the version
   var myExtension = function (schema, keys) {
        var deselection = dataVersions.keyDifference (keys, schema.tree, 'getter');
        schema.methods.toProtected = new dataVersions.modelFromDeselectionArray(deselection);
    };
   dataVersions.extend('toProtected', myExtension);
 
 
   // ... Then somewhere else, in some other file
 
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

---

# Detailed Overview of the Controller
Your controller is setup with some default <b>REST API handlers.</b> 
You can always add more or create your own blueprint for what makes sense to you. However, this is a great starting place, as it gives you a fully functioning API for your resource and from there you can just add in additional functionality as needed.

It is worth mentioning that the policies used in your route file handle authorizing access to the controllers. This way you should not need to implement access control in a controller and it can always be assumed that the request has access to your controller logic.

## GET
The GET method is in place to handle routes like `/widgets`
The default code will query the widgets collection for a list of all your widgets, 
and respond with a list of widgets in JSON format.

You would be advised to modify the query to implement limiting, query strings etc... 

Query strings are available in the request object.  
In a nutshell, if you hit `/widgets?limit=10&search=widget-2000`
you would get these query paramters from the `req.query`.
```
  //etc...
  GET : function (req, res) {
  	var limit = req.query.limit || 20,
    	search = req.query.search || "";
    // ---> etc...
  },
    //etc...
```

## findOne
The findOne method is in place to handle routes like `/widgets/:id`
The default code will query the widgets collection for the widget with the id that was passed in the url as `req.params.id`, then respond with it in JSON format.

## scaffold
#### Every piece of data has a unique URL.
The scaffold method is in place for handling routes like `widgets/:id/desc`, where desc is a property of widget.
For example, say we have the following widget document. <span style="font-size:11px">(The id is shortened, and an object is represented instead of JSON for the purposes of documenting)</span>
```
{
  id : "h38d7g",
  name : "Super Widget 2000",
  desc : "A widget to rule all widgets!",
  tags : ["super", "widget", "super widget"],
  manufacture : {
  	name : "Super Co",
    stuff : [
        {
            title : "Hey There"
        }
    ]
  }
}
```
The following table would represent just some of the different endpoints that the scaffold would handle.

| URL | The API provides |
| --- |:--- |
| `/widgets/h38d7g/desc` | "A widget to rule all widgets!" |
| `/widgets/h38d7g/name` | "Super Widget 2000" |
| `/widgets/h38d7g/manufacture/name` | "Super Co" |
| `/widgets/h38d7g/tags/0` | "super" |
| `/widgets/h38d7g/tags/1` | "widget" |
| `/widgets/h38d7g/tags` | ["super", "widget", "super widget"] |
| `/widgets/h38d7g/manufacture/stuff/0/title` | "Hey There" |
| `/widgets/h38d7g/manufacture` | `{name:"Super Co",stuff:[{title:"Hey There"}]}`|

The scaffold method will find its way to even your deepest nested objects/arrays. 

Conversion:  `foo.bar[2].stuff.what` --> `foo/bar/2/stuff/what`. 

## POST
The POST method is in place for handling POST requests to routes like `/widgets`. The POST handler will take the data from the request, and store it in the widgets collection in your database.

## PUT
The PUT method is for handling PUT requests to routes like `/widgets/:id`. It will take the data from the request body and update the document in the widgets collection that matches the id provided in the URL. To clarify, the PUT method is designed to update your document with only the fields that get passed in. 

For example, given the following document:
```
{
  id : "h38d7g",
  name : "Super Widget 2000",
  desc : "A widget to rule all widgets!",
  tags : ["super", "widget", "super widget"],
  manufacture : {
  	name : "Super Co",
    stuff : [
        {
            title : "Hey There"
        }
    ]
  }
}
```

and a PUT request to `/widgets/h38d7g` with the following request body:

```
{
  desc : "A widget to rule all widgets! And More!",
  tags : ["super", "widget", "super widget", "awesome widget"]
}
```

Would Result in the following document:
```
{
  id : "h38d7g",
  name : "Super Widget 2000",
  desc : "A widget to rule all widgets! And More!",
  tags : ["super", "widget", "super widget", "awesome widget"],
  manufacture : {
  	name : "Super Co",
    stuff : [
        {
            title : "Hey There"
        }
    ]
  }
}
```

## DELETE
The DELETE method is in place for handling DELETE requests to routes like `/widgets/:id`. The DELETE handler will remove the widget from the widgets collection in your database.

<br>
### Links
This repository is available at [github](https://www.github.com/charliemitchell/glad) 

The Glad JS Website is at [gladjs.com](http://www.gladjs.com)
