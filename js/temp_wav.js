import './engine/mp3-engine.js'
import './engine/wav.js'
import './engine/mp3.js'
import './jquery-3.6.0.min.js'
import 'https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js'

//用於決定倒數計時的數字顯示
const times = document.getElementById("times");
times.innerHTML = "8";
//用於決定在執行跳動指令操作時，欄位變換的相關邏輯
let name_of_assembling = ['滑軌X軸', '滑軌Y軸','滑軌Z軸','主軸1','主軸2','主軸3'];
let assembling_num = 1;
let assembling_name =0;
let assembling_now = name_of_assembling[assembling_name]+assembling_num;
let Myelement = document.getElementById(assembling_now);


//錄音變數初始化
var rec,wave,recBlob;
//input視窗DB視窗轉換切換設定
let elementinput = document.getElementById('machine_data');
let elementdatabase = document.getElementById('databse_grid');
elementdatabase.style.display = 'none';

//用於紀錄目前db table所有資料除以9後可以有幾頁
var count_of_db_row_divide_nine = 0;
//紀錄db要如何跳動的相關參數
var now_db_count = 0;
var last_show_db = 0;
//用於處理指令變換時的畫面跳動控制
var open_cooperation_switch = false;
var cooperation_switch = false;
var number_check = true;
var number_upload = false;
var open_db = false;
var state_in_input = true;
//取得cookie值的函式(用在取回辨識結果)
function getCookie(name)
{ 
    const value = "; " + document.cookie; 
    const parts = value.split("; " + name + "="); 
    if (parts.length == 2)
    {
        const vlu = parts.pop().split(";").shift(); 
        const decode_vlu = decodeURIComponent(vlu) ; 
        console.log('decode_vlu') ; 
        const replace_vlu = decode_vlu.replace(/[+]/g, ' ');
        console.log(replace_vlu)
        return replace_vlu ; 
    }
    else
        return '' ;
}
//開始錄音
function startRec(){
    rec=null;
	wave=null;
	recBlob=null;
	var newRec=Recorder({
		type:"wav",sampleRate:16000,bitRate:256 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
		,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd){
		}
	});

	
    newRec.open(function()
    { //開始錄音 
        rec=newRec;
        rec.start(); 
    },function(msg,isUserNotAllow){ 
        //用戶拒絕了權限或瀏覽器不支持 
        alert((isUserNotAllow?"用戶拒絕了權限，":"")+"無法錄音:"+msg); }); 
   
	
};
//因為網頁設計一次只能輸入一行的數據，故此function是協助當要跳到下一行時，舊行要被限制住
function clean_disable(num){
    console.log("inin")
    for(var i=1;i<4;i++){
        assembling_now = name_of_assembling[assembling_name]+i;
        console.log(assembling_now);
        Myelement = document.getElementById(assembling_now);
        Myelement.disabled = true;
    }
    assembling_name = assembling_name+num;
    if(assembling_name>5)
        assembling_name = 0
    if(assembling_name<0)
        assembling_name = 5
    for(var i=1;i<4;i++){
        assembling_now = name_of_assembling[assembling_name]+i;
        Myelement = document.getElementById(assembling_now);
        Myelement.disabled = false;
    }
}

function clean_all(){
    console.log("inin2")
    for(var i=1;i<4;i++){
        assembling_now = name_of_assembling[assembling_name]+i;
        console.log(assembling_now);
        Myelement = document.getElementById(assembling_now);
        Myelement.disabled = true;
    }
}
function able_first(){
    console.log("inin3")
    for(var i=1;i<4;i++){
        assembling_now = name_of_assembling[assembling_name]+i;
        console.log(assembling_now);
        Myelement = document.getElementById(assembling_now);
        Myelement.disabled = false;
    }
}
//停止錄音
function playRec(){ 
    //停止錄音，得到了錄音文件blob二進位對象，想幹嘛就幹嘛    
    rec.stop(function(blob,duration){ 
        recBlob=blob;
        var fileReader = new FileReader();
        fileReader.readAsText(blob);
        console.log(blob.length);       
        fileReader.onload = function() {          
            var indexBase64 =  fileReader.result;
            var start_time = new Date().getTime();
            //呼叫php傳輸音檔給模型進行辨識
            fetch(`./server2.php`, {method:"POST", body:blob})
            .then(response => {
                if (response.ok) return response;
                else throw Error(`Server returned ${response.status}: ${response.statusText}`)
            })
            //辨識結果處理
            .then(response => {
                console.log(response.text());
                //out是辨識結果，但此時會是以unicode進行編碼
                var out = getCookie("test4");
                console.log(out);
                //判斷out是不是空值
                if(out!=""){
                    var result = document.getElementById("result");
                    //透過JSON將unicode轉成繁體字
                    out = JSON.parse(out);
                    console.log(out);
                    //念出辨識結果
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = out;
                    msg.lang = 'zh'; //漢語
                    msg.volume = 50; // 聲音的音量
                    msg.rate = 0.7; //語速，數值，預設值是1，範圍是0.1到10
                    msg.pitch = 1.0;                 
                    speechSynthesis.speak(msg);                              

                    result.innerHTML = out;
                    if(out=="空白音檔"){
                        console.log(out);
                    }
                    if(out=="無法辨識"){
                        console.log(out);
                    }
                    else if(open_db){
                        console.log("in db");
                        if(out=="確定"){
                            if(open_cooperation_switch){
                                cooperation_switch = true;
                                open_db = false;
                                open_cooperation_switch = false;
                                state_in_input = true;
                                clean_all();
                                assembling_num = 1;
                                assembling_name =0;
                                able_first();
                                assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                Myelement = document.getElementById(assembling_now);
                                
                                elementinput.style.display = '';
                                elementdatabase.style.display = 'none';
                                Myelement.focus();
                            }
                            else{
                                console.log("OPen db");
                                $.post('take_machine_data.php', function(data){
                                    console.log(typeof(data));
                                    console.log(data);
                                    var arr = JSON.parse(data);
                                    console.log(arr)

                                    var table = document.getElementById('tab');
                                    
                                    var array = ['time', 'machine', 'mechanical_part_parameter','variable'];
                                    var temp = 0;
                                    count_db_change = 0;
                                    var count_db_change = now_db_count*9;
                                    arr.forEach(function(value) {
                                        count_of_db_row_divide_nine = count_of_db_row_divide_nine+1;
                                        console.log(count_of_db_row_divide_nine);
                                        if(count_db_change*9>0){
                                            count_db_change = count_db_change-1;
                                            return false;
                                        }
                                        if(temp==9){
                                            return false;
                                        }
                                        var tr = document.createElement('tr');            
                                        for (var j = 0; j < array.length; j++) {
                                            var td = document.createElement('td'); // Create a table cell
                                            var text = document.createTextNode(value[array[j]]); // Set the cell content
                                            td.appendChild(text); // Append the text node to the cell
                                            tr.appendChild(td); // Append the cell to the row
                                            
                                        }
                                        temp = temp+1;
                                        last_show_db = last_show_db+1;
                                        table.appendChild(tr); // Append the row to the table
                                    });
                                    console.log(count_of_db_row_divide_nine);
                                    count_of_db_row_divide_nine = Math.ceil(count_of_db_row_divide_nine/9)                         
                                });                            
                                elementinput.style.display = 'none';
                                elementdatabase.style.display = '';
                                cooperation_switch = false;
                            }
                        }
                        else if(out=="取消"){
                            if(open_cooperation_switch){
                                if(!state_in_input)
                                    open_cooperation_switch = false;
                            }
                            else{
                                if(state_in_input){
                                    console.log("Close db");
                                    open_db = false;
                                }
                            }
                        }
                        else if(out=="下一頁"){
                            console.log("I am here")
                            now_db_count = now_db_count+1
                            if(now_db_count>=count_of_db_row_divide_nine){
                                now_db_count = 0
                            }
                            var table = document.getElementById('tab');
                            // 需要移除的子元素数量
                            var elementsToRemove = last_show_db;

                            // 移除最後9个子元素
                            for (var i = 0; i < elementsToRemove; i++) {
                                // 使用 removeChild 移除最後一个子元素
                                console.log("delete")
                                table.removeChild(table.lastChild);
                            }
                            last_show_db = 0;
                            $.post('take_machine_data.php', function(data){
                                console.log(typeof(data));
                                console.log(data);
                                var arr = JSON.parse(data);
                                console.log(arr)

                                var table = document.getElementById('tab');
                                
                                var array = ['time', 'machine', 'mechanical_part_parameter','variable'];
                                //var array = ['name','action','positive_or_negative','Value','time'];

                                var temp = 0;
                                var count_db_change = now_db_count*9;
                                arr.forEach(function(value) {
                                    if(count_db_change*9>0){
                                        count_db_change = count_db_change-1;
                                        return false;
                                    }
                                    if(temp==9){
                                        return false;
                                    }
                                    var tr = document.createElement('tr');            
                                    for (var j = 0; j < array.length; j++) {
                                        var td = document.createElement('td'); // Create a table cell
                                        var text = document.createTextNode(value[array[j]]); // Set the cell content
                                        td.appendChild(text); // Append the text node to the cell
                                        tr.appendChild(td); // Append the cell to the row
                                        
                                    }
                                    temp = temp+1;
                                    last_show_db = last_show_db+1;
                                    table.appendChild(tr); // Append the row to the table
                                });                          
                            });

                        }
                        else if(out=="上一頁"){
                            console.log("I am here")
                            now_db_count = now_db_count-1
                            console.log(now_db_count);
                            if(now_db_count<0){
                                now_db_count = count_of_db_row_divide_nine-1;
                            }
                            console.log(now_db_count);
                            var table = document.getElementById('tab');
                            // 需要移除的子元素数量
                            var elementsToRemove = last_show_db;

                            // 移除最後9个子元素
                            for (var i = 0; i < elementsToRemove; i++) {
                                // 使用 removeChild 移除最後一个子元素
                                console.log("delete")
                                table.removeChild(table.lastChild);
                            }
                            last_show_db = 0;
                            $.post('take_machine_data.php', function(data){
                                console.log(typeof(data));
                                console.log(data);
                                var arr = JSON.parse(data);
                                console.log(arr)

                                var table = document.getElementById('tab');
                                
                                var array = ['time', 'machine', 'mechanical_part_parameter','variable'];

                                var temp = 0;
                                var count_db_change = now_db_count*9;
                                arr.forEach(function(value) {
                                    if(count_db_change*9>0){
                                        count_db_change = count_db_change-1;
                                        return false;
                                    }
                                    if(temp==9){
                                        return false;
                                    }
                                    var tr = document.createElement('tr');            
                                    for (var j = 0; j < array.length; j++) {
                                        var td = document.createElement('td'); // Create a table cell
                                        var text = document.createTextNode(value[array[j]]); // Set the cell content
                                        td.appendChild(text); // Append the text node to the cell
                                        tr.appendChild(td); // Append the cell to the row
                                        
                                    }
                                    temp = temp+1;
                                    last_show_db = last_show_db+1;
                                    table.appendChild(tr); // Append the row to the table
                                });                          
                            });
                        }
                        else if(out=="暫存"){
                            open_cooperation_switch = true;
                        }
                    }
                    else if(cooperation_switch){
                        if(number_check){
                            if(out=="確定"){
                                if(number_upload==true){
                                    console.log("HERE YES");
                                    let selectElement = document.getElementById('mahine_select');
                                    let selectedValue = selectElement.value;
                                    let give_out = [];
                                    give_out.push(selectedValue)
                                    for(var i=1;i<4;i++){
                                        assembling_now = name_of_assembling[assembling_name]+i+'l';
                                        Myelement = document.getElementById(assembling_now);
                                        var temp = Myelement.innerText.replace(/：/g, '');
                                        give_out.push(temp);
                                        assembling_now = name_of_assembling[assembling_name]+i;
                                        Myelement = document.getElementById(assembling_now);
                                        var temp = Myelement.value;
                                        give_out.push(temp);
                                        Myelement.value = "";
                                    }
                                    assembling_num = 1
                                    assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                    Myelement = document.getElementById(assembling_now);
                                    Myelement.focus();
                                    console.log(give_out)
                                    $.post("./insert2.php", {
                                        machine:give_out[0],
                                        name1:give_out[1],
                                        variable1:give_out[2],
                                        name2:give_out[3],
                                        variable2:give_out[4],
                                        name3:give_out[5],
                                        variable3:give_out[6]
                                    }, function(data) {
                                        if (data != "") {
                                            //alert('We sent Jquery string to PHP : ' + data);
                                        }
                                    });
                                    number_upload==false;
                                }
                                else if(open_db==true){
                                    console.log("OPen db");
                                    elementinput.style.display = 'none';
                                    elementdatabase.style.display = '';
                                }
                                Myelement.focus();
                            }
                            //控制協作系統開關
                            else if(out=="暫存"){
                                cooperation_switch = true;
                            }
                            else if(out=="取消"){
                                Myelement.focus();
                                number_upload = false;
                            }
                            //控制輸入頁面跳動
                            else if(out=="上一點"){
                                assembling_num = 1
                                clean_disable(-1)
                                assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                Myelement = document.getElementById(assembling_now);
                                Myelement.focus();
                            }
                            else if(out=="下一點"){
                                assembling_num = 1
                                clean_disable(1)
                                assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                console.log(assembling_now)
                                Myelement = document.getElementById(assembling_now);
                                Myelement.focus();
                            }
                            else if(out=="上一組"){
                                assembling_num = assembling_num-1
                                if(assembling_num<1)
                                    assembling_num = 3
                                assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                Myelement = document.getElementById(assembling_now);
                                Myelement.focus();
                            }
                            else if(out=="下一組"){
                                assembling_num = assembling_num+1
                                if(assembling_num>3)
                                    assembling_num = 1
                                assembling_now = name_of_assembling[assembling_name]+assembling_num;
                                Myelement = document.getElementById(assembling_now);
                                Myelement.focus();
                            }
                            else if(out=="是"){
                                Myelement.focus();
                            }
                            else if(out=="否"){
                                Myelement.focus();
                            }
                            else if(out=="上傳"){
                                Myelement.focus();
                                number_upload = true;
                            }
                            else if(out=="紀錄"){
                                Myelement.focus();
                                open_db = true;
                                console.log("DB　Switch on");
                            }
                            else if(out=="鎖定"){
                                cooperation_switch = false;
                                console.log("備索")                          
                            }
                            else{
                                Myelement.value=out;
                                Myelement.focus();
                                number_check = false;
                            }
                        }
                        else if(out=="是"){
                            number_check = true;
                            assembling_num = assembling_num+1
                            if(assembling_num>3)
                                assembling_num = 1
                            assembling_now = name_of_assembling[assembling_name]+assembling_num;
                            Myelement = document.getElementById(assembling_now);
                            Myelement.focus();
                        }
                        else if(out=="否"){
                            number_check = true;
                            Myelement.value = "";
                            Myelement.focus();                            
                        }
                    }
                    else if(out=="暫存"){
                        cooperation_switch = true;
                        console.log("Switch on");
                        assembling_num = 1;
                        assembling_name =0;
                        Myelement.focus();
                    }                   

                        
                }
               
     


            
            })
            .catch(err => {
                //alert(err);
            });


            


            
            
        };
        

        

        },function(msg){ 
            alert("錄音失敗:"+msg); }); 
    };


function start_before(){

    startRec();
    
    
    var count = 0;
    for(var i=0;i<720;i++){
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '七';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 5; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "7";
        },1000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '六';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 5; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "6";
        },2000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '五';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "5";
        },3000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '四';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "4";
        },4000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '三';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "3";
        },5000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '二';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "2";
        },6000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '一';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            times.innerHTML = "1";
        },7000+count*12000);
        setTimeout(function(){
            var msg = new SpeechSynthesisUtterance();
            msg.text = '辨識中';
            msg.lang = 'zh'; //漢語
            msg.volume = 20; // 聲音的音量
            msg.rate = 6; //語速，數值，預設值是1，範圍是0.1到10
            msg.pitch = 1.0;                 
            speechSynthesis.speak(msg);
            playRec();
           times.innerHTML = "辨識中";
        },8000+count*12000);
        setTimeout(function(){
            times.innerHTML = "辨識中";
        },9000+count*12000);
        setTimeout(function(){
            times.innerHTML = "辨識中";
        },10000+count*12000);
        setTimeout(function(){
            
            times.innerHTML = "辨識中";
        },11000+count*12000);
        setTimeout(function(){
            
            
            
            times.innerHTML = "8";
            startRec();
        },12000+count*12000);
        count+=1;

    }
    setTimeout(function(){
        playRec();
    },12000+count*12000);
    



}
function stop(){
    let endTid = setTimeout(function () {});
    for (let i = 0; i <= endTid; i++) {
        clearTimeout(i)
    }

    times.innerHTML = "8";
    assembling_num = 1;
    assembling_name =0;
    open_cooperation_switch = false;
    cooperation_switch = false;
    number_check = true;
    number_upload = false;
    open_db = false;
    elementinput.style.display = '';
    elementdatabase.style.display = 'none';
}

document.getElementById("myBtnStart").addEventListener("click", start_before);
document.getElementById("myBtnPlay").addEventListener("click", stop);