<?php

include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';

class WebGisAddressServer extends Server {

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
        if ($this->_request->type == "ADDRESS_GET") {//判断具体请求类型
            $this->getAddress();
        }

        pg_close($this->_connection); //关闭连接
    }

    private function getPAddress() {
        $this->beginTransaction();
        $sql = "select * from paragraph_address;";
        $result = pg_query($this->_connection, $sql);
        $data = array();
        if (!$result) {
            return FALSE;
        } else {
            $i = 0;
            while ($row = pg_fetch_row($result)) {
                $data[$i]["dID"] = $row[1];
                $data[$i]["addressName"] = $row[2];
                $data[$i]["x"] = $row[3];
                $data[$i]["y"] = $row[4];
                $i++;
            }

            pg_free_result($result);
        }
        $this->endTransaction();
        return $data;
    }

    private function getRealAddress($dID) {
        $this->beginTransaction();
        $sql = "select * from real_address where d_id = $1;";
        $result = pg_query_params($this->_connection, $sql, [$dID]);
        $data = array();
        if (!$result) {
            return FALSE;
        } else {
            $i = 0;
            while ($row = pg_fetch_row($result)) {
                $data[$i]["dID"] = $row[0];
                $data[$i]["addressName"] = $row[1];
                $data[$i]["x"] = $row[2];
                $data[$i]["y"] = $row[3];
                $i++;
            }
            pg_free_result($result);
        }
        $this->endTransaction();
        return $data;
    }
    
    private function getAddress() {
        $pAddress = $this->getPAddress();//得到真实地址列表
        $rAddressList = array();//取景地址列表数组
        for($i = 0; $i < count($pAddress);$i++){
            $rAddress = $this->getRealAddress($pAddress[$i]["dID"]);//取景地址列表
            $rAddressList[$i] = $rAddress;
        }        
        $this->makeResponse(true, "get address successfully");
        $data = array();
        $data["pAddress"] = $pAddress;
        $data["rAddress"] = $rAddressList;
        $this->_response["data"] = $data;
//        $this->makeResponse(true, "get address successfully");
    }
    
}

?>
