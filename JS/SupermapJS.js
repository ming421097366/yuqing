$(document).ready(onReady);

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

function addWMS(map) {
    url = 'http://localhost:8080/geoserver/china/wms';
    wms = new SuperMap.Layer.WMS("WMS4", url, {layers: "china:provinces", version: '1.1.1', transparent: "true", format: "image/png"}, {projection: "EPSG:4326", maxExtent: new SuperMap.Bounds(-180, -90, 180, 90)});
    wms.setOpacity(0.8);
    map.addLayers([wms]);
}

function getNews() {
    var data = null;
    var postData =
            {
                type: "NEWS_GET"
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
            data = obj.data;
        }
        else
        {
            alert(obj.message + "fail to get the news");
        }
    }

    var ajaxParameter =
            {
                url: "../PHP/MainServer.php",
                type: "POST",
                data: {parameters: postData},
                error: errorHandle,
                success: successHandle,
                async: false

            };


    $.ajax(ajaxParameter);
    return data;
}

function getPopUpArray(data) {

    //请求服务器，取回新闻数据
    var data = data;

    var popUpArray = [];
    var size = new SuperMap.Size(10, 50);
    for (var j = 0; j < data.length; j++) {
        popUpArray[j] = [];
        for (var i = 0; i < data[j].length; i++)
        {
            var title = data[j][i].title;
            var link = data[j][i].link;
            var province = data[j][i].province;
            var lnglat = NameToLonLat[province];
            var contentHTML = "<div style = 'width:100px; height:20px;background-color: rgba(255,255,255,1);opacity: 0.769;'><a target = '_blank' href=' " + link + "'>";
            contentHTML += title;
            contentHTML += "</a></div>";
            var popUp = new SuperMap.Popup.FramedCloud("popwin" + i + "" + j, lnglat, null, contentHTML, null, true, null, false);
            popUpArray[j].push(popUp);
        }
    }
    return popUpArray;
}

function onReady() {

    var map = getMap();
    //  addWMS(map);


    var newsData = getNews();
    addMarkerLayer(map, newsData);

    var popUpArray = getPopUpArray(newsData);

    $("#startBubble").click(function () {
        startBubble(map, popUpArray);
    });
    $("#stopBubble").click(function () {
        endBubble();
        map.removeAllPopup();
    });


}

function endBubble() {
    if (BUBBLE_ANIMATION) {
        clearInterval(BUBBLE_ANIMATION);
        BUBBLE_ANIMATION = null;
    }
}


function startBubble(map, popUpArray) {
    var lenI = popUpArray.length;

    var k = 0;

    BUBBLE_ANIMATION = setInterval(bubbleAnimation, 2000);
    var existTag = [];
    function bubbleAnimation() {


        var m = Math.floor(Math.random() * lenI);
        var n = Math.floor(Math.random() * popUpArray[m].length);
        var currentTag = popUpArray[m][n];
        if (k < 3) {
            addBubbleTag(map, currentTag);
            existTag.push(currentTag);
            k++;

        } else {
            var removeTag = existTag.shift();
            removeBubbleTag(map, removeTag);
            addBubbleTag(map, currentTag);
            existTag.push(currentTag);
        }


    }
}

//冒泡标签

function addBubbleTag(map, tag) {

    map.addPopup(tag);
}

function removeBubbleTag(map, tag) {
    map.removePopup(tag);
}


function addMarkerLayer(map, newsData) {

    var newsData = newsData;
    var markerlayer = new SuperMap.Layer.Markers("markerLayer");
    map.addLayer(markerlayer);

    for (var key in ProvinceName) {
//        alert("a");
        var lonLat = ProvinceName[key];
//        alert(lonLat.lon);
        var name = key;
        var size = new SuperMap.Size(21, 21);
        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        var icon = new SuperMap.Icon('../images/supermap/BIG_POI.png', size, offset);
        var marker = new SuperMap.Marker(lonLat, icon);
        var onClick = returnOnClick(name);
//        alert("onClick");
        marker.events.on({
            "click": onClick,
            "scope": marker
        });
        markerlayer.addMarker(marker);
    }

    var infowin;
    function closeInfoWin() {
        if (infowin) {
            try {
                infowin.hide();
                infowin.destroy();
            }
            catch (e) {
            }
        }
    }


    function returnOnClick(name) {
        return function () {
            for (var k = 0; k < newsData.length; k++) {
                if (newsData[k][0].province === name) {
                    break;
                }
            }

            var dataItem = newsData[k];
            $("body").append
                    ('<div class="infobox">' +
                            '<a class="close" id="closeinfobar"></a>' +
                            '<div class="box">' +
                            '<ul class="group group1">' +
                            '<li><div class="box-img"><h2>' + dataItem[0].time.substr(0, 10) + '</h2><a href = "'+dataItem[0].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[0].province + '</h3></div></li>' +
                            '<li><div class="box-news news_1"><h1>' + dataItem[0].title + '</h1><h2>' + dataItem[0].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group2">' +
                            '<li><div class="box-img"><h2>' + dataItem[2].time.substr(0, 10) + '</h2><a href = "'+dataItem[2].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[2].province + '</h3></div></li>' +
                            '<li><div class="box-news news_3 animation-bottom"><h1>' + dataItem[2].title + '</h1><h2>' + dataItem[2].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group3">' +
                            '<li><div class="box-news news_2 animation-bottom"><h1>' + dataItem[1].title + '</h1><h2>' + dataItem[1].abs + '</h2></div></li>' +
                            '<li><div class="box-img"><h2>' + dataItem[1].time.substr(0, 10) + '</h2><a href = "'+dataItem[1].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[1].province + '</h3></div></li>' +
                            '</ul>' +
                            '<ul class="group group1">' +
                            '<li><div class="box-img"><h2>' + dataItem[3].time.substr(0, 10) + '</h2><a href = "'+dataItem[3].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[3].province + '</h3></div></li>' +
                            '<li><div class="box-news news_4"><h1>' + dataItem[3].title + '</h1><h2>' + dataItem[3].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group2">' +
                            '<li><div class="box-img"><h2>' + dataItem[5].time.substr(0, 10) + '</h2><a href = "'+dataItem[5].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[5].province + '</h3></div></li>' +
                            '<li><div class="box-news news_6 animation-bottom"><h1>' + dataItem[5].title + '</h1><h2>' + dataItem[5].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group3">' +
                            '<li><div class="box-news news_5 animation-bottom"><h1>' + dataItem[4].title + '</h1><h2>' + dataItem[4].abs + '</h2></div></li>' +
                            '<li><div class="box-img"><h2>' + dataItem[4].time.substr(0, 10) + '</h2><a href = "'+dataItem[4].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[4].province + '</h3></div></li>' +
                            '</ul>' +
                            '<ul class="group group1">' +
                            '<li><div class="box-img"><h2>' + dataItem[6].time.substr(0, 10) + '</h2><a href = "'+dataItem[6].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[6].province + '</h3></div></li>' +
                            '<li><div class="box-news news_7"><h1>' + dataItem[6].title + '</h1><h2>' + dataItem[6].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group2">' +
                            '<li><div class="box-img"><h2>' + dataItem[8].time.substr(0, 10) + '</h2><a href = "'+dataItem[8].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[8].province + '</h3></div></li>' +
                            '<li><div class="box-news news_9 animation-bottom"><h1>' + dataItem[8].title + '</h1><h2>' + dataItem[8].abs + '</h2></div></li>' +
                            '</ul>' +
                            '<ul class="group group3">' +
                            '<li><div class="box-news news_8 animation-bottom"><h1>' + dataItem[7].title + '</h1><h2>' + dataItem[7].abs + '</h2></div></li>' +
                            '<li><div class="box-img"><h2>' + dataItem[7].time.substr(0, 10) + '</h2><a href = "'+dataItem[7].link+'" target = "_blank"><img src="../images/supermap/position.png"></a><h3>' + dataItem[7].province + '</h3></div></li>' +
                            '</ul>' +
                            '</div>' +
                            '</div>'
                            );
            $(".infobox").show();
            $(".infobox").animate({
                right: "50px",
                opacity: "1"
            }, "ease-out");
            setTimeout(function () {
                $("#closeinfobar").css("position", "fixed");
            }, 4000);
        };
    }
}