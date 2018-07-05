let debug = require('debug')('app:server');
let requestPromies = require('request-promise');
let cheerio = require('cheerio');
let uri = 'http://kantor.waw.pl/';

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
	parse: function (currency, callback) {
		let selector = getCurrencySelector(currency);
		return requestPromies(options)
			.then(function ($) {
				callback(null, {
					buyRate: $(selector.buy).html(),
					saleRate: $(selector.sale).html()
				});
			})
			.catch(function (err) {
				callback(err);
				debug('Error when getting data from %s', uri, err);
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