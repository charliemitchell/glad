var glad = require('glad'),
    config = require("../config"),
    app = true,
    express,
    server,
    should = require('should'),
    mongoose = glad.mongoose,
    http = require('http'),
    assert = require('assert'),
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

mongoose.connect(config.mongodb.testdb);

describe('Glad should Start'.magenta, function() {

    before(function(done) {
        glad.server(function(ap, expr, serv) {
            app = ap;
            express = express;
            server = serv;
            done();
        });
    });

    it('app object should exist', function(done) {
        should.exist(app);
        done();
    });

    it('should be listening on port ' + config.port, function(done) {
        assert.equal(server.address().port, config.port);
        done();
    });

});

describe('The server will provide 404 for routes that are not handled'.magenta, function() {
    describe("404".magenta, function () {

        it('should respond with status code 404 when on GET request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazzgladcool9870298437');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on POST request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazzgladcool9870298437', 'POST');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on DELETE request to an unknown route', function(done) {
            var headers = requestOptions("",'/foobarbazz/glad', 'DELETE');
            http.get(headers, function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 on a PUT request to an unknown route', function(done) {
            var headers = requestOptions("{}",'/asdfasdh87h87h8hdnf/78699786234', 'PUT'),
                req = http.request(headers, function(res) {
                    res.statusCode.should.eql(404);
                    done();
                });
                req.write('{}')
                req.end()
        });

        it('should respond with status code 404 on a POST request to an unknown route', function(done) {
            var headers = requestOptions("{}",'/asdfasdf/78699786234', 'POST'),
                req = http.request(headers, function(res) {
                    res.statusCode.should.eql(404);
                    done();
                });
                req.write('{}')
                req.end()
        });
    });
});