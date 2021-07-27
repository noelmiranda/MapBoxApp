const Router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin

Router.post("/", async(req,res)=>{
const newPin = new Pin(req.body)
try{
const savePin = await newPin.save();
res.status(200).json(savePin);

}catch(err) {
res.status(500).json(err)
}
})

//get all pins

Router.get("/", async(req,res)=>{
try{
const pins = await Pin.find();
res.status(200).json(pins)
}catch(err){
res.status(500).json(err)
}
})

module.exports = Router