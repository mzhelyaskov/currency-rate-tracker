let CronJob = require('cron').CronJob;
let debug = require('debug')('app:server');
let CurrencyRateParser = require('../services/currencyRateParser');
let CurrencyService = require('../services/currencyService');
let SmsService = require('../services/smsService');
let async = require("async");

try {
	module.exports = new CronJob({
		cronTime: '00 59 * * * *',
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
			CurrencyRateParser.parse(currency, callback);
		},
		function (currentRates, callback) {
			CurrencyService.update(currency, currentRates, callback);
		}
	], function (err, result) {
		if (err) {
			throw err;
		}
		if (result.updated) {
			let prevBuy = result.rates.prevBuy || '0.000';
			let currBuy = result.rates.currBuy || '0.000';
			SmsService.send(`prev: ${prevBuy} curr: ${currBuy}`);
			debug('%s currency rates updated.', result.currency);
		}
	});
}