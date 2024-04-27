const express = require("express");
const router = express.Router();
const Sensor = require("../../models/Sensor");
const db = require("../../config/keys").mongoURI;

let data = null;

router.get("/", function(req, res, next) {
    const id = req.body
    Sensor.findById(id)
        .then(doc => {
            if (doc) {
                const info = { 
                    _id: doc._id,
                    location: doc.location,
                    Distance: doc.Distance,
                    Humidity: doc.Humidity,
                    Temperature: doc.Temperature,
                    maxHigh: doc.maxHigh,
                    maxWeight: doc.maxWeight
                }
                data = info;
                try {
                    res.status(200).json({
                        message: "get data team successfully",
                        info
                    })
                } catch (error) {
                    res.status(400).json({ message: "an error occured" })
                }
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Error while searching team by id",
                error: error,
            })
        })
  });
  

router.get("/register",(req,res) =>{
    console.log("tes");
    // User.findOne({email: req.body.email})
    //     .then(user => {
    //         if(user){
    //             return res.status(400).json({'email' : 'Alamat email sudah digunakan'});
    //         }else{
    //             const newUser = new User({
    //                 name : req.body.name,
    //                 email : req.body.email,
    //                 password : req.body.password
    //             });
    //             bcrypt.genSalt(10,(err,salt) => {
    //                 bcrypt.hash(newUser.password,salt,(err,hash) => {
    //                     if(err) throw err;
    //                     newUser.password = hash;
    //                     newUser.save()
    //                         .then(user => res.json(user))
    //                         .catch(err => console.log(err))
    //                     return res.json(newUser);
    //                 })
    //             });
    //         }
    //     })
});

module.exports = router;