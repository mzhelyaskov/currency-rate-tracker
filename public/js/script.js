$(function () {
	//$('.table-container').animate({ scrollTop: 9999 }, "slow");

	var expectedRates = {
		'2018-07-09': {value: 3700},
		'2018-07-10': {value: 3630},
		'2018-07-11': {value: 3620},
		'2018-07-12': {value: 3590},
		'2018-07-13': {value: 3580},
		'2018-07-14': {value: 3570},
		'2018-07-15': {value: 3600},
		'2018-07-16': {value: 3570},
		'2018-07-17': {value: 3600},
		'2018-07-18': {value: 3570},
		'2018-07-19': {value: 3580},
		'2018-07-20': {value: 3620},
		'2018-07-21': {value: 3620},
		'2018-07-22': {value: 3620},
		'2018-07-23': {value: 3630},
		'2018-07-24': {value: 3640},
		'2018-07-25': {value: 3620},
		'2018-07-26': {value: 3620},
		'2018-07-27': {value: 3630},
		'2018-07-28': {value: 3630},
		'2018-07-29': {value: 3630},
		'2018-07-30': {value: 3650},
		'2018-07-31': {value: 3660}
	};

	$.get('/getRatesForChart', function (currentRates) {
		Morris.Line({
			element: 'currency-chart',
			data: getChartRates(currentRates),
			xLabelAngle: 60,
			ymin: 3500,
			ymax: 3800,
			xkey: 'x',
			ykeys: ['y', 'z'],
			labels: ['Expected', 'Current'],
			lineColors: ['blue', 'red']
		});
	});

	function getChartRates(currentRates) {
		var result = [];
		for (var date in expectedRates) {
			result.push({
				x: date,
				y: expectedRates[date].value,
				z: currentRates[date]
			});
		}
		return result;
	}
});