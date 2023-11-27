<?php
    function connect_to_database(){
        $link = @mysqli_connect( 
            'localhost',  // MySQL主機名稱 
            'test',       // 使用者名稱 
            'danny',  // 密碼 
            'test7');  // 預設使用的資料庫名稱 
        if ( !$link ) {
        //echo "MySQL資料庫連接錯誤!<br/>";
        exit();
        }
        else {
       //echo "MySQL資料庫test連接成功!<br/>";
        }
        return $link;
    }
    
    function close($link){
        mysqli_close($link);
    }
    
    
    
    function see($link){
            // sql語法存在變數中
        $datas=NULL;
        $returnback = "";
        $sql = "SELECT * FROM `mytest`";

        // 用mysqli_query方法執行(sql語法)將結果存在變數中
        $result = mysqli_query($link,$sql);

        // 如果有資料
        if ($result) {
            // mysqli_num_rows方法可以回傳我們結果總共有幾筆資料
            
            if (mysqli_num_rows($result)>0) {
                // 取得大於0代表有資料
                // while迴圈會根據資料數量，決定跑的次數
                // mysqli_fetch_assoc方法可取得一筆值
                while ($row = mysqli_fetch_assoc($result)) {
                    // 每跑一次迴圈就抓一筆值，最後放進data陣列中
                    $datas[] = $row;
                }
            }
            // 釋放資料庫查到的記憶體
            mysqli_free_result($result);
        }
        else {
            //echo "{$sql} 語法執行失敗，錯誤訊息: " . mysqli_error($link);
        }
        // 處理完後印出資料
        if(!empty($result)){
            if($datas==NULL){
                //echo "NPNONONO";
            }
            else{
                //print_r($datas);
                $returnback = $datas;
            }
        }
        else {
            // 為空表示沒資料
            //echo "查無資料";
        }
        
        return $returnback;
    }
    $link = connect_to_database();
    $result = see($link);
    
    close($link);
    //print_r($result);
    //print_r(count($result));
    //print_r(gettype($result));
    print_r(json_encode($result));


    //print_r("HI");
?>