const express = require('express');

const {connection} = require("./db")
require("dotenv").config();
const cors= require("cors");

const {userRouter}= require("./Routes/userRoutes")
const {postRouter}= require("./Routes/postRoutes")
const app = express()
app.use(cors());
app.use(express.json());
app.use("/users",userRouter);
app.use("/posts",postRouter)


app.listen(8080,async()=>{
    try {
        await connection;
        console.log(`DB Connected \nServer is running at post 8080`);
    } catch (error) {
        console.log(error);
    }
})