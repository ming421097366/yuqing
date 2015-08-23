<?php

include_once __DIR__ . '\Assist.php';
include_once __DIR__ . '\Server.php';
include_once __DIR__ . '\NewsServer.php';
include_once __DIR__ . '\ReviewsServer.php';
include_once __DIR__ . '\WebGisAddressServer.php';
include_once __DIR__ . '\PositionServer.php';
include_once __DIR__ . '\WebGisMainContentServer.php';

if (!isset($_POST["parameters"])) {
    $response = makeResponse(FALSE, "cannot get parameters");
    echo json_encode($response); //将各种各样的类型，处理为一个json字符串！
    exit(1);
}

$parameters = $_POST["parameters"];
$parameters = json_decode($parameters);
$type_request = split("_", $parameters->type);

$handle;

if ($type_request[0] == "NEWS") {
    $handle = new NewsServer();
} else if ($type_request[0] == "REVIEWS") {
    $handle = new ReviewsServer();
} else if ($type_request[0] == "ADDRESS") {
    $handle = new WebGisAddressServer();
} else if ($type_request[0] == "POSITION") {
    $handle = new PositionServer();
} else if ($type_request[0] == "CONTENT") {
    $handle = new WebGisMainContentServer();
} else {
    makeResponse(FALSE, "parameters cannot be parased");
    echo json_encode($response);
    exit(1);
}

$handle->setRequest($parameters);
$handle->run();
echo json_encode($handle->getResponse());
?>
