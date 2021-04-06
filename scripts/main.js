//TODO: 2, Add information in portfolio performance
//TODO: 5, Use binance data for charts
//TODO: 4, Design AWS dynamic page structure
//TODO: 1, Delete chart pop in and out on redraw
//TODO: 1, Find color for folio time selection
//TODO: 1, Make folio time in out chart

const NUM_CONTAINERS = 13;
var num = 0;

const MAX_OPTS = 7;
var OPT_SCROLL = 0;

const COLORS = Highcharts.getOptions().colors.slice(0,10);
var COLOR_HEAP = [10,1,2,3,4,5,6,7,8,9];

var FOLIO_VALS = [];

var chart;
var highlighted;
var time_frame;

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};
function initialize(){
    //Get DATA for BTC
    getCoin("BTC")
        .then(vals => {
            chart.series[0].setData(vals);
        })

    //Load line chart
    chart = Highcharts.chart('line_figure',chart_data);

    //Load pie chart
    $("#pie_figure").highcharts(pie_data);

    //Initialize portfolio 1 as selected
    highlighted = $("#container1 > .portfolio_time");

    //Load sliders
    $(".slider").each(function(i,obj){
        $("#"+$(obj).attr("data-ratio")).html(obj.value);
    });
    
    //Fade in containers
    fadeContainers();
}

function coin_selections(){
    $(".add_to_chart, .coin_add").click(function(event) {
	var target = event.target;
	var color;
	if(!$(target).hasClass("selected")){
	    color = COLOR_HEAP.min();
	    COLOR_HEAP[color] = 10;
	    if(color == 10){
		console.log("No more than ten selections available.")
		return;
	    }
	    $(target).addClass("selected");
	    $(target).attr("data-color",COLORS[color]);
	    $(target).css("background",COLORS[color]);

	    $("#container7").animate({opacity:0,right:"100px"}, 150, function() {
                var ticker = $(target).attr("data-chart");
                getCoin(ticker)
                    .then(vals => {
                        chart.series[color].setData(vals);
                        $("#container7").animate({opacity:1,right:0}, 150);
                    });
	    });

	    if($(target).hasClass("coin_add"))
		$(target).html("−");
	}
	else{
	    var index = COLORS.indexOf($(target).attr("data-color"));
	    $(target).attr("data-color",0);
	    COLOR_HEAP[index] = index;
	    $(target).removeClass("selected");
	    if($(target).hasClass("coin_add"))
		$(target).html("+");
	    $(target).css("background","");
	    $("#container7").animate({opacity:0,right:100}, 150,function() {
		chart.series[index].setData([]);
	    });
	    $("#container7").animate({opacity:1,right:0}, 150);
	}
    });
}

function portfolio_selections(){
    $(".portfolio_time").click(function(event) {
	if(event.target == highlighted){
	    $(event.target).parent().css("border","0px");
	    $(event.target).css("padding-top","12px");
	    highlighted = 0;
	}
	else{
	    $(event.target).parent().css("border","3px solid white");
	    $(event.target).css("padding-top","9px");
	    $(highlighted).parent().css("border","0px");
	    $(highlighted).css("padding-top","12px");
	    highlighted = event.target;
	}
    });
}

function time_selections(){
    $(".time_button").click(function(event) {
	if(event.target == time_frame) {
	    //clear selection and display max data
	    var time_offset = .01*(chart.xAxis[0].dataMax - chart.xAxis[0].dataMin)
	    clickBump(event.target);
	    $("#container7").animate({opacity:0,right:100}, 150,function() {
		chart.xAxis[0].setExtremes(
		    chart.xAxis[0].dataMin - time_offset,
		    chart.xAxis[0].dataMax + time_offset
		);
	    });
	    $("#container7").animate({opacity:1,right:0}, 150);

	    //Remove styling from selected element
	    $(event.target).css({"background-color":"","box-shadow":"","z-index":""});
	    time_frame = null;
	}
	else{
	    var time_slot = 86400000*$(event.target).attr("data-time");
	    $("#container7").animate({opacity:0,right:100}, 150, function() {
		chart.xAxis[0].setExtremes(
		    chart.xAxis[0].dataMax-time_slot*1.01,
		    chart.xAxis[0].dataMax+time_slot*.01
		)
	    });
	    $("#container7").animate({opacity:1,right:0}, 150);

	    clickBump(event.target);

            //Add/Remove styling from buttons
	    $(time_frame).css({"background-color":"","box-shadow":"","z-index":""});
	    $(event.target).css({"background-color":"#16c784","box-shadow":"0px 0px 0px 3px #16c784","z-index":"1"});
	    time_frame = event.target;
	}
    });
}

function scroll_portfolios(){
    $("#right_scroll").click(function() {
	if(OPT_SCROLL != 0){
	    $(`#opt${OPT_SCROLL}`).css("display","inline-block");
	    OPT_SCROLL--;
	    
	}
    });

    $("#left_scroll").click(function() {
	if(OPT_SCROLL+6 <= MAX_OPTS){
	    OPT_SCROLL++;
	    $(`#opt${OPT_SCROLL}`).css("display","none");

	}
    });
}

$(document).ready(function() {
    initialize();

    //Allow selections of coin opts
    coin_selections();

    //Add border to container on portfolio click
    portfolio_selections();

    //Highlight time selection
    time_selections();
			    
    //Scroll through portfolios
    scroll_portfolios();

    //Listen to sliders
    slider_updates();
});

function slider_updates(){
    $(".slider").on("input",function() {
        $("#"+$(this).attr("data-ratio")).html(this.value);
    });
}

function fadeContainers(){
    num++;
    if(num > NUM_CONTAINERS)
	return;
    if(num != 11 && num != 9 && num != 7 && num != 8){
	$("#container" + num).css("bottom","100px")
	$("#container" + num).animate({opacity:1,bottom:0}, 150, fadeContainers);
    }
    else if(num == 9 || num == 11){
	$("#container" + num).css("left","100px")
	$("#container" + num).animate({opacity:1,left:0}, 150, fadeContainers);
    }
    else{
	$("#container" + num).css("right","100px")
	$("#container" + num).animate({opacity:1,right:0}, 150, fadeContainers);
    }
}

function calcPortfolios() {
    $(".slider").each(function(i,obj) {
        if(obj.value == 0)
            return;
        getCoin($(obj).attr("data-ratio").slice(0,3))
            .then(vals => {
                for(let i = vals.length-1; i >= 0; i--){
                    if(FOLIO_VALS[i] == undefined)
                        FOLIO_VALS[i] = [
                            vals[i][0],
                            0
                        ];
                    FOLIO_VALS[i][1] += vals[i][1]*.01*parseInt(obj.value);
                }
            });
    });
}

/**
 * Returns useful information about the portfolio.
 * 
 * Info includes:
 * max, min, best avg, worst avg, best log avg, most consistent
 *
 * @params (TODO NAME) The [highlighted] portfolio.
 @ return  html for the portfolio's calculated info.
 */
function analyzePortfolios() {
    
}

function clickBump(target) {
    $(target).css("padding-top","0px");
	    $(target).animate({
		"padding-top": "3px",
	    }, 150, function(){});
}
