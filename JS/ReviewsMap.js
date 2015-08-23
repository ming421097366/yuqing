$(document).ready(onReady);



var infowinPosition;//记录鼠标位置



function onReady() {
    
    var postArray = location.hash.split("#"); //字符分割 
//    alert(postArray[1]);
    var rq = {
        id : postArray[1]        
    };
    var title = postArray[2];
    
    $("body").append('<div class = "big-title">'+title+'热点分析图</div>');


    var map = getMap();//底图
    map.events.on({"mousemove": function (e) {
            infowinPosition = e.xy.clone();// 偏移
            infowinPosition.x += 40;
            infowinPosition.y -= 25;
        }});

//    addWMS(map);//添加wms地图
    var barLayer = constructBarLayer(map);//得到柱状图

    var features = constructFeatures(rq);//构造数据
//    alert(features.length)

    var heatMapLayer = getHeatMapLayer(features);
    map.addLayer(heatMapLayer);

    map.addLayer(barLayer);//添加柱状图
    barLayer.addFeatures(features);//添加数据





}

//得到地图图层
function getMap() {

    var map = new SuperMap.Map("map", {controls: [
            new SuperMap.Control.LayerSwitcher(),
            new SuperMap.Control.Attribution(),
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.Zoom(),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            })],
        allOverlays: true,
        projection: "EPSG:4326"//"EPSG:4326"
    });
    var layer1 = new SuperMap.Layer.Tianditu({"layerType": "vec"});//img,ter
    var layer2 = new SuperMap.Layer.Tianditu({"layerType": "vec", "isLabel": true});
    map.addLayers([layer1, layer2]);
    map.setCenter(new SuperMap.LonLat(108.07567641634, 36.855795258955), 3);
    return map;
}

//得到柱状图表图层
function constructBarLayer(map) {


//    alert(SuperMap.Layer.Graph);
    var themeLayer = new SuperMap.Layer.Graph("ThemeLayer", "Bar");
    themeLayer.themeFields = ["reviewsCount", "reviewsValue"];
    themeLayer.chartsSetting = {
// width，height，codomain 分别表示图表宽、高、数据值域；此三项参数为必设参数
        width: 100,
        height: 100,
        codomain: [0, 1000], // 允许图表展示的值域范围，此范围外的数据将不制作图表
// 数据可视化对象（表示字段值的图形）样式
        dataStyle: {
            fillOpacity: 0.7
        },
// 按字段设置样式
        dataStyleByFields: [{fillColor: "#FFB980"}, {fillColor: "#5AB1EF"}],
// 数据可视化对象 hover 样式
        dataHoverStyle: {fillOpacity: 1},
//        useAxis: false,
// x 轴上的空白间距参数
        axisXBlank: [0, 0, 0],
// 坐标轴样式
        axisStyle: {strokeColor: '#008ACD'},
// y 轴刻度数量
        axisYTick: 4,
// y 轴标签及其样式
        axisYLabels: ["800", "600", "400", "200", "0"],
        axisYLabelsStyle: {fillColor: "#333333"},
// x 轴标签及其样式
//        axisXLabels: ["评论数目", "评论认可度"],
//        axisXLabelsStyle: {fillColor: "#333333"},
// 启用背景框
        useBackground: true,
// 背景框圆角参数
        backgroundRadius: [5, 5, 5, 5],
        backgroundStyle: {fillColor: "#F3F3F3"}
    };
    themeLayer.on("mousemove", showInfoWin);
    themeLayer.on("mouseout", closeInfoWin);

    var infowin = null;

    function showInfoWin(e) {
// e.target 是图形对象，即数据的可视化对象;
// 图形对象的 refDataID 属性是数据（feature）的 id 属性，它指明图形对象是由那个数据制作而来;
// 图形对象的 dataInfo 属性是图形对象表示的具体数据，他有两个属性，field 和 value;
        if (e.target && e.target.refDataID && e.target.dataInfo) {
            closeInfoWin();
// 获取图形对应的数据 (feature)
            var fea = themeLayer.getFeatureById(e.target.refDataID);

            var info = e.target.dataInfo;

// 弹窗内容
            var contentHTML = "<div style='color: #000; background-color: #fff'>";
            contentHTML += "省级行政区名称:<br><strong>" + fea.attributes.name + "</strong>";

            contentHTML += "<hr>";
            switch (info.field) {
                case "reviewsCount":
                    contentHTML += "评论热度<br/><strong>" + info.value + "</strong>";
                    break;
                case "reviewsValue":
                    contentHTML += "评论认可度<br/><strong>" + info.value + "</strong>";
                    break;
                default:
                    contentHTML += "No Data";
            }
            contentHTML += "</div>";

// 鼠标地理位置

//            var lonLat = NameToLonLat[fea.attributes.name].clone();
//            var lonLatCurrent = lonLat.clone();
//            lonLatCurrent.lon = lonLat.lon - 1;
//            lonLatCurrent.lat = lonLat.lat + 0.5;
            var lonLat = map.getLonLatFromPixel(infowinPosition);
            infowin = new SuperMap.Popup(
                    "infowin",
                    lonLat,
                    new SuperMap.Size(140, 90),
                    contentHTML,
                    false,
                    false,
                    null);
            infowin.setBackgroundColor("#fff");
            infowin.setOpacity(0.8);
            if (infowin)
                map.removePopup(infowin);
            map.addPopup(infowin);
        }
    }



    function closeInfoWin() {
        if (infowin) {
            try {
                map.removePopup(infowin);
            }
            catch (e) {
                alert(e.message);
            }
        }
    }
    return themeLayer;
}








//构建feature数据
function constructFeatures(rq) {
    if (rq) {
        var request = rq;
    } else {
        alert("无请求");
    }
    var features = [];



//    var a = {//数据格式
//        "name": '广东',
//        "reivewsCount": 380,
//        "reviewsValue": 413
//    };
//
//    var b = {
//        "name": '云南',
//        "reivewsCount": 380,
//        "reviewsValue": 413
//    };
//    var reviewsDataSet = [a, b];

    var reviewsDataSet = getReviewsDataSet(request);//得到统计数据

    for (var i = 0; i < reviewsDataSet.length; i++) {
        var dataItem = reviewsDataSet[i];
        var name = dataItem.name;
//        alert(dataItem.name + " "+dataItem.reviewsCount +" " + dataItem.reviewsValue);
        if (!NameToLonLat[name]) {//如果是不合法的名字则不处理此条数据
            continue;
        }
        var latLnt = NameToLonLat[name];
//        alert(latLnt);
        var geo = new SuperMap.Geometry.Point(latLnt.lon, latLnt.lat);
        var attrs = {};
        attrs.name = name;
        attrs.reviewsCount = dataItem.reviewsCount || 1;
        attrs.reviewsValue = dataItem.reviewsValue || 1;
//        alert(attrs.name + " " + attrs.reviewsCount + " " + attrs.reviewsValue);
        attrs.reviewsCount = attrs.reviewsCount * 3;
        attrs.reviewsValue = Math.floor((attrs.reviewsValue / attrs.reviewsCount) * 150);
        attrs.value = attrs.reviewsCount * 1.5 + attrs.reviewsValue * 5;
        var fea = new SuperMap.Feature.Vector(geo, attrs);
        features.push(fea);
//        alert(fea);
    }
//    alert(features[0]);
//    alert(features.length)
    return features;

}

//从服务器取回评论统计数据，并返回
function getReviewsDataSet(request) {
    var data = null;
    var id = (request && request.id) || 'AS8A28Q600252FPI';
    var postData =
            {
                type: "REVIEWS_GET",
                id: id
            };
    postData = JSON.stringify(postData);

    function errorHandle(xhr, message)
    {
        alert(message);
    }
    function successHandle(echoData)
    {
        var obj = JSON.parse(echoData);
        if (obj.success)
        {
//            alert(obj.data.length);
            data = obj.data;
//            for (var i = 0; i < obj.data.length; i++)
//            {
//                alert(obj.data[i].name + " "+obj.data[i].reviewsCount +" " + obj.data[i].reviewsValue);
//            }
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

//增加WMS服务图层
function addWMS(map) {
    url = 'http://localhost:8080/geoserver/china/wms';
    wms = new SuperMap.Layer.WMS("WMS4", url, {layers: "china:provinces", version: '1.1.1', transparent: "true", format: "image/png"}, {projection: "EPSG:4326", maxExtent: new SuperMap.Bounds(-180, -90, 180, 90)});
    wms.setOpacity(0.5);
    map.addLayer(wms);
}





function getHeatMapLayer(features) {
    var heatMapLayer = new SuperMap.Layer.HeatMapLayer(
            "heatMap",
            {
                "radius": 100,
                "featureWeight": "reviewsCount"
            }
    );

    heatMapLayer.addFeatures(features);
    return heatMapLayer;

}