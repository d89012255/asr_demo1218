import './engine/mp3-engine.js'
import './engine/wav.js'
import './engine/mp3.js'
import './jquery-3.6.0.min.js'
import 'https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js'

const times = document.getElementById("times");
times.innerHTML = "8";
let name_of_assembling = ['滑軌X軸', '滑軌Y軸','滑軌Z軸','主軸1','主軸2','主軸3'];
let assembling_num = 1;
let assembling_name =0;
let assembling_now = name_of_assembling[assembling_name]+assembling_num;
let Myelement = document.getElementById(assembling_now);
Myelement.focus();

//取出label文字(滑軌X軸長度)
//console.log(Myelement.innerText.replace(/：/g, ''));

var rec,wave,recBlob;



var cooperation_switch = false;
var number_check = true;
var number_upload = false;
var open_db = false;

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
function playRec(){ 
    //停止錄音，得到了錄音文件blob二進位對象，想幹嘛就幹嘛 
    
    rec.stop(function(blob,duration){ 
        recBlob=blob;
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
                    else if(cooperation_switch){
                        if(number_check){
                            if(out=="確定"){
                                if(number_upload==true){
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
                                    open_db = false;
                                }
                                Myelement.focus();
                            }
                            //控制協作系統開關
                            else if(out=="鎖定"){
                                cooperation_switch = false;
                            }
                            else if(out=="暫存"){
                                cooperation_switch = true;
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