const mongoose = require("mongoose");

const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected");
});