import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name:{
        type: String,
        //require: [true, "Please enter your product name"],
        //maxLength: [200, "Product name can not exceed 200 characters"]
    },
    price:{
        type:Number,
        //require: [true, "Please enter product price"],
        //maxLength: [5, "Product price can not exceed 5 digits"]
    },
    description:{
        type: String,
        //require: [true, "Please enter product description"],
        //maxLength: [200, "Description can not exceed 200 characters"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type: String,
            },
            url:{
                type: String
            }
        }
    ],
    category:{
        type: String,
        //require: [true, "Please enter product category"],
        enum:{
            values:[
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message:"Please select correct category"
        }
    },
    seller:{
        type: String,
        //require:[true,"Please enter product seller"]
    },
    stock:{
        type: Number,
        //require:[true,"Please enter product stock"]
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
                //require:true
            },
            rating:{
                type: Number,
                //require: true
            },
            comment:{
                type: String,
               // require: true
            }

        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        //require: true
    },

}, {timestamps:true});

export default mongoose.model("Product",productSchema);