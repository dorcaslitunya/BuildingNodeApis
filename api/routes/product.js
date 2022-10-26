
//By the time a file reaches this file, it means it already has bypased /products
//So we need to know how to handle after that..after reaching products


const express = require ('express');

//express.Router()
//subfolder for express that allows us to have different routes reaching different endponints
//
const router = express.Router();
const mongoose = require('mongoose');
const product = require('../../models/product');

const Product = require('../../models/product');


router.get('/',(req,res,next) => {
    Product.find()
    .select('name price _id') //fetch this fields and no other
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            products:docs.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type:'GET',
                        url: 'http://localhost:3000/products/'+ doc._id

                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
   
});

router.post('/',(req,res,next)=>{
   
    const product1= new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
    product1.save()
    .then(result=>{
        console.log(result)
        res.status(201).json({
            message:"Created product successfully",
            createdProduct:{
                name:result.name,
                price:result.price,
                id:result._id,
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+ result._id
                }
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    });
    
    
});

//:productid is a variable that will store any id after /products

router.get('/:productid',(req,res,next)=>{
    const id=req.params.productid;
   Product.findById(id)
   .select("name id price")
   .exec()
   .then(doc => {
    console.log("From database",doc);
    if(doc){
        const response={
            name:doc.name,
            price:doc.price,
            id:doc._id,
            request:{
                type:'GET',
                description:"GET_ALL_PRODUCTS",
                url:"http://localhost:3000/products/"

            }
        }

    res.status(200).json({response})

    }else{
        res.status(404).json({message:"No valid entry for current ID"});
    }
   })
   .catch(err =>{
    console.log(err)
    res.status(500).json({error:err})
   })
});

router.patch('/:productid',(req,res,next)=>{
    const id=req.params.productid;
    //object of what you want to modify in your code
    //might have no key: value pairs, we can just change the name or change the price
    //[    {"propName":"name","value":"Dorcas Anono modified"   }]
    
    const updateOperations={};
    //operations is an array 
    for(const operations of req.body){
        updateOperations[operations.propName] = operations.value
    }
    //set is a mongoose feature - json object that you pass what you want to set
    //This assumes we want to update both name and price but we need to know which one we want to update
    //{name: req.body.newName,price:req.body.newPrice}

  Product.updateOne({_id:id},{$set:updateOperations})
  .exec()
  .then(result=>{
    console.log(result)
    const response={
        message:"Product updated",
        request:{
            type:'GET',
            url:'http://localhost:3000/products/'+ id
        }
    }
    res.status(200).json(response)

})
  .catch( err =>{

    console.log(err);
    res.status(500).json({
        error:err
    });
  });

});

router.delete('/:productid',(req,res,next)=>{

    const id = req.params.productid

    //removeproduct that has this id stated here
    //.exec() gets a real promise
    Product.deleteOne({_id:id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:"Product deleted",
            request:{
                type:'POST',
                url:'http://localhost:3000/products/',
                body:{name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});

module.exports = router;