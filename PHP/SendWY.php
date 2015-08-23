
<html>
    <head>
        <title>Learn PHP</title>
        <meta charset="utf-8">
    </head>
    <body>
        <?php
        include_once __DIR__ . '\Assist.php';

        
        
        /*
         * 把csv文件存入数据库中
         * 做法：读取文件每一行，处理为数组，如果有需要转换字符编码
         * 存入数据库
         */
        
        class CSVFile {

            private $fileName = "";
            private $mode = "";
            private $file = null;
            private $tableName ="";

            public function __construct($fileName, $mode,$tableName) {
                $this->tableName = $tableName;
                $this->fileName = $fileName;
                $this->fileName = $mode;
                $this->file = fopen($fileName, $mode) or die("Unable to open file!");
            }

            private function sendToDB($strArray) {
                $connection = getConnection();
                if (!$connection) {
                    echo "cannot connect DB";
                }
                pg_query($connection, "begin");
                $sql = "insert into ".$this->tableName." values($1,$2,$3,$4,$5)";
                $result = pg_query_params($connection, $sql, array(
                    $strArray[0],
                    $strArray[2],
                    $strArray[3],
                    mb_substr(trim($strArray[4]),0,2,'utf-8'),
                    $strArray[1]
                    
                ));
                if (!$result) {
                    echo '错误提示：'.pg_last_notice($this->_connection);
                    return;
                } else {
                    //$this->makeResponse(true, "insert successfully");
                }

                pg_free_result($result);


                pg_query($connection, "end");
            }

            public function handleFileOne() {
                while (!feof($this->file)) {
                    $oneLine = fgets($this->file); //读取一行
                  //  $oneLine = mb_convert_encoding($oneLine, "utf-8", "gbk"); //转换字符编码
                    $strArray = explode("\t", $oneLine); //切分成数组
//                    if ($strArray[0] == "学号" || count($strArray) != 10) {//除去一些标题行
//                        continue;
//                    }
                    $this->sendToDB($strArray);//将数据存入数据库中 
//                    for ($i = 0; $i < count($strArray); $i++) {                   
//                        $str = $strArray[$i];
//                        echo $str . ",";
//                    }
                    echo mb_substr(trim($strArray[4]),0,2,'utf-8');
                    echo '<br>';
                }
            }

            public function __destruct() {
                fclose($this->file);
            }

        }

        $fileName = "c:\\supermap_data\\wanyi161.txt";
        $tableName = "net_reviews";
        $mode = "r";
        $handle = new CSVFile($fileName, $mode,$tableName);
        $handle->handleFileOne();
        ?>
    </body>
</html>