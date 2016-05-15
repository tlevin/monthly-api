var monthlyChargeBuilder = require('../helpers/monthlyCharges.js')

var apiHandler = {
  calculateMonthlyCharges: function(req, res){
    monthlyChargeBuilder(req.body).then(function(result){
      if(result.err !== null){
        res.status(400).json(result)
      } else {
        res.status(201).json(result);
      }
    })
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;