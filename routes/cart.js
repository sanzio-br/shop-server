const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorisation,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Cart = require("../models/Cart");
// create product
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart)
  } catch (error) {
    res.status(500).json("error is" + error);
  }
});

// update
router.put("/:id", verifyTokenAndAuthorisation, async (req, res) => {
    try {
      // update everything in body
      const updateCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateCart);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  // delete
  router.delete("/:id",verifyTokenAndAuthorisation, async (req, res) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart deleted successfully");
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
// get user cart 
  router.get("/find/:userid",verifyTokenAndAuthorisation, async (req, res) => {
    try {
      const cart = await Cart.findOne({userID :req.params.userId});
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
  // get all carts
  router.get("/",verifyTokenAndAdmin, async (req, res) => {
     try {
        const carts = await Cart.find()
        res.status(200).json(carts)
     } catch (error) {
        res.status(500).json("error is" + error);
     }
  });
  
module.exports = router;
