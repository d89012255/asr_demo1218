<?php

    function connect_to_database(){
        $link = @mysqli_connect( 
            'localhost',  // MySQL主機名稱 
            'test',       // 使用者名稱 
            'danny',  // 密碼 
            'test9');  // 預設使用的資料庫名稱 
        if ( !$link ) {
            echo "MySQL資料庫連接錯誤!<br/>";
            exit();
        }
        else {
            echo "MySQL資料庫test連接成功!<br/>";
        }
        return $link;
    }
    function insert($link,$machine,$variable1,$variable2){
        // sql語法存在變數中
        echo "in data";
        $now = new DateTime();
        date_default_timezone_set("Asia/Taipei");
        $formattedNow = $now->format('Y-m-d H:i:s');
        $sql = "INSERT INTO `log_info_machine` (`time`, `machine`, `mechanical_part_parameter`,`variable`) VALUES ('$formattedNow','$machine', '$variable1', '$variable2');";
        // 用mysqli_query方法執行(sql語法)將結果存在變數中
        $result = mysqli_query($link,$sql);
        // 如果有異動到資料庫數量(更新資料庫)
        if (mysqli_affected_rows($link)>0) {
        // 如果有一筆以上代表有更新
        // mysqli_insert_id可以抓到第一筆的id
        $new_id= mysqli_insert_id ($link);
        echo "新增後的id為 {$new_id} ";
        }
        elseif(mysqli_affected_rows($link)==0) {
            echo "無資料新增";
        }
        else {
            echo "{$sql} 語法執行失敗，錯誤訊息: " . mysqli_error($link);
        }
        //mysqli_close($link); 
        //return $result;
    }
    function close($link){
        mysqli_close($link);
    }
    $machine = $_POST['machine'];
    $name1 = $_POST['name1'];
    $variable1 = $_POST['variable1'];
    $name2 = $_POST['name2'];
    $variable2 = $_POST['variable2'];
    $name3 = $_POST['name3'];
    $variable3 = $_POST['variable3'];
    $link = connect_to_database();
    insert($link,$machine,$name1, $variable1);
    insert($link,$machine,$name2, $variable2);
    insert($link,$machine,$name3, $variable3);
    close($link);

    



?>