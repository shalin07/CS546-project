const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const checkCookie = require('../middleware/check_cookie')
const ObjectID = require("mongodb").ObjectID

router.get("/registration", checkCookie, async (req, res) => {
  console.log("sign up")
  req.flash('error','')
  res.status(200).render("pages/registration", {layout: 'alternate.handlebars', error:false})
});


router.get("/logout", checkCookie, async (req, res) => {
  // console.log("sign in")
  if(req.session.user){
    res.clearCookie('user_sha')
    res.redirect('/pages/login')
  }else{
    res.redirect('/pages/login')
  }
})

router.get("/logon", checkCookie, async (req, res) => {
  console.log("sign in")
 

  res.status(200).render("pages/login", {
    title:"Signup Page",
    layout: 'alternate.handlebars'
  });
});

router.get("/logout", checkCookie, async (req, res) => {
  // console.log("sign in")
  if(req.session.user){
    res.clearCookie('user_sha')
    res.redirect('/pages/login')
  }else{
    res.redirect('/pages/login')
  }
})

// please update this user profile
router.get("/:userid/profile", async(req, res) => {
  // try {
      console.log("In Venues GET route")
      // let venueId = ObjectID(req.params.venueid)
    let tosendid = req.params.userid
      let userId = ObjectID(req.params.userid)
      console.log("User ID", userId)
      const user = await userData.getUserById(userId)
      console.log("User found in profile get route:",user, typeof user)
      res.render('pages/profile', { title: "Your Profile", profile: user, userId: tosendid });

  // } catch (error) {
  //     res.status(500).json({error: error})
  // }
})

  router.post("/registration", async (req,res) =>{
    try{
   console.log(req.body)
          if(req.body.fname ==  '' || req.body.lname == '' || req.body.phone == '' || req.body.email == '' || req.body.password == '' || req.body.age == '' || req.body.bday == '') throw 'Please fill all fields'
         
          if(req.body.password != req.body.confirm) throw "Password doesn't match"
     
          //test illegal email
          var mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
          if(!mail.test(req.body.email)) throw "email format is not correct"
  
          //test illegal phone number
          var phoneno = /^\d{10}$/;
          if(!req.body.phone.match(phoneno)) throw "Phone number format is not correct"
     
          
          //test illegal first name and last name
          var format_name = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?]/;
          if(format_name.test(req.body.fname) || format_name.test(req.body.lname)) throw "Don't contain special character like !@#$%^&*.,<>/\'\";:? in firstname or lastname";
     
          //test illegal password format
          var format = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
          if(format.test(req.body.password) == false) throw "Password should be atleast 8 characters long and should have 1 uppercase, 1 lowercase and 1 number";
     
          const user = await userData.create(req.body.fname, req.body.lname, req.body.email, req.body.phone, Number(req.body.age), req.body.password, req.body.bday)
       
          res.status(200).redirect(`/${user._id}/home`)      
        
    }catch(e){
      req.flash('error', e)
      res.redirect('/users/registration')
  }
});

router.post("/login", async (req, res) => {
  try{
    console.log(req.body)
      if(req.body.email ==  '' || req.body.password ==  '' ) throw 'Please fill all fields'
        
        const user = await userData.login(req.body.email, req.body.password)
        let userId = user.user[0]._id

        res.cookie('token', user['token']);
        res.cookie('userid', user['user'][0]._id);
        res.status(200).redirect(`/${userId}/home`)    
  }catch(e){
    req.flash('error', e)
    res.redirect('/users/login')
        }
  });

module.exports = router;
