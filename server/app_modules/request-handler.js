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

            // Merge into "allScripts" and remove duplicated
            var allScripts = runningScripts;

            // Loop over all storedScripts. Compare paths to see if a script exists in runningScripts. If it doesn't exist in runningScripts, add it.
            for (var i=0; i<storedScripts.length; i++) {
                var scriptExists = false;
                var runningScriptsIndex = 0;

                for (var j=0; j<runningScripts.length; j++) {
                    if (runningScripts[j].path == storedScripts[i].path) {
                        scriptExists = true;
                        runningScriptsIndex = j;
                        break;
                    }
                }

                if (!scriptExists) {
                    storedScripts[i].status = 0;
                    allScripts.push(storedScripts[i]);
                } else {
                    allScripts[j].name = storedScripts[i].name;
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

}
function stopAll(res) {

}
function addScript(script, res) {

}
function updateScript(script, res) {
    dbManager.getScripts(function(storedScripts) {
        for (var i=0; i<storedScripts.length; i++) {
            if (storedScripts[i].path == script.path) {
                storedScripts[i] = script;
                console.log(storedScripts[i]);
            }
        }

        dbManager.saveScripts(storedScripts, function() {
            res.end();
        });
    });
}
function stopScript(script, res) {
    execManager.stopScriptWithFilename(script.filename, function() {
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






