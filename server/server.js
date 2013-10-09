var fs = require('fs');
var http = require('http');
//var https = require('https');
//var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

//var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

app.configure(function(){
    app.use(express.static(__dirname + '/html'));
    app.use(express.bodyParser());
});

// your express configuration here

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
//httpsServer.listen(443);

app.post('/command', function(req, res) {
    res.end(req.body.cmd);
});



// Unix commands exec: http://stackoverflow.com/a/12941138/1156999
// Basic authentication: http://stackoverflow.com/a/12148212/1156999