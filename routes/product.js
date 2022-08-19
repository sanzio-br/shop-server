const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorisation,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/Product");
// create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct)
  } catch (error) {
    res.status(500).json("error is" + error);
  }
});
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      // update everything in body
      const updateProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateProduct);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  // delete
  router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json("Product deleted successfully");
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
  // admin find product by id
  router.get("/find/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
  // get all products
  router.get("/",async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({ createdAt: -1 }).limit(2)
        }
        else if(qCategory){
            products = await Product.find({
                categories:{
                    $in:[qCategory]
                }
            })
        }else{
            products = await Product.find()
        }
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
module.exports = router;
