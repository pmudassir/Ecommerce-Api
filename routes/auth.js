const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//USER REGISTRATION.
// using async await to wait until the user is saved and then trying to send the user data if its successful and catch err if any.

router.post("/register", async (req,res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
        ).toString(),  //encrypting password using crypto-js and turning the hash to string.
    });
    try{    
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(500).json(err)
    }
});

//LOGIN

router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({username: req.body.username})
        
        if(!user){
            res.status(401).json("Wrong Credentials!")
            return;
        }//if no user found

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASS_SEC
        );
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        
        if(Originalpassword !== req.body.password){
            res.status(401).json("Wrong Credentials!");
            return
        }//if password doesn't match
        
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },  process.env.JWT_SEC,
            {expiresIn: "3d"}
        );  //creating a jwt expiring in 3 days.

        const {password, ...others} = user._doc; //sending infos except password (._doc) is must.
        res.status(200).json({...others, accessToken});  //if Credentials are correct.
    }
    catch(err){
        res.status(500).json(err)
    }
});

module.exports = router;