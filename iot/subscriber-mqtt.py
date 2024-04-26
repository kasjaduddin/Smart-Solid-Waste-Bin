import time
import paho.mqtt.client as paho

def on_message(client,userdata,message):
    print("topik", message.topic)
    print("data", str(message.payload.decode("utf-8")))

Broker = "192.168.135.217"
client = paho.Client("langganan teststr")  
client.connect(Broker)
client.loop_start()
client.subscribe("komdat/data")
client.on_message=on_message

time.sleep(30)
