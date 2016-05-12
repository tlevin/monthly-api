var monthlyChargeBuilder = require('../controllers/monthlyCharges.js')

var apiHandler = {
  calculateMonthlyCharges: function(req, res){
    var resultBody = monthlyChargeBuilder(req.body)
    res.status(201)
    res.send(resultBody);
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;