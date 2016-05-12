
var apiHandler = {
  calculateMonthlyCharges: function(req, res){

    res.sendStatus(201)
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;