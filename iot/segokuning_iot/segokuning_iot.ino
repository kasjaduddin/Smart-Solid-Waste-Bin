#include "DHT.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include "soc/rtc.h"
// #include "HX711.h"
#include <WiFi.h> 
#include <PubSubClient.h>
#include <Wire.h>
#include <EasyUltrasonic.h>

#define DHTPIN 33
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
StaticJsonDocument<100> sensor_Doc;
char buffer[100];

const char* ssid = "uddin";
const char* password = "12345678";
const char* mqtt_server = "192.168.34.81";

WiFiClient espClient;
PubSubClient client(espClient);

//ultrasonic
const int trigPin = 26;
const int echoPin = 27;

// const int LOADCELL_DOUT_PIN = 26;
// const int LOADCELL_SCK_PIN = 25;
// long weight;
// HX711 scale;
EasyUltrasonic ultrasonic; // Create the ultrasonic object

void setup() {
  Serial.begin(115200);
  Serial.println("Start");
  dht.begin();
  setup_wifi();
  client.setServer(mqtt_server, 1883);

  ultrasonic.attach(trigPin, echoPin); // Attaches the ultrasonic sensor on the specified pins on the ultrasonic object

  // rtc_cpu_freq_config_t config;
  // rtc_clk_cpu_freq_get_config(&config);
  // rtc_clk_cpu_freq_to_config(RTC_CPU_FREQ_80M, &config);
  // rtc_clk_cpu_freq_set_config_fast(&config);

  // scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  // scale.set_scale(-471.497);                      // this value is obtained by calibrating the scale with known weights; see the README for details
  //scale.tare();               // reset the scale to 0
  
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

  //ULTRASONIC
  float distanceCM = ultrasonic.getPreciseDistanceCM(t, h); // Read the distance in centimeters

  if (isnan(h) && isnan(t) && isnan(distanceCM)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  
  

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print("Distance (cm): ");
  Serial.println(distanceCM);

  // LOAD CELL
  // Serial.print(" Weight: ");
  // Serial.println("podnso");
  //  weight = scale.get_units(10);

  // Serial.println("pds");
  // Serial.println(weight);

  // scale.power_down();             // put the ADC in sleep mode
  // delay(2000);
  // scale.power_up();
  // Serial.println("p");

  //MQTT
  sensor_Doc["Temperature"] = t;
  sensor_Doc["Humidity"] = h;
  sensor_Doc["Distance"] = distanceCM;
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

  // char weightString[8];
  // dtostrf(weight, 1, 2, weightString);
  // client.publish("segokuningteam/weight", weightString);
}
