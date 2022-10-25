const express = require ('express');

const router = express.Router();


router.get('/',(req,res,next) => {

    res.status(200).json({
        message:"Handling GET requests to /order"
    });
})

router.post('/',(req,res,next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    }

    res.status(201).json({
        message:"Handling POST requests to /order",
        order:order
    });
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
