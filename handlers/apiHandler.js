var monthlyChargeBuilder = require('../controllers/monthlyCharges.js')

var apiHandler = {
  calculateMonthlyCharges: function(req, res){
    var resultBody = monthlyChargeBuilder(req.body);
    if(resultBody.err === null){
      res.status(201);
    } else {
      res.status(400);
    }
    res.send(resultBody);
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;