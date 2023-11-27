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

"""
@author: nl8590687
用于通过ASRT语音识别系统预测一次语音文件的程序
"""

import os

from speech_model import ModelSpeech
from speech_model_zoo import SpeechModel251BN
from speech_features import Spectrogram
from language_model3 import ModelLanguage
from scipy.io import wavfile
import scipy.signal as sps
import os
# -*- coding: utf-8 -*-
import socket
HOST = "127.0.0.1"
#HOST = "172.20.10.3"
PORT = 30103

def post_process(input): 
    
    second_record = ["i","e","i"]
    third_record = ["i","an","i"]
    forth_record = ["i","s","i","i"]
    fifth_record = ["i","w","u","i"]
    sixth_record = ["i","l","iu","i"]
    seventh_record = ["i","q","i"]
    eighth_record = ["i","b","a","i"]
    ninth_record = ["i","iu","i"]  

    last_dot = ["an","ia"]
    next_dot = ["ia","ia"]
    last_page = ["an","e"]
    last_team = ["an","u"]
    last_record = ["an","i"]    

    next_page = ["ia","e"]
    next_team = ["ia","u"]
    next_record = ["ia","i"]    
    first_team = ["i","yi","u"]
    first_record = ["i","yi","i"]

    cancel = ["u","iao"]
    delete = ["in","u"]
    lock = ["uo","in"]
    negative = ["u"]
    upload = ["an","ua"]
    no = ["ao"]
    dot = ["ian"]
    positive = ["ang"]
    save = ["an","un"]
    sure = ["ue","in"]
    yes = ["shi"]
    zero = ["in"]
    one = ["yi"]
    two = ["e"]
    three = ["an"]
    four = ["s","i"]
    five = ["w","o"]
    six = ["l","iu"]
    seven = ["i"]
    eight = ["b","a"]
    nine = ["iu"]
    record = ["i","l","u"]




    mix = [second_record,third_record,forth_record,fifth_record,sixth_record, ninth_record,seventh_record,eighth_record,upload,save,delete,record,
   last_dot,next_dot,last_page,last_team,last_record,next_page,next_team,next_record,first_team,first_record,cancel,lock,sure,
   no,dot,positive,yes,zero,one,two,three,four,five,six,eight,nine,seven,negative]
    table= ["第二筆","第三筆","第四筆","第五筆","第六筆","第九筆","第七筆","第八筆","上傳","暫存","清除","紀錄","上一點","下一點","上一頁","上一組",
    "上一筆","下一頁","下一組","下一筆","第一組","第一筆","取消","鎖定","確定","否","點","正","是","零","一","二","三","四","五","六","八","九","七","負"]

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
qq = 'save_models/' + sm251bn.get_model_name() + '.model.base.h5'
print(qq)
ms.load_model('save_models/' + sm251bn.get_model_name() + '.model.h5')
while True:
    conn, addr = server.accept()
    ss = []
    clientMessage = str(conn.recv(15120), encoding='utf-8')
  
    res = ms.recognize_speech_from_file('temp.wav')
    #print('*[提示] 声学模型语音识别结果：\n', res)
    print("後處理前：")
    print(res)
    print("後處理後")

    res = post_process(res)
    print(res)
    
    # ml = ModelLanguage('model_language')
    # ml.load_model()
    # str_pinyin = res
    # res = ml.pinyin_to_text(str_pinyin)
    # print('语音识别最终结果：\n',res)

    # serverMessage = 'I\'m here!'
    conn.sendall(res.encode())
    conn.close()
    

