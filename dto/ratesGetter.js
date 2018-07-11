let db = require('../db');
let CurrencyRate = db['CurrencyRate'];
let CurrencyService = require('../services/currencyService');
let dateformat = require('dateformat');
let moment = require('moment');
let _ = require('lodash');

module.exports = {
	getAll: function () {
		return CurrencyService.findAll({
			order: [['id', 'DESC']]
		}).then(rates => {
			let length = rates.length;
			return rates.map(rate => {
				return convertToDTO(length--, rate);
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
		date: moment(rate.created_at).add(2, 'hour').format('YYYY-MM-DD'),
		buyRate: rate.buyRate
	}
}

function convertToDTO(rowNum, rate) {
	return {
		rowNum: rowNum,
		timestamp: moment(rate.created_at).add(2, 'hour').format('YYYY-MM-DD HH:mm'),
		currency: rate.currency,
		buy: rate.buyRate,
		sale: rate.saleRate
	}
}