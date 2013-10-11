var fs = require('fs');
var file = __dirname + '/db.json';

function saveScripts(scripts, callback) {
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
function doesScriptExistWithPath(path, callback) {
    fs.readFile(path, function(err, data) {
        if (err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}
function fetchLogWithPath(logPath, callback) {
    fs.readFile(logPath, 'utf8', function(err, data) {
        if (err) {
            callback(false);
        } else {
            callback(data);
        }
    });
    exports.requestIO().sockets.on('connection', function (socket) {

    });
}

exports.saveScripts = saveScripts;
exports.getScripts = getScripts;
exports.doesScriptExistWithPath = doesScriptExistWithPath;
exports.fetchLogWithPath = fetchLogWithPath;