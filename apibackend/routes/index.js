var express = require('express');
var router = express.Router();
const CustomerExe = require("../customerModel");
const message = require("../message");
const resBody = require("../responseStructure");
const multer = require('multer');
var path = require('path');
/** Setup multer with file destination */
let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let path = `upload/`;
      callback(null, path);
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      callback(null, file.originalname);
    }
  })
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/** GET All customer data */
router.post('/selectCustomers', function (req, res, next) {
  CustomerExe.getAllCustomer(req).then((result) => {
    resBody.message = message.dbSuccess;
    resBody.data = result;
    resBody.total_records = result.totalRecords;
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.dbError;
    resBody.has_error = true;
    res.status(500).send(resBody);
  })

});

/** GET customer details by id */
router.post('/selectCustomerById', function (req, res, next) {
  CustomerExe.getCustomerById(req).then((result) => {
    resBody.message = message.dbSuccess;
    resBody.data = result[0] ? result[0] : {};
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.dbError;
    resBody.has_error = true;
    res.status(500).send(resBody);
  })

});
/** Insert a new customer */
router.post('/insertCustomer', function (req, res, next) {
  CustomerExe.addNewCustomer(req).then((result) => {
    resBody.message = message.dbInsert;
    resBody.has_error = false;
    resBody.data = result;
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.dbError + ': ' + err.sqlMessage;
    resBody.data = { code: err.code, sqlMessage: err.sqlMessage };
    resBody.has_error = true;
    res.status(500).send(resBody);
  })

});
/** Upload image of a customer */
router.post('/customer/imageupload', upload.single('file'), function (req, res) {
  const customerId = req.body.customerId;
  const file = req.file;
  CustomerExe.updateCustomerImage(customerId, file.filename).then((result) => {
    resBody.message = message.dbUpdate;
    resBody.data = result;
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.dbError + ': ' + err.sqlMessage;
    resBody.data = { code: err.code, sqlMessage: err.sqlMessage };
    resBody.has_error = true;
    res.status(500).send(resBody);
  })
});
/** Update a customer */
router.post('/updateCustomer', function (req, res, next) {
  CustomerExe.updateCustomer(req).then((result) => {
    resBody.message = message.dbUpdate;
    resBody.data = result;
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.dbError + ': ' + err.sqlMessage;
    resBody.data = { code: err.code, sqlMessage: err.sqlMessage };
    resBody.has_error = true;
    res.status(500).send(resBody);
  })

});
/** Delete a customer */
router.post('/deleteCustomer', function (req, res, next) {
  CustomerExe.deleteCustomer(req).then((result) => {
    resBody.message = message.dbDelete;
    resBody.data = result;
    res.status(200).send(resBody);
  }).catch((err) => {
    resBody.message = message.generalError;
    resBody.data = {};
    resBody.has_error = true;
    res.status(500).send(resBody);
  })

});
/** Get customer image */
router.get('/customerimage/:name', function (req, res) {
  let name = req.params.name
  let filename = path.resolve(__dirname, '../upload');
  res.sendFile(name, { root: filename });
});

module.exports = router;
