import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({path:"backend/config/config.env"});
export const connectDatabase = () => {

    let DB_URI = "";  
   // DB_URI = "mongodb://0.0.0.0:27017/shopit-v2";
   console.log(process.env.NODE_ENV);  
   // console.log(process.env.DB_LOCAL_URI);
    if(process.env.NODE_ENV === 'development') {DB_URI = process.env.DB_LOCAL_URI};
    if(process.env.NODE_ENV === "production") DB_URI = process.env.DB_URI;  
    console.log(DB_URI);
    mongoose.connect(DB_URI)
    .then(() => console.log(`MongoDB connection with host: ${mongoose.connection.host}`))
    .catch(err => console.error('Could not connect to MongoDB:', err));
};