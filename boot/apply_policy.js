var requireCwd = function (aPath) {
        return require(process.cwd() + aPath);
    },
    policies = requireCwd('/policies');

module.exports = applyPolicy

function applyPolicy (policy, method) {
    return function (req, res) {

        var accept = function () {
                method(req, res);
            },
            reject = function (custom) {
                policies.onFailure(req, res, custom);
            };

        if (policy) {
            if (policies[policy]) {
                policies[policy](req, res, accept, reject);
            } else {
                console.log(("Glad: The Policy '" + policy + "' Does Not exist, therefore the request was denied").red);
                reject();
            }
        } else { // No Policy, Allow it
            method(req, res);
        }
    };
}