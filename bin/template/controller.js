var {{model_cap}} = require('./../models/{{model}}');

require('glad').colors;

function onError (res, err) {
    res.status(500).json({
        error : err
    });
}

module.exports = {

    GET : function (req, res) {
       {{model_cap}}.find(function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json({{model}});
            }    
        });
    },
    
    findOne : function (req, res) {
        {{model_cap}}.findOne({
            _id: req.params.id
        }).exec(function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json({{model}});
            }    
        });
    },

    scaffold : function (req, res) {
        {{model_cap}}.findOne({
            _id: req.params.id
        }).exec(function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                var path = req.params['0'].split('/'),
                    scaffold = {{model}};

                for (var i=0, len=path.length; i < len; i +=1) {
                    if (scaffold[path[i]] === undefined ) {
                        res.status(404).json({
                            error : "The path " + path[i] + " does Not Exist on the resource " + ((i-1 === -1) ? " {{model}} " : (path[i-1]))
                        })
                        return;
                    } else {
                        scaffold = scaffold[path[i]];
                    }
                }

                res.status(200).json(scaffold);
            }
        });
    },

    POST : function (req, res) {
        new {{model_cap}}(req.body).save(function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                // You should set a location header when POSTing
                res.location('http://www.{{mywebapp.com}}/api/{{model}}/' + {{model}}._id).json({{model}});
            }
        });
    },

    PUT : function (req, res) {

        {{model_cap}}.findOneAndUpdate({_id: req.params.id}, req.body, {/*upsert: true*/}, function (err, doc) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json(doc);
            }
        });
    },

    DELETE : function (req, res) {
        {{model_cap}}.findOne({_id: req.params.id}).remove(function (err) {
            if (err) {
               onError(res, err);
            } else {
                res.status(200).json({id : req.params.id, status : "deleted"});
            }
        });
    }
}