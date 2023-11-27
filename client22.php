<html>
<head>
    
 
<body>
    
    <script>
    </script>
    <?php
    function connected($data){
        //電腦之ip與port
        $host = "172.20.10.2";
        $port = 2391;

        // // // No Timeout 
        set_time_limit(0);

        // //Create Socket
        $sock = socket_create(AF_INET, SOCK_STREAM, 0) or die("Could not create socket\n");

        // //Connect to the server
        $result = socket_connect($sock, $host, $port) or die("Could not connect toserver\n");      

        
        // //Write to server socket
        
        socket_write($sock, $data, strlen($data)) or die("Could not send data to server\n");

        //Read server respond message
        $result = socket_read($sock, 1024) or die("Could not read server response\n");

        //socket close and return
        socket_close($sock);
        return $result;
    }
    do {
        $data = file_get_contents('php://input');
        $result = "";
        if($data!=NULL){
            $result =connected($data);
            if($result != "wait")
                setcookie("test4", $result, time()+10);            
        }
    }while($data ==NULL) 
       
   

  

    ?>
 

</body>
 
 
</html>