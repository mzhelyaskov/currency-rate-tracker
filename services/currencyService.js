let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let OperationLog = db['OperationLog'];

module.exports = {
	update: function (operationId, currency, currentRates) {
		return findPreviousRate(operationId, currency).then(previousRates => {
			if (areRatesDifferent(currentRates, previousRates)) {
				return insertNewRates(operationId, currency, currentRates).then(() => {
					return getUpdateResult(true, currency, previousRates, currentRates);
				});
			}
			return getUpdateResult();
		});
	}
};

function findPreviousRate(operationId, currency) {
	return CurrencyRate.findOne({
		where: {currency: currency},
		order: [['id', 'DESC']]
	}).then(rate => {
		let buyRate = rate && rate.buyRate;
		let saleRate = rate && rate.saleRate;
		OperationLog.create({
			operationId: operationId,
			operationName: `Searching previous rate for ${currency}`,
			status: 'SUCCESS',
			description: `Previous rates ${buyRate} / ${saleRate}`
		});
		return rate;
	})
}

function insertNewRates(operationId, currency, rates) {
	return CurrencyRate.create({
		currency: currency,
		buyRate: rates.buyRate,
		saleRate: rates.saleRate
	}).then(rate => {
		OperationLog.create({
			operationId: operationId,
			operationName: `Inserting new rates for ${currency}`,
			status: 'SUCCESS',
			description: `Rates: ${rate.buyRate} / ${rate.saleRate}`
		});
		return rate;
	});
}

function areRatesDifferent(currentRates, previousRates) {
	return previousRates && currentRates
		? currentRates.buyRate !== previousRates.buyRate
		: true;
}

function getUpdateResult(updated, currency, previousRates, currentRates) {
	return {
		updated: !!updated,
		currency: currency,
		rates: {
			prevBuy: previousRates && previousRates.buyRate,
			prevSale: previousRates && previousRates.saleRate,
			currBuy: currentRates && currentRates.buyRate,
			currSale: currentRates && currentRates.saleRate
		}
	};
}