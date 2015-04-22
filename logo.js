require('colors');
function serverstart () {
    var today = new Date();
    return (today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear() + ' ') + 
        ((today.getHours() < 10)?"0":"") + 
        ((today.getHours()>12)?(today.getHours()-12):today.getHours()) +":"+ 
        ((today.getMinutes() < 10)?"0":"") + today.getMinutes() +":"+ 
        ((today.getSeconds() < 10)?"0":"") + today.getSeconds() + 
        ((today.getHours()>12)?('PM'):'AM'); 
}
var this_package_json = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '/package.json')));
var their_package = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), '/package.json')));

console.log(("\n\n  [ " + their_package.name.toUpperCase() + "  v" +  their_package.version + " ]"));

var ascii = "\n GLAD Version " + (this_package_json.version) + ' (ツ)'.green  + "\n";

ascii += "  > Service Starting...\n";
ascii += "  > " + serverstart() + "\n";
ascii += "  > working directory : " + process.cwd() + "\n";
ascii += "  > To shut down, press <CTRL> + C at any time.\n";


module.exports = function () {
    console.log(ascii.grey)
};