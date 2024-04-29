import paho.mqtt.client as paho
import sys

data = ""

def onMessage(client, userdata, msg):
    data = msg.payload.decode()
    print(data)

client = paho.Client("segokuning")
client.on_message = onMessage

if client.connect("localhost", 1883, 60) != 0:
    print("Could not connect to MQTT Broker!")
    sys.exit(-1)
else:
    print("Connected")
    
client.subscribe("sensor/data")

try:
    client.loop_forever()
except:
    print("Disconnection from broker")