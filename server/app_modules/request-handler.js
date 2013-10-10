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

}
function startAll(res) {

}
function stopAll(res) {

}
function addScript(script, res) {

}
function updateScript(script, res) {

}
function stopScript(script, res) {

}
function startScript(script, res) {

}
function removeScript(script, res) {

}
function fetchLog(script, res) {

}






