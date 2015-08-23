<?php

include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';

class PositionServer extends Server {

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
        if ($this->_request->type == "POSITION_YG_GET") {//判断具体请求类型
            $this->getPositionYG();
        } else if($this->_request->type == "POSITION_SX_GET") {
            $this->getPositionSX();
        } 

        pg_close($this->_connection); //关闭连接
    }
    
    private function getPositionSX() {
        $this->beginTransaction();
        $sql = "select SX.*,paragraph_address.x,paragraph_address.y from SX,paragraph_address where SX.d_id = paragraph_address.d_id";

        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {

            $dataItem = array();
            $dataItem["sx_name"] = $row[3];
            $dataItem["sx_intro"] = $row[4];
            $dataItem["sx_b_name"] = $row[5];            
            $dataItem["sx_sex"] = $row[6];
//            $dataItem["sx_land"] = $row[7];
            $dataItem["sx_level"] = $row[7];
            $dataItem["sx_weapon"] = $row[8];
            $dataItem["sx_get"] = $row[9];
            $dataItem["sx_couple"] = $row[10];
//            $dataItem["sx_couple_id"] = $row[12];
            
            
            

            $position = array();
            $position["x"] = $row[11];
            $position["y"] = $row[12];

            $data[$i]["p_id"] = $row[0];
            $data[$i]["d_id"] = $row[1];
            $data[$i]["sx_id"] = $row[2];
            
            $data[$i]["position"] = $position;
            $data[$i]["introduction"] = $dataItem;            
            
            $i++;
        }
        //echo $_SESSION["userid"];
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

    private function getPositionYG() {
        $this->beginTransaction();
        $sql = "select YG.*,paragraph_address.x,paragraph_address.y from YG,paragraph_address where YG.d_id = paragraph_address.d_id";

        $result = pg_query($this->_connection, $sql);
        if (!$result) {
            $this->makeResponse(false, pg_last_error($this->_connection));
            pg_close($this->_connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {

            $dataItem = array();
            $dataItem["y_name"] = $row[3];
            $dataItem["y_intro"] = $row[4];
            $dataItem["y_b_name"] = $row[5];
            $dataItem["y_people"] = $row[6];
            $dataItem["y_sex"] = $row[7];
            $dataItem["y_land"] = $row[8];
            $dataItem["y_couple"] = $row[3];
            $dataItem["y_level"] = $row[10];
            $dataItem["y_weapon"] = $row[11];
            $dataItem["y_get"] = $row[12];
            $dataItem["y_end"] = $row[13];

            $position = array();
            $position["x"] = $row[14];
            $position["y"] = $row[15];

            $data[$i]["p_id"] = $row[0];
            $data[$i]["d_id"] = $row[1];
            $data[$i]["y_id"] = $row[2];
            
            $data[$i]["position"] = $position;
            $data[$i]["introduction"] = $dataItem;            
            
            $i++;
        }
        //echo $_SESSION["userid"];
        pg_free_result($result);
        $this->makeResponse(true, "ok");
        $this->_response["data"] = $data;
        $this->endTransaction();
    }

}
