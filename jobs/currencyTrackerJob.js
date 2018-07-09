let CurrencyRateParser = require('../services/currencyRateParser');
let CurrencyService = require('../services/currencyService');
let SmsService = require('../services/smsService');
let OperationLog = require('../db')['OperationLog'];
let shortid = require('shortid');
let async = require("async");
let env = process.env.NODE_ENV || 'development';
let cronConfig = require(__dirname + '/cron-config.json')[env];

module.exports = {
	start: function () {
		setInterval(doTracking, cronConfig.interval);
	}
};

function doTracking() {
	let currency = 'USD';
	let operationId = shortid.generate();
	OperationLog.create({
		operationId: operationId,
		operationName: `Start tracking`,
		status: 'SUCCESS'
	});
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
			SmsService.send(`pre: ${prevBuy} / cur: ${currBuy}`);
			OperationLog.create({
				operationId: operationId,
				operationName: `Sent message`,
				status: 'SUCCESS',
				description: `Previous rates ${prevBuy} / ${currBuy}`
			});
		} else {
			OperationLog.create({
				operationId: operationId,
				operationName: `Parse finish`,
				status: 'SUCCESS',
				description: `Rates haven't changed.`
			});
		}
	});
}