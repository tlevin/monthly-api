var db = require('../db/schema');


module.exports = function(input){
  var totalUsers = +input.totalMonthlyActiveUsers;
  var pricingTier = input.pricingBuckets;
  var company = input.companyName

  // To calculate the total charge, we start with the largest user tier that divides evenly
  // into the totalUsers.  Then we add to the total the product of the price and the number of times
  // it divides.  Continue until users cannot be divided evenly.
  if(!pricingTier.length){
    return {
      "charge": null,
      "result": "error",
      "err": "invalid pricing tier"
    }
  }
  if (totalUsers < 0 || typeof totalUsers !== 'number'){
    return {
      "charge": null,
      "result": "error",
      "err": "invalid number of users"
    }
  }

  var curCharge = 0;

  // To ensure we are progressing through, we sort using native sort O(NlogN)
  pricingTier = pricingTier.sort(function(a, b){
    return a.numUsers < b.numUsers;
  });

  // Iterate over pricing tier from largest to smallest.
  pricingTier.forEach(function(tier){
    curCharge += (totalUsers - tier.numUsers) * tier.price;
    totalUsers = tier.numUsers;
  });
  
  return {
    "charge": curCharge,
    "result": "success",
    "err": null
  }
}