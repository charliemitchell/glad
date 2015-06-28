module.exports = function () {
 var today = new Date();
    return (today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear() + ' ') +
        ((today.getHours() < 10) ? "0" : "") +
        ((today.getHours() > 12) ? (today.getHours() - 12) : today.getHours()) + ":" +
        ((today.getMinutes() < 10) ? "0" : "") + today.getMinutes() + ":" +
        ((today.getSeconds() < 10) ? "0" : "") + today.getSeconds() +
        ((today.getHours() > 12) ? ('PM') : 'AM');
};