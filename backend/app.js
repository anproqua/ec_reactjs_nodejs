import express from 'express';
import dotenv from 'dotenv';
const app = express();
import { connectDatabase } from './config/dbConnect.js';
import errorsMiddleware from './middlewares/errors.js';
import cookieParser from 'cookie-parser';
//handle uncaught exceptions
/*
process.on("uncaughtException", (err)=>{
    console.log(`ERROR nè: ${err}`)
    console.log("uncaughtException ví dụ");   
    process.exit(1);
   
})
*/
// vi du cho uncaughtException
//console.log(hello);

// connect datbase
connectDatabase();

// limit: 50mb để giải quyết up file lớn
app.use(express.json({ limit: '50mb'}));
app.use(cookieParser());
// use error middleware
//app.use(errorsMiddleware);

dotenv.config({path:"backend/config/config.env"});

//import all routes
import productRoutes from "./routes/products.js";
import userRouters from "./routes/users.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
app.use("/api/v1",productRoutes);
app.use("/api/v1",userRouters);
app.use("/api/v1",orderRoutes);
app.use("/api/v1",paymentRoutes);
// add dong nay o day moi xuat duoc loi kieu json
app.use(errorsMiddleware);
app.listen(process.env.PORT,()=>{
   // console.log("hello123")
   // console.log(process.env.PORT)
    console.log(`server start on Port:${process.env.PORT}`);
})


//handle unhandled promise rejection
/*
process.on("unhandledRejection", (err)=>{

    console.log(`ERROR unhandledRejection nè: ${err}`)
    console.log("unhandledRejection ví dụ");
    // server.close(()=>{
    //     process.exit(1);
    // })
    process.exit(1);
})

*/