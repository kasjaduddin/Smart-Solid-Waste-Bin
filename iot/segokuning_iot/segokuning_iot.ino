#include "DHT.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include "soc/rtc.h"
#include <WiFi.h> 
#include <PubSubClient.h>
#include <Wire.h>
#include <EasyUltrasonic.h>
#include <HX711_ADC.h>

// define dht
#define DHTPIN 33
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// define hx711
#if defined(ESP8266)|| defined(ESP32) || defined(AVR)
#include <EEPROM.h>
#endif
const int HX711_dout = 32; //mcu > HX711 dout pin
const int HX711_sck = 25; //mcu > HX711 sck pin
HX711_ADC LoadCell(HX711_dout, HX711_sck);
const int calVal_eepromAdress = 0;
unsigned long t = 0;


// json
StaticJsonDocument<100> sensor_Doc;
char buffer[100];

// wifi & mqtt
const char* ssid = "BAHAGIA 2,4G";
const char* password = "kayaberkah21";
const char* mqtt_server = "broker.hivemq.com";
WiFiClient espClient;
PubSubClient client(espClient);

//ultrasonic
const int trigPin = 26;
const int echoPin = 27;
EasyUltrasonic ultrasonic; // Create the ultrasonic object

void setup() {
  Serial.begin(115200);
  Serial.println("Start");

  setup_wifi();
  client.setServer(mqtt_server, 1883);

  ultrasonic.attach(trigPin, echoPin); // Attaches the ultrasonic sensor on the specified pins on the ultrasonic object
  dht.begin();

  LoadCell.begin();
  LoadCell.setReverseOutput(); //uncomment to turn a negative output value to positive
  float calibrationValue; // calibration value (see example file "Calibration.ino")
  // calibrationValue = 696.0; // uncomment this if you want to set the calibration value in the sketch
#if defined(ESP8266)|| defined(ESP32)
  EEPROM.begin(512); // uncomment this if you use ESP8266/ESP32 and want to fetch the calibration value from eeprom
#endif
  EEPROM.get(calVal_eepromAdress, calibrationValue); // uncomment this if you want to fetch the calibration value from eeprom

  unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true; //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag()) {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1);
  }
  else {
    LoadCell.setCalFactor(calibrationValue); // set calibration value (float)
    Serial.println("Startup is complete");
  }
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("esp32")) {
      Serial.println("connected");
      // Subscribe
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  delay(2000); 

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  //DHT
  float h = dht.readHumidity();  //humidity
  float t = dht.readTemperature(); // temp

  // LOAD CELL
  static boolean newDataReady = 0;
  if (LoadCell.update()) newDataReady = true;
  float i;
  if (newDataReady) {
    i = LoadCell.getData();
    newDataReady = 0;
  }

  //ULTRASONIC
  float distanceCM = ultrasonic.getPreciseDistanceCM(t, h); // Read the distance in centimeters

  if (isnan(h) || isnan(t) || isnan(distanceCM) || isnan(i)){
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }


  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print("Distance (cm): ");
  Serial.print(distanceCM);
  Serial.print(" Weight (g): ");
  Serial.println(i);


  //MQTT

  sensor_Doc["Temperature"] = t;
  sensor_Doc["Humidity"] = h;
  sensor_Doc["Distance"] = distanceCM;
  sensor_Doc["Weight"] = i;
  serializeJson(sensor_Doc, buffer);
  client.publish("sensor/data", buffer);
  
  char tempString[8];
  dtostrf(t, 1, 2, tempString);
  client.publish("segokuningteam/temp", tempString);

  char humString[8];
  dtostrf(h, 1, 2, humString);
  client.publish("segokuningteam/humidity", humString);

  char distanceString[8];
  dtostrf(distanceCM, 1, 2, distanceString);
  client.publish("segokuningteam/distance", distanceString);

  char weightString[8];
  dtostrf(i, 1, 2, weightString);
  client.publish("segokuningteam/weight", weightString);
}
