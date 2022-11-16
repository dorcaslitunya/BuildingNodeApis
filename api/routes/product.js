
//By the time a file reaches this file, it means it already has bypased /products
//So we need to know how to handle after that..after reaching products


const express = require('express');

//express.Router()
//subfolder for express that allows us to have different routes reaching different endponints
//
const router = express.Router();
const mongoose = require('mongoose');
const product = require('../../models/product');

const Product = require('../../models/product');
const multer = require('multer');

//initialize multer
//dest - specify a folder where multer will try to store all incoming files
//folder isnt publicly accessible..set it up in app config so that its publicly acceptable
//by making it a static folder


//addres and adjust how files get stored
const storage = multer.diskStorage({

    //function that decides where the incoming file will get into
    destination: function (req, file, cb) {
        //cb(potentialError, pathToStorefile)
        cb(null, './uploads/')
    },

    //defines how the file will be named
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }

});

const fileFilter = (req, file, cb) => {
    //reject file i.e filter a file user wants to save

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);


    } else {
        cb(null, false);//ignores file and does not store it

    }
}
const upload = multer({
    storage: storage,
    //limits size of image(accepts files upto 5MB)
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter

});

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage') //fetch this fields and no other
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage:doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id

                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

//you can have multiple middleware before our main middleware(req,res,next)
//upload.single()- processes a single file and you need to provide a field name so as to process it

router.post('/', upload.single('productImage'), (req, res, next) => {
    ///Option 1..Build an additional endpoint where you accept binary data only
    //https://stackoverflow.com/questions/16598973/uploading-binary-file-on-node-js
    // You can create a binary acceptable URL, this one is not binary acceptable
    //req.body cannot parse binary data through body parser plugin that does url-encoded or json format data
    //Try to pass out the raw request body
    //Disav:We have to find out to which product does this information belong to 


    //Option 2: Use form data object(JS automatically provides when you submit a form instead of request body to allow us
    // to submit all form data(name, email and files)
    //use multer that can parse  incoming form data(used to read forms)


    console.log(req.file);
    const product1 = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product1.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Created product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });


});

//:productid is a variable that will store any id after /products

router.get('/:productid', (req, res, next) => {
    const id = req.params.productid;
    Product.findById(id)
        .select("name _id price productImage")
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                const response = {
                    name: doc.name,
                    price: doc.price,
                    id: doc._id,
                    productImage:doc.productImage,
                    request: {
                        type: 'GET',
                        description: "GET_ALL_PRODUCTS",
                        url: "http://localhost:3000/products/"

                    }
                }

                res.status(200).json({ response })

            } else {
                res.status(404).json({ message: "No valid entry for current ID" });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

router.patch('/:productid', (req, res, next) => {
    const id = req.params.productid;
    //object of what you want to modify in your code
    //might have no key: value pairs, we can just change the name or change the price
    //[    {"propName":"name","value":"Dorcas Anono modified"   }]

    const updateOperations = {};
    //operations is an array 
    for (const operations of req.body) {
        updateOperations[operations.propName] = operations.value
    }
    //set is a mongoose feature - json object that you pass what you want to set
    //This assumes we want to update both name and price but we need to know which one we want to update
    //{name: req.body.newName,price:req.body.newPrice}

    Product.updateOne({ _id: id }, { $set: updateOperations })
        .exec()
        .then(result => {
            console.log(result)
            const response = {
                message: "Product updated",
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            }
            res.status(200).json(response)

        })
        .catch(err => {

            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.delete('/:productid', (req, res, next) => {

    const id = req.params.productid

    //removeproduct that has this id stated here
    //.exec() gets a real promise
    Product.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Product deleted",
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;