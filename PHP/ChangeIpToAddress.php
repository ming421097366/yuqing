
<html>
    <head>
        <title>将IP转为地址</title>
        <meta charset="utf-8">
    </head>
    <body>
        <?php
        include_once __DIR__ . '\IPQuery.php';
        include_once __DIR__ . '\Assist.php';

        
        $sql = "select * from net_reviews_1 order by get_time desc limit 100;";
        $connection = getConnection();
        $result = pg_query($connection, $sql);
        if (!$result) {
            
            pg_close($connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {
            $data[$i]["ip"] = trim($row[1]);
            $ip_address = $data[$i]["ip"];
            $ip_address = str_replace("*", "0", $ip_address);
            $ip_info = IPQuery::getIPInfo($ip_address);
            $ip_info = $ip_info['data'];
            echo $ip_info['country'] . "，" . $ip_info['area'] . "," . $ip_info['region'] . "," . $ip_info['city'];
            echo "<br/>";
            $i++;
        }
        pg_free_result($result);
        ?>
    </body>
</html>