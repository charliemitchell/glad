var dot = require('dot-object');

module.exports = function (deselection) {
    return function (keysOnly) {
        var output = {},
            docObject;

        if (keysOnly) {
            return deselection;
        } else {
            docObject = this.toObject();

            Object.keys(docObject).forEach(function (key) {
                if (docObject.hasOwnProperty(key)) {

                    if (deselection.indexOf(key) === -1) {
                        dot.copy(key, key, docObject, output);
                    }
                }
            });
            return output;
        }
    };
};