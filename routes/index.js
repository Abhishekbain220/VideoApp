var express = require('express');
var router = express.Router();
let path=require("path")
let fs=require("fs")
let global=path.join(__dirname,"../","public","images")
let Youtube=require("../models/youtube_schema")
let upload=require("../utils/multer").single("video")
let youtube_user=require("../models/register_schema")
let pasport=require("passport")
let LocalStrategy=require("passport-local");
const passport = require('passport');
passport.use(new LocalStrategy(youtube_user.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('login', {
    user:req.youtube_user
  });
});
router.get('/create_video', function(req, res, next) {
  res.render('create_video', {

  });
});
router.post('/create_video',upload,async function(req, res, next) {
  try {
    let newdata=await Youtube.create({
      ...req.body,
      video:req.file.filename,
      image:req.file.filename
    })
    await newdata.save()
    res.redirect("/profile")

  } catch (error) {
    res.send(error.message)
  }
  
});
router.get('/profile',isLoggedIn,async function(req, res, next) {
  try {
    let read_data=await Youtube.find()
    res.render('profile', {
      read_data,
      user:req.user
    });
  } catch (error) {
    res.send(error.message)
  }
});
router.get('/video/:id',async function(req, res, next) {
  try {
    let {id}=req.params
    let read_video=await Youtube.findById(id)
    let read_data=await Youtube.find()
    res.render("video",{
      name:read_video.name,
      video:read_video.video,
      read_data
    })
  } catch (error) {
    res.send(error.message)
  }
});
router.get('/delete',async function(req, res, next) {
  let read_data=await Youtube.find()

  res.render("delete",{
    read_data
  })
});
router.get('/delete_video/:id',async function(req, res, next) {
  let {id}=req.params
  let delete_video =await Youtube.findByIdAndDelete(id)
  await fs.unlinkSync(path.join(global,delete_video.video))
  res.redirect("/profile")
  
});

router.get('/update',async function(req, res, next) {
  let read_data=await Youtube.find()

  res.render("update",{
    read_data
  })
});
router.get('/update_video/:id',async function(req, res, next) {
  let {id}=req.params
  let read_video=await Youtube.findById(id)

  res.render("update_video",{
    read_video
  })
});
router.post('/update_video/:id',upload,async function(req, res, next) {
  try {
    let {id}=  req.params
    let updated_data=  req.body
    if(req.file){
      updated_data.video=  req.file.filename
      await fs.unlinkSync(path.join(global,updated_data.old_video))
    }
    await Youtube.findByIdAndUpdate(id,updated_data)
    res.redirect("/update")
    
  } catch (error) {
    res.send(error.message)
  }
});

router.get('/login',async function(req, res, next) {
  res.render("login",{
    
  })
});
router.post('/login',
passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login"
}),

async function(req, res, next) {
  
});
router.get('/register',async function(req, res, next) {
  res.render("register",{

  })
});
router.post('/register',async function(req, res, next) {
  try {
    let {name,username,email,password}=req.body
    let newuser= await youtube_user.register({
      name,username,email
    },password)
    await newuser.save()
    res.redirect("/login")
  } catch (error) {
    res.send(error.message)
  }
});

router.get('/logout',async function(req, res, next) {
  try {
    req.logout(()=>{
      res.redirect("/")
    })
  } catch (error) {
    res.send(error.message)
  }
});

router.get('/update_user/:id',isLoggedIn,async function(req, res, next) {
  try {
    let {id}=req.params
    res.render("update_user",{
      user:req.user
    })
  } catch (error) {
    res.send(error.message)
  }
});
router.post('/update_user/:id',isLoggedIn,async function(req, res, next) {
  try {
    let {id}= await req.params
    await youtube_user.findByIdAndUpdate(id,req.body)
    await res.redirect("/profile")
  } catch (error) {
    res.send(error.message)
  }
});
router.get('/reset_password/:id',async function(req, res, next) {
  try {
    let {id}=req.params
    res.render("reset_password",{
      user:req.user
    })
  } catch (error) {
    res.send(error.message)
  }
});
router.post('/reset_password/:id',isLoggedIn,async function(req, res, next) {
  try {
    let {id}=await req.params
    await req.user.changePassword(
      req.body.oldpassword,
      req.body.newpassword
  );
    await res.redirect(`/update_user/${id}`)
  } catch (error) {
    res.send(error.message)
  }
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    next()
  }
  else{
    res.redirect("/login")
  }
}

module.exports = router;
