var fs = require('fs');
var file = __dirname + '/db.json';

function saveScripts(scripts, callback) {
    console.log(scripts);

    fs.writeFile(file, JSON.stringify(scripts), { encoding : 'utf8' }, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        callback();
    });
}

function getScripts(callback) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        if (data) {
            var scripts = JSON.parse(data);
            callback(scripts);
        } else {
            callback([]);
        }
    });
}

exports.saveScripts = saveScripts;
exports.getScripts = getScripts;