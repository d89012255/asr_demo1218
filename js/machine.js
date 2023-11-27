function post(){
    $.post('test.php', function(data){
            console.log(typeof(data));
            console.log(data);
            var arr = JSON.parse(data);
            console.log(arr)
            console.log(arr[0]['name']);
            var table = document.getElementById('tab');
            
            var array = ['name', 'num1', 'num2'];
            //var array = ['name','action','positive_or_negative','Value','time'];

            
            arr.forEach(function(value){
                var tr = document.createElement('tr');
                for (var j = 0; j < array.length; j++) {
                    var th = document.createElement('th'); //column
                    var text = document.createTextNode(value[array[j]]); //cell
                    th.appendChild(text);
                    tr.appendChild(th);
                }
                table.appendChild(tr);
            });
            

            
    }); 
}
post();