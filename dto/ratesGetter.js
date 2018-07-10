let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let CurrencyService = require('../services/currencyService');
let dateformat = require('dateformat');
let _ = require('lodash');

module.exports = {
	getAll: function () {
		return CurrencyService.findAll({
			order: [['id', 'ASC']]
		}).then(rates => {
			return rates.map((rate, index) => {
				return convertToDTO(index + 1, rate);
			});
		});
	},
	getDateToAverageRate: function () {
		return CurrencyRate.findAll().then(rates => {
			let chartRates = rates.map(convertToChardDTO);
			return getAverageRates(chartRates);
		})
	}
};

function getAverageRates(rates) {
	let dateToAvgRate = {};
	rates.forEach(function (rate) {
		dateToAvgRate[rate.date] = dateToAvgRate[rate.date] || [];
		dateToAvgRate[rate.date].push(rate.buyRate);
	});
	for (let date in dateToAvgRate) {
		let rates = dateToAvgRate[date];
		dateToAvgRate[date] = Math.floor(_.sum(rates) / rates.length * 1000);
	}
	return dateToAvgRate;
}

function convertToChardDTO(rate) {
	return {
		date: dateformat(rate.created_at, 'yyyy-mm-dd'),
		buyRate: rate.buyRate
	}
}

function convertToDTO(row, rate) {
	return {
		row: row,
		id: rate.id,
		timestamp: dateformat(rate.created_at, 'yy-mm-dd HH:MM'),
		currency: rate.currency,
		buy: rate.buyRate,
		sale: rate.saleRate
	}
}