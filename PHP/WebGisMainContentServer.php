<?php

/**
 * 取回西游记每个章节的简介，标题，时间
 *
 */
include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';

class WebGisMainContentServer extends Server {

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
        if ($this->_request->type == "CONTENT_MAIN_GET") {//判断具体请求类型
            $this->getContent();
        } else if ($this->_request->type == "CONTENT_LIST_GET") {
            $this->getList();
        } else if ($this->_request->type == "CONTENT_SPECIAL_SAVE") {
            $this->saveSpecial();
        } else if ($this->_request->type == "CONTENT_SPECIAL_GET") {
            $this->getSpecial();
        } else if ($this->_request->type == "CONTENT_SPECIAL_ALL_GET") {
            $this->getAllSpecial();
        }

        pg_close($this->_connection); //关闭连接
    }

    private function getAllSpecial() {
        $this->beginTransaction();
        $sql = "select distinct t_id from own_special where user_id = $1;";

        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->userID            
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }
        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["tId"] = trim($row[0]);            
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getSpecial() {
        $this->beginTransaction();
        $sql = "select * from own_special where user_id = $1 and t_id = $2";


        $result = pg_query_params($this->_connection, $sql, array(
            $this->_request->userID,
            $this->_request->tID
        ));
        if (!$result) {
            $this->makeResponse(false, pg_last_notice($this->_connection));
            return;
        }
        if (pg_num_rows($result) > 0) {
            $this->makeResponse(true, "OK");
            $row = pg_fetch_row($result);
//            $_SESSION["userid"]=$row[1];
        } else {
            $this->makeResponse(false, "没有宝物");
        }
        pg_free_result($result);
        $this->endTransaction();
    }

    private function saveSpecial() {
        $this->beginTransaction(); //开始事务        
        $sql = "insert into own_special values($1,$2);";

//        if(!$_SESSION["userid"])
//        {
//             $this->makeResponse(false, "you have not logined");
//             return;
//        }

        $result = pg_query_params($this->_connection, $sql, array(
//            $_SESSION["userid"],
            $this->_request->userID,
            $this->_request->tID
        ));

        if (!$result) {
            $this->makeResponse(false, pg_last_notice($this->_connection));
            return;
        } else {
            $this->makeResponse(true, "insert special successfully");
        }

        pg_free_result($result);
        $this->endTransaction(); //结束事务
    }

    private function getList() {
        $this->beginTransaction();
        $sql = "select * from tswpb1 order by CAST( substring(t_id,2,(length(t_id)-1)) AS INTEGER);";

        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["tId"] = trim($row[2]);
            $data[$i]["tName"] = $row[3];
            $data[$i]["tBName"] = $row[4];
            $data[$i]["wx"] = $row[5];
            $data[$i]["cl"] = $row[6];
            $data[$i]["zzz"] = $row[7];
            $data[$i]["cyz"] = $row[8];
            $data[$i]["gn"] = $row[9];
            $data[$i]["kx"] = trim($row[10]);
            $data[$i]["x"] = $row[11];
            $data[$i]["y"] = $row[12];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getContent() {
        $this->beginTransaction();
        $sql = "select * from zb order by CAST( substring(p_id,3,(length(p_id)-2)) AS INTEGER);";

        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["id"] = trim($row[0]);
            $data[$i]["title"] = $row[1];
            $data[$i]["time"] = $row[2];
            $data[$i]["content"] = $row[3];
            $i++;
        }
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

}
