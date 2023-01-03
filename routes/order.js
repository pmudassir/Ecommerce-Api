const Order = require("../models/Order");
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
const moment = require('moment');
  

//CREATE 
router.post("/", verifyTokenAndAuth, async (req,res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder)
    } catch (err) {
        res.status(500).json(err)
    }
});

//UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        )
        res.status(200).json(updatedOrder);
    }
    catch(err){
        res.status(err).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        await Order.findByIdAndDelete(req.params.id) 
        res.status(200).json("Order Item has been deleted");
    }
    catch(err){
        res.status(500).json(err)
    }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuth, async (req,res) => {
    try{
        const orders = await Order.find(req.params.userId)
        res.status(200).json(orders)
    }
    catch(err){
        res.status(500).json(err)
    } 
});

// //GET ALL ORDERS ONLY FOR ADMIN
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    try {
        const orders = await Order.find()
        res.status(200).json(orders); 
    } catch (err) {
        res.status(500).json(err)
    }
});

//GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req,res)=>{
    let previousMonth = moment().subtract(2, 'months').format("YYYY-MM-DD")
     previousMonth=new Date(previousMonth)

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",    //fetching amount from order model
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: "$sales"}, //sums the sales amount generated through orders
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});
 
module.exports = router;