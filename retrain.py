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
from data_loader import DataLoader
from tensorflow.keras.optimizers import Adam
# -*- coding: utf-8 -*-






os.environ["CUDA_VISIBLE_DEVICES"] = "0"

AUDIO_LENGTH = 1600
AUDIO_FEATURE_LENGTH = 200
CHANNELS = 1
# 默认输出的拼音的表示大小是1428，即1427个拼音+1个空白块
OUTPUT_SIZE = 1428
train_data = DataLoader('train')
opt = Adam(lr = 0.0001, beta_1 = 0.9, beta_2 = 0.999, decay = 0.0, epsilon = 10e-8)
sm251bn = SpeechModel251BN(
    input_shape=(AUDIO_LENGTH, AUDIO_FEATURE_LENGTH, CHANNELS),
    output_size=OUTPUT_SIZE
    )
feat = Spectrogram()
ms = ModelSpeech(sm251bn, feat, max_label_length=1)
qq = 'save_models/' + sm251bn.get_model_name() + '.model.base.h5'
print(qq)
ms.load_model('save_models/' + sm251bn.get_model_name() + '.model.h5')

ms.train_model(optimizer=opt, data_loader=train_data,
    epochs=50, save_step=1, batch_size=16, last_epoch=0)
ms.save_model('save_models/' + sm251bn.get_model_name())



    

