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
    var body = { 
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      }

    it('should return a charge amount', function(done){
      
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body).to.have.property('charge')
          done()
        })
    });

    it('should return a correct charge amount', function(done){
      
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body).to.have.property('charge')
          expect(res.body.charge).to.equal(110000)
          done()
        })
    });

    it('should return a result property', function(done){
      
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body).to.have.property('result')
          done()
        })
    })
  })
});
