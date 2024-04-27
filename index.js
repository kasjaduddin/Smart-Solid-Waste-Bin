//  /**
//      * this demo uses EMQX Public MQTT Broker (https://www.emqx.com/en/mqtt/public-mqtt5-broker), here are the details:
//      *
//      * Broker host: broker.emqx.io
//      * WebSocket port: 8083
//      * WebSocket over TLS/SSL port: 8084
//      */
//  const clientId = 'mqttjs_' + Math.random().toString(16).substring(2, 8)

//  /**
//   * choose which protocol to use for connection here
//   *
//   * /mqtt: MQTT-WebSocket uniformly uses /path as the connection path,
//   * which should be specified when connecting, and the path used on EMQX is /mqtt.
//   *
//   * for more details about "mqtt.connect" method & options,
//   * please refer to https://github.com/mqttjs/MQTT.js#mqttconnecturl-options
//   */
//  const connectUrl = 'ws://192.168.34.81:8083/mqtt'


//  const options = {
//    keepalive: 30,
//    clientId: clientId,
//    clean: true,
//    connectTimeout: 5000,
//    username: 'uddin',
//    password: '12345678',
//    reconnectPeriod: 1000,
//  }
//  const topic = 'sensor/data'
//  const payload = 'WebSocket mqtt test'
//  const qos = 2;

//  console.log('connecting mqtt client')
//  const client = mqtt.connect(connectUrl, options)

//  client.on('error', (err) => {
//    console.log('Connection error: ', err)
//    client.end()
//  })

//  client.on('reconnect', () => {
//    console.log('Reconnecting...')
//  })

//  client.on('connect', () => {
//    console.log('Client connected:' + clientId)

//    client.subscribe(topic, { qos }, (error) => {
//      if (error) {
//        console.log('Subscribe error:', error)
//        return
//      }
//      console.log(`Subscribe to topic ${topic}`)
//    })
//  })

//  client.on('message', (topic, payload) => {
//    console.log(
//      'Received Message: ' + payload.toString() + '\nOn topic: ' + topic
//    )
//  })
let getData = require('./routes/api/sensors') 

var localTime = new Date();
var year = localTime.getFullYear().toString();
var month = (localTime.getMonth() + 1);
var day = (localTime.getDay() + 1);
var date = localTime.getDate().toString();
var hour = localTime.getHours().toString();
var minute = localTime.getMinutes().toString();
var second = localTime.getSeconds().toString();

function strMonth() {
    switch(month) {
        case 1:
          return "Januari";
        case 2:
          return "Februari";
        case 3:
            return "Maret";
        case 4:
          return "April";
        case 5:
          return "Mei";
        case 6:
            return "Juni";
        case 7:
          return "Juli";
        case 8:
          return "Agustus";
        case 9:
            return "September";
        case 10:
          return "Oktober";
        case 11:
          return "November";
        case 12:
            return "Desember";
        default:
          console("Error");
      }
}

function strDay() {
    switch(day) {
        case 1:
          return "Ahad";
        case 2:
          return "Senin";
        case 3:
            return "Selasa";
        case 4:
          return "Rabu";
        case 5:
          return "Kamis";
        case 6:
            return "Jumat";
        case 7:
          return "Sabtu";
        default:
          console("Error");
      }
}

Time.innerHTML = `<p class="text-secondary fw-semibold pb-0 mb-0">${strDay() + ", " + date + " " + strMonth() + " " + year + " " + hour + ":" + minute + ":" + second}</p>`;