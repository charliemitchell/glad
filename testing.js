var bluebird = require('bluebird');
var extend = require('./utility').object.extend;
var path = require('path');
var config = require(path.join(process.cwd(), 'config'));
var http = require('http');

module.exports = {
    
    get : function (url, customOptions) {
        return new bluebird.Promise(function (resolve, reject) {
            var options = this.requestOptions('GET', url);
            if (customOptions) {
                extend(options, customOptions);
            }
            http.get(options, resolve).on('error', reject);
        }.bind(this));
    },

    getJSON : function (url, customOptions) {
        return new bluebird.Promise(function (resolve, reject) {
            var options = this.requestOptions('GET', url);
            var data = '';

            if (customOptions) {
                extend(options, customOptions);
            }
             
            var req = http.get(options, function (res) {
                
                res.on('data', function (newdata) {
                    data += newdata;
                });

                res.on('end', function () {
                    data = data ? JSON.parse(data) : data;
                    res.body = data;
                    resolve(res);
                }).on('error', reject);
            });

        }.bind(this));
    },

    post : function (url, data, customOptions) {
        var options = this.requestOptions('POST', url, data);
        
        if (customOptions) {
            extend(options, customOptions);
        }

        return new bluebird.Promise(function (resolve, reject) {
            var req = http.request(options, resolve);
            req.on('error', reject);
            if (data) {
                req.write(data || '{}');
            }
            req.end();
        });
    },

    put : function (url, data, customOptions) {
        var options = this.requestOptions('PUT', url, data);
        
        if (customOptions) {
            extend(options, customOptions);
        }

        return new bluebird.Promise(function (resolve, reject) {
            var req = http.request(options, resolve);
            req.on('error', reject);
            if (data) {
                req.write(data || '{}');
            }
            req.end();
        });
    },

    del : function (url, customOptions) {
        return new bluebird.Promise(function (resolve, reject) {
            var options = this.requestOptions('DELETE', url);
            if (customOptions) {
                extend(options, customOptions);
            }
            http.get(options, resolve).on('error', reject);
        }.bind(this));
    },

    head : function (url, customOptions) {
        return new bluebird.Promise(function (resolve, reject) {
            var options = this.requestOptions('HEAD', url);
            if (customOptions) {
                extend(options, customOptions);
            }
            http.get(options, resolve).on('error', reject);
        }.bind(this));
    },

    requestOptions : function (method, url, data) {
        return {
            host : config.localhost,
            port : config.port,
            path : url,
            method : method,
            headers : {
                'Content-Type' : 'application/json',
                'Content-Length' : data ? data.length : 0
            }
        }
    }
};