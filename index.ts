//const express = require('express')
import express from "express"
import bodyParser from "body-parser";
import mongoose from "mongoose";
import  { VandorRouter}  from "./routes/VandorRoute";
import  {AdminRouter}  from "./routes/AdminRoute";
import { MONGOURI } from "./config";
import path from "path";


let app = express();

// Third parties libraries 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use("/images", express.static(path.join(__dirname, 'images')));

// App middlewares  
app.use("/admin", AdminRouter);
app.use("/vandor", VandorRouter);

// Database connection 

mongoose.connect(MONGOURI)
.then( (result)=> {
   console.log("connected to mongodb")
}).catch( (err)=> {
    console.log(err)
})

// start server 
app.listen(8000, () => {
    console.log("app started on port 8000")
})


