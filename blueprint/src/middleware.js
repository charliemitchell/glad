var middleware = require('glad').middleware.extend({
    // Injects custom Middleware after Router (USEFUL FOR STATIC PAGES)
    custom : function (app, express) {
        // To Serve Static Assets ...
        // app.use(express.static(require('path').join(process.cwd(), '/client/')));
    },

    // Will get called on every request, before anything is handled
    onRequest : function (req, res, next) {
        console.log((req.method + ":").cyan, (req.url).cyan);
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