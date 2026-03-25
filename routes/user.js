const express = require('express');
const router = express.Router({});

router.get("/register",(req,res)=>{
    res.render("users/signUp.ejs",{ showNavbar: false });
})

module.exports  = router 