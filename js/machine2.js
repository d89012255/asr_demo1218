import './jquery-3.6.0.min.js'
import 'https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js'
function post(){
    var now_db_count = 1;
    $.post('take_machine_data.php', function(data){
        console.log(typeof(data));
        console.log(data);
        var arr = JSON.parse(data);
        console.log(arr)

        var table = document.getElementById('tab');
        
        var array = ['time', 'machine', 'mechanical_part_parameter','variable'];
        //var array = ['name','action','positive_or_negative','Value','time'];

        arr.forEach(function(value) {

            var tr = document.createElement('tr');            
            for (var j = 0; j < array.length; j++) {
                var td = document.createElement('td'); // Create a table cell
                var text = document.createTextNode(value[array[j]]); // Set the cell content
                td.appendChild(text); // Append the text node to the cell
                tr.appendChild(td); // Append the cell to the row
                
            }
            table.appendChild(tr); // Append the row to the table
        });                          
    });
}
post();