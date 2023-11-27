import './recorder.mp3.min.js'
import './jquery-3.6.0.min.js'
import 'https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js'


const times = document.getElementById("times");
times.innerHTML = "8";



var rec;


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
function startRec(){ 
    rec=Recorder();
    //使用默認配置，mp3格式 
    //打開麥克風授權獲得相關資源 
    rec.open(function()
    { //開始錄音 
        rec.start(); 
    },function(msg,isUserNotAllow){ 
        //用戶拒絕了權限或瀏覽器不支持 
        alert((isUserNotAllow?"用戶拒絕了權限，":"")+"無法錄音:"+msg); }); 
}; 

function playRec(){ 
    //停止錄音，得到了錄音文件blob二進位對象，想幹嘛就幹嘛 
    rec.stop(function(blob,duration){        
        

        console.log(blob);
      
        // a.click(); 
        var fileReader = new FileReader();
        fileReader.readAsText(blob);
        console.log(fileReader);
       
        fileReader.onload = function() {          
            var indexBase64 =  fileReader.result;
            console.log(indexBase64);
            console.log(fileReader);
            
            console.log("UUUUUUUUUUUU");

            var start_time = new Date().getTime();
            fetch(`./server2.php`, {method:"POST", body:blob})
            .then(response => {
                if (response.ok) return response;
                else throw Error(`Server returned ${response.status}: ${response.statusText}`)
            })
            .then(response => {
                console.log(response.text());
                var out = getCookie("test4");
                console.log(out);
                if(out!=""){
                    var result = document.getElementById("result");
                    out = JSON.parse(out);
                    console.log(out);

                              

                    result.innerHTML = out;
                   
                    if(out=="確定" ){
                        control_on = 0;
                   
                        clean_all_command();
                        confirm.style.color = 'blue';
                        let give_out = [name_of_machine[name_num]];
                        for(var i=1;i<3;i++){
                            console.log(name_of_machine[name_num]+i);
                            var temp = document.getElementById(name_of_machine[name_num]+i);
                            give_out.push(temp.value);
                            console.log(temp.value);
                        }
                        Myelement.focus();
                        console.log(give_out)
                        $.post("./insert.php", {
                            name:give_out[0],
                            variable1:give_out[1],
                            variable2:give_out[2]
                        }, function(data) {
                            if (data != "") {
                                //alert('We sent Jquery string to PHP : ' + data);
                            }
                        });
                        for(var i=1;i<3;i++){
                            console.log(name_of_machine[name_num]+i);
                            var temp = document.getElementById(name_of_machine[name_num]+i);
                            temp.value="";
                        }
                        machine_num=1;

                        machine_now = name_of_machine[name_num]+machine_num;
                        console.log(machine_now);
                        Myelement = document.getElementById(machine_now);
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
            times.innerHTML = "7";
        },1000+count*12000);
        setTimeout(function(){
            times.innerHTML = "6";
        },2000+count*12000);
        setTimeout(function(){
            times.innerHTML = "5";
        },3000+count*12000);
        setTimeout(function(){
            times.innerHTML = "4";
        },4000+count*12000);
        setTimeout(function(){
            times.innerHTML = "3";
        },5000+count*12000);
        setTimeout(function(){
            times.innerHTML = "2";
        },6000+count*12000);
        setTimeout(function(){
            times.innerHTML = "1";
        },7000+count*12000);
        setTimeout(function(){
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
    
}

document.getElementById("myBtnStart").addEventListener("click", start_before);
document.getElementById("myBtnPlay").addEventListener("click", stop);