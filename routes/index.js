var express = require('express');
var router = express.Router();
var apiHandler = require('../handlers/apiHandler')


router.post('/company/:id/monthlyCharges', apiHandler.calculateMonthlyCharges);
router.get('/company/:id/monthlyCharges/:month', apiHandler.getMonthlyCharge)

module.exports = router;
