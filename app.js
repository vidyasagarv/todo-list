var express = require('express');
var app = express();

app.use(express.static(__dirname+'/public'));

var todos = require('./routes/todos');
app.use('/todos', todos);

module.exports = app;