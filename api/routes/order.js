const express = require ('express');

const router = express.Router();
const mongoose = require('mongoose');
const order = require('../../models/order');

const Order = require ('../../models/order');

//used as a check to make sure we only create orders for which
//products exist
const Product = require('../../models/product');




router.get('/',(req,res,next) => {

    //pass property name of your reference property you want to populate
 Order.find()
 .select('product quantity_id')
 //pass property name of your reference property you want to populate
 //second arg is a list of properties of object you want to populate
 .populate('product',"name")
 .exec()
 .then(docs =>{
    //console.log(docs)
    res.status(200).json({
        count:docs.length,
        orders:docs.map(doc=>{
            return{
                _id:doc._id,
                product:doc.product,
                quantity:doc.quantity,
                request:{
            type:'GET',
            url:"http://localhost:3000/order/"+doc._id 
                  }  }

        }),
        
      
    });
 })
 .catch(err=>{
    res.status(500).json({
        error:err
    });
 })
})

router.post('/',(req,res,next) => {
    //returns product if found and returns null if product is not found
    Product.findById(req.body.productId)
    .then(productFound =>{
        if(!productFound){
            return res.status(404).json({
                message:"Product not found",

            })
        }
        const order1 =new Order({
        _id:new mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        //Id of the product we are connected to
        product:req.body.productId
    })

    //Since this is not a query, it runs an actuall promise thus no need
    //to  add exec()

    //save it..then now do another chaining outside current then() 
    //to avoid internal chainings
    // execution continues as .save returns a promise

   return  order1.save()
    
}).then(result =>{
    console.log(result);
    res.status(201).json({
        message:"Order stored",
        createdObject:{
            Orderid: result._id,
            quantity:result.quantity,
            product:result.product   
        },
        request:{
            type:'GET',
            url:"http://localhost:3000/order/" + result._id 
        }
    });
})
.catch(err=>{
    console.log(err);
    res.status(500).json({
        message:"Product not found",
        error:err
    });
})
    
    
})

router.get('/:ordersid',(req,res,next)=>{
    Order.findById(req.params.ordersid)
    .populate('product')
    .exec()
    .then(orderFound=>{
        if(!orderFound){
            return res.status(404).json({
                "message":"Order not found"
            })
        }
        res.status(200).json({
            orders:orderFound,
            request:{
                type:'GET ',
                url:"http://localhost:3000/order/"
            }


        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});
router.delete('/:orderid',(req,res,next)=>{
    Order.deleteOne({_id: req.params.orderid}).exec()
    .then(result=>{
        if(result.deletedCount==0){
            return res.status(404).json({
                message:"No such order exists"
            })
        }
        res.status(200).json({
            message:"Order deleted",
            
            request:{
                type:'POST',
                url:"http://localhost:3000/order/",
                body:{productId:'ID', quantity:"Number"}
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

module.exports = router;
