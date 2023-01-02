const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];  //splitting the token with space eg:{Bearer (token No.)}.
        jwt.verify(token, process.env.JWT_SEC, (err, foundUser) => {
            if(err) res.status(401).json("Invalid Token!");
            req.user = foundUser;
            next();
        })
    }else{
        return res.status(401).json("You are not authenticated!");
    }
};


//verifies the token before auth next refers to the root function for updating.

const verifyTokenAndAuth = (req,res, next)=> {
    verifyToken(req, res, () =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};

const verifyTokenAndAdmin = (req,res, next)=> {
    verifyToken(req, res, () =>{
        if(req.user.isAdmin){
            next();
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    })
};  //token verification for admin exclusive functions.

module.exports = {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin };