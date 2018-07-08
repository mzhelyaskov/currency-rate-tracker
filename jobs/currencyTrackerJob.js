let CronJob = require('cron').CronJob;
let CurrencyRateParser = require('../services/currencyRateParser');
let CurrencyService = require('../services/currencyService');
let SmsService = require('../services/smsService');
let OperationLog = require('../db')['OperationLog'];
let shortid = require('shortid');
let async = require("async");

try {
	module.exports = new CronJob({
		cronTime: '00 * * * * *',
		onTick: doTracking,
		start: false,
		timeZone: 'Europe/Warsaw'
	});
} catch (ex) {
	console.log("Cron pattern not valid");
}

function doTracking() {
	let currency = 'USD';
	let operationId = shortid.generate();
	async.waterfall([
		function (callback) {
			CurrencyRateParser.parse(operationId, currency).then(
				rates => callback(null, rates),
				error => callback(error)
			);
		},
		function (rates, callback) {
			CurrencyService.update(operationId, currency, rates).then(results => {
				callback(null, results);
			});
		}
	], function (error, result) {
		if (error) {
			return;
		}
		if (result.updated) {
			let prevBuy = result.rates.prevBuy || 0;
			let currBuy = result.rates.currBuy || 0;
			console.log('Currency rates updated.');
			OperationLog.create({
				operationId: operationId,
				operationName: `${result.currency} currency rates updated.`,
				status: 'SUCCESS',
				description: `Rates ${prevBuy} / ${currBuy}`
			});
			SmsService.send(`prev: ${prevBuy} curr: ${currBuy}`);
			OperationLog.create({
				operationId: operationId,
				operationName: `Sent message`,
				status: 'SUCCESS',
				description: `Previous rates ${prevBuy} / ${currBuy}`
			});
		}
	});
}