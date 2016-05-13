var express = require('express');
var router = express.Router();
var apiHandler = require('../handlers/apiHandler')


router.post('/company/:id/monthlyCharges', apiHandler.calculateMonthlyCharges);

module.exports = router;
