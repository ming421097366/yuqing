

var __id = 0;//全局变量

function uuid() {//返回一个唯一id号的函数
    __id++;
    return "__id_" + __id;
}




function getEntiry(newsID) {
    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_ENTITY_GET"

            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);
    data = handleEntityData(data);
    return data;
}

function handleEntityData(data) {
    var entity = data[0].entity;
    console.log(entity);
    var entityArray = entity.split("|");
    var iToEntity = {
        0: '人名',
        1: '地名',
        2: '机构名',
        3: '关键字',
        4: '作者',
        5: '媒体'
    };
    var nodes = [];
    var links = [];
    var node1 = {category: 0, name: '文本', value: 10};
    nodes.push(node1);
    for (var i = 0; i < entityArray.length; i++) {
        var node2 = {category: 1, name: iToEntity[i], value: 7};
        nodes.push(node2);
        var link1 = {source: '文本', target: iToEntity[i], weight: 2};
        links.push(link1);
        var item = entityArray[i];
        var itemArray = item.split("#");
//        if(itemArray.length === 1) {
//            continue;
//        }
        for (var j = 0; j < itemArray.length-1; j++) {
            var node3 = {category: 2, name: itemArray[j], value: 3};
            var link2 = {source: iToEntity[i], target: itemArray[j], weight: 1};
            nodes.push(node3);
            links.push(link2);
        }
    }
    return {
        nodes: nodes,
        links: links
    };
}

function getBaseEntityOption(nodes, links) {
    var option = {
        title: {
            text: '实体关系',
            x: 'right',
            y: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} : {b}'
        },
        toolbox: {
            show: true,
            feature: {
                restore: {show: true},
                magicType: {show: true, type: ['force', 'chord']},
                saveAsImage: {show: true}
            }
        },
        legend: {
            x: 'left',
            data: ['实体类型', '实体内容']
        },
        series: [
            {
                type: 'force',
                name: "内容",
                ribbonType: false,
                categories: [
                    {
                        name: '内容'
                    },
                    {
                        name: '实体类型'
                    },
                    {
                        name: '实体内容'
                    }
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        nodeStyle: {
                            brushType: 'both',
                            borderColor: 'rgba(255,215,0,0.4)',
                            borderWidth: 1
                        },
                        linkStyle: {
                            type: 'curve'
                        }
                    },
                    emphasis: {
                        label: {
                            show: false
                                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                        },
                        nodeStyle: {
                            //r: 30
                        },
                        linkStyle: {}
                    }
                },
                useWorker: false,
                minRadius: 15,
                maxRadius: 25,
                gravity: 1.1,
                scaling: 1.1,
                roam: 'move',
                nodes: nodes,
                links: links
            }
        ]
    };
    return option;
}



function getKeyWord(newsID) {
    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_KEY_WORD_GET"

            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);


    return data;
}
function getWordFreqData(newsID, wordType) {
    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_WORD_FREQ",
                wordType: wordType

            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);

    data = handleWordFreqData(data);
    return data;
}

function handleWordFreqData(data) {
    var freqArray = [];
    var wordArray = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        freqArray.push(item.freq);
        wordArray.push(item.word);
    }

    return {
        freqArray: freqArray,
        wordArray: wordArray
    };

}


function getWordFreqOption(wordArray, freqArray, wordType) {

    var option = {
        title: {
            text: wordType
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'value',
                boundaryGap: [0, 0.01]
            }
        ],
        yAxis: [
            {
                type: 'category',
//                            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']//替换
                data: wordArray
            }
        ],
        series: [
            {
                name: '频次',
                type: 'bar',
//                            data: [1, 2, 3, 4, 5, 6]//替换
                data: freqArray
            }
        ]
    };
    return option;
}







function getMoodData(newsID) {


    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_MOOD_ALL"

            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);

    data = handleMoodData(data);
    return data;
}

function handleMoodMapData(data) {
    var returnData = [];
    var max = 0;
    var min = 0;
    for (var i = 0; i < data.length; i++) {
        var value = 0;
        if (data[i].moodPoint !== null) {
            value = Math.round((data[i].moodPoint * 1000));
            if (value > max) {
                max = value;
            } else if (value < min) {
                min = value;
            }
        }
        var obj = {
            name: data[i].provinceName,
            value: value
        };
        returnData.push(obj);

    }
    return {
        returnData: returnData,
        max: max,
        min: min
    };
}


function handleMoodData(data) {
    var returnData = [];
    returnData.push({
        value: Math.abs(data[0].positivePoint),
        name: '正面得分'
    });
    returnData.push({
        value: Math.abs(data[0].negativePoint),
        name: '负面得分'
    });
    return returnData;

}

function getMoodMapData(moodType, newsID) {
    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_MOOD_MAP",
                moodType: moodType
            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);

    data = handleMoodMapData(data);
    return data;


}


function getMoodProvince(provinceName, newsID) {
    var data = null;
    var postData =
            {
                newsID: newsID,
                type: "REVIEWS_MOOD_PROVINCE",
                provinceName: provinceName
            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message + "cannot find php");
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the reviews");
        }
    }
    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false//同步
            };

    $.ajax(ajaxParameter);

    data = handleMoodData(data);
    return data;

}

function addMaskShowDialog() {
    $("#mask").show();
    var $html = $('<div class = "m-chart">' +
            '<div class = "close-item"> X </div>' +
            '<div id = "chart"> </div>' +
            '</div>');
    $("#mask").html($html);
    $(".close-item").click(function () {
        $("#mask").html("");
        $("#mask").hide();
    });
}
function getBaseMoodOption(data, subtext) {
    var option = {
        title: {
            text: '情感分析',
            subtext: subtext,
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            y: 'top',
            data: ['正面得分', '负面得分']
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        series: [
            {
                name: '心情指数',
                type: 'pie',
                radius: ['50%', '75%'],
                center: ['50%', '60%'],
                data: data
            }
        ]
    };
    return option;
}



function getMoopMapOption(moodType, data, max, min) {
    var subTitle = "";

    if (moodType === "negativePoint") {
        subTitle = "负面指数";
    } else if (moodType === "positivePoint") {
        subTitle = "正面指数";
    } else if (moodType === "allPoint") {
        subTitle = "整体指数";
    }

    var option = {
        title: {
            text: '心情指数',
            subtext: '全国',
            x: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: [subTitle]
        },
        dataRange: {
            min: min,
            max: max,
            x: 'left',
            y: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series: [
            {
                name: subTitle,
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                },
                data: data
            }
        ]
    };
    return option;
}


$(function () {
//    $("#provinceMood").click(function () {
//        var provinceName = $("#provinceSelect select option:selected").text();
//        addMaskShowDialog();
//        var subTitle = provinceName + "心情指数";
//        var data = getMoodProvince(provinceName, "ASBQCHPN0001124J");
//        var option = getBaseMoodOption(data, subTitle);
//        var myChart = echarts.init(document.getElementById('chart'));
//        myChart.setOption(option);
//    });
//    $("#countryMood").click(function () {
//        addMaskShowDialog();
//        var data = getMoodData("ASBQCHPN0001124J");
//        var option = getBaseMoodOption(data, "全国心情指数");
//        var myChart = echarts.init(document.getElementById('chart'));
//        myChart.setOption(option);
//    });
//    $("#moodMap").click(function () {
//        var moodType = $("#moodTypeSelect select option:selected").val();
////                    alert(moodType);
//
//        addMaskShowDialog();
//        var obj = getMoodMapData(moodType, "ASBQCHPN0001124J");
//        var data = obj.returnData;
//        var max = obj.max;
//        var min = obj.min;
//        var option = getMoopMapOption(moodType, data, max, min);
//        var myChart = echarts.init(document.getElementById('chart'));
//        myChart.setOption(option);
//    });
//    $("#wordFreq").click(function () {
//        addMaskShowDialog();
//        var $chartRegion = $("#chart");
//        var chartAID = uuid();//形容词词频
//        var chartVID = uuid();//动词词频
//        var chartNID = uuid();//名词词频                    
//        var html = '<div id = "' + chartNID + '" class = "chart-inline"></div>' +
//                '<div id = "' + chartVID + '" class = "chart-inline"></div>' +
//                '<div id = "' + chartAID + '" class = "chart-inline"></div>';
//        $chartRegion.html(html);
//
//
//        var dataA = getWordFreqData("ASBQCHPN0001124J", "a");
//        var optionA = getWordFreqOption(dataA.wordArray, dataA.freqArray, "形容词");
//        var myChart = echarts.init(document.getElementById(chartAID));
//        myChart.setOption(optionA);
//
//        var dataV = getWordFreqData("ASBQCHPN0001124J", "v");
//        var optionV = getWordFreqOption(dataV.wordArray, dataV.freqArray, "动词");
//        var myChart = echarts.init(document.getElementById(chartVID));
//        myChart.setOption(optionV);
//
//        var dataN = getWordFreqData("ASBQCHPN0001124J", "n");
//        var optionN = getWordFreqOption(dataN.wordArray, dataN.freqArray, "名词");
//        var myChart = echarts.init(document.getElementById(chartNID));
//        myChart.setOption(optionN);
//
//    });
//
//    $("#keyWordCloud").click(function () {
//        addMaskShowDialog();
//        var data = getKeyWord("ASBQCHPN0001124J");
//        var $title = $('<div id="tagsList-title">关键词列表</div>');
//        var $div = $('<div id="tagsList"></div>');
//        for (var i = 0; i < data.length; i++) {
//            var $a = $('<a href="javascript:void(0);" title="' + data[i].word + '">' + data[i].word + '</a> ');
//            $div.append($a);
//        }
//        $("#chart").append($title);
//        $("#chart").append($div);
//        var cloud = new CloudTag();
//        cloud.beignCloud();
//        $(".close-item").click(function () {
//            if (cloud.close) {
//                cloud.close();
//            }
//        });
//    });
//
//    $("#entityGet").click(function () {
//        addMaskShowDialog();
//        var data = getEntiry("ASBQCHPN0001124J");
//        var nodes = data.nodes;
//        var links = data.links;
//        var option = getBaseEntityOption(nodes, links);
//        var myChart = echarts.init(document.getElementById('chart'));
//        myChart.setOption(option);
//    });


});