var express = require('express');
const LoginExe = require('../loginModel');
var router = express.Router();
const jwt = require('jsonwebtoken');

const message = require("../message");
const resBody = require("../responseStructure");
/* GET users listing. */
router.post('/', function (req, res, next) {
  LoginExe.login(req).then((result) => {
    resBody.message = message.sendLoginCode;
    resBody.has_error = false;
    resBody.data = [{customerId:result[0]['customerId']}];
    res.status(200).send(resBody);
  }).catch((err) => {
    console.log(err);
    resBody.message = err;
    resBody.has_error = true;
    resBody.data = JSON.stringify(err);
    res.status(200).send(resBody);
  })
});

router.post('/code', function (req, res, next) {
  LoginExe.loginWithCode(req).then((result) => {
    const tokenjwt = jwt.sign({ customerId: result[0]['customerId'], role: result[0]['role'], name: result[0]['firstName'] + result[0]['lastName'] }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' });
    resBody.message = message.loginSuccessfull;
    resBody.has_error = false;
    resBody.data = { token: tokenjwt, role: result[0]['role'],customerId:result[0]['customerId'] };
    res.status(200).send(resBody);
  }).catch((err) => {
    console.log(err);
    resBody.message = err;
    resBody.has_error = true;
    resBody.data = JSON.stringify(err);
    res.status(200).send(resBody);
  })
});

router.post('/forgotpassword', function (req, res, next) {
  LoginExe.forgotPassword(req).then((result) => {
    resBody.message = message.sendLoginCode;
    resBody.has_error = false;
    resBody.data =  [{customerId:result[0]['customerId']}];
    res.status(200).send(resBody);
  }).catch((err) => {
    console.log(err);
    resBody.message = err;
    resBody.has_error = true;
    resBody.data = JSON.stringify(err);
    res.status(200).send(resBody);
  })
});

router.post('/resetPassword', function (req, res, next) {
  LoginExe.resetPassword(req).then((result) => {
    resBody.message = message.updateSuccessfull;
    resBody.has_error = false;
    resBody.data =  result;
    res.status(200).send(resBody);
  }).catch((err) => {
    console.log(err);
    resBody.message = err;
    resBody.has_error = true;
    resBody.data = JSON.stringify(err);
    res.status(200).send(resBody);
  })
});

module.exports = router;
