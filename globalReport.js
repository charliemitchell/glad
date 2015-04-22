var nativeGlobals = Object.keys(global);


module.exports = function () {
    var globalVars = [];
    Object.keys(global).forEach(function (key) {
        if (nativeGlobals.indexOf(key) === -1)
            globalVars.push(key)
    });

    return globalVars.toString();
}


