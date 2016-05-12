
var apiHandler = {
  calculateMonthlyCharges: function(req, res){
    var body = {
      charge: null,
      result: null,
      err: null 
    }
    res.status(201)
    res.send(body)
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;