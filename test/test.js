process.env.NODE_ENV = 'test'
var app = require('../app.js')
var request = require('supertest')(app);
var expect = require('chai').expect; 
var mocha = require('mocha');
var db = require('../db/schema.js')

describe('Monthly Charge API', function () {
  
  describe('Routing', function () {
  
    it('should return 404 for route not in routers', function (done) {
      request
        .get('/v1/somethingnotthere')
        .expect(404, done);
    });
  
    it('should return 201 for successful post', function(done){
      var body = { 
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers" : 382983,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10}, { numUsers: 50000, price: 5 } ]
      };
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201, done);
    });

    it('should return 400 for invalid input (bad request)', function(done){
      var invalidInput = {
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": -1,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(invalidInput)
        .expect(400, done);
    })
  });

  describe('Return object validations', function() {
    var body = { 
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      };

    it('should return an object with charge, result, and err properties', function(done){
      
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body).to.have.property('charge');
          expect(res.body).to.have.property('result');
          expect(res.body).to.have.property('err');
          done();
        })
    });

    it('should return a correct charge amount', function(done){
      
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body).to.have.property('charge');
          expect(res.body.charge).to.equal(110000);
          done();
        });
    });

    it('should return a correct result and err value', function(done){
       request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body.result).to.equal('success');
          expect(res.body.err).to.equal(null);
          done();
        });
    });

    it('should return a correct err result for invalid number of user input', function(done){
      var invalidInput = {
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": -1,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(invalidInput)
        .expect(400)
        .end(function(err, res){
          expect(res.body.result).to.equal('error');
          expect(res.body.err).to.equal('invalid number of users');
          done();
        });
    });

    it('should return a correct err result for missing pricingBuckets', function(done){
      var invalidInput = {
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": []
      };
      request
        .post('/v1/company/2/monthlyCharges')
        .send(invalidInput)
        .expect(400)
        .end(function(err, res){
          expect(res.body.result).to.equal('error');
          expect(res.body.err).to.equal('invalid pricing tier');
          done();
        });
    });
    it('should return a correct err result for missing companyName', function(done){
      var invalidInput = {
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [{ numUsers: 0, price: 20}, { numUsers: 1000, price: 10}]
      };
      request
        .post('/v1/company/2/monthlyCharges')
        .send(invalidInput)
        .expect(400)
        .end(function(err, res){
          expect(res.body.result).to.equal('error');
          expect(res.body.err).to.equal('missing company name');
          done();
        });
    });
  });

  describe('Calculations checking', function(){
    it('should work with multiple price tiers', function(done){
      var body = {
        "companyName": "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body.result).to.equal('success');
          expect(res.body.charge).to.equal(110000);
          done();
        });
    });
    it('should work with single price tier', function(done){
      var body = {
        "companyName": "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 0, price: 10} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body.result).to.equal('success');
          expect(res.body.charge).to.equal(100000);
          done();
        });
    });
    it('should work if numUsers 0 is not included', function(done){
      var body = {
        "companyName": "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 5000, price: 5} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body.result).to.equal('success');
          expect(res.body.charge).to.equal(75000);
          done();
        });
    });
    it('should work if number of users less than max provided numUsers', function(done){
      var body = {
        "companyName": "EAT24",
        "totalMonthlyActiveUsers": 4000,
        "pricingBuckets": [ { numUsers: 5000, price: 5} ]
      }
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(201)
        .end(function(err, res){
          expect(res.body.result).to.equal('success');
          expect(res.body.charge).to.equal(40000);
          done();
        });
    });
  });

  describe('Database entry verification', function(){
    beforeEach(function(done){
      db('monthly_charges').del().then(function(){
        done();
      })
    });
    it('should not insert into db with invalid inputs', function(done){
      var invalidInput = {
        "companyName": "EAT24",
        "totalMonthlyActiveUsers": -1,
        "pricingBuckets": [{ numUsers: 0, price: 20}, { numUsers: 1000, price: 10}]
      };
      request
        .post('/v1/company/2/monthlyCharges')
        .send(invalidInput)
        .expect(400)
        .end(function(err, res){
          db('monthly_charges')
            .where({company_name: invalidInput.companyName})
            .then(function(result){
              expect(result.length).to.equal(0);
              done();
            })
        });
    });

    it('should insert into db with valid inputs', function(done){
      var body = { 
        "companyName" : "EAT24",
        "totalMonthlyActiveUsers": 10000,
        "pricingBuckets": [ { numUsers: 0, price: 20}, { numUsers: 1000, price: 10} ]
      };
      request
        .post('/v1/company/2/monthlyCharges')
        .send(body)
        .expect(400)
        .end(function(err, res){
          db('monthly_charges')
            .where({company_name: body.companyName})
            .then(function(result){
              expect(result.length).to.equal(1);
              expect(result[0].charge).to.equal(110000)
              expect(result[0].company_name).to.equal('EAT24')
              done();
            })
        });
    })
  });
});
