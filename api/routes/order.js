const express = require ('express');

const router = express.Router();
const mongoose = require('mongoose');

const Order = require ('../../models/order');




router.get('/',(req,res,next) => {

    res.status(200).json({
        message:"Handling GET requests to /order"
    });
})

router.post('/',(req,res,next) => {
    const order1 =new Order({
        _id:new mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        //Id of the product we are connected to
        product:req.body.productId
    })

    //Since this is not a query, it runs an actuall promise thus no need
    //to  add exec()
    order1.save()
    .then(result =>{
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })

    
})

router.get('/:ordersid',(req,res,next)=>{
    const id=req.params.ordersid;
   if(id==='special') {
    res.status(200).json({
        message:"You discoverd the special ORDER ID",
        id:id
    });
}else{
    res.status(200).json({
        message:"You passed an ORDER id"
    });
}
});
router.delete('/:orderid',(req,res,next)=>{
    const id=req.params.orderid;
   if(id==='special') {
    res.status(200).json({
        message:"You discoverd the special ORDER delete ID",
        id:id
    });
}else{
    res.status(200).json({
        message:"You passed an ORDER delete id"
    });
}
});

module.exports = router;
