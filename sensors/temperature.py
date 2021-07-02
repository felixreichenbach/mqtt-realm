# https://pypi.org/project/paho-mqtt/#connect-reconnect-disconnect

import paho.mqtt.publish as publish
import time
from sense_hat import SenseHat

sense = SenseHat()
sense.clear()

while True:
    temp = sense.get_temperature()
    publish.single("presence", "Temperature: "+temp, hostname="mqtt")
    time.sleep(10)
