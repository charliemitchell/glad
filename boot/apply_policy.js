var requireCwd = function (aPath) {
        return require(process.cwd() + aPath);
    },
    policies = requireCwd('/policies'),
    config = requireCwd('/config');

module.exports = applyPolicy

function applyPolicy (policy, method, key, action) {

    return function (req, res) {

        req.controller = key;
        req.action = action;

        if (config.logHTTP) {
            console.log(['Routing   ', req.id, ' ', " to ", key, '#', action].join('').cyan);
        }

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