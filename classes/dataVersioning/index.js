/**
 *
 * Each Model Version should accept a boolean value as it's first parameter that determines whether or not to perform the operation or just return the keys
 * that would be excluded from it's resulting transform. This is so that the main method can chain multiple calls to transform the document.
 *
 * The instance methods must accept an array of keys in which to apply the transform to. The method must support dot delimited object path key naming.
 * This way an engineer will be able to pass in key names like ["foo.bar", "baz", "free.bee.tree.knee"]
 *
 * Also Be aware that a naming convention should be in place here. If you create a new "Version" Then the key to describe it should be Camel Cased.
 * Furthermore, the same name should be used as the filter name ("Version Name"), with the exception where the describing key (in the schema) defines data that should be removed.
 * For example:
 * ```
 *  var myModel = new Schema({
 *      name : { type : String },
 *      address : { type : String },
 *      password : { type : String},
 *      boost : { type : Number }
 *  });
 *
 *  dataVersions({
 *     schema : myModel,
 *     versions : {
 *         minimalData : ["_id", "name", "address"],
 *         systemData  : ["boost"],
 *         privateData : ["password"]
 *     }
 *  });
 *
 *  // For the "describing keys" minimalData, privateData, systemData
 *  // Then we would expect the schema methods to be named minimalData, removePrivateData, removeSystemData
 *  // This is so that it is clear what the method will be doing.
 *  // It will either remove the field that has the "describing key" or it will only include fields containing the describing key.
 *
 *  // It is important to note that describing key array includes elements that "DESCRIBE" the key. For instance, systemData : ['boost']
 *  // suggests that boost is a computed property of the systemData data structure. Therefore a method named removeSystemData will provide
 *  // the inverse of the systemData data structure. Likewise, a method named toSystemData would provide just the systemData data structure.
 *
 * ```
 *
 * ## Pipeline and single method example
 * ```
 *  myModel.find().exec(function (err, docs) {
 *      docs = docs.map(function(doc) {
 *          return doc.forVersion(['removeSystemData', 'removePrivateData', 'minimalData']); // should pipe all the filters
 *      });
 *   });
 *
 *   // ------- OR ----------
 *
 *  myModel.find().exec(function (err, docs) {
 *      docs = docs.map(function (doc) {
 *          return doc.removeSystemData();
 *      });
 *  });
 *
 * ```
 *
 * Example of Using The extend feature
 *
 *  // Best to do this during bootstrapping
 *
 *  var dataVersions = require('glad').dataVersions;
 *
 *  // When Key Array points to keys that should be removed
 *  var myExtension = function (schema, keys) {
 *       schema.methods.removeStuff = new dataVersions.modelFromDeselectionArray(keys);
 *   };
 *   dataVersions.extend('removeStuff', myExtension);
 *
 *
 *  // When Keys Array points to keys that make up the version
 *  var myExtension = function (schema, keys) {
 *       var deselection = dataVersions.keyDifference (keys, schema.tree, 'getter');
 *       schema.methods.toProtected = new dataVersions.modelFromDeselectionArray(deselection);
 *   };
 *  dataVersions.extend('toProtected', myExtension);
 *
 *
 *  // ... Then Somewhere else, in some other file
 *
 *  var dataVersions = require('glad').dataVersions;
 *  dataVersions.create({
 *     schema : mySchema,
 *     versions : {
 *         removeStuff : ["password", "address", "zipcode", "phone"],
 *         toProtected : ["_id", "name", "email", "city", "country"]
 *     }
 *  });
 *
 *  removeStuff removes all fields that match the keys passed in,
 *  toProtected removes all fields that do not match the keys passed in
 *
 *
 * @module DataModels
 * @param schema {mongoose.Schema}
 *
 */
var glad = require('glad');
glad.versions = glad.versions || {};
glad.versions.systemData  = require('./models/removeSystemData');
glad.versions.privateData = require('./models/removePrivateData');
glad.versions.minimalData = require('./models/to_minimal');

module.exports = {
    create : function (params) {

        var schema = params.schema,
            versions = params.versions;

        schema.statics.forVersion = function (transforms) {
            var output = this.toObject();

            if (transforms) {

                transforms.forEach(function (transform) {
                    if (schema.statics[transform]) {
                        schema.statics[transform].call(this, true).forEach(function (key) {
                            delete output[key];
                        });
                    }
                }.bind(this));
            }
            return output;
        };

        Object.keys(versions).forEach(function (key) {
            if (versions.hasOwnProperty(key) && glad.versions[key]) {
                glad.versions[key](schema, versions[key])
            } else {
                console.log("---------------------------------------------------------------".red);
                console.log((" !!! Could not create the data version for " + key).red);
                console.log("---------------------------------------------------------------".red);
            }
        });

    },

    extend : function (name, model) {
        glad.versions[name] = model;
    },

    keyDifference : require('./helpers/keyDifference'),

    modelFromDeselectionArray : require('./method')
};
