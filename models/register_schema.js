let mongoose=require("mongoose")
let plm=require("passport-local-mongoose")
let register_schema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"Name must be required"],
        minLength:[4,"Name must have 4 character atleast"]
    },
    username:{
        type:String,
        trim:true,
        unique:true,
        required:[true,"Username must be required"],
        minLength:[4,"Username must have 4 character atleast"]
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:[true,"Username must be required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password:String
    
},{timestamps:true})
register_schema.plugin(plm)
let youtube_user=mongoose.model("youtube_user",register_schema)
module.exports=youtube_user