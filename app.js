const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

//settings
app.set("port", process.env.PORT || 3001)

 // middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/users", userRoute);
app.use("/pins", pinRoute);

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "/client/build")));
//     app.get("*", (req,res) => {
//         res.sendFile(path.join(__dirname + "/client/build/index.html"))
//     });
//     } else {
//     app.get("/", (req, res) => {
//         res.send("API is running")
//     })
//     } 


module.exports = app;
