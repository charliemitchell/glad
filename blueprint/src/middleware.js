var middleware = require('glad').middleware.extend({

    custom : function (app, express) {
        // To Serve Static Assets ...
        // app.use(express.static(require('path').join(process.cwd(), '/client/')));
    },

    // Will get called on every request, after getting the session info
    onRequest : function (req, res, next) {
        next();
    },

    // this method will execute on EVERY response
    onAfterController : function (req, res) {
        
    },

    // This method will only execute after a GET Request
    onAfterGET : function (req, res) {
        
    },
    
    // This method will only execute after a POST Request
    onAfterPOST : function (req, res) {
        
    },

    // This method will only execute after a PUT Request
    onAfterPUT : function (req, res) {
        
    },

    // This method will only execute after a DELETE Request
    onAfterDELETE : function (req, res) {
        
    }
});

module.exports = middleware;