//TODO: Fix prices

const NUM_CONTAINERS = 13;
const NUM_COINS = 8;
var num = 0;

var MAX_OPTS = 9;
var OPT_SCROLL = 0;

const COLORS = Highcharts.getOptions().colors.slice(0,10);
var COLOR_HEAP = [10,1,2,3,4,5,6,7,8,9];

var FOLIOS = [];
var SELECTED_FOLIO = [];
var FOLIO_PROPS = [{name: 'BTC',y: 100}]

var chart;
var pie;
var highlighted;
var time_frame;

Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

$(document).ready(function() {
    //Get starter data and run startup animations
    initialize();

    //Highlight time selection
    time_selections();
			    
    //Scroll through portfolios
    scroll_portfolios();

    //Listen to sliders
    slider_updates();

    //Adjust returns in response to funds
    calcReturn();
});

function initialize(){
    //Get DATA for BTC
    getCoin("BTC")
        .then(vals => {
            chart.series[0].setData(vals);
            analyzePortfolio(vals);
            SELECTED_FOLIO = vals
        })
    
    //Load line chart
    chart = Highcharts.chart('line_figure',chart_data);

    //Load pie chart
    pie = Highcharts.chart('pie_figure',pie_data);

    //Initialize portfolio 1 as selected
    highlighted = $("#container1 > .portfolio_time");

    //Load sliders
    $(".slider").each(function(i,obj){
        $("#"+$(obj).attr("data-ratio")).html(obj.value);
    });
    
    //Fade in containers
    fadeContainers();
}

function coin_selections(event){
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
            if (ticker.slice(0,5) == 'folio') {
                chart.series[color].setData(FOLIOS[parseInt(ticker.slice(5,ticker.length))-1]);
                $("#container7").animate({opacity:1,right:0}, 150);
            }
            else {
                getCoin(ticker)
                    .then(vals => {
                        chart.series[color].setData(vals);
                        $("#container7").animate({opacity:1,right:0}, 150);
                    });
            }
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
}

function portfolio_selections(event){
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
        if($(event.target).html().slice(0,5) == "FOLIO"){
            analyzePortfolio(FOLIOS[parseInt($(event.target).html().slice(6))-1])
            SELECTED_FOLIO = FOLIOS[parseInt($(event.target).html().slice(6))-1]
            pie.series[0].setData(FOLIO_PROPS[parseInt($(event.target).html().slice(6))])
        }
        else{
            getCoin($(event.target).html())
                .then(vals => {
                    pie.series[0].setData([{name:$(event.target).html(),y:100}])
                    analyzePortfolio(vals)
                    SELECTED_FOLIO = vals
                });
        }
    }
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
            $("#container7").animate({opacity:1,right:0}, 150,function() {
                $(".portfolio_time").each(function(){
                    if (SELECTED_FOLIO != []) {
                        analyzePortfolio(SELECTED_FOLIO)
                    }
                });
            });

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
	    $(`#opt${MAX_OPTS-OPT_SCROLL}`).css("display","inline-block");
	    OPT_SCROLL--;
	    
	}
    });

    $("#left_scroll").click(function() {
	if(OPT_SCROLL+6 <= MAX_OPTS){
	    OPT_SCROLL++;
	    $(`#opt${MAX_OPTS-OPT_SCROLL}`).css("display","none");

	}
    });
}

function slider_updates(){
    $(".slider").on("input",function() {
        $("#"+$(this).attr("data-ratio") + "Ratio").html(this.value);
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

async function calcPortfolio() {
    var new_folio = []
    var folio_props = []
    var total_weights = []
    $(".slider").each(function(i,obj) {
        if(obj.value == 0)
            return;
        getCoin($(obj).attr("data-ratio"))
            .then(vals => {
                folio_props.push({name:$(obj).attr("data-ratio").toUpperCase(),y:parseInt(obj.value)})
                if(new_folio.length > 0 && new_folio.length < vals.length){
                    bonus = []
                    bonus_weights = []
                    for (let i = 0; i+new_folio.length < vals.length; i++) {
                        bonus[i] = [
                            vals[i][0],
                            vals[i][1]/vals[0][1]*.01*parseInt(obj.value)
                        ];
                        bonus_weights[i] = 1
                    }
                    new_folio = bonus.concat(new_folio)
                    total_weights = bonus_weights.concat(total_weights)
                }
                for(let i = vals.length-1; i >= 0; i--) {
                    var dist = i
                    if (new_folio.length >= vals.length) {
                        dist = new_folio.length - (vals.length-i);
                    }
                    if(new_folio[dist] == undefined)
                        new_folio[dist] = [
                            vals[i][0],
                            0
                        ];
                    if(typeof total_weights[dist] == "undefined")
                        total_weights[dist] = 1
                    let new_weight = total_weights[dist]+(parseInt(obj.value))
                    new_folio[dist][1] = new_folio[dist][1]*(total_weights[dist]/new_weight) +
                        vals[i][1]/vals[0][1]*.01*((parseInt(obj.value))/new_weight);
                    total_weights[dist] = new_weight
                }
            });
    });
    FOLIO_PROPS.push(folio_props);
    FOLIOS.push(new_folio);
    addOpt(FOLIOS.length-1);
}

function addOpt(folio_index) {
    var html = `<div id=\"opt${folio_index+1+NUM_COINS}\" class=\"parent coin_opts\">\
                  <div id=\"folio_container${folio_index+1}\" class=\"container\" style="opacity:1">\
	            <div class=\"portfolio_time\" style=\"padding-top:12px\" onclick=\"portfolio_selections(event)\">FOLIO ${folio_index+1}</div>\
                    <div class=\"add_to_chart\" data-chart=\"folio${folio_index+1}\"  onclick=\"coin_selections(event)\">\
		      +\
		    </div>\
	          </div>\
                </div>`;
    if (OPT_SCROLL != 0) {
        html = `<div id=\"opt${folio_index+1+NUM_COINS}\" class=\"parent coin_opts\" style=\"display:none\">\
                  <div id=\"folio_container${folio_index+1}\" class=\"container\" style="opacity:1">\
	            <div class=\"portfolio_time\" style=\"padding-top:12px\" onclick=\"portfolio_selections(event)\">FOLIO ${folio_index+1}</div>\
                      <div class=\"add_to_chart\" data-chart=\"folio${folio_index+1}\" onclick=\"coin_selections(event)\">\
		      +\
		    </div>\
	          </div>\
                </div>`;
        OPT_SCROLL += 1
    }
    $("#scrolling_coin_opts").prepend(html);
    MAX_OPTS += 1;
}

/**
 * Returns useful information about the portfolio.
 * 
 * Info includes:
 * max, min, best avg, worst avg, best log avg, most consistent...
 */
function analyzePortfolio(folio) {
    //MIN and MAX eventually need to be adjusted to display window only
    var min = 2000000
    var mintime = 0
    var max = 0
    var maxtime = 0
    var avg = 0
    var base = -1
    var window = [chart.xAxis[0].min,chart.xAxis[0].max]
    var count  = 0
    folio.forEach( val => {
        if(val[0] < window[0] || val[0] > window[1]) {
            return
        }
        if(base == -1) {
            base = val[1]
        }
        count++
        var percent = val[1]/base
        if(min > percent) {
            min = percent
            mintime = val[0]
        }
        if(max < percent) {
            max = percent
            maxtime = val[0]
        }
        avg += percent
    });
    avg /= count

    var stdevSum = 0
    //Second loop to calc stdev
    folio.forEach( val => {
        if(val[0] < window[0] || val[0] > window[1]) {
            return
        }
        var diff = val[1]/base-avg
        stdevSum += diff*diff
    });
    var stdev = Math.sqrt(stdevSum / count)
    var retrn = parseInt(100*(folio[folio.length-1][1]/folio[folio.length-count][1]))

    //Update DOM with values
    $("#folioStdev").html(+stdev.toFixed(2))

    //Set colors based on gain/loss
    if(retrn >= 100){
        $("#return").html("+" + (retrn-100) + "%")
        $("#return").css("color","#16c784")
    }
    else{
        $("#return").html("−" + (100-retrn) + "%")
        $("#return").css("color","#ea3943")
    }
    if(max > 1){
        $("#folioHigh").html("+" + +((max*100)-100).toFixed(2) + "%")
        $("#folioHigh").css("color","#16c784")
        $("#folioHighTime").css("color","#16c784")
    }
    else{
        $("#folioHigh").html("−" + (100-(max*100)).toFixed(2) + "%")
        $("#folioHigh").css("color","#ea3943")
        $("#folioHighTime").css("color","#ea3943")
    }
    if(min > 1){
        $("#folioLow").html("+" + +((min*100)-100).toFixed(2) + "%")
        $("#folioLow").css("color","#16c784")
        $("#folioLowTime").css("color","#16c784")
    }
    else{
        $("#folioLow").html("−" + (100-(min*100)).toFixed(2) + "%")
        $("#folioLow").css("color","#ea3943")
        $("#folioLowTime").css("color","#ea3943")
    }
    if(avg > 1){
        $("#folioAvg").html("+" + +((avg*100)-100).toFixed(2) + "%")
        $("#folioAvg").css("color","#16c784")
    }
    else{
        $("#folioAvg").html("−" + (100-(avg*100)).toFixed(2) + "%")
        $("#folioAvg").css("color","#ea3943")
    }
    if(stdev < 3)
        $("#folioStdev").css("color","#16c784")
    else
        $("#folioStdev").css("color","#ea3943")
    $("#cashReturn").html("$0.00");
    $("#funds").val("0");

    // Add times to everything
    maxdate = new Date(maxtime)
    $("#folioHighTime").html(`${maxdate.getMonth()}/${maxdate.getDate()}/${maxdate.getFullYear()}`)
    mindate = new Date(mintime)
    $("#folioLowTime").html(`${mindate.getMonth()}/${mindate.getDate()}/${mindate.getFullYear()}`)
}

function calcReturn(){
    $("#funds").on("input", function() {
        let ret = parseInt($("#return").html().substring(1,$("#return").html().length-1));
        let funds = parseFloat($(this).val().replace(/,/g, ""));
        if(isNaN(funds))
            $("#cashReturn").html("$0.00");
        else if(ret > 100)
            $("#cashReturn").html("$" + (funds*(ret/100)).toFixed(2));
        else
            $("#cashReturn").html("$" + (funds*((100-ret)/100)).toFixed(2));
        $("#cashReturn").css("color",$("#return").css("color"));
    })
}

function clickBump(target) {
    $(target).css("padding-top","0px");
	    $(target).animate({
		"padding-top": "3px",
	    }, 150, function(){});
}
