let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let OperationLog = db['OperationLog'];

module.exports = {
	addRates: function(currency, rates) {
		return CurrencyRate.create({
			currency: currency,
			buyRate: rates.buyRate,
			saleRate: rates.saleRate
		});
	},
	findPreviousRates: function(currency) {
		return CurrencyRate.findOne({
			where: {currency: currency},
			order: [['id', 'DESC']]
		});
	}
};