const express = require("express");

const router = express.Router();

router.get('/speakers',(req,res,next)=>{
    res.send("This is a speaker route");
})