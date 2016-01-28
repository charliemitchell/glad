var glad = require('glad'),
    config = require("../config"),
    app = true,
    express,
    server,
    should = require('should'),
    assert = require('assert'),
    http = require('http'),
    fs = require('fs'),
    controller = require("../controllers/{{model}}"),
    router = require("../routes/{{model}}"),
    response = function (callback) {
        return {
            json : function (data) {
                callback(data);
            }
        }
    },
    requestOptions = function (post_data, path, method) {
        return {
          host: config.localhost,
          port: config.port,
          path: path || '/',
          method: method || 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Content-Length': post_data.length
          }
        }
    };

describe('Should Prevent Access if the policy is rejected'.magenta, function() {

    describe("403".magenta, function () {

        router.GET.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("", route.path.replace(':', ''));
                    http.get(headers, function(res) {
                        res.statusCode.should.eql(403);
                        done();
                    });
                });
            }
        });

        router.POST.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a POST request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("{}", route.path.replace(':', ''), 'POST'),
                        req = http.request(headers, function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    req.write('{}');
                    req.end();
                });
            }
        });

        router.PUT.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a PUT request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("{}", route.path.replace(':', ''), 'PUT'),
                        req = http.request(headers, function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    req.write('{}');
                    req.end();
                });
            }
        });

        router.DELETE.forEach(function (route) {
            if (route.policy) {
                it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                    var headers = requestOptions("", route.path.replace(':', ''), 'DELETE');
                    http.get(headers, function(res) {
                        res.statusCode.should.eql(403);
                        done();
                    });
                });
            }
        });
    });
});
