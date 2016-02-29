
/**
 * ## Glad Tokenizer
 *```
 * var tokenizer = require('glad').tokenizer;
 *
 * tokenizer.generate(6); // <-- 6 character token
 * tokenizer.generate(256); // <-- 256 character token
 *
 * var myTokenizer = tokenizer.create('0123456789');
 * myTokenizer.generate(6) // 6 character token of '0123456789' characters
 *```
 */

function rand (max) {
    return Math.floor(Math.random()*max);
}

function generate(salt, size){
    var key = '';
    var sl = salt.length;
    while ( size -- ) {
        var rnd = rand(sl);
        key += salt[rnd];
    }
    return key;
}

var randomToken = function(salt, size){
    return isNaN(size) ? undefined : (size < 1) ? undefined : generate(salt, size);
};

randomToken.gen = createGenerator;

function createGenerator (salt) {
    var temp;

    salt = ( (typeof salt  === 'string') && (salt.length > 0) ) ? salt :  'ABCDEFGHIJKLMNOPQRSTUVWXYZ-0987654321_abcdefghijklmnopqrstuvwxyz';
    temp = randomToken.bind(randomToken, salt);
    temp.salt = function(){ return salt; };
    temp.create = createGenerator;
    temp.gen = createGenerator;
    return temp;
}

module.exports.generate = createGenerator();
module.exports.create = createGenerator;
