var addressObjectKeys = require('../helpers/addressObjectKeys');

module.exports = function keyDifference (keys, object, stop_if_key_exists, void_function) {
    var allKeys;

    stop_if_key_exists = stop_if_key_exists || '';
    void_function = void_function || function () { return true; };
    allKeys = addressObjectKeys(object, stop_if_key_exists, void_function);

    return allKeys.filter(function (path) {
        return keys.indexOf(path) === -1;
    });
};