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

def check(res):
    k = ["li","yi","er","sa","si","wu","lu","qi","ba","ju","di","bi","xi","sha"]
    k2 = ["ling2","yi1","er4","san1","si4","wu3","liu4","qi1","ba1","jiu3","di4","bi3","xia4","shang4"]
    for i in k:
        for s in range(len(i)):
            if(i[s] in res):
                if(s == len(i)-1):
                    return str(k2[k.index(i)])
            else:
                
                break
    return str(res)


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
    print("後處理前：")
    print(res)
    for i in range(len(res)):
        res[i] = check(res[i])
    
    
    ml = ModelLanguage('model_language')
    ml.load_model()
    str_pinyin = res
    res = ml.pinyin_to_text(str_pinyin)
    print("後處理後：")
    print(res)

    # serverMessage = 'I\'m here!'
    conn.sendall(res.encode())
    conn.close()
    

