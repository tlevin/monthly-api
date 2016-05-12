var express = require('express');
var router = express.Router();


router.post('/company/:id/monthlyCharges', apiHandler.calculateMonthlyCharge);
router.get('/company/:id/monthlyCharges/:month', apiHandler.getMonthlyCharge)

module.exports = router;
