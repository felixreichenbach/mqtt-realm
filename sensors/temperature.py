# https://pypi.org/project/paho-mqtt/#connect-reconnect-disconnect

import paho.mqtt.publish as publish
import time

while True:
    publish.single("presence", "Temperature: 21C", hostname="mqtt")
    time.sleep(10)