// Create an express web app that can parse HTTP POST requests
var app = require('express')();
app.use(require('body-parser').urlencoded({
    extended:false
}));
 
// Create a route that will respond to a POST request
app.post('/command', function(request, response) {
    // Get the command from the HTTP request and send it to the Minecraft
    // server process
    var command = request.param('Body');
    minecraftServerProcess.stdin.write(command+'\n');
 
    // buffer output for a quarter of a second, then reply to HTTP request
    var buffer = [];
    var collector = function(data) {
        data = data.toString();
        buffer.push(data.split(']: ')[1]);
    };
    minecraftServerProcess.stdout.on('data', collector);
    setTimeout(function() {
        minecraftServerProcess.stdout.removeListener('data', collector);
        response.send(buffer.join(''));
    }, 250);
});
 
// Listen for incoming HTTP requests on port 3000
app.listen(3000);
