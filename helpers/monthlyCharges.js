var db = require('../db/schema');


module.exports = function(input){
  var totalUsers = +input.totalMonthlyActiveUsers;
  var pricingTier = input.pricingBuckets;
  var companyName = input.companyName

  // Invalid input checks
  // Workaround to mock a promise return
  if(!pricingTier || pricingTier.length < 1){
    return {
      then: function(cb){
        cb({
          "charge": null,
          "result": "error",
          "err": "invalid pricing tier"
        });
      }
    };
  }

  if (totalUsers < 0 || typeof totalUsers !== 'number'){
    return { 
      then: function(cb){
        cb({
          "charge": null,
          "result": "error",
          "err": "invalid number of users"
        });
      }
    }
  }

  if(!companyName){
    return {
      then: function(cb){
        cb({
          "charge": null,
          "result": "error",
          "err": "missing company name"
        });
      }
    };
  }

  var curCharge = 0;
  // To ensure we are progressing from largest user tier to smallest
  // We sort using native sort O(NlogN)

  pricingTier = pricingTier.sort(function(a, b){
    return a.numUsers < b.numUsers;
  });

  // Iterate over pricing tier from largest to smallest.
  pricingTier.forEach(function(tier){

    // ensures we don't calculate numUsers more than total.
    if(totalUsers - tier.numUsers >= 0){
      curCharge += (totalUsers - tier.numUsers) * tier.price;
      totalUsers = tier.numUsers;
    }
  });

  // Checks if totalUsers is not zero, if it isn't that means there wasn't a 0 numUser provided
  // Use default pricing
  if(totalUsers !== 0){
    curCharge += totalUsers * 10;
  }

  // Getting a month to store in format: YYYY_m
  var today = new Date();
  var month = today.getMonth() + 1;
  var year = today.getFullYear();

  return db('monthly_charges').insert({
    pricing_tiers: JSON.stringify(pricingTier),
    users: +input.totalMonthlyActiveUsers,
    charge: curCharge,
    company_name: companyName,
    month: year + '_' + month,
  }).then(function(){
    return {
    "charge": curCharge,
    "result": "success",
    "err": null
  };
  }).catch(function(err){
    console.log(err)
  })



}