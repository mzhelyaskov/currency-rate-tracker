let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let Logger = require('../services/logService').getDefault();

module.exports = {
	findAll: function (params) {
		return CurrencyRate.findAll(params).catch(error => {
			Logger.error({
				operationName: 'CurrencyRate.findAll',
				description: error.message
			})
		});
	},
	addRates: function (currency, rates) {
		return CurrencyRate.create({
			currency: currency,
			buyRate: rates.buyRate,
			saleRate: rates.saleRate
		}).catch(error => {
			Logger.error({
				operationName: 'CurrencyRate.create',
				description: error.message
			})
		});
	},
	findPreviousRates: function (currency) {
		return CurrencyRate.findOne({
			where: {currency: currency},
			order: [['id', 'DESC']]
		}).catch(error => {
			Logger.error({
				operationName: 'CurrencyRate.findOne',
				description: error.message
			})
		});
	}
};