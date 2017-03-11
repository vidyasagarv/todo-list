var express = require('express');
var app = express();

app.use(express.static('public'));

var todos = require('./routes/todos');
app.use('/todos', todos);

module.exports = app;