var localhost = process.env.LOCALHOST || 'localhost';

module.exports = {

    port : 4242, /*ns-port*/

    sessionless : false, // Set True if you don't want to use a session

    verbose : false,

    reportGlobalVars : true,

    exposeModels : false, // Set True if you would like to expose Models as Global Variables

    /**
     * Typically Used for key sharing between separate server (service) instances.
     */
    localkey : process.env.LOCALKEY || 'dev',

    localhost : localhost, // address of localhost (can differ if using Docker, etc...)

    bodyParser : 'json', // What Kind of API is this [https://www.npmjs.com/package/body-parser]

    maxBodySize : '100kb', // The max body size of a request [https://www.npmjs.com/package/body-parser]

    // Used For Session, remove this if you are not using redis.
    redis : {
        host: localhost,
        port: 6379,
        key : 'sess:',
        username : false,
        password : false
    },

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
        database : 'yourdatabase',
        username : false,
        password : false
    }
};