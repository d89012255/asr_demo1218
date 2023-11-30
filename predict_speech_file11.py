#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright 2016-2099 Ailemon.net
#
# This file is part of ASRT Speech Recognition Tool.
#
# ASRT is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# ASRT is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with ASRT.  If not, see <https://www.gnu.org/licenses/>.
# ============================================================================


#predict_speech_file10(with_socket_mp3).py
"""
@author: nl8590687000
用于通过ASRT语音识别系统预测一次语音文件的程序
"""

import os

from speech_model import ModelSpeech
from speech_model_zoo import SpeechModel251BN
from speech_features import Spectrogram
from scipy.io import wavfile
import scipy.signal as sps
import os
# -*- coding: utf-8 -*-
import socket
import wave
import numpy as np
from scipy.io import wavfile

import time
import datetime
import numpy as np
from pydub import AudioSegment
import subprocess
from pydub import AudioSegment
from pydub.silence import split_on_silence
import shutil
import pydub
pydub.AudioSegment.converter = r"C:\PATH_Programs\bin\ffmpeg.exe"  # set path of ffmpeg.exe

def convert_to_db(audio_segment):
    # 将音频转换为dB值
    rms = audio_segment.rms
    db = 20 * np.log10(rms / (2 ** 16))
    return db

def limit_audio_below_threshold(audio_segment, threshold_db):
    # 计算将低于指定dB阈值的部分设置为0所需的增益
    db = convert_to_db(audio_segment)
    gain_needed = threshold_db - db

    # 将增益应用于音频段
    audio_segment.apply_gain(gain_needed)




def add_silence_to_wav_file(input_file, output_file, silence_duration_sec):
    try:
        # 讀取WAV檔案
        wav = wave.open(input_file, 'rb')
        sample_width = wav.getsampwidth()
        framerate = wav.getframerate()
        num_frames = wav.getnframes()

        # 讀取音訊資料
        audio_data = np.frombuffer(wav.readframes(num_frames), dtype=np.int16)

        # 產生空白音訊資料
        silence_duration_frames = int(silence_duration_sec * framerate)
        silence_data = np.zeros(silence_duration_frames, dtype=np.int16)

        # 將空白音訊資料加到音訊的前後
        new_audio_data = np.concatenate((silence_data, audio_data, silence_data))

        # 建立新的WAV檔案
        with wave.open(output_file, 'wb') as output_wav:
            output_wav.setparams((wav.getnchannels(), sample_width, framerate, len(new_audio_data), wav.getcomptype(), wav.getcompname()))
            output_wav.writeframes(new_audio_data.tobytes())

        # 關閉原始WAV檔案
        wav.close()
    except:
        pass
HOST = "127.0.0.1"
#HOST = "172.20.10.3"
PORT = 4000
def post_process_positive_negative(input):
    negative = ["u"]
    positive = ["ng"]      




    mix = [positive,negative]
    table= ["正","負"]

    all = ""



    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in input):
                input = input[input.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"
def post_process_number(input):

    negative = ["u"]
    positive = ["e","iu"]   
    mix2 = [positive,negative]
    table2= ["+","-"]
    result = ""
    for i in range(1):        
        all = list()                                # numbers from 0 to 9     
        sound = AudioSegment.from_wav(f'temp2.wav')
        #get 分貝數
        dBFS = sound.dBFS
        print(dBFS)
        chunks = split_on_silence(sound, 
                min_silence_len = 100,                         # minimum length of silence:250 ms 
                silence_thresh = -30,                      # threshhold to divide voice and silence
                keep_silence = 100                             # time left before and after each voice cut:1000 ms(留下靜音)
            )
        path = './number_temp'
        if not os.path.isdir(path):
            os.mkdir(path)
        else:
            shutil.rmtree(path)
            os.mkdir(path)
    
        for j, chunk in enumerate(chunks):
            chunk.export(f'./number_temp/{i}_temp_{j}.wav',bitrate = "160k",format = "wav")
            # 指定輸入和輸出檔案名稱以及要加入的空白音訊長度（秒）
            input_file = f'./number_temp/{i}_temp_{j}.wav'
            output_file = f'./number_temp/{i}_temp_{j}.wav'
            silence_duration_sec = 1
            # 執行函式
            add_silence_to_wav_file(input_file, output_file, silence_duration_sec)
            res = ms.recognize_speech_from_file(input_file)
            print(res)
            if('dian3' in res):
                all.append('dian3')
            else:
                all.append(res[0])
            if(j==0):
                for i in range(len(res)):
                    for x in range(len(mix2)):
                        w = 0
                        for b in range(len(mix2[x])):                 
                            if(mix2[x][b] in all[0]):
                                print("HERE")                                
                                result+=table2[x]
                                w=1
                                break
                                    
                        if(w==1):
                            break
                    if(w==1):
                            break
                all = list()
        print(result)
        print(all)
        dot = ["ian"]
        zero = ["in"]
        one = ["yi"]
        two = ["e"]
        three = ["an"]
        four = ["s","i"]
        five = ["w","u"]
        six = ["l","iu"]
        seven = ["i"]
        eight = ["a"]
        nine = ["iu"]

   
        
        




        mix = [dot,zero,one,two,three,four,five,six,eight,nine,seven]
        table= [".","0","1","2","3","4","5","6","8","9","7",]

        for i in range(len(all)):
            for x in range(len(mix)):
                w = 0
                for b in range(len(mix[x])):
                    
                    if(mix[x][b] in all[i]):
                        if(b==len(mix[x])-1):
                            result+=table[x]
                            w=1
                            
                        else:
                            continue
                    else:
                        break
                if(w==1):
                    break
                    
        if(result==""):
            return "無法辨識"
        else:
            return result


def post_process_1(input):  

    
    no = ["o"]   
    yes = ["i"]  




    mix = [no,yes]
    table= ["否","是"]

    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all

    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"

def post_process_2(input):
    cancel = ["u","iao"]
    delete = ["in","u"]
    lock = ["uo","i"]

    upload = ["an","ua"]    
    
    save = ["an","un"]
    sure = ["ue","i"]   
   
    record = ["i","l","u"]
    mix = [upload,save,delete,record, cancel,lock,sure,]
    table= ["上傳","暫存","清除","紀錄","取消","鎖定","確定"]
    all = ""

    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all
    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"
def post_process_3_up_down(input):  

    
    up = ["an"]   
    down = ["ia"]  




    mix = [up,down]
    table= ["上","下"]

    all = ""



    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in input):
                input = input[input.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"
def post_prrocess_3_normal(input):
    last_dot = ["ang","ia"]
    next_dot = ["ia","ia"]
    last_page = ["ang","e"]
    last_team = ["ang","u"]
    last_record = ["ang","i"]    

    next_page = ["ia","e"]
    next_team = ["ia","u"]
    next_record = ["ia","i"]    

    mix = [
    last_dot,next_dot,last_page,last_team,last_record,next_page,next_team,next_record]
    table= ["上一點","下一點","上一頁","上一組",
    "上一筆","下一頁","下一組","下一筆"]
    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all
    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"
def post_process_3(input):
    second_record = ["i","e","i"]
    third_record = ["i","an","i"]
    forth_record = ["i","s","i","i"]
    fifth_record = ["i","w","u","i"]
    sixth_record = ["i","l","iu","i"]
    seventh_record = ["i","i","i"]
    eighth_record = ["i","a","i"]
    ninth_record = ["i","iu","i"]  



 

    first_record = ["i","yi","i"]
    mix = [second_record,third_record,forth_record,fifth_record,sixth_record, ninth_record,first_record,seventh_record,eighth_record]
    table= ["第二筆","第三筆","第四筆","第五筆","第六筆","第九筆","第一筆","第七筆","第八筆"]
    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all
    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"

def post_process_4(input):
    second_team = ["i","e","u"]
    third_team = ["i","an","u"]
    forth_team = ["i","s","i","u"]
    fifth_team = ["i","w","u","u"]
    sixth_team = ["i","l","iu","u"]




 
    first_team = ["i","yi","u"]

    mix = [second_team,third_team,forth_team,fifth_team,sixth_team,first_team]
    table= ["第二組","第三組","第四組","第五組","第六組","第一組"]
    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all
    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"

def post_process_5(input):
    second_dot = ["i","e","ian"]
    third_dot = ["i","an","ian"]
    forth_dot = ["i","s","i","ian"]
    fifth_dot = ["i","w","u","ian"]
    sixth_dot = ["i","l","iu","ian"]




 


    mix = [second_dot,third_dot,forth_dot,fifth_dot,sixth_dot]
    table= ["第二點","第三點","第四點","第五點","第六點"]
    all = ""
    for i in range(len(input)):
        all+=(input[i][:-1]+" ")
    temp_for_check = all
    for i in range(len(mix)):
        temp_for_check = all
        for b in range(len(mix[i])):
            
            if(mix[i][b] in temp_for_check):
                temp_for_check = temp_for_check[temp_for_check.find(mix[i][b])+len(mix[i][b]):]
                
                if(b==len(mix[i])-1):
                    return str(table[i])
            else:
                break
            continue
    return "無法辨識"


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen(10)


os.environ["CUDA_VISIBLE_DEVICES"] = "0"

AUDIO_LENGTH = 1600
AUDIO_FEATURE_LENGTH = 200
CHANNELS = 1
# 默认输出的拼音的表示大小是1428，即1427个拼音+1个空白块
OUTPUT_SIZE = 1428
sm251bn = SpeechModel251BN(
    input_shape=(AUDIO_LENGTH, AUDIO_FEATURE_LENGTH, CHANNELS),
    output_size=OUTPUT_SIZE
)
feat = Spectrogram()
ms = ModelSpeech(sm251bn, feat, max_label_length=64)
#qq = 'save_models/' + sm251bn.get_model_name() + '.model.base.h5'
qq = 'save_models/20231103/SpeechModel251bn_epoch47.model.h5'
print(qq)
ms.load_model(qq)
while True:
    conn, addr = server.accept()
    ss = []
    clientMessage = conn.recv(4194304)
    if(os.path.exists("temp2.wav")):        
        os.remove("temp2.wav")
    f = open("temp2.wav", "wb")
    f.write(clientMessage)
    f.close()


    t= time.time()  

    conn.send(str(round(t * 1000000)).encode())
    # 指定輸入和輸出檔案名稱以及要加入的空白音訊長度（秒）
    input_file = 'temp2.wav'
    output_file = 'temp2.wav'
    silence_duration_sec = 1

    # 執行函式
    add_silence_to_wav_file(input_file, output_file, silence_duration_sec)

    res = ms.recognize_speech_from_file('temp2.wav')

    #print('*[提示] 声学模型语音识别结果：\n', res)
    print("後處理前：")
    print(res)
    print("後處理後")
    if(res==[]):
        res = "空白音黨"
        print(res)
        conn.sendall(res.encode())
        conn.close()
        continue
    if(len(res)==1):
        res = post_process_1(res)
    elif(post_process_positive_negative(res[0])!="無法辨識" and len(res)>3 ):
        #res = post_process_positive_negative(res[0])+post_process_number(res[1:])
        res = post_process_number(ms)

    elif(len(res)==2):
        ans = res
        res = post_process_2(res)
        print(res)
        if(res=="無法辨識"):
            res = post_prrocess_3_normal(ans)
        
    elif(post_process_3_up_down(res[0])!="無法辨識"):        
        res = post_prrocess_3_normal(res)
    else:
        res1 = post_process_3(res)
        res2 = post_process_4(res)
        res3 = post_process_5(res)
        if(res3 != "無法辨識"):
            res = res3
        elif(res1 != "無法辨識"):
            res = res1
        else:
            res = res2
    print(res)
    conn.sendall(res.encode())
    conn.close()

    

