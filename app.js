const express = require('express');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

/*Including product routes
You need to make sure requests are forwarded to this file no
matter which HTTP they use,so long as its /products
SO in the products.js file, we need not to fix /products as it will now target /products/products
Hence why we do app.use('/products',ProductRoutes)

*/

const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/order');

mongoose.connect('mongodb+srv://dorcaslit:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.rihztbt.mongodb.net/?retryWrites=true&w=majority',
{
    useNewUrlParser: "true",
}
);
mongoose.connection.on("error", err => {
    console.log("err", err)
  })
  mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected")
  })

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))//makes a folder statically or publicly available
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use((req,res,next)=>{
    //* gives access to any client not just one
    res.header('Access-Control-Allowed-Origin','*')

    //allow which headers to be sent along with the request
    res.header('Access-Control-Allowed-Headers',
                'Origin,X-Requested-With,Content-Type,Accept,Authorization'
                );

    if(req.method === 'OPTIONS'){
        //checks if you are allowed to make this request
        //Al http requests you want to support with your API
        //send a return because it just checks if the method is supported and through these , we do provide an method

        res.header('Access-Control-Allowed-Methods','PUT,POST,PATCH,DELETE,GET')
        return res.status(200).json({});
    
    }
    next();
})


//Routes that handle request
app.use('/products',productRoutes);
app.use('/order',orderRoutes);

//If you reach this line it means no route in the two files was able to handle your request
app.use((req,res,next)=>{
    const error = new Error("Not found");
    error.status = 404;
    next(error);
})


//All errors are forwarded here and handled by this use case
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    })

})

module.exports=app;