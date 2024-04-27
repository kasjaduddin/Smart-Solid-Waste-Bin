var fetchModel= require('../../models/Sensor');
module.exports={
 
    fetchData:function(req, res){
      
      fetchModel.fetchData(function(data){
          res.render('sensor-table',{sensorData:data});
      })
    }
}