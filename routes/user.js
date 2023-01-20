const User = require("../models/User");
const { verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//updating user
router.put("/:id", verifyTokenAndAuth, async (req,res) => {

    //if password has been changed before updating
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString()    //making the password more secure by adding our secret key with the password and converting to string
    };

    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new: true} //updating everything from body and sending it using new.
        )
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(err).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuth, async (req,res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted");
    }
    catch(err){
        res.status(500).json(err)
    }
});

//GET USER ONLY FOR ADMINS
router.get("/find/:id", verifyTokenAndAdmin, async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json(err)
    }
});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req,res) => {
    const query = req.query.new;    //if query new is given it gets only the last 5 users which is the set limit. 
    try{
        const users = query 
        ? await User.find().sort({ _id: -1 }).limit(5)  //id -1 is given so the get user will be the last 5 instead of first five.
        : await User.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err)
    }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1)); //getting previous year from the current year.
    
    try {
        const data = await User.aggregate([
            {
                $match: {createdAt: {$gte: lastYear}}   //matching users whose createdAt is greater or equal to last year i.e 1yr stats.
            },
            {
                $project: {
                    month: {$month: "$createdAt"}   //fetching created at from the user model
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;