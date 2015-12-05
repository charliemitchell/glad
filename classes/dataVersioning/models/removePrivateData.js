/**
 * Removes private data in the document. Private data can be fields in which you feel that only the "Document Owner" should be able to see
 * Such fields may include details such as email address, phone, password, etc.. The Gist here is that it should really target Owner VS Public Versions.
 *
 * @export removePrivateData
 * @type {*|exports|module.exports}
 */
var Method = require('../method'),
    keyDifference  = require('../helpers/keyDifference');

module.exports = function (schema, keys) {
    schema.methods.removePrivateData = new Method(keys);
};