// var todos = {
// 	'item1': 'some description',
// 	'item2': 'description', 
// 	'item3': 'description'
// };

// Redis connection
var redis = require('redis');
var express = require('express');

var bodyParser = require('body-parser');
var urlencode = bodyParser.urlencoded({ extended: false});

if (process.env.REDISTOGO_URL) {
	var rtg = require("url").parse(process.env.REDISTOGO_URL);
	var client = redis.createClient(rtg.port, rtg.hostname);
	client.auth(rtg.auth.split(":")[1]);
} else{
	var client = redis.createClient();
	// use a different db for dev and test
	client.select((process.env.NODE_ENV || 'development').length);
}
// End redis connection

// client.hset('todos', 'item1', 'description');
// client.hset('todos', 'item2', 'description');
// client.hset('todos', 'item3', 'description');


// app.get('/', function(request, response){
// 	response.json(todos);
// });

var router = express.Router();



router.route('/')
	.get(function(request, response){
	client.hkeys('todos', function(error, names) {
		response.json(names);
	});
})

	.post(urlencode, function(request, response){
	var newTodo = request.body;
	if(!newTodo.name || !newTodo.description){
		response.sendStatus(400);
		return false;
	}
	client.hset('todos', newTodo.name, newTodo.description, function (error) {
		if (error) throw error;
		response.status(201).json(newTodo.name);
	});
});

router.route('/:name')
	.delete(function(request, response){
	client.hdel('todos', request.params.name, function(error){
		if (error) throw error;
		response.sendStatus(204);
	});
})

	.get(function(request, response){

	client.hget('todos', request.params.name, function(error, description) {
		response.render('show.ejs', {
			todo: { 
				name: request.params.name,
				description: description
			}
		});
	});
});

module.exports = router;
