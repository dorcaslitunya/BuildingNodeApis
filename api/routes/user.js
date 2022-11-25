const express = require ('express');

const router = express.Router();
const mongoose = require('mongoose');

const User = require ('../../models/user');

const bcrypt = require('bcrypt');


router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }else{
            const user =new User({
                _id:new mongoose.Types.ObjectId(),
                email:req.body.email,
                //hashing is a one way street, once you hash, you cannot unhash the password
                //we need a salt because if you google the hash, chances are high that you will find the translation to 
                //the hash exists in the dictionary
                //salting is used to add random string cues to plain text before we hash the password thus strings added are also stored 
                //in the hash
                //bcryot.hash(data,saltRounds)
                password:hash
            });
            user.save()
            .then(result=>{
                console.log(result);
                res.status(201).json({
                    message:"User created"
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
        }

    })
    
}) ; 

module.exports = router;





