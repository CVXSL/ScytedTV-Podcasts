// Load the express module.
var express = require('express');
var app = express();
var path = require('path');
var step = 1;
var fs = require('fs');

// Load in the config.
let rawconfig = fs.readFileSync('config.json');
let config = JSON.parse(rawconfig);

// Set up the static asset directory.
app.use(express.static('public'));

// Respond to requests for / with index.html.
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Respond to requests for /current with current step.
app.get('/current', function(req, res){
    res.send(String(step));
});

// Respond to requests for /config with current config.
app.get('/config', function(req, res){
    res.send(config);
});

// Allow incrementing or decrementing the step via /up or /down.
app.get('/up', function(req, res){
    if (step < config.task_list_items.length){
        step++;
    }
    res.send('New value: ' + step);
});
app.get('/down', function(req, res){
    if (step > 1){
        step--;
    }
    res.send('New value: ' + step);
});

// Start listening on configured port.
app.listen(config.server_port);
console.log('Server listening on port ' + config.server_port + '.');