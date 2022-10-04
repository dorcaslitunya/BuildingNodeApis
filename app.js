const express = require('express');


const app = express();

/*Including product routes
You need to make sure requests are forwarded to this file no
matter which HTTP they use,so long as its /products
SO in the products.js file, we need not to fix /products as it will now target /products/products
Hence why we do app.use('/products',ProductRoutes)

*/
const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/order');



app.use('/products',productRoutes);
app.use('/order',orderRoutes);

module.exports=app;