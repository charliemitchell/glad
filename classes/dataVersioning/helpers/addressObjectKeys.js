module.exports = function (object, stop_if_key_exists, void_function) {
    var output = [];

    var walkObject = function (obj, stack) {

        for (var k in obj) {
            if (obj.hasOwnProperty(k)){

                if ((typeof obj[k] === 'object') && !obj[k].hasOwnProperty(stop_if_key_exists) && void_function(obj[k], k)) {
                    walkObject(obj[k], stack + "." + k);
                } else {
                    if (k !== '0') {
                        output.push(stack + "." + k);
                    } else {
                        output.push(stack);
                    }
                }
            }
        }

        return output.map(function (path) {
            return path.replace(/^\./, '');
        });
    };

    return walkObject(object, "");
};