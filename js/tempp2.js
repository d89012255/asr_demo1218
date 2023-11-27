import './recorder.mp3.min.js'
import './jquery-3.6.0.min.js'
import 'https://cdn.jsdelivr.net/npm/js-base64@3.7.2/base64.min.js'

let name_of_machine = ['旋轉軸', '機械手臂','切削機','工具機','臥式洗床','刀具磨床','車床','磨床','線切割','雷雕機'];
let machine_num = 1;
let name_num=0;
let control_on = 0;
let color_in = document.getElementById(name_of_machine[name_num]);
const right_now = document.getElementById("right_now");
const times = document.getElementById("times");
times.innerHTML = "8";
right_now.innerText = "按下開始";
let machine_now = name_of_machine[name_num]+machine_num;
let Myelement = document.getElementById(machine_now);
Myelement.focus();
color_in.style.color = 'blue';

const yes = document.getElementById("是");
const no = document.getElementById("否");
const confirm =document.getElementById("確定");
const cancel = document.getElementById("取消");
const last_group = document.getElementById("上一組");
const next_group = document.getElementById("下一組");
const first_group = document.getElementById("第一組");
const last_one = document.getElementById("上一筆");
const next_one = document.getElementById("下一筆");
const first_one = document.getElementById("第一筆");
const store = document.getElementById("暫存");
const upload = document.getElementById("上傳");
const lock = document.getElementById("鎖定");
const last_dot = document.getElementById("上一點");
const next_dot = document.getElementById("下一點");
const record = document.getElementById("紀錄");
const clean = document.getElementById("清除");
const last_page = document.getElementById("上一頁");
const next_page = document.getElementById("下一頁");
const positive = document.getElementById("正");
const negative = document.getElementById("負");

const initial_word = "透過語音指令輸入上一筆、下一筆、第一筆、上一組、下一組、第一組、數字";
const after_word = "透過語音指令輸入是、否";
const after_whole_one = "透過語音指令輸入確認、取消";

let decide_action = 3;

var rec;
function clean_all_command(){
    
    yes.style.color = '#000000';
    no.style.color = '#000000';
    confirm.style.color = '#000000';
    cancel.style.color = '#000000';
    last_group.style.color = '#000000';
    next_group.style.color = '#000000';
    first_group.style.color = '#000000';
    last_one.style.color = '#000000';
    next_one.style.color = '#000000';
    first_one.style.color = '#000000';
    store.style.color = '#000000';
    upload.style.color = '#000000';
    lock.style.color = '#000000';
    last_dot.style.color = '#000000';
    next_dot.style.color = '#000000';
    record.style.color = '#000000';
    clean.style.color = '#000000';
    last_page.style.color = '#000000';
    next_page.style.color = '#000000';
    positive.style.color = '#000000';
    negative.style.color = '#000000';
} 

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
    if(decide_action==1){
        right_now.innerText="開始辨識";
    }
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


        console.log("JIJJIHJUHUISHIUHSIHSUI");

       
        fileReader.onload = function() {
            if(decide_action==1){
                right_now.innerText="確認辨識中";
            }
          
            var indexBase64 =  fileReader.result;
            console.log(indexBase64);
            console.log(fileReader);
            
            console.log("UUUUUUUUUUUU");
            //console.log(indexBinary.length);
            // $.post('./client22.php',{text:indexBase64,address:contentIn,filename:fileName,long:longg,type:typee},function(data){
            //     $('#result').html(data);
            //     console.log(data);
            // });
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
                    
                    //console.log(Myelement.value);
                    
                    //console.log(Myelement.value);
                    console.log(out);
                    console.log(typeof(out));
                    //$('#result').html(out);
                    out = JSON.parse(out);
                    console.log(out);
                    //Myelement.value = out;
                    //color_in.style.color = 'blue'
                    console.log(name_of_machine);
                    console.log(name_num);
                    console.log(name_of_machine[name_num]);
                    result.value = out;
                    // if(out=="紀錄" && control_on!=1){
                    //     //console.log("I am HER");
                        
                    //     clean_all_command();
                    //     next_one.style.color = 'blue';
                    //     color_in = document.getElementById(name_of_machine[name_num]);
                    //     color_in.style.color = '#000000';
                    //     name_num+=1;
                    //     if(name_num==10){
                    //         name_num = 0;
                    //     }
                    //     color_in = document.getElementById(name_of_machine[name_num]);
                    //     color_in.style.color = 'blue';
                    //     machine_num = 1;
                    //     machine_now = name_of_machine[name_num]+machine_num;
                    //     Myelement = document.getElementById(machine_now);
                    //     Myelement.focus();
                    // }

                    if(out=="下一筆" && control_on!=1){
                        //console.log("I am HER");
                        
                        clean_all_command();
                        next_one.style.color = 'blue';
                        color_in = document.getElementById(name_of_machine[name_num]);
                        color_in.style.color = '#000000';
                        name_num+=1;
                        if(name_num==10){
                            name_num = 0;
                        }
                        color_in = document.getElementById(name_of_machine[name_num]);
                        color_in.style.color = 'blue';
                        machine_num = 1;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="上一筆" && control_on!=1){
                       
                        clean_all_command();
                        last_one.style.color = 'blue';
                        color_in = document.getElementById(name_of_machine[name_num]);
                        color_in.style.color = '#000000';
                        name_num-=1;
                        if(name_num<0){
                            name_num = 9;
                        }
                        color_in = document.getElementById(name_of_machine[name_num]);
                        color_in.style.color = 'blue';
                        machine_num =1;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="下一組" && control_on!=1){
                       
                        clean_all_command();
                        next_group.style.color = 'blue';
                        machine_num+=1;
                        if(machine_num>2)
                            machine_num=1;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="上一組" && control_on!=1){
                        
                        clean_all_command();
                        last_group.style.color = 'blue';
                        machine_num-=1;
                        if(machine_num<1)
                            machine_num=2;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="第一組" && control_on!=1){
                       
                        clean_all_command();
                        first_group.style.color = 'blue';
                        machine_num=1;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="第一筆" && control_on!=1){
                     
                        clean_all_command();
                        first_one.style.color = 'blue';
                        color_in.style.color = '#000000';
                        name_num=0;
                        color_in = document.getElementById(name_of_machine[name_num]);
                        color_in.style.color = 'blue';
                        machine_num = 1;
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="確定" && control_on!=1){
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
                    else if(out=="是" && control_on!=0){
                        control_on=0;
                        clean_all_command();
                        yes.style.color = 'blue';
                        machine_num+=1;
            
                        if(machine_num>2){
                            machine_num=2;
                          
                        }
                        machine_now = name_of_machine[name_num]+machine_num;
                        Myelement = document.getElementById(machine_now);
                        Myelement.focus();
                    }
                    else if(out=="否" && control_on!=0){
                        control_on=0;
                    
                        clean_all_command();
                        no.style.color = 'blue';
                        Myelement.value="";
                        Myelement.focus();
                    }
                    else if(out=="取消" && control_on!=1){
                     
                        clean_all_command();
                        cancel.style.color = 'blue';
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
                    else if(out=="暫存" && control_on!=1){
                        clean_all_command();
                        store.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="上傳" && control_on!=1){
                        clean_all_command();
                        upload.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="鎖定" && control_on!=1){
                        clean_all_command();
                        lock.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="上一點" && control_on!=1){
                        clean_all_command();
                        last_dot.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="下一點" && control_on!=1){
                        clean_all_command();
                        next_dot.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="紀錄" && control_on!=1){
                        clean_all_command();
                        record.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="清除" && control_on!=1){
                        clean_all_command();
                        clean.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="上一頁" && control_on!=1){
                        clean_all_command();
                        last_page.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="下一頁" && control_on!=1){
                        clean_all_command();
                        next_page.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="正" && control_on!=1){
                        clean_all_command();
                        positive.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="負" && control_on!=1){
                        clean_all_command();
                        negative.style.color = 'blue';
                        Myelement.focus();
                    }
                    else if(out=="無法辨識"){
                        clean_all_command();
                        Myelement.focus();
                    }
                    else if(out=="空白音檔"){
                        clean_all_command();
                        Myelement.focus();
                    }
                    else{
                        if(control_on!=1){
                            if(!isNaN(out) && out[0]!='-')
                                out = '+'+out;
                       
                            clean_all_command();
                            Myelement.value=out;
                            Myelement.focus();
                            control_on = 1;
                        }
                    }

                        
                    }
               
             
                //alert((end_time - start_time) / 1000 + "sec");


            
            })
            .catch(err => {
                //alert(err);
            });


            


            
            
        };
        

        

        },function(msg){ 
            alert("錄音失敗:"+msg); }); 
    };


function start_before(){
    control_on = 0;
    startRec();
    
    //     setTimeout(function(){
    //         
    //         right_now.innerText="關閉變識";
    //     },5000);

  
    // //setTimeout(function(){console.log(6)},6000);
    right_now.innerText="說出語音指令";
    // console.log("HHHHHHHHHHHH");
    // var d=new Date();
    // var stand = d.getSeconds();
    
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
// function start2(){
//     startRec();
//     right_now.innerText="說出 開始 則啟動辨識";
//     console.log("like you");
//     var d=new Date();
//     var stand = d.getSeconds();
//     while(1){
//         var d = new Date();
//         var now = d.getSeconds()
//         console.log(stand);
//         console.log(now);
//         if(Math.abs(stand-d.now)>=5){
//             stand = d.getSeconds();
//             playRec();
//             if(decide_action==0){
//                 break;
//             }
//             startRec();
//             console.log(Math.abs(stand-d.getSeconds()));
//         }

//     }

// }
function stop(){
    let endTid = setTimeout(function () {});
    for (let i = 0; i <= endTid; i++) {
        clearTimeout(i)
    }
    right_now.innerText = "按下開始";
    times.innerHTML = "8";
    
}

document.getElementById("myBtnStart").addEventListener("click", start_before);
document.getElementById("myBtnPlay").addEventListener("click", stop);