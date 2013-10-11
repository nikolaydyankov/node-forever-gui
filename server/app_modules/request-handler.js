var execManager = require(__dirname + '/exec-manager.js');
var dbManager = require(__dirname + '/db-manager.js');

function handleRequest(url, req, res) {
    if (url == '/fetch_all') {
        fetchAll(res);
    }
    if (url == '/start_all') {
        startAll(res);
    }
    if (url == '/stop_all') {
        stopAll(res);
    }
    if (url == '/add_script') {
        addScript(req.body.script, res);
    }
    if (url == '/update_script') {
        updateScript(req.body.script, res);
    }
    if (url == '/stop_script') {
        stopScript(req.body.script, res);
    }
    if (url == '/start_script') {
        startScript(req.body.script, res);
    }
    if (url == '/remove_script') {
        removeScript(req.body.script, res);
    }
    if (url == '/fetch_log') {
        fetchLog(req.body.script, res);
    }
}

exports.handleRequest = handleRequest;

// PRIVATE

function fetchAll(res) {
    dbManager.getScripts(function(scripts) {
        var storedScripts = scripts;

        execManager.executeListCommand(function(result) {
            var runningScripts = result;

            // Set all statuses to 0
            for (var s=0; s<storedScripts.length; s++) {
                storedScripts[s].status = 0;
            }

            // Check if there are new scripts in runningScripts.
            var allScripts = storedScripts;

            for (var i=0; i<runningScripts.length; i++) {
                var scriptIsNew = true;
                var existingScriptIndex = 0;

                for (var j=0; j<storedScripts.length; j++) {
                    if (storedScripts[j].path == runningScripts[i].path) {
                        scriptIsNew = false;
                        existingScriptIndex = j;
                    }
                }

                if (scriptIsNew) {
                    // If script does not exist in storedScripts, add it
                    allScripts.push(runningScripts[i]);
                } else {
                    // if script does exist in storedScripts, change the status of the storedScript to 1
                    allScripts[existingScriptIndex].status = 1;
                    allScripts[existingScriptIndex].sysname = runningScripts[i].sysname;
                }
            }

            // Save all scripts
            dbManager.saveScripts(allScripts, function() {
                var json = JSON.stringify(allScripts);
                res.end(json);
            });
        });
    });
}
function startAll(res) {
    dbManager.getScripts(function(scripts) {
        startScriptsRecursion(scripts, function() {
            res.end();
        });
    });
}
function stopAll(res) {
    execManager.stopAllScripts(function() {
        res.end();
    });
}
function addScript(script, res) {

}
function updateScript(script, res) {
    dbManager.getScripts(function(storedScripts) {
        for (var i=0; i<storedScripts.length; i++) {
            if (storedScripts[i].path == script.path) {
                storedScripts[i] = script;
            }
        }

        dbManager.saveScripts(storedScripts, function() {
            res.end();
        });
    });
}
function stopScript(script, res) {
    execManager.stopScriptWithSysName(script.sysname, function() {
        res.end();
    });
}
function startScript(script, res) {
    execManager.startScriptWithPath(script.path, function() {
        res.end();
    });
}
function removeScript(script, res) {

}
function fetchLog(script, res) {

}

// PRIVATE
function startScriptsRecursion(scripts, callback) {
    if (scripts.length > 0) {
        if (scripts[0].status == 0) {
            execManager.startScriptWithPath(scripts[0].path, function() {
                scripts.splice(0, 1);
                startScriptsRecursion(scripts, callback);
            });
        } else {
            scripts.splice(0, 1);
            startScriptsRecursion(scripts, callback);
        }
    } else {
        callback();
    }
}





