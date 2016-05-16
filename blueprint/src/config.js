var localhost = process.env.LOCALHOST || 'localhost'; // Address of localhost
var database = process.env.test ? 'yourtestdatabase' : 'yourdatabase'; // The Database To Connect To

module.exports = {

    port : 4242, /*ns-port*/

    sessionless : false, // Set True if you don't want to use a session

    verbose : false, // Additional logging

    logHTTP : true, // Log request, routing, and response information

    reportGlobalVars : true, // Log any globals that get created during startup

    exposeModels : false, // Set True if you would like to expose Models as Global Variables

    localkey : process.env.LOCALKEY || 'dev', // typically used for key sharing between instances

    localhost : localhost, // address of localhost (can differ if using Docker, etc...)

    bodyParser : 'json', // What Kind of API is this [https://www.npmjs.com/package/body-parser]

    maxBodySize : '100kb', // The max body size of a request [https://www.npmjs.com/package/body-parser]

    // Redis (Just Remove this entire key if you would like to run without redis)
    redis : {
        host: localhost,
        port: 6379,
        key : 'sess:',
        username : false,
        password : false
    },

    // Cookie
    cookie : {
        name : 'connect.sid',
        secret: 'Your session secret',
        resave : false,
        saveUninitialized : true,
        maxAge : (24 * 3600000)

    },

    // MongoDB (Just Remove this entire key if you would like to run without mongo DB)
    mongodb : {
        host : localhost,
        port : 27017,
        database : database,
        username : false,
        password : false
    }
};