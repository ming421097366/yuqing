
<html>
    <head>
        <title>将IP转为地址</title>
        <meta charset="utf-8">
    </head>
    <body>
        <?php
        include_once __DIR__ . '\IPQuery.php';
        include_once __DIR__ . '\Assist.php';

        
        $sql = "select content from net_reviews_2";
        $connection = getConnection();
        $result = pg_query($connection, $sql);
        if (!$result) {
            
            pg_close($connection);
            return;
        }

        $data = array();
        $i = 0;
        while ($row = pg_fetch_row($result)) {            
            echo $row[0];
            echo "<br/>";
            $i++;
        }
        pg_free_result($result);
        ?>
    </body>
</html>