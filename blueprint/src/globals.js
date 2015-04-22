/*
    Boileplate, the server will wait for this callback. Define any Globals in here.
    You must add globals to the global namespace.
*/

require('glad').colors;

module.exports = function (global, callback) {

    // Usage, anywhere in the application. :: global.logJSON({foo:'boo'});
    // global.logJSON = function (object) {
    //     var prefix = "JSON:".yellow;
    //     console.log(prefix, JSON.stringify(object));
    // };
    /////////////////////////////////////////////////////////////


    // OR, create private stuff, and choose how to expose the global
    // var privateString = "Hello I am a private string";
    // var privateNumber = 120;
    // var privateMethod = function (input) {
    //     console.log(privateString, privateNumber, input);
    // };
    // global.myLogger = privateMethod; // Expose the private method as myLogger
    ////////////////////////////////////////////////////////////////

    callback(); // Do not remove this callback.
}