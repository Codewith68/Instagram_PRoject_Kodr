import mongoose from "mongoose"
import config from "./config.js"


export  const connectDB = async () => {
    try {
         await mongoose.connect(config.MONGO_URI)
        console.log(`MongoDB Connected: successful`)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}