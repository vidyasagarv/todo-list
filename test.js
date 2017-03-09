var request = require('supertest');
var app = require('./app');

describe('Requests to the root', function(){
	it('Returns a 200 status code', function(){
		request(app)
			.get('/')
			.expect(200)
			.end(function(error) {
				if (error) throw error;
				done();
			});
	});
});
