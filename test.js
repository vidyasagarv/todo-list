var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();

// select test db and flush it
client.select('test'.length);
client.flushdb();

describe('Requests to the root', function(){
	it('Returns 200 status code', function(done){
		request(app)
		.get('/')
		.expect(200, done);
	});

	it('Returns HTML format', function(done) {
		request(app)
		.get('/')
		.expect('Content-Type', /html/, done);
	});

	it('Returns index file with todo list', function(done) {
		request(app)
		.get('/')
		.expect(/todos/i, done);
	});
});

describe('Listing todos on /todos', function() {
	it('Returns 200 status code', function(done) {
		request(app)
		.get('/todos')
		.expect(200, done);
	});

	it('Returns JSON format', function(done) {
		request(app)
		.get('/todos')
		.expect('Content-Type', /json/, done);
	});

	it('Returns intial todos', function(done) {
		request(app)
		.get('/todos')
		.expect(JSON.stringify([]), done);
	});
});

describe('Creating new todos', function() {
	it('Returns 201 status code', function(done) {
		request(app)
		.post('/todos')
		.send('name=Graduationday&description=when+you+get+wings')
		.expect(201, done);
	});

	it('Return the todo item', function(done) {
		request(app)
		.post('/todos')
		.send('name=Graduationday&description=when+you+get+wings')
		.expect(/graduationday/i, done);
	});
});

describe('Deleting todos', function() {
	before(function(){
		client.hset('todos', 'Banana', 'go bananas');
	});

	after(function(){
		client.flushdb();
	});

	it('Returns 204 status code', function(done) {
		request(app)
		.delete('/todos/Banana')
		.expect(204, done);
	});

	it('Validates todo name and description', function(done) {
		
		request(app)
		.post('/todos')
		.send('name=&description=')
		.expect(400, done);
	});
});

describe('Shows todo info', function() {

	before(function(){
		client.hset('todos', 'Banana', 'go bananas');
	});

	after(function(){
		client.flushdb();
	});

	it('Returns 200 status code', function(done) {
		request(app)
		.get('/todos/Banana')
		.expect(200, done);
	});

	it('Returns HTML format', function(done) {
		request(app)
		.get('/todos/Banana')
		.expect('Content-Type', /html/, done);
	});

	it('Returns information for given todo', function(done) {
		request(app)
		.get('/todos/Banana')
		.expect(/go bananas/, done);
	});
});

