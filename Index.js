const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const stripeRoute = require("./routes/stripe")
const cors = require("cors");

mongoose.set('strictQuery', true);

dotenv.config();

//connecting to mongodb atlas.

mongoose
    .connect(process.env.MONGO_URL)    //stored mongo url in env
    .then(() => console.log("DB Connection Successful"))
    .catch(err => {
        console.log(err)
});

app.use(cors());
app.use(express.json());   //use json

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});