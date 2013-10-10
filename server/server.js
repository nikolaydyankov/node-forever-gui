var http =              require('http');
var express =           require('express');
var exec =              require('child_process').exec;
var requestHandler =    require(__dirname + '/app_modules/request-handler.js');
var app =               express();

app.configure(function(){
    app.use(express.static(__dirname + '/html'));
    app.use(express.bodyParser());
});

var httpServer = http.createServer();
httpServer.listen(80);

app.post('/fetch_all', function(req, res) {
    requestHandler.handleRequest('/fetch_all', req, res);
});
app.post('/start_all', function(req, res) {
    requestHandler.handleRequest('/start_all', req, res);
});
app.post('/stop_all', function(req, res) {
    requestHandler.handleRequest('/stop_all', req, res);
});
app.post('/add_script', function(req, res) {
    requestHandler.handleRequest('/add_script', req, res);
});
app.post('/update_script', function(req, res) {
    requestHandler.handleRequest('/update_script', req, res);
});
app.post('/stop_script', function(req, res) {
    requestHandler.handleRequest('/stop_script', req, res);
});
app.post('/start_script', function(req, res) {
    requestHandler.handleRequest('/start_script', req, res);
});
app.post('/remove_script', function(req, res) {
    requestHandler.handleRequest('/remove_script', req, res);
});
app.post('/fetch_log', function(req, res) {
    requestHandler.handleRequest('/fetch_log', req, res);
});

// Unix commands exec: http://stackoverflow.com/a/12941138/1156999
// Basic authentication: http://stackoverflow.com/a/12148212/1156999