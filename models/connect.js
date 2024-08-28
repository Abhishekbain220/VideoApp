let mongoose=require("mongoose")
// mongoose.connect("mongodb://127.0.0.1:27017/youtube")
mongoose.connect("mongodb+srv://abhi123:abhi123@cluster0.gsgs3bg.mongodb.net/youtube?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("Database connection established")
})
.catch((error)=>{
    console.log(error.message)
})