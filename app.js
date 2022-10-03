const express = require('express');


const app = express();
const routes=require('./api/routes');

app.use('/',routes());

app.use((req,res,next)=>{
    res.status(200).json({
        message:"it works!"
    });
});

module.exports=app;