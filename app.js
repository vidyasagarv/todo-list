var express = require('express');
var app = express();

app.get('/', function(request, response){
	throw 'Error'
	// response.send('OK');
});

module.exports = app;