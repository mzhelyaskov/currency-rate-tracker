let CurrencyRateParser = require('../services/currencyRateParser');
let CurrencyService = require('../services/currencyService');
let SmsService = require('../services/smsService');
let LogService = require('../services/logService');
let shortid = require('shortid');
let async = require("async");
let dateformat = require('dateformat');
let env = process.env.NODE_ENV || 'development';
let cronConfig = require(__dirname + '/cron-config.json')[env];

module.exports = {
	start: function () {
		setInterval(function () {
			doTracking(LogService.getLogger(shortid.generate()));
		}, cronConfig.interval);
	}
};

function doTracking(logger) {
	logger.info({operationName: `Task started`});
	let currency = 'USD';
	async.parallel({
		currRates: function(callback) {
			let operationName = `Parsing rates for ${currency}`;
			CurrencyRateParser.parse(currency).then(
				rates => {
					let date = dateformat(new Date(), 'yyyy-mm-dd');
					let buyRate = rates.buyRate;
					let saleRate = rates.saleRate;
					logger.success({
						operationName: operationName,
						description: `Rates: ${buyRate} / ${saleRate}`
					});
					callback(null, {date, buyRate, saleRate});
				},
				error => {
					logger.error({
						operationName: operationName,
						description: `Error on parsing rates`
					});
					callback(error);
				}
			);
		},
		prevRates: function(callback) {
			CurrencyService.findPreviousRates(currency).then(rates => {
				let date = dateformat(rates.createdAt, 'yyyy-mm-dd');
				let buyRate = rates && rates.buyRate || 0;
				let saleRate = rates && rates.saleRate || 0;
				logger.success({
					operationName: `Got prev rates for ${currency}`,
					description: `Previous rates ${buyRate} / ${saleRate}`
				});
				callback(null, {date, buyRate, saleRate});
			});
		}
	}, function(err, results) {
		if (err) {
			console.error('Error when getting start page.');
			return;
		}
		if (areRatesDifferent(results.prevRates, results.currRates)) {
			CurrencyService.addRates(currency, results.currRates).then(() => {
				let prevBuy = results.prevRates.buyRate || 0;
				let currBuy = results.currRates.buyRate || 0;
				let smsMessage = `pre: ${prevBuy} / cur: ${currBuy}`;
				SmsService.send(smsMessage);
				logger.info({
					operationName: `Sent sms`,
					description: smsMessage
				});
			});
		} else {
			logger.success({
				operationName: `Parsing finished`,
				description: `Rates haven't changed.`
			});
		}
	});
}

function areRatesDifferent(previous, current) {
	if (previous === current) {
		return false;
	}
	if (!previous || !current) {
		return true;
	}
	if (current.buyRate !== previous.buyRate || current.saleRate !== previous.saleRate) {
		return true;
	}
	return previous.date !== current.date;
}