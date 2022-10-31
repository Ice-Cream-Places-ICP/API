require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');
const mongoose = require("mongoose");

const authentication = require("./authentication/authentication");
const shopRoutes = require('./routes/shop');

const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use("/auth", authentication);
app.use('/shops', shopRoutes);
app.use(errorHandler);

//sample get endpoint
app.get("/sample", (req, res) => {
    res.send("I am from API");
})

//DATABASE CONNECTION
// TODO: create and connect with database
mongoose.connect(process.env.DB_CONNECTION, () => {
    console.log("Database Connected");
});
//SERVER LISTENING
app.listen(process.env.PORT, () => {
    console.log(`Server up at port ${process.env.PORT}`);
})