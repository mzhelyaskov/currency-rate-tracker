let express = require('express');
let router = express.Router();
let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let OperationLog = db['OperationLog'];
let RatesGetter = require('../dto/ratesGetter');
let LogGetter = require('../dto/logGetter');
let async = require("async");

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
			version: '2.1.0',
			rates: results.rates,
			logs: results.logs
		});
	});
});

module.exports = router;

function convertToLogDTO(logs) {

}

function convertToRatesDTO(rates) {
	return rates.map((rate, index) => {
		return {
			row: index + 1,
			id: rate.id,
			timestamp: dateformat(rate.created_at, 'yyyy-mm-dd HH:MM'),
			currency: rate.currency,
			buy: rate.buyRate,
			sale: rate.saleRate
		}
	});
}
