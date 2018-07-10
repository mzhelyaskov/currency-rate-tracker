$(function () {
	$('.table-container').animate({ scrollTop: 9999 }, "slow");

	var expectedRates = {
		'18-07-09': {value: 3700},
		'18-07-10': {value: 3660},
		'18-07-11': {value: 3650},
		'18-07-12': {value: 3640},
		'18-07-13': {value: 3680},
		'18-07-14': {value: 3680},
		'18-07-15': {value: 3680},
		'18-07-16': {value: 3680},
		'18-07-17': {value: 3680},
		'18-07-18': {value: 3680},
		'18-07-19': {value: 3680},
		'18-07-20': {value: 3680},
		'18-07-21': {value: 3680},
		'18-07-22': {value: 3680},
		'18-07-23': {value: 3650},
		'18-07-24': {value: 3650},
		'18-07-25': {value: 3650},
		'18-07-26': {value: 3650},
		'18-07-27': {value: 3650},
		'18-07-28': {value: 3650},
		'18-07-29': {value: 3650}
	};

	$.get('/getRatesForChart', function (currentRates) {
		Morris.Line({
			element: 'currency-chart',
			data: getChartRates(currentRates),
			xLabelAngle: 60,
			ymin: 3500,
			ymax: 4000,
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