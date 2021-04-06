// Make monochrome colors
var pieColors = (function () {
    var colors = [],
	base = Highcharts.getOptions().colors[0],
	i;

    for (i = 0; i < 10; i += 1) {
	// Start out with a darkened base color (negative brighten), and end
	// up with a much brighter color
	colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}());

var pie_data = 
{
    chart: {
	plotBackgroundColor: null,
	plotBorderWidth: null,
	plotShadow: false,
	type: 'pie',
	backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
	text: null
    }, 
    tooltip: {
	pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
	hideDelay:0
    },
    accessibility: {
	point: {
	    valueSuffix: '%'
	}
    },
    plotOptions: {
	pie: {
	    allowPointSelect: true,
	    cursor: 'pointer',
//	    colors: pieColors,
//	    borderColor: '#192C42',
	    dataLabels: {
		enabled: false
	    },
//	    showInLegend: true
	}
    },
    exporting: {
	buttons: {
	    contextButton: {
		theme: {
		    fill: 'rgba(0,0,0,0)'
		}
	    }
	}
    },
    series: [{
	name: '% Holdings',
	colorByPoint: true,
	data: [{
	    name: 'Bitcoin',
	    y: 61.41,
	    sliced: true,
	    selected: true
	}, {
	    name: 'Etherium',
	    y: 11.84
	}, {
	    name: 'LiteCoin',
	    y: 10.85
	}, {
	    name: 'DogeCoin',
	    y: 4.67
	}, {
	    name: 'Bitconnect',
	    y: 4.18
	}, {
	    name: 'Other',
	    y: 7.05
	}]
    }]
}
