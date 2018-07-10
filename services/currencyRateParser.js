let requestPromies = require('request-promise');
let cheerio = require('cheerio');
let uri = 'http://kantor.waw.pl/';
let dateformat = require('dateformat');

const currencyRateSelectors = {
	'USD': {
		buy: 'body > center > table > tbody > tr:nth-child(4) > td > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(3)',
		sale: 'body > center > table > tbody > tr:nth-child(4) > td > table:nth-child(1) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(4)'
	}
};

const options = {
	uri: uri,
	transform: function (body) {
		return cheerio.load(body);
	}
};

module.exports = {
	parse: function (currency) {
		let selector = getCurrencySelector(currency);
		return requestPromies(options)
			.then(function ($) {
				let buyRate = parseFloat($(selector.buy).html());
				let saleRate = parseFloat($(selector.sale).html());
				return {
					buyRate: buyRate,
					saleRate: saleRate
				}
			})
			.catch(function () {
				throw new Error(`Error when getting data from ${uri}`);
			});
	}
};

function getCurrencySelector(currency) {
	let selector = currencyRateSelectors[currency];
	if (!selector) {
		throw Error("Currency selector for: ' + currency + ' doesn't exists");
	}
	return selector;
}