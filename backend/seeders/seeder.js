import mongoose from "mongoose";
//import dotenv from 'dotenv';
import Product from "../models/product.js";
import products from "./data.js";
//dotenv.config({path:"backend/config/config.env"});
const seederProducts = async () => {
    try
    {
       //await mongoose.connect(process.env.DB_LOCAL_URI);
       await mongoose.connect("mongodb://0.0.0.0:27017/shopit-v2");
       await Product.deleteMany();
       console.log("Product deleted");
       await Product.insertMany(products);
       console.log("Product addes");
       process.exit();
    }
    catch(error){
        console.log(error.message);
        process.exit();
    }
};
seederProducts();