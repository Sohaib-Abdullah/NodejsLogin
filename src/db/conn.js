const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/YoutubeRegistration",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connection successful")
}).catch((e)=>{
    console.log("No Connection to DB")
})