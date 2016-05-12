
var apiHandler = {
  calculateMonthlyCharges: function(req, res){
    var body = {
      charge: 110000,
      result: "success",
      err: null 
    }
    if(req.body.totalMonthlyActiveUsers < 0 || typeof req.body.totalMonthlyActiveUsers !== 'number'){
      body.result = "error";
      body.err = "invalid number of users";
    }
    res.status(201)
    res.send(body)
  },
  getMonthlyCharge: function(req, res){
    res.send('ok')
  }
}

module.exports = apiHandler;