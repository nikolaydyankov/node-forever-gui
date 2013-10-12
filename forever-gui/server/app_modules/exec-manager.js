var exec =              require('child_process').exec;
// PUBLIC

function executeListCommand(callback) {
    execute('forever list --plain', function(stdout) {
        // Get names
        var sysNames = stdout.match(/\S+\.js/g);

        if (!sysNames) {
            console.log('No scripts are currently running.');
            callback([]);
            return;
        }

        // Get log paths
        var logPaths = stdout.match(/\/\S+\.log/g);

        // Get scripts ID's
        var idsWithExtraCharacters = stdout.match(/\s\d+\s+\//g);
        var IDs = new Array();

        for (var i=0; i<idsWithExtraCharacters.length; i++) {
            var id = idsWithExtraCharacters[i].match(/\d+/)[0];
            IDs.push(id);
        }

        // Get script paths
        var pathForID = {};

        execute('ps aux | grep forever', function(stdout) {
            var rows = stdout.split('\n');

            for (var i=0; i<rows.length; i++) {
                var row = rows[i];

                // Get script path
                var scriptPathArray = row.match(/\/\S+.js/);

                if (scriptPathArray == null) { // If the current row does not contain a script path, move to next row
                    continue;
                }

                var scriptPath = scriptPathArray[0];

                // Get script ID
                var scriptID = row.match(/^\w+\s+\d+/)[0].match(/\d+/)[0];

                // Store
                pathForID[scriptID] = scriptPath;
            }

            // Construct Script objects with parsed data
            var scripts = new Array();

            for (var i=0; i<sysNames.length; i++) {
                var script = {
                    id : IDs[i],
                    name : 'Unnamed',
                    sysname : sysNames[i],
                    status : 1,
                    path : pathForID[IDs[i]],
                    log : logPaths[i]
                }

                scripts.push(script);
            }

            callback(scripts);
        });
    });
}
function startScriptWithPath(scriptPath, callback) {
    execute('forever start ' + scriptPath, function(stdout) {
        callback();
    });
}
function stopScriptWithSysName(scriptSysName, callback) {
    execute('forever stop ' + scriptSysName, function(stdout) {
        callback();
    });
}
function stopAllScripts(callback) {
    execute('forever stopall', function() {
        callback();
    });
}

exports.executeListCommand = executeListCommand;
exports.startScriptWithPath = startScriptWithPath;
exports.stopScriptWithSysName = stopScriptWithSysName;
exports.stopAllScripts= stopAllScripts;

// PRIVATE

function execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
        callback(stdout);
    });
};








//execute('forever ' + req.body.cmd + ' ' + req.body.args + ' --plain', function(result) {
//    var names = result.match(/\S+\.js/g);
//    var logPaths = result.match(/\/\S+\.log/g);
//
//
//    var response = JSON.stringify({
//        "logPaths" : logPaths,
//        "names" : names
//    });
//
//    console.log(logPaths);
//
//    res.end(response);
//});