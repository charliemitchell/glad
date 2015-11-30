/**
 * Creates a minimal data version of a document.
 * Especially useful when you only need to send a few details about the document down the wire.
 * An example use case for this is where a summarized document is first shown to the user, and the complete document loaded upon some interaction with the summary
 * @export minimalData
 * @type {*|exports|module.exports}
 */

var Method = require('../method'),
    keyDifference  = require('../helpers/keyDifference');

module.exports = function (schema, keys) {
    // The Deselection array is cached
    var deselection = keyDifference (keys, schema.tree, 'getter');
    schema.methods.minimalData = new Method(deselection);
};

