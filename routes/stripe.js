const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
//implementing stripe in node

router.post("/payment",  (req, res) => {
    stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'inr',
        description:"Test Payment 3",
        confirm:true,
        payment_method_data: {
            type: 'card',
            card: {
                token: req.body.tokenId
            }
        }
    },    (stripeErr, stripeRes) => {
        if(stripeErr){
            console.log(stripeErr);
            res.status(500).json(stripeErr)
        } else {
            console.log(stripeRes);
            res.status(200).json(stripeRes)
        }   //if payment err it sends the err, and not sends the response.
    });

});

module.exports = router;