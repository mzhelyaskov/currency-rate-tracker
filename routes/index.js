let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {version: '1.0.4'});
});

module.exports = router;
