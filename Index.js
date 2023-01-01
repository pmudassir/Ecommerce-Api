const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user")

mongoose.set('strictQuery', true);

dotenv.config();

//connecting to mongodb atlas.

mongoose
    .connect(process.env.MONGO_URL)    //stored mongo url in env
    .then(() => console.log("DB Connection Successful"))
    .catch(err => {
        console.log(err)
});

app.use(express.json());   //use json

app.use("/api/users", userRoute);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});