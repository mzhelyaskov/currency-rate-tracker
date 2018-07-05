let DbService = require('../db');

module.exports = {
	getAll: function (country, callback) {
		DbService.getAll('selectAllByCurrency', [country], callback);
	},
	getLast: function (currency, callback) {
		DbService.getAll('selectLastRates', [currency], (err, rows) => {
			if (err) {
				callback(err);
				return;
			}
			callback(null, {buyRate: rows[0].buy_rate, saleRate: rows[0].sale_rate});
		});
	},
	update: function (currency, currentRates, callback) {
		this.getLast('USD', function (err, previousRates) {
			if (err) {
				callback(err);
				return;
			}
			if (isRateDifferent(currentRates, previousRates)) {
				insertAndGetResult(currency, previousRates, currentRates, callback);
			} else {
				callback(null, {updated: false});
			}
		});
	}
};

function insertAndGetResult(currency, previousRates, currentRates, callback) {
	let currBuy = currentRates.buyRate;
	let currSale = currentRates.saleRate;
	let prevBuy = previousRates.buyRate;
	let prevSale = previousRates.saleRate;
	DbService.run('insertRates', [currency, currBuy, currSale], (err) => {
		if (err) {
			callback(err);
			return;
		}
		callback(null, {
			updated: true,
			currency: currency,
			rates: {prevBuy, prevSale, currBuy, currSale}
		});
	});
}

function isRateDifferent(currentRates, previousRates) {
	return currentRates.buyRate !== previousRates.buyRate;
}