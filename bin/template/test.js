var controller = require("../controllers/{{model}}"),
    router = require("../routes/{{model}}");

describe('Should Prevent Access if the policy is rejected'.magenta, function() {

    describe("403".magenta, function () {

        if (router.GET) {
            router.GET.forEach(function (route, i) {
                if (route.policy) {
                    it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                        glad.test.get(route.path.replace(':', '')).then(function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    });
                }
            });
        }

        if (router.POST) {
            router.POST.forEach(function (route) {
                if (route.policy) {
                    it('should respond with status code 403 on a POST request to the ' + route.path + ' route', function(done) {
                        glad.test.post(route.path.replace(':', '')).then(function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    });
                }
            });
        }

        if (router.PUT) {
            router.PUT.forEach(function (route) {
                if (route.policy) {
                    it('should respond with status code 403 on a PUT request to the ' + route.path + ' route', function(done) {
                        glad.test.put(route.path.replace(':', '')).then(function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    });
                }
            });
        }

        if (router.DELETE) {
            router.DELETE.forEach(function (route) {
                if (route.policy) {
                    it('should respond with status code 403 on a GET request to the ' + route.path + ' route', function(done) {
                        glad.test.del(route.path.replace(':', '')).then(function(res) {
                            res.statusCode.should.eql(403);
                            done();
                        });
                    });
                }
            });
        }
        
    });
});