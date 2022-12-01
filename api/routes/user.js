const express = require ('express');

const router = express.Router();
const mongoose = require('mongoose');

const User = require ('../../models/user');

const bcrypt = require('bcrypt');


router.post('/signup',(req,res,next)=>{

    User.find({email: req.body.email}).exec()
    .then((user)=>{
        console.log("User object lolzz"+user)
        if(user.length>=1){
            //409->COnflict, we got the request and we could handle it but we have a 
            //conflict with current resources
            //422->Unprocessable entity, we got a request we can read, we can understand the request 
            //but we can't process it
            return res.status(409).json({
                message: "Email exists already"
            })
        }else{
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
        }

    })
  
   
    
}) ; 

router.delete('/:userId',(req,res,next)=>{
    User.remove({_id:req.params.userId}).exec()
    .then(result=>{
        res.status(200).json({
            message: "user deleted"
        })
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})

module.exports = router;





