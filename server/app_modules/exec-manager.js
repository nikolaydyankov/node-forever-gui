// PUBLIC

function executeCommand(command, args, callback) {

}

exports.executeCommand = executeCommand;

// PRIVATE

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
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