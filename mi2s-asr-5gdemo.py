import json
import socket
import struct
import sys
import codecs

sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())

def askForService(token:str, port:int, data:bytes) -> dict:
    '''
    DO NOT MODIFY THIS PART!
    '''
    HOST = "140.116.245.157"
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.connect((HOST, port))
        msg_dict = {"token": token, "source": "P", "data_len": len(data)}
        msg = json.dumps(msg_dict).encode('utf-8')
        msg = struct.pack(">I", len(msg)) + msg  # add msg len
        sock.sendall(msg)  # send message to server
        sock.sendall(data)  # send audio data to server

        # receive result
        received_all = ''
        while 1:
            received = str(sock.recv(1024), "utf-8")
            if len(received) == 0:
                sock.close()
                break
            received_all += received
    finally:
        sock.close()

    # json expecting property name enclosed in double quotes
    return json.loads(received_all.replace("'", '"'))


def recognize_request(file_pth: str):
    '''
    Mi2S ASR API
    '''
    token = "5gdemo" 
    port = 2810
    audio = open(file_pth, 'rb').read()  # read wav in binary
    result = askForService(token, port, audio)
    # print(result['rec_result'])
    print(result)
    return result['rec_result']


if __name__ == "__main__":
    result = recognize_request("temp.wav")
    print(result)