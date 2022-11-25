//models define how a product looks like in an application
//We want to have an order and say this order is connected to a product
//we start of with a basic schema stating that this ord



const mongoose = require ('mongoose');

const orderSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,

    //the type will be an object id
    //we will store the id of the product related to this order
    //ref i used to configure the ObjectId type in the product object
    //It holds a string to the name of the model(Product) I want to connect this model (Order) to
    //Use the name assigned in the exports part of the relational model

   email:{type:String,required:true},
   password:{type:String,required:true},
   
  
   //You don't need to pass me a qauntity.If you don't pass me, I will use a default of 1

  



});

module.exports = mongoose.model('User',orderSchema) ;