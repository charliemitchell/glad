var loggers     = {

    on_time_expired : function (hook_name) {
        console.log('-----------------------------------------------------------------------------------------------------------------------'.yellow);
        console.log(("| Glad Detected that your ".yellow + (hook_name).bold.yellow + " hook has been running for over 3 seconds".yellow));
        console.log("| Make sure that you call next() when you are done setting things up, otherwise your app will get stuck right here.".yellow);
        console.log('-----------------------------------------------------------------------------------------------------------------------'.yellow);
        console.log();
    },

    explain : function (callback, fn_string, desc, name) {
        console.log("**** Glad Found an error in your ".red.bold + name.red.bold + " hook ****".red.bold);
        console.log(("It looks like the next function is in your parameters as \"" + callback + "\"").red);
        console.log((desc).red);
        console.log(("So we would expect to see the invocation as " + callback + "();").red);

        var reg = new RegExp(callback + '.*\\(');
        if (fn_string.match(reg)) {
            console.log("It Appears like you are trying to execute the callback, maybe the callback is nested in another callback that is not invoking, or perhaps it is commented out?".red);
        } else {
            console.log(("Glad was unable to detect any invocation to " + callback + "() in your method.").red);
        }
        console.log("See below...".red)
        console.log(fn_string.red);
        console.log("*******************************************".red.bold + name.split('').map(function () {return "*"}).join('').red.bold);
    },

    fn_missing_params : function (fn_string, num, name) {
        var params = fn_string.match(/.*\((.*)\)/)[1].split(',');

        if ( (params.length === (num - 1) ) && (!params[params.length - 1].match(/next/) ) ) {
            console.log("**** Glad Found an error in your ".red.bold + name.red.bold + " hook ****".red.bold);
            console.log(("* It seems like you only have "+ (num - 1) + " parameters to your hook, you should have " + num).red);
            console.log(("* Right Now your params are (" + params.join(',') + ')').red);
            console.log(("* Change them to (" + params.join(',') + ", next) and when you are done initializing things call next()").red);
        } else {
            console.log("**** Glad Found an error in your ".red.bold + name.red.bold + " hook ****".red.bold);
            console.log(("* It seems like you only have "+ (num - 1) + " parameters to your hook, you should have " + num).red);
            console.log("* The last parameter is your callback and you need to invoke it when you are done setting things up.".red)
        }

        console.log("*******************************************".red.bold + name.split('').map(function () {return "*"}).join('').red.bold);
    }
};

var parameters  = {

    get_callback: function (fn_string, num) {

        var regex = (function () {
            var i = 1, str = ".*\\(";
            for (i; i < num; i +=1) {
                str += ".*,";
            }
            return new RegExp(str + "(.*)\\)");
        }());

        return fn_string.match(regex);
    },

    describe_callback : function (fn_string, callback) {

        var fn_split = fn_string.split('\n'),
            match = fn_split[0].match(new RegExp(callback));

        return (function () {
            var desc = fn_split[0] + "\n";

            for (var i = 0; i < match.index; i += 1) {
                desc += " ";
            }

            if (callback.match(/^ /)) {
                desc += " ^";
            } else {
                desc += "^";
            }
            return desc;
        }());

    }
};

var timers      = {

    'default' : function (fn_string, name, count) {

        count = ((count === 0) ? 0 : count) || 4;

        var callback = parameters.get_callback(fn_string, count),
            desc;

        if (callback && callback[1]) {
            callback = callback[1];
            desc = parameters.describe_callback(fn_string, callback);
            callback = callback.trim();
            loggers.explain(callback, fn_string, desc, name);
        } else {
            loggers.fn_missing_params(fn_string, count, name);
        }
    },

    initialize : function (fn_string, name) {
        this.default(fn_string, name);
    },

    app : function (fn_string, name) {
        this.default(fn_string, name);
    },

    onBeforeMongoose : function (fn_string, name) {
        this.default(fn_string, name, 5);
    },

    onBeforeBodyParser : function (fn_string, name) {
        this.default(fn_string, name);
    },

    onBeforeMethodOverride : function (fn_string, name) {
        this.default(fn_string, name);
    },
    onBeforeCookieParser : function (fn_string, name) {
        this.default(fn_string, name);
    },
    onBeforeReadSession : function (fn_string, name) {
        this.default(fn_string, name);
    },
    onBeforeRouter : function (fn_string, name) {
        this.default(fn_string, name);
    },
    onBeforeListen : function (fn_string, name) {
        this.default(fn_string, name);
    }
};

module.exports = function (hook, timer) {
    var fn_string = hook.toString();

    return setTimeout(function () {
        loggers.on_time_expired(timer);
        timers[timer](fn_string, timer);
    }, 3000);
};