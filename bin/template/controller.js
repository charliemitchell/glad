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

        {{model_cap}}.findOne({_id: req.params.id}).remove(function (err) {
            if (err) {
                onError(res, err);
            } else {
                req.body._id = req.params.id;
                new {{model_cap}}(req.body).save(function (err, {{model}}) {
                    if (err) {
                        onError(res, err);
                    } else {
                        res.status(200).json({{model}});
                    }
                });
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