let express = require('express');
let router = express.Router();
let RatesGetter = require('../dto/ratesGetter');
let LogGetter = require('../dto/logGetter');
let async = require("async");
let env = process.env.NODE_ENV || 'development';
let cronConfig = require('../jobs/cron-config.json')[env];
let url = require('url');


router.get('/', function (req, res) {
	let urlParams = url.parse(req.url, true);
	let operationId = urlParams.query.operationId;
	async.parallel({
		rates: function(callback) {
			RatesGetter.getAll().then(rates => callback(null, rates));
		},
		logs: function(callback) {
			LogGetter.getLog(operationId).then(logs => callback(null, logs));
		}
	}, function(err, results) {
		if (err) {
			throw new Error('Error when getting start page.');
		}
		res.render('index', {
			resetLogBtnExist: !!operationId,
			interval: cronConfig.interval,
			mode: process.env.NODE_ENV,
			rates: results.rates,
			logs: results.logs
		});
	});
});

router.get('/getRatesForChart', function (req, res) {
	RatesGetter.getDateToAverageRate().then(dateToAvgRate => {
		res.json(dateToAvgRate);
	});
});

module.exports = router;
