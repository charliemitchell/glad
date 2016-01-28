/**
 * The {{model}} Model
 *
 * @module models/{{model}}
 * @version 1.0
 */
var mongoose = require('glad').mongoose,
    Schema = mongoose.Schema,
    validator = require('glad').validate,
    setter = require('glad').setter,
    dataVersions = require('glad').dataVersions;

// Edit Your Model Here
var {{model}} = new Schema({

});

/* OPTIONAL FEATURES

    // copy the `_id` field over to a virtual field named `id`.
    {{model}}.virtual('id').get(function(){
        return this._id.toHexString();
    });
    {{model}}.set('toJSON', {
        virtuals: true
    });

    // Create Instance methods for transforming your document to alternate versions.
    dataVersions.create({
        schema : {{model}},
        versions : {
            systemData : [],  // (remove ) Data that should never be delivered to a user, regardless of their role.
            privateData : [], // (remove ) Data that available to a resource owner, but should be hidden from any public version of the document
            minimalData : []  // (include) Useful for autocomplete, or searching, etc... When you only need just a few fields from a doc.
        }
    });

*/


mongoose.model('{{model}}', {{model}});

module.exports = mongoose.model('{{model}}');


/*
     If you don't want to use mongoose's default behavior for determining collection names
     you can specify the exact name of your collection by using this instead.
     switch to this ----> mongoose.model('{{model}}', {{model}}, '{{model}}');
     Otherwise mongoose will follow REST resource conventions and pluralize what it thinks a resource is.
     So If your model was "Customer" then it would create a resource (collection) "Customers".
     By Specifying the 3rd parameter, you are telling mongoose that you would like to explicitly declare the collection name.
 */
