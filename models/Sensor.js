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

sensorTable=mongoose.model("sensorMonitor",SensorSchema);
        
module.exports={
     
     fetchData:function(callback){
        var sensorData=sensorTable.find({});
        sensorData.exec(function(err, data){
            if(err) throw err;
            return callback(data);
        })
        
     }
}