const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorisation,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");
// create product
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder)
  } catch (error) {
    res.status(500).json("error is" + error);
  }
});

// update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
      // update everything in body
      const updateOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateOrder);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  // delete
  router.delete("/:id",verifyTokenAndAdmin, async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json("Order deleted successfully");
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
// get user Order 
  router.get("/find/:userid",verifyTokenAndAuthorisation, async (req, res) => {
    try {
      const order = await Order.findOne({userID :req.params.userId});
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json("error is" + error);
    }
  });
  
  // get all Orders
  router.get("/",verifyTokenAndAdmin, async (req, res) => {
     try {
        const Orders = await Order.find()
        res.status(200).json(Orders)
     } catch (error) {
        res.status(500).json("error is" + error);
     }
  });
  router.get("/income", verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1));
    try {
        const income = await Order.aggregate([
            {$match : {createAt:{$gte : previousMonth }}},
            {
                $project:{
                    month:{$month : "createsAt"},
                    sales:"$amount"
                }
            },
            {
                $group:{
                    _id:"$month",
                    total:{$sum :"$sales"}
                }
            }
        ]);
        res.status(200).json(income)

     } catch (error) {
        res.status(500).json("error is" + error);
     }
  })
module.exports = router;
