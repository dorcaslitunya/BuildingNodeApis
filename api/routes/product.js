
//By the time a file reaches this file, it means it already has bypased /products
//So we need to know how to handle after that..after reaching products


const express = require ('express');

//express.Router()
//subfolder for express that allows us to have different routes reaching different endponints
//
const router = express.Router();


router.get('/',(req,res,next) => {
    res.status(200).json({
        message:"Handling GET requests to /products"
    });
});

router.post('/',(req,res,next)=>{
    res.status(201).json({
        message:"Handling POST requests to /products"
    });
});

//:productid is a variable that will store any id after /products

router.get('/:productid',(req,res,next)=>{
    const id=req.params.productid;
   if(id==='special') {
    res.status(200).json({
        message:"You discoverd the special ID",
        id:id
    });
}else{
    res.status(200).json({
        message:"You passed an id"
    });
}
});

router.patch('/:productid',(req,res,next)=>{
    const id=req.params.productid;
   if(id==='special') {
    res.status(200).json({
        message:"You discoverd the special ID patch request",
        id:id
    });
}else{
    res.status(200).json({
        message:"You passed an patch id"
    });
}
});

router.delete('/:productid',(req,res,next)=>{
    const id=req.params.productid;
   if(id==='special') {
    res.status(200).json({
        message:"You discoverd the special delete ID",
        id:id
    });
}else{
    res.status(200).json({
        message:"You passed an delete id"
    });
}
});

module.exports = router;