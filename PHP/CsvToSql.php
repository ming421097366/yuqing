
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
            private $data = array();

            public function __construct($fileName, $mode) {
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
                $sql = "insert into province_news values($1,$2,$3,$4,now())";
                $result = pg_query_params($connection, $sql, array(
                    $strArray[0],
                    $strArray[1],
                    trim($strArray[3]),
                    $strArray[2]
                ));
                if (!$result) {
                    echo '错误提示：' . pg_last_notice($this->_connection);
                    return;
                } else {
                    //$this->makeResponse(true, "insert successfully");
                }

                pg_free_result($result);


                pg_query($connection, "end");
            }

            public function handleFileOne($num, $key, $rnum) {
                $data = array();
                $j = 0;
                while (!feof($this->file)) {
                    $oneLine = fgets($this->file); //读取一行
                    $oneLine = mb_convert_encoding($oneLine, "utf-8", "gbk"); //转换字符编码
                    $strArray = explode(",", $oneLine, $num); //切分成数组
                    if ($strArray[0] == $key) {//除去一些标题行
                        continue;
                    }
                    $this->data[$j] = array_slice($strArray, 0, $rnum); //取到需要的前14项
                    $j++;
//                    echo $j;
//                    for ($i = 0; $i < 13; $i++) {
//                        $str = $strArray[$i];
//                        echo $str . ",";
//                    }
//                    
//                    echo var_dump($strArray);
//                    echo $strArray[0]." ".$strArray[1]." ".$strArray[2]." ".$strArray[7];
//                    echo '<br>';
                }
            }

            public function cout($rnum) {
                $str = 'insert into YG values';

                $len = count($this->data);
//                echo $len;
                for ($i = 0; $i < $len; $i++) {
                    $line = $this->data[$i];


                    $line_len = count($line);
                    if ($line_len != $rnum) {
                        continue;
                    }
                    $str .= "(";

//                    echo $line_len;
                    for ($j = 0; $j < $line_len; $j++) {
//                        if($j == 1) {
//                            continue;       ----------------处理取景地表专用
//                        }
                        $str .= "'" . $line[$j] . "'";
                        if ($j != $line_len - 1) {
                            $str .=',';
                        } else {
                            $str .=')';
                        }
                    }
                    if ($i != $len - 1) {
                        $str .=",";
                    }
                }
                echo $str; //输出sql
            }

            public function __destruct() {
                fclose($this->file);
            }

        }

//        $fileName = "c:\\xyj1\\ygb.csv";//csv文件的名字
//        $fileName = "c:\\xyj1\\sxb.csv";
//        $fileName = "c:\\xyj1\\ddb.csv";
//        $fileName = "c:\\xyj1\\qjb.csv";
//        $fileName = "c:\\xyj1\\zb.csv";
        $fileName = "c:\\xyj1\\tswpb3.csv";
        $mode = "r";
        $handle = new CSVFile($fileName, $mode);
//        $handle->handleFileOne(17,"故事ID",14);//指定字段的个数，要排除的行
//        $handle->cout(14);//输出sql
//        $handle->handleFileOne(11,"故事ID",11);//指定字段的个数，要排除的行
//        $handle->cout(11);//输出sql
//        $handle->handleFileOne(6,"故事ID",5);//指定字段的个数，要排除的行
//        $handle->cout(5);//输出sql
        $handle->handleFileOne(13, "故事ID", 13); //指定字段的个数，要排除的行
        $handle->cout(13); //输出sql
        ?>
    </body>
</html>