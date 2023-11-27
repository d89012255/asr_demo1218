
import azure.cognitiveservices.speech as speechsdk
import os
import sys
import codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

def check_number(str):
    if ("正") in str:
        str = str.replace("正","+")
    elif("鄭") in str:
        str = str.replace('鄭','+')
    elif("整") in str:
        str = str.replace("整","+")
    elif("證") in str:
        str = str.replace("證","+")
    elif("漲") in str:
        str = str.replace("漲","+")
    elif("長") in str:
        str = str.replace("長","+")
    elif("乘") in str:
        str = str.replace("乘","+")
    if ("付") in str:
        str = str.replace("付","-")
    elif("副") in str:
        str = str.replace('副','-')
    elif("附") in str:
        str = str.replace("附","-")
    elif("負") in str:
        str = str.replace("負","-")
    elif("復") in str:
        str = str.replace("復","-")
    elif("富") in str:
        str = str.replace("富","-")
    
    if("比") in str:
        str = str.replace("比","筆")
    if("集") in str:
        str = str.replace("集","筆")
    if("喔") in str:
        str = str.replace("喔","否")
    if("善") in str:
        str = str.replace("善","暫")
    return str

    


def recognize_from_microphone():
    speech_config = speechsdk.SpeechConfig(subscription="3b343b1f5cc54eafb68841b09d286885", region="eastasia")
    speech_config.speech_recognition_language="zh-tw"
    
    audio_config = speechsdk.audio.AudioConfig(filename="temp.wav")
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    i=0
    list = []
    while i<1:
        speech_recognition_result = speech_recognizer.recognize_once_async().get()        
        if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
            result_re_format = speech_recognition_result.text[:-1]
            result_re_format = check_number(result_re_format)
            

            print("{}".format(result_re_format))
        elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
            print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
        elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
            cancellation_details = speech_recognition_result.cancellation_details
            print("Speech Recognition canceled: {}".format(cancellation_details.reason))
            if cancellation_details.reason == speechsdk.CancellationReason.Error:
                print("Error details: {}".format(cancellation_details.error_details))
                print("Did you set the speech resource key and region values?")
        i+=1
recognize_from_microphone()