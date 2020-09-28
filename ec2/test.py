import threading

def timer():

    print('timer start')

mytimer = threading.Timer(10.0, timer)
mytimer.start()