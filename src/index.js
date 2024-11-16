//require('dotenv').config({path: './env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js'

dotenv.config({
    path: './env'
})

connectDB()









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