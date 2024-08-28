let mongoose=require("mongoose")
let youtube_schema=mongoose.Schema({
    name:String,
    video:String,
    
})

let Youtube=mongoose.model("youtube",youtube_schema)
module.exports=Youtube