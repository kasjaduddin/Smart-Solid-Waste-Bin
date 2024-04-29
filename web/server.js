import express from 'express';
import http from 'http';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io'
import { connect } from 'mqtt';
import { fileURLToPath } from 'url';
// import { strDay,
//          date,
//          strMonth,
//          year,
//          hour,
//          minute,
//          second } from './date.js';

const client = connect('mqtt://127.0.0.1:1883');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// var dateNow = {
//     "day": strDay(),
//     "date": date,
//     "month": strMonth(),
//     "year": year,
//     "hour": hour,
//     "minute": minute,
//     "second": second
// }

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
});
app.use('/asset', express.static(__dirname + "/asset"));

client.on('connect', () => {
    console.log("Connected to broker");
    io.on('connection', (socket) => {
        console.log("Connected to client");
    });
    // Subscribe to a topic named testtopic with QoS 0
    client.subscribe('sensor/data', { qos: 1 }, function (error, granted) {
        if (error) {
        console.log(error);
        } else {
        console.log(`${granted[0].topic} was subscribed`);
        }
    });
});

client.on('message', function (topic, payload, packet) {
    io.emit('date', dateNow);
    io.emit('payload', payload.toString());
  });


const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });

  