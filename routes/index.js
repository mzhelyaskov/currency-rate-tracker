let express = require('express');
let router = express.Router();
let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let OperationLog = db['OperationLog'];
let RatesGetter = require('../dto/ratesGetter');
let LogGetter = require('../dto/logGetter');
let async = require("async");
let env = process.env.NODE_ENV || 'development';
let cronConfig = require('../jobs/cron-config.json')[env];

router.get('/', function (req, res) {
	async.parallel({
		rates: function(callback) {
			RatesGetter.getAll().then(rates => callback(null, rates));
		},
		logs: function(callback) {
			LogGetter.getAll(50).then(logs => callback(null, logs));
		}
	}, function(err, results) {
		if (err) {
			throw new Error('Error when getting start page.');
		}
		res.render('index', {
			version: '2.1.8',
			cronTime: cronConfig.cronTime,
			mode: process.env.NODE_ENV,
			rates: results.rates,
			logs: results.logs
		});
	});
});

module.exports = router;
