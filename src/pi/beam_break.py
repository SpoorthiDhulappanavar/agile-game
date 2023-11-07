
from flask import Flask
from flask_socketio import SocketIO, emit
import RPi.GPIO as GPIO
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

GPIO.setmode(GPIO.BCM)
beamBreakerPin = 17
GPIO.setup(beamBreakerPin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def beam_breaker():
    while True:
        data = str(GPIO.input(beamBreakerPin))
        socketio.emit('beam_break', data)
        socketio.sleep(0.01)

@socketio.on('connect')
def handle_connect():
    socketio.start_background_task(beam_breaker)

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=5001)
