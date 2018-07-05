let CronJob = require('cron').CronJob;
let debug = require('debug')('DollarRate:server');
let DollarRateExtractor = require('../services/dollarRateExtractor');
let CurrencyService = require('../services/currencyService');
let SmsService = require('../services/smsService');
let async = require("async");

try {
	module.exports = new CronJob({
		cronTime: '00 00 * * * *',
		onTick: doTracking,
		start: false,
		timeZone: 'Europe/Warsaw'
	});
} catch (ex) {
	debug("Cron pattern not valid");
}

function doTracking() {
	let currency = 'USD';
	async.waterfall([
		function (callback) {
			DollarRateExtractor.extract(currency, callback);
		},
		function (currentRates, callback) {
			CurrencyService.update(currency, currentRates, callback);
		}
	], function (err, result) {
		if (err) {
			throw err;
		}
		if (result.updated) {
			let rates = result.rates;
			SmsService.send(`prev: ${rates.prevBuy} curr: ${rates.currBuy}`);
			debug('%s currency rates updated.', result.currency);
		}
	});
}