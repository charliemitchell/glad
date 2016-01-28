/**
 * Init Should be used for initializing things before the boot process.
 * Be careful what you require in this method, as it may have unintended consequences.
 * For instance, requiring in a model, or something else that requires in a model would be a bad idea because there is no connection
 * to mongoose at this point. Furthermore, If you are extending DataVersions with new versions, you should do it here. But, if something requires a model,
 * then the data versions may never get properly attached to your instance methods for that model.
 *
 * A general rule of thumb for this hook.
 * Don't do anything with models or controllers here.
 * Don't require anything that in turn requires models or controllers.
 * Don't Setup any Cron, schedulers, etc... stuff here unless you are certain it does not interact with models or controllers.
 * Don't do anything that requires network access here.
 * Don't Forget to invoke next() when you are done.
 *
 * @param server
 * @param app
 * @param express
 * @param next
 */
module.exports = function (server, app, express, next) {
    next();
};