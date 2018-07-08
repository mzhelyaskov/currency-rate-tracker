let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let dateformat = require('dateformat');

module.exports = {
	getAll: function () {
		return CurrencyRate.findAll().then(rates => {
			return rates.map((rate, index) => {
				return convertToDTO(index + 1, rate);
			});
		});
	}
};

function convertToDTO(row, rate) {
	return {
		row: row,
		id: rate.id,
		timestamp: dateformat(rate.created_at, 'yyyy-mm-dd HH:MM'),
		currency: rate.currency,
		buy: rate.buyRate,
		sale: rate.saleRate
	}
}