//require('dotenv').config({path: './env'})
import { app } from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import express from 'express'





dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err);
})








/*
import express from 'express'

( async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

       app.on("ERROR",(error) => {
        console.log("Error", error)
        throw error
       })

       app.listen(process.env.PORT, () =>{
        console.log(`app is listing on ${process.env.PORT}`)
       })

    } catch (error) {
        console.log("ERROR", error)
        throw err
    }
})()
    */