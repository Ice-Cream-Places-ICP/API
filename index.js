require("dotenv").config({path: "./config.env"})
const express = require("express");

const app = express();
//MIDDLEWARE

//sample get endpoint
app.get("/sample", (req, res) => {
    res.send("I am from API");
})

//DATABASE CONNECTION
// TODO: create and connect with database

//SERVER LISTENING
app.listen(process.env.PORT,() => {
    console.log(`Server up at port ${process.env.PORT}`);
})