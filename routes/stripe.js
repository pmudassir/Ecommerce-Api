const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

//implementing stripe in node
router.post("/payment", (req,res)=>{
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd"
        },
        (stripeErr, stripeRes) => {
            if(stripeErr){
                res.status(500).json(stripeErr)
            } else {
                res.status(200).json(stripeRes)
            }   //if payment err it sends the err, and not sends the response.
        }
    )
});

module.exports = router;