$(function () {
	$('.table-container').animate({ scrollTop: 9999 }, "slow");

	$("#chartContainer").CanvasJSChart({
		animationEnabled: true,
		title:{
			text: "USD currency rates tracker:"
		},
		axisY: {
			title: "PLN / USD",
			valueFormatString: "#0.00",
			suffix: "zl",
			prefix: ""
		},
		data: [{
			type: "area",
			markerSize: 8,
			xValueFormatString: "YYYY-MM-DD",
			yValueFormatString: "#,##0.##zl",
			dataPoints: [
				{ x: new Date(2018, 8,  9), y: 3.300 },
				{ x: new Date(2018, 8, 10), y: 3.400 },
				{ x: new Date(2018, 8, 11), y: 3.420 },
				{ x: new Date(2018, 8, 12), y: 3.450 },
				{ x: new Date(2018, 8, 13), y: 3.500 },
				{ x: new Date(2018, 8, 14), y: 3.711 },
				{ x: new Date(2018, 8, 15), y: 3.701 }
			]
		}]
	});
});