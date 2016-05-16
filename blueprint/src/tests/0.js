describe('The server will provide 404 for routes that are not handled'.magenta, function() {
    describe("404".magenta, function () {

        it('should respond with status code 404 when on GET request to an unknown route', function(done) {
            glad.test.get('/foobarbazzgladcool9870298437').then(function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on POST request to an unknown route', function(done) {
            glad.test.post('/foobarbazzgladcool9870298437', '{"foo" : 1}').then(function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on PUT request to an unknown route', function(done) {
            glad.test.put('/foobarbazzgladcool9870298437','{"foo" : 1}').then(function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

        it('should respond with status code 404 when on DELETE request to an unknown route', function(done) {
            glad.test.del('/foobarbazz/glad').then(function(res) {
                res.statusCode.should.eql(404);
                done();
            });
        });

    });
});