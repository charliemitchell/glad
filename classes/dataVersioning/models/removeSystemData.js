/**
 * Removes Data associated only with the system that should be private even if the document pertains to a user.
 * An example would be a boost field or a weight field used by the system to declare more relevance over other documents
 * in it's collection.
 * Expected Inputs
 *
 * @export removeSystemData
 * @param schema
 */
var Method = require('../method');

module.exports = function (schema, keys) {
    schema.statics.removeSystemData = new Method(keys);
};

// Usage Example
/**
    foo.find().exec(function (err, docs) {
        docs = docs.map(function(doc) {
            return doc.removeSystem(); // No longer an instance object
        });
    });
 */