
//2、弹出事件框
//$("#infonbox").click(function () {
//    $("body").append
//            ('<div class="infobox">' +
//                    '<a class="close" id="closeinfobar"></a>' +
//                    '<div class="box">' +
//                    '<ul class="group group1">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_1"><h1>浩铭超人的瘦身秘诀</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group2">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_3 animation-bottom"><h1>静雯超人飞向中南海</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group3">' +
//                    '<li><div class="box-news news_2"><h1>陈英超人拯救咸弹超人</h1><h2>this is text</h2></div></li>' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group1">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_4"><h1>静雯超人使出绝招</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group2">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_6"><h1>丹丹超人吃了螺蛳粉</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group3">' +
//                    '<li><div class="box-news news_5"><h1>波波超人会见丹丹超人</h1><h2>this is text</h2></div></li>' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group1">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_7"><h1>浩铭超人光环循环滚动</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group2">' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '<li><div class="box-news news_9"><h1>波波超人成为动感超人</h1><h2>this is text</h2></div></li>' +
//                    '</ul>' +
//                    '<ul class="group group3">' +
//                    '<li><div class="box-news news_8"><h1>陈英超人使出咸弹光波</h1><h2>this is text</h2></div></li>' +
//                    '<li><div class="box-img"><h2>2015年6月26日</h2><img src="../images/supermap/position.png"><h3>中国-中南</h3></div></li>' +
//                    '</ul>' +
//                    '</div>' +
//                    '</div>'
//                    );
//    $(".infobox").show();
//    $(".infobox").animate({
//        right: "50px",
//        opacity: "1"
//    }, "ease-out");
//    setTimeout(function () {
//        $("#closeinfobar").css("position", "fixed");
//    }, 4000);
//});
//
////3、收起事件框
//
//
//
//嗷大喵框效果
$(document).on("click", "#closeinfobar", function () {
    setTimeout(function () {
        $("#closeinfobar").css("position", "absolute");
    }, 200);
    $(".infobox").animate({
        right: "-690px",
        top: "0",
        opacity: "0"
    });
    setTimeout(function () {
        $(".infobox").remove();
    }, 2000);
});

$(document).on("mouseover", ".group", function () {

    $(".group").css("opacity", "0.4");
    $(this).css("opacity", "1");
});
//
$(document).on("mouseout", ".group", function () {
//
    $(".group").css("opacity", "1");
});

//地图popup弹出框(位置根据地图坐标)
$("#popupbox").mouseover(function () {
    $("body").append(
            '<div class="popup mappopup" style="top: 230px;left: 50px;">' +
            '<div class="text"></div>' +
            '<span class="bottom"></span>' +
            '</div>'
            );
});
//移出鼠标记得销毁弹出框
$("#popupbox").mouseout(function () {
    $(".mappopup").remove();
});
//侧栏导航条滑过显示提示框
$(".aclass").mouseover(function () {
    $(this).css("background-color","rgb(82, 141, 201)");
    $(this).next('div').show();
});
//侧栏导航条滑出提示框
$(".aclass").mouseout(function () {
    $(this).css("background-color","#226fbe");
    $(this).next('div').hide();
});
//点击右侧导航条按钮显示侧栏子导航框
$("#poppoint").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();
    $("#poppointpop").show();
});
$("#heatpoint").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();
    $("#heatpointpop").show();
});
$("#heatmap").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();
    $("#heatmappop").show();
});
$("#tops").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();

    var $div = $("#topspop .visual");
    var data = getHotNewsData();
    var titleArray = data.title;
    var heatArray = data.heat;
    var idArray = data.id;

    for (var i = 0; i < titleArray.length; i++) {
        var $divI = $('<div id = "' + idArray[i] + '" class = "news" title = "' + titleArray[i] + '">' + (i + 1) + ":" + titleArray[i].substr(0, 5) + "..." + '<span>' + heatArray[i] + '</span></div>');
        $div.append($divI);
        $divI.click(function () {
            var id = $(this).attr("id");
            var title = $(this).attr("title");
//            alert(id);
            addMaskShowDialog();
            var $frame = '<iframe class = "frameWindow" src = "../HTML/ReviewsMap.html#'+id+"#"+title+'"></iframe>';
            $("#chart").html($frame);
        });
    }

    $("#topspop").show();
});
$("#feel").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();
    $("#feelpop").show();
});
$("#proheat").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(this).css("background-color","rgb(82, 141, 201)");
    $(".navpopup").hide();
    $("#proheatpop").show();
});
$(".item li").mouseover(function () {
    $(this).css("background-color","rgb(82, 141, 201)");
});
$(".item li").mouseout(function () {
    $(this).css("background-color","#226fbe");
});
//点击关闭按钮关闭侧栏子导航框
$(".closeIcon").click(function () {
    $(".aclass").css("background-color","#226fbe");
    $(".navpopup").hide();
    $("#topspop .visual").html("");
});



$(function () {
    $("#moodIndex").click(function () {
        var provinceName = $("#selectProvinceMood option:selected").text();
//        alert(provinceName);
        addMaskShowDialog();
        var subTitle = provinceName + "心情指数";
        var data = null;
        if (provinceName === "全国") {
            data = getMoodData("ASBQCHPN0001124J");
        } else {
            data = getMoodProvince(provinceName, "ASBQCHPN0001124J");
        }

        var option = getBaseMoodOption(data, subTitle);
        var myChart = echarts.init(document.getElementById('chart'));
        myChart.setOption(option);
    });

    $("#moodMap").click(function () {
        var moodType = $("#selectMoodType option:selected").val();
//        alert(moodType);
        addMaskShowDialog();
        var obj = getMoodMapData(moodType, "ASBQCHPN0001124J");
        var data = obj.returnData;
        var max = obj.max;
        var min = obj.min;
        var option = getMoopMapOption(moodType, data, max, min);
        var myChart = echarts.init(document.getElementById('chart'));
        myChart.setOption(option);
    });

    $("#wordFreq").click(function () {
        addMaskShowDialog();
        var $chartRegion = $("#chart");
        var chartAID = uuid();//形容词词频
        var chartVID = uuid();//动词词频
        var chartNID = uuid();//名词词频                    
        var html = '<div id = "' + chartNID + '" class = "chart-inline"></div>' +
                '<div id = "' + chartVID + '" class = "chart-inline"></div>' +
                '<div id = "' + chartAID + '" class = "chart-inline"></div>';
        $chartRegion.html(html);


        var dataA = getWordFreqData("ASBQCHPN0001124J", "a");
        var optionA = getWordFreqOption(dataA.wordArray, dataA.freqArray, "形容词");
        var myChart = echarts.init(document.getElementById(chartAID));
        myChart.setOption(optionA);

        var dataV = getWordFreqData("ASBQCHPN0001124J", "v");
        var optionV = getWordFreqOption(dataV.wordArray, dataV.freqArray, "动词");
        var myChart = echarts.init(document.getElementById(chartVID));
        myChart.setOption(optionV);

        var dataN = getWordFreqData("ASBQCHPN0001124J", "n");
        var optionN = getWordFreqOption(dataN.wordArray, dataN.freqArray, "名词");
        var myChart = echarts.init(document.getElementById(chartNID));
        myChart.setOption(optionN);

    });

    $("#keyWordCloud").click(function () {
        addMaskShowDialog();
        var data = getKeyWord("ASBQCHPN0001124J");
        var $title = $('<div id="tagsList-title">关键词列表</div>');
        var $div = $('<div id="tagsList"></div>');
        for (var i = 0; i < data.length; i++) {
            var $a = $('<a href="javascript:void(0);" title="' + data[i].word + '">' + data[i].word + '</a> ');
            $div.append($a);
        }
        $("#chart").append($title);
        $("#chart").append($div);
        var cloud = new CloudTag();
        cloud.beignCloud();
        $(".close-item").click(function () {
            if (cloud.close) {
                cloud.close();
            }
        });
    });

    $("#entityGet").click(function () {
        addMaskShowDialog();
        var data = getEntiry("ASBQCHPN0001124J");
        var nodes = data.nodes;
        var links = data.links;
        var option = getBaseEntityOption(nodes, links);
        var myChart = echarts.init(document.getElementById('chart'));
        myChart.setOption(option);
    });

    $("#beginDevelop").click(function () {
        addMaskShowDialog();

        var $frame = '<iframe class = "frameWindow" src = "../HTML/reviewsSea.html"></iframe>';
        $("#chart").html($frame);
    });

    $("#beginHeat").click(function () {
        addMaskShowDialog();
        var $frame = '<iframe class = "frameWindow" src = "../HTML/heatAnimation.html"></iframe>';
        $("#chart").html($frame);
    });





});













