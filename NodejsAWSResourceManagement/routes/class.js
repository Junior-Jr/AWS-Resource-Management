var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('class');
});

router.post('/', function(req, res, next) {
    console.log(req.body.subject);
    console.log(req.body.lecturer);
  });

module.exports = router;
