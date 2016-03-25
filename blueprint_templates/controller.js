/**
 * The {{model_cap}} Controller
 *
 * @module controllers/{{model}}
 * @version 1.0
 */

var {{model_cap}} = require('./../models/{{model}}');

function onError (res, err) {
    res.status(500).json({
        error : err
    });
}

module.exports = {

    /**
     * ## Gets A list of {{model}}
     * ```
     * GET /api/{{model}}
     * ```
     * */
    GET : function (req, res) {
       {{model_cap}}.find(function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json({{model}});
            }    
        });
    },

    /**
     * ## Gets An individual {{model}}
     * ```
     * GET /api/{{model}}/:id
     * ```
     * */
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

    /**
     * ## Scaffold into the {{model}} data structure
     * This endpoint will return the data for a given key on a given {{model}} resource
     * ```
     * GET /api/{{model}}/:id/*
     * ```
     * @param req {object} - The Request Object
     * @param res {object} - The Response Object
     * */
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
                    if (!scaffold || scaffold[path[i]] === undefined ) {
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

    /**
     * ## Create a {{model}}
     * ```
     * POST /api/{{model}}/
     * ```
     * */
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

    /**
     * ## Update a {{model}}
     * ```
     * PUT /api/{{model}}/:id
     * ```
     * */
    PUT : function (req, res) {

        {{model_cap}}.findOneAndUpdate({_id: req.params.id}, req.body, {/*upsert: true*/}, function (err, {{model}}) {
            if (err) {
                onError(res, err);
            } else {
                res.status(200).json({{model}});
            }
        });
    },

    /**
     * ## Delete a {{model}}
     *
     * ```
     * DELETE /api/{{model}}/:id
     * ```
     * */
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