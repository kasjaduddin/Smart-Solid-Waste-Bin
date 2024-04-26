const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SensorSchema = new schema({
    location:{
        type:String,
        default: "Departemen Teknik Nuklir dan Teknik Fisika",
        required:false
    },
    Distance:{
        type:Number,
        required:true
    },
    Humidity:{
        type:Number,
        required:true
    },
    Temperature:{
        type:Number,
        required:true
    },
    maxHigh:{
        type:String,
        required:false
    },
    maxWeight:{
        type:String,
        required:false
    },
    time:{
        type:String,
        required:false
    }
});

module.exports = Sensor = mongoose.model("sensorMonitor",SensorSchema);