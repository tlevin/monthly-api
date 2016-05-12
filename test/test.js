var app = require('../app.js')
var request = require('supertest')(app);
var expect = require('chai').expect; 
var mocha = require('mocha')


describe('Monthly Charge API', function () {
  
  describe('Routing', function () {
  
    it('should return 404 for route not in routers', function (done) {
      request
        .get('/v1/somethingnotthere')
        .expect(404, done)
    });
  
    it('should return 201 for successful post', function(done){
      var body = { 
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers" : 382983,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10}, { numUsers: 50000, price: 5 } ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201, done)
    });
  });

  describe('Calculations', function() {
    
  })
});
