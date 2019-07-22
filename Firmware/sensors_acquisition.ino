#include <ArduinoJson.h>
const size_t capacity = JSON_OBJECT_SIZE(3);
DynamicJsonDocument doc(capacity);

void setup() {
 //Initialize serial and wait for port to open:
  Serial.begin(9600); 
  delay(1000);

}

void loop() {

doc["temperature"] = random(12,10000);
doc["capacitante"] = random(12,10000);
doc["hummidity"] = random(12,10000);

serializeJson(doc, Serial);
//Println is important becouse of the parser in Electron app
Serial.println();

}
