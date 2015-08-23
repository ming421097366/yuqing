<?php

include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';

class NewsServer extends Server {

    private $_provinceName = ['西藏', '黑龙江', '吉林', '辽宁', '河北', '山西', '河南', '陕西', '宁夏', '甘肃', '青海', '四川', '重庆', '湖北', '海南', '广东', '广西', '云南',
        '贵州',
        '湖南',
        '江西',
        '福建',
        '安徽',
        '浙江',
        '江苏',
        '山东'];

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
        if ($this->_request->type == "NEWS_GET") {//判断具体请求类型
            $this->getNews1();
        } else if ($this->_request->type == "NEWS_NET_GET") {
            $this->getNetNews();
        }

        pg_close($this->_connection); //关闭连接
    }

    private function getNetNews() {
        $this->beginTransaction();
        $sql = "select * from net_news limit 10;";
        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(FALSE, pg_last_notice($this->_connection));
            return;
        } else {

            $data = array();
            $i = 0;
            while ($row = pg_fetch_row($result)) {
                $data[$i]["title"] = $row[0];
                $data[$i]["heat"] = $row[2];
                $data[$i]["id"] = $row[4];
                $i++;
            }

            pg_free_result($result);
            $this->makeResponse(true, "get news successfully");
            $this->_response["data"] = $data;
        }
        $this->endTransaction();
    }

    private function getProvinceNews($provinceName) {
        $this->beginTransaction();
        $sql = "select * from province_news where province=$1 order by get_time desc limit 9;";
        $result = pg_query_params($this->_connection, $sql, [$provinceName]);
        $data = array();
        if (!$result) {

            return FALSE;
        } else {

            $i = 0;
            while ($row = pg_fetch_row($result)) {
                $data[$i]["title"] = $row[0];
                $data[$i]["link"] = $row[1];
                $data[$i]["province"] = $row[2];
                $data[$i]["abs"] = $row[3];
                $data[$i]["time"] = $row[4];
                $i++;
            }

            pg_free_result($result);
        }
        $this->endTransaction();
        return $data;
    }

    private function getNews1() {
        $data = array();

        for ($i = 0; $i < count($this->_provinceName); $i++) {
            $currentProvince = $this->_provinceName[$i];
            $currentData = $this->getProvinceNews($currentProvince);
            if ($currentData) {
                $data[$i] = $currentData;
            }
        }
        $this->makeResponse(true, "get news successfully");
        $this->_response["data"] = $data;
    }

    private function getNews() {
        $this->beginTransaction();
        $sql = "select * from province_news order by get_time desc limit 5;";
        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(FALSE, pg_last_notice($this->_connection));
            return;
        } else {

            $data = array();
            $i = 0;
            while ($row = pg_fetch_row($result)) {
                $data[$i]["title"] = $row[0];
                $data[$i]["link"] = $row[1];
                $data[$i]["province"] = $row[2];
                $i++;
            }

            pg_free_result($result);
            $this->makeResponse(true, "get news successfully");
            $this->_response["data"] = $data;
        }
        $this->endTransaction();
    }

}
