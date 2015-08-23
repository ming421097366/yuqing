




$(function () {
    var map = new BMap.Map("map");
    map.centerAndZoom(new BMap.Point(113.269945, 32.86713), 5);
    map.enableScrollWheelZoom(true);
//    $("#selectSeaType select").change(function () {
//        var type = $(this).val();
    var seaPoint = new SeaPoint(map);
    seaPoint.init();
//    });





});
var SeaPoint = function (map) {

    var animation = null;
    var pointCollection = null;
    var len = 0; //私有变量

    //私有函数
    function addAnimation(data) {
        animation = setInterval(function () {
            addSeaPoints(data, len);
            len += 10;
        }, 20);
    }

    function addSeaPoints(data, len) {

        if (len + 10 >= data.length) {//判断当前长度，如果长度达到数组长度，则结束演变
            clearInterval(animation); //清除动画
            animation = null;
            alert("演变结束,总共演变" + data.length + "个点");
            return;
        }
        var points = []; // 添加海量点数据
        for (var i = 0; i < len; i++) {
            var point = new BMap.Point(data[i].x, data[i].y);
            point.rContent = data[i].content;
            point.rAddress = data[i].address;
            point.rTime = data[i].time;
            if (data[i].polarity) {
                point.rPolarity = data[i].polarity;
            }
            points.push(point);
        }
        pointCollection.setPoints(points); //数据驱动
    }


    //从服务器中取回特定新闻的所有评论数据
    function getAllReviews(id) {
        var data = null;
        var postData =
                {
                    newsID: id,
                    type: "REVIEWS_GET_ALL_XY"
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


    //从服务器取回特定新闻的所有正向评论数据
    function getPositiveReviews(id) {
        var data = null;
        var postData =
                {
                    newsID: id,
                    type: "REVIEWS_GET_ALL_XY_POSITIVE"
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

    function getNegativeReviews(id) {
        var data = null;
        var postData =
                {
                    newsID: id,
                    type: "REVIEWS_GET_ALL_XY_NEGATIVE"
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



    this.init = function () {




        if (document.createElement('canvas').getContext) {

            pointCollection = new BMap.PointCollection([]); // 初始化PointCollection
            pointCollection.addEventListener('click', (function () {
                return function (e) {
                    console.log('单击点的坐标为：' + e.point.lng + ',' + e.point.lat); //监听点击事件
                    var str = '<span style = "color: red;">' + e.point.rContent + '<br/>' + e.point.rAddress + '<br/>' + e.point.rTime + '<br/></span>';
                    if (e.point.rPolarity) {
                        str += '<span style = "color: red;">'+"情感系数:" + e.point.rPolarity+'</span>';
                    }
                    console.log(str);

                    var opts = {};
                    var infoWindow = new BMap.InfoWindow(str, opts);

                    map.openInfoWindow(infoWindow,e.point);
                };
            })());
            map.addOverlay(pointCollection); // 添加Overlay
        } else {
            alert('请在chrome、safari、IE8+以上浏览器查看本示例');
        }

        $("#beignAnimation").click(function () {

            var $option = $("#selectSeaType select");
            var type = $option.val();
            var data = null;
            alert(type);
            if (type === "all") {
                data = getAllReviews('ASBQCHPN0001124J'); //得到评论数据
                pointCollection.setStyles({//确定点的样式
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_STAR,
                    color: '#d340c3'
                });
                len = 0;
            } else if (type === "positive") {
                data = getPositiveReviews('ASBQCHPN0001124J'); //得到评论数据
                pointCollection.setStyles({//确定点的样式
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_RHOMBUS,
                    color: 'red'
                });
                len = 0;

            } else if (type === "negative") {
                data = getNegativeReviews('ASBQCHPN0001124J'); //得到评论数据
                pointCollection.setStyles({//确定点的样式
                    size: BMAP_POINT_SIZE_SMALL,
                    shape: BMAP_POINT_SHAPE_RHOMBUS,
                    color: 'blue'
                });
                len = 0;
            }
            else {
                return;
            }
            addAnimation(data);
            alert("开始演变");
        });
        $("#cancelAnimation").click(function () {
            if (animation !== null) {
                clearInterval(animation);
                animation = null;
                alert("停止演变，当前已演变" + len + "个点");
            }
        });
        $("#clearPointCollection").click(function () {
            if (animation !== null) {
                clearInterval(animation);
                animation = null;
            }
            len = 0;
            pointCollection.clear();
        });
    };
};