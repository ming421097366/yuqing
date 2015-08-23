<?php

include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';

class ReviewsServer extends Server {

    private $_provinceName1 = [
        '内蒙',
        '新疆',
        '北京',
        '天津',
        '上海',
        '西藏',
        '黑龙',
        '吉林',
        '辽宁',
        '河北',
        '山西',
        '河南',
        '陕西',
        '宁夏',
        '甘肃',
        '青海',
        '四川',
        '重庆',
        '湖北',
        '海南',
        '广东',
        '广西',
        '云南',
        '贵州',
        '湖南',
        '江西',
        '福建',
        '安徽',
        '浙江',
        '江苏',
        '山东',
        '香港',
        '澳门',
        '台湾'];
    private $_provinceName = [
        '内蒙',
        '新疆',
        '北京',
        '天津',
        '上海',
        '西藏',
        '黑龙',
        '吉林',
        '辽宁',
        '河北',
        '山西',
        '河南',
        '陕西',
        '宁夏',
        '甘肃',
        '青海',
        '四川',
        '重庆',
        '湖北',
        '海南',
        '广东',
        '广西',
        '云南',
        '贵州',
        '湖南',
        '江西',
        '福建',
        '安徽',
        '浙江',
        '江苏',
        '山东'
    ];

    public function __construct() {
        parent::__construct();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function run() {
        parent::run();
        $this->_connection = getConnection(); //建立连接
        if (!$this->_connection) {
            $this->makeResponse(false, "cannot connect to database");
            return;
        }
        if ($this->_request->type == "REVIEWS_GET") {//判断具体请求类型
            $this->getReviewsIndex(); //得到net_review_1分省份评论数据总量
        } else if ($this->_request->type == "REVIEWS_GET_ALL") {
            $this->getReviewsAll(); //得到一条新闻的所有评论数据，以进行分析。
        } else if ($this->_request->type == "REVIEWS_UPDATE_ALL") {
            $this->UpdateAll(); //更新数据，为数据增加XY坐标
        } else if ($this->_request->type == "REVIEWS_GET_ALL_XY") {
            $this->getReviewsAllXY(); //得到带XY坐标的所有评论数据
        } else if ($this->_request->type == "REVIEWS_GET_SPECIAL") {
            $this->getReviewsIndexSpecial(); //得到net_review_2分省份评论数据总量
        } else if ($this->_request->type == "REVIEWS_MOOD_ALL") {
            $this->getReviewsMoodAll(); //得到全国的评论心情比例
        } else if ($this->_request->type == "REVIEWS_MOOD_PROVINCE") {
            $this->getReviewsMoodProvince(); //得到单个省份的评论心情比例
        } else if ($this->_request->type == "REVIEWS_MOOD_MAP") {
            $this->getReviewsMoodMap(); //得到每个省份的评论心情指数
        } else if ($this->_request->type == "REVIEWS_WORD_FREQ") {
            $this->getReviewsWordFreq(); //得到每个省份的评论心情指数
        } else if ($this->_request->type == "REVIEWS_KEY_WORD_GET") {
            $this->getReviewsKeyWord();
        } else if ($this->_request->type == "REVIEWS_ENTITY_GET") {
            $this->getReviewsEntity();
        } else if ($this->_request->type == "REVIEWS_GET_ALL_XY_POSITIVE") {
            $this->getReviewsAllXYPolarity();
        } else if ($this->_request->type == "REVIEWS_GET_ALL_XY_NEGATIVE") {
            $this->getReviewsAllXYPolarity();
        }

        pg_close($this->_connection); //关闭连接
    }

    private function getReviewsAllXYPolarity() {
        $this->beginTransaction();
        $sql = "";
        if ($this->_request->type == "REVIEWS_GET_ALL_XY_NEGATIVE") {
            $sql = "select * from net_reviews_2 where id = $1 and polarity < 0 order by get_time;";
        } else if ($this->_request->type == "REVIEWS_GET_ALL_XY_POSITIVE") {
            $sql = "select * from net_reviews_2 where id = $1 and polarity > 0 order by get_time;";
        }


        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["id"] = trim($row[8]);
            $data[$i]["content"] = trim($row[0]);
            $data[$i]["address"] = trim($row[4]);
            $data[$i]["time"] = trim($row[2]);
            $data[$i]["x"] = trim($row[6]);
            $data[$i]["y"] = trim($row[7]);
            $data[$i]["polarity"] = trim($row[10]);
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsEntity() {
        $this->beginTransaction();
        $sql = "select * from net_review_entity where id = $1";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID,
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["entity"] = $row[1];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsKeyWord() {
        $this->beginTransaction();
        $sql = "select * from net_reviews_keyword where id = $1 limit 20 ";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID,
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["word"] = $row[1];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsWordFreq() {
        $this->beginTransaction();
        $sql = "select * from word_freq where ID = $1 and type = $2 order by freq desc limit 10";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID,
            $this->_request->wordType
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["word"] = $row[3];
            $data[$i]["freq"] = $row[4];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsMoodAll() {
        $this->beginTransaction();
        $sql = "select sum(positive_point),sum(negative_point) from net_reviews_2 where id = $1";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["positivePoint"] = $row[0];
            $data[$i]["negativePoint"] = $row[1];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsMoodMap() {
        $data = array();
        for ($i = 0; $i < count($this->_provinceName1); $i++) {
            $currentProvince = $this->_provinceName1[$i];
            $currentData = $this->getReviewsMoodMapOne($currentProvince);
            if ($currentData) {
                $data[$i] = $currentData;
            }
        }
        $this->makeResponse(true, "get reviews mood map successfully");
        $this->_response["data"] = $data;
    }

    private function getReviewsMoodMapOne($provinceName) {
        $this->beginTransaction();
        $sql = "";
        if ($this->_request->moodType == "positivePoint") {
            $sql = "select avg(positive_point) from net_reviews_2 where substr(province,1,2) = $1 and id = $2";
        } else if ($this->_request->moodType == "negativePoint") {
            $sql = "select avg(negative_point) from net_reviews_2 where substr(province,1,2) = $1 and id = $2";
        } else if ($this->_request->moodType == "allPoint") {
            $sql = "select avg(polarity) from net_reviews_2 where substr(province,1,2) = $1 and id = $2";
        }



        $result = pg_query_params($this->_connection, $sql, array(
            $provinceName,
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();

        $row = pg_fetch_row($result);
        $data["moodPoint"] = $row[0];


        if ($provinceName == '内蒙') {
            $provinceName = '内蒙古';
        } else if ($provinceName == '黑龙') {
            $provinceName = '黑龙江';
        }

        $data["provinceName"] = $provinceName;
        pg_free_result($result);

        $this->endTransaction();
        return $data;
    }

    private function getReviewsMoodProvince() {
        $this->beginTransaction();
        $sql = "select sum(positive_point),sum(negative_point) from net_reviews_2 where substr(province,1,2) = $1 and id = $2";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->provinceName,
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["positivePoint"] = $row[0];
            $data[$i]["negativePoint"] = $row[1];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getReviewsAllXY() {
        $this->beginTransaction();
        $sql = "select * from net_reviews_2 where id = $1 order by get_time;";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["id"] = trim($row[8]);
            $data[$i]["content"] = trim($row[0]);
            $data[$i]["address"] = trim($row[4]);
            $data[$i]["time"] = trim($row[2]);
            $data[$i]["x"] = trim($row[6]);
            $data[$i]["y"] = trim($row[7]);
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function UpdateAll() {
        $this->beginTransaction();
        $sql = "update net_reviews_2 set x=$1,y=$2 where id =$3 and num = $4;";
        $coordinate = $this->_request->coordinate;
        $newsID = $this->_request->newsID;

        $item = $coordinate;
        $x = $item->x;
        $y = $item->y;
        $id = (int) $item->id;
        $result = pg_query_params($this->_connection, $sql, array(
            (double) $x,
            (double) $y,
            $newsID,
            $id,
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        pg_free_result($result);



//        if (!$result) {
//            $this->makeResponse(false, pg_last_error($this->_connection));
//            pg_close($this->_connection);
//            return;
//        }
//        $i = 0;
//        while ($row = pg_fetch_row($result)) {
//            $data[$i]["id"] = trim($row[8]);
//            $data[$i]["content"] = trim($row[0]);
//            $data[$i]["address"] = trim($row[4]);
//            $data[$i]["time"] = trim($row[2]);
//            $i++;
//        }
//        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $coordinate;
        $this->endTransaction();
    }

    private function getReviewsAll() {
        $this->beginTransaction();
        $sql = "select * from net_reviews_2 where id = $1 and num > 3908;";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->newsID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["id"] = trim($row[8]);
            $data[$i]["content"] = trim($row[0]);
            $data[$i]["address"] = trim($row[4]);
            $data[$i]["time"] = trim($row[2]);
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getProvinceReviewsIndex($provinceName) {//得到单个省份的评论情况
        $this->beginTransaction();
        $sql = "select count(*),sum(likes) from net_reviews_1 where province=$1 and id = $2;";
        $result = pg_query_params($this->_connection, $sql, [$provinceName, $this->_request->id]);
        $data = array();
        if (!$result) {
            return FALSE;
        } else {
            $row = pg_fetch_row($result); //只有一条记录返回
            $data["name"] = $provinceName; //得到地区名字
            $data["reviewsCount"] = $row[0]; //得到评论数目
            $data["reviewsValue"] = $row[1]; //得到评论指数
        }

        pg_free_result($result);

        $this->endTransaction();
        return $data;
    }

    private function getProvinceReviewsIndexSpecial($provinceName) {//得到单个省份的评论情况
        $this->beginTransaction();
        $sql = "select count(*),sum(likes) from net_reviews_2 where SUBSTR(province,1,2)=$1 and id = $2;";
        $result = pg_query_params($this->_connection, $sql, [$provinceName, $this->_request->id]);
        $data = array();
        if (!$result) {
            return FALSE;
        } else {
            $row = pg_fetch_row($result); //只有一条记录返回
            $data["name"] = $provinceName; //得到地区名字
            $data["reviewsCount"] = $row[0]; //得到评论数目
            $data["reviewsValue"] = $row[1]; //得到评论指数
        }

        pg_free_result($result);

        $this->endTransaction();
        return $data;
    }

    private function getReviewsIndexSpecial() {
        $data = array();

        for ($i = 0; $i < count($this->_provinceName); $i++) {
            $currentProvince = $this->_provinceName[$i];
            $currentData = $this->getProvinceReviewsIndexSpecial($currentProvince);
            if ($currentData) {
                $data[$i] = $currentData;
            }
        }
        $this->makeResponse(true, "get reviews successfully");
        $this->_response["data"] = $data;
    }

    private function getReviewsIndex() {
        $data = array();

        for ($i = 0; $i < count($this->_provinceName); $i++) {
            $currentProvince = $this->_provinceName[$i];
            $currentData = $this->getProvinceReviewsIndex($currentProvince);
            if ($currentData) {
                $data[$i] = $currentData;
            }
        }
        $this->makeResponse(true, "get reviews successfully");
        $this->_response["data"] = $data;
    }

}
