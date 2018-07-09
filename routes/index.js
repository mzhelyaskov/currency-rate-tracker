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
let url = require('url');


router.get('/', function (req, res) {
	let urlParams = url.parse(req.url, true);
	let operationId = urlParams.query.operationId;
	async.parallel({
		rates: function(callback) {
			RatesGetter.getAll().then(rates => callback(null, rates));
		},
		logs: function(callback) {
			LogGetter.getAll({
				operationId: operationId,
				limit: 50
			}).then(logs => callback(null, logs));
		}
	}, function(err, results) {
		if (err) {
			throw new Error('Error when getting start page.');
		}
		res.render('index', {
			version: '2.3.1',
			resetLogBtnExist: !!operationId,
			interval: cronConfig.interval,
			mode: process.env.NODE_ENV,
			rates: results.rates,
			logs: results.logs
		});
	});
});

module.exports = router;
