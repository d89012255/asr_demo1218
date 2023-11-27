<?php
    //取得post過來的資訊(mp3音檔之二位為編碼)
    $input = file_get_contents('php://input');    


    $host = "127.0.0.1";
    $port = 4000;
    // // // No Timeout 
    set_time_limit(0);
    // //Create Socket
    $sock = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");
    // //Connect to the server
    $result = socket_connect($sock, $host, $port) or die("Could not connect toserver\n");

    socket_write($sock, $input, strlen($input)) or die("Could not send data to server\n");

    
    
    header("Content-type: text/html; charset=utf-8");


    
    // //Write to server socket
    $microtime = microtime(true);
    $microseconds = sprintf("%06d", ($microtime - floor($microtime)) * 1000000);
    $a = time().$microseconds;
        
    //Read server respond message
    $result = socket_read($sock, 102400) or die("Could not read server response\n");

    $diff = abs((int)$result-(int)$a);
    setcookie("diff", $diff, time()+100); 
    setcookie("test5", $a, time()+100); 
    setcookie("test6", $result, time()+100); 
    $file_name = "total_count.txt"; //檔案名稱
    $file = @file("$file_name"); //讀取檔案
    $open = @fopen("$file_name","a+"); //開啟檔案，要是沒有檔案將建立一份
  
    @fwrite($open,$diff."\n"); //寫入人數
    fclose($open); //關閉檔案


    //Read server respond message
    $result = socket_read($sock, 1024) or die("Could not read server response\n");

    //socket close and return
    socket_close($sock);

    
    print_r($result);
    
    
    $result = trim($result);
    
    if ($result != ""){
        print_r($result);   
    
        $output = json_encode($result);
        //把out塞進cookie內供網頁調用
        setcookie("test4", $output, time()+10);                       

    }             
            
    



        
        
?>
