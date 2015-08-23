

$(document).ready(onReady);

function getDataFromDB() {
    var data = null;
    var postData =
            {
                type: "NEWS_NET_GET"
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

//从服务器取回数据
function getHotNewsData() {

    var data = getDataFromDB();
    var titleArray = [];
    var heatArray = [];
    var idArray = [];

    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        titleArray[i] = item.title;
        heatArray[i] = item.heat;
        idArray[i] = item.id;
    }


//    var titleArray = [
//        '"中国留学生在美群殴同伴 家长因贿赂证人被捕"',
//        "云南一名男子持斧头闯派出所追砍警察被击毙",
//        "安倍晋三:日本决不会重蹈战争覆辙 已宣誓不再战",
//        "恒大获三机构齐予AAA评级 国内首家",
//        '"河南2名农民工给公安局送"不作为"锦旗被拘留"',
//        "南宁医生疑被患者在电梯泼汽油烧伤 已进ICU(图",
//        "【另一面】目睹妻子被强暴“无限防卫权”很无奈",
//        "哈尔滨一名交警使用巡逻车喇叭与市民对骂",
//        '"宽带"降费提速"满月 多方案未落地无时间表"',
//        "建设银行行长张建国辞职 曾称银行是弱势群体"];
//    var heatArray = [
//        24466,
//        20172,
//        20118,
//        18157,
//        17687,
//        16689,
//        15795,
//        15406,
//        14100,
//        12307
//    ];
//
//    var idArray = [
//        "ARSID0J300014AED",
//        "ARQLOA570001124J",
//        "AS7EB03T0001121M",
//        "AS8A28Q600252FPI",
//        "AS605C3A00011229",
//        "AS7V2U220001124J",
//        "AS7KS6VG00014JHT",
//        "ARTHMVC500011229",
//        "AS41U9TT00014JB6",
//        "ARU8OOAA00254R91"
//    ];
    return {
        title: titleArray,
        heat: heatArray,
        id: idArray
    };

}

//function createRandomItemStyle() {
//    return {
//        normal: {
//            color: 'rgb(' + [
//                Math.round(Math.random() * 160),
//                Math.round(Math.random() * 160),
//                Math.round(Math.random() * 160)
//            ].join(',') + ')'
//        }
//    };
//}

function onReady() {
//
//    var data = getHotNewsData()();
//    var titleArray = data.title.reverse();
//    var heatArray = data.heat.reverse();
//    var idArray = data.id.reverse();
//
//    var yunData = [];
//    for (var i = 0; i < titleArray.length; i++) {
//        yunData.push(
//                {
//                    name: titleArray[i],
//                    value: heatArray[i],
//                    itemStyle: createRandomItemStyle()
//                }
//        );
//    }
//
//    var option = {
//        title: {
//            text: '热门关注事件',
//            subtext: '数据来自网络'
//        },
//        tooltip: {
//            trigger: 'axis'
//        },
//        legend: {
//            data: ['关注度']
//        },
//        toolbox: {
//            show: true
//
//        },
////        calculable: true,
//        xAxis: [
//            {
//                type: 'value',
//                boundaryGap: [0, 0.01]
//            }
//        ],
//        yAxis: [
//            {
//                type: 'category',
//                data: titleArray,
//                show:false
//            }
//        ],
//        series: [
//            {
//                type: 'bar',
//                data: heatArray
//            }
//        ]
//    };
//    var myChart = echarts.init(document.getElementById('chartRegion'));
//    myChart.setOption(option);
//    var ecConfig = echarts.config;
////    alert(ecConfig.EVENT.CLICK);
//    function eConsole(param) {
//        alert(param.dataIndex);
//        alert(titleArray[param.dataIndex]);
//        alert(idArray[param.dataIndex]);
//        REVIEWS_QUERY.title = titleArray[param.dataIndex];
//        REVIEWS_QUERY.id = idArray[param.dataIndex];
//
//        window.open("../HTML/ReviewsMap.html");
//    }
//
//    myChart.on(ecConfig.EVENT.CLICK, eConsole);
}