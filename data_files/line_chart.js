var chart_data =
{
    chart: {
	zoomType: 'x',
	margin: 0,
	height:300,
	backgroundColor: 'rgba(0,0,0,0)',
	animation:false
    },
    title: {
	text: null
    },
    tooltip: {
	hideDelay:0,
        xDateFormat: '%Y-%m-%d',
	pointFormat: '<b style="color:{series.color}">{point.y}</b> ({point.change}%)<br/><span style="font-size:9px">{point.key}</span>',
	valueDecimals: 2,
	split: true
    },
    xAxis: {
	type:"datetime",
	title: null
    },
    yAxis: {
	title: null,
	gridLineColor:'#307CAA',
	labels: {
	    formatter: function () {
		return (this.value > 0 ? ' + ' : '') + this.value + '%';
	    }
	},
    },
    legend: {
	enabled: false
    },
    plotOptions: {
	series: {
	    compare: 'percent',
	    showInNavigator: true,
	    type: 'area',
	    name: 'Coin Value',
	    pointIntervalUnit: "day",
	    animation: false
	},
	area: {
	    marker: {
		radius: 2
	    },
	    lineWidth: 1,
	    states: {
		hover: {
		    lineWidth: 1
		}
	    },
	    threshold: null
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
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[0]],
		[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[1]],
		[1, Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[2]],
		[1, Highcharts.color(Highcharts.getOptions().colors[2]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    },{
	fillColor: {
	    linearGradient: {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	    },
	    stops: [
                [0, Highcharts.getOptions().colors[3]],
		[1, Highcharts.color(Highcharts.getOptions().colors[3]).setOpacity(0).get('rgba')]
	    ]
	}
    }
            ]
} 
