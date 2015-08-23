<?php

$host="127.0.0.1";
$port=5432;
//$db_name="webgis";
$db_name="supermap";
$user="postgres";
$password="154815";


function getConnection()//连接数据库的辅助函数
{
    global $host,$port,$db_name,$user,$password;
    $connect_string="host={$host} port={$port} dbname={$db_name} user={$user} password={$password} ";
    $db_connect=  pg_connect($connect_string);
    return $db_connect;
}


function makeResponse($success,$message)//构造回复的辅助函数
{
    $response=array();
    $response["success"]=$success;
    $response["message"]=$message;
    return $response;
    
}

?>