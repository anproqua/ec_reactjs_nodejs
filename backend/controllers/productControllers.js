import Product from "../models/product.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
// show product => /api/v1/Product
export const getProducts = catchAsyncErrors(async(req,res,next) => {

    // const resPerPage = 4;
    // let  apiFilters = new APIFilters(Product.find(),req.query);   
   
    // if(req?.query!=""){
    //    // if(req?.query?.keyword){
    //         apiFilters = new APIFilters(Product.find(),req.query).search();
          
           
    //    // }
    // }  
    // let products = await apiFilters.query; // danh sach product tong
    // let filteredProductsCount = products.length;
    // apiFilters = apiFilters.pagination(resPerPage);  
    //  products = await apiFilters.query.clone();
    //  //.clone de fix loi  Query was already executed: Product.find({})
    //  // danh sach product phan trang
   
    // res.status(200).json({
    //     filteredProductsCount,
    //     products,
    //     resPerPage
    // }); 

    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();
  
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;
  
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();
  
    res.status(200).json({
      resPerPage,
      filteredProductsCount,
      products,
    });
    

});


// create new product => /api/v1/admin/Product
export const newProducts = async (req,res) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        product,
    });
}

//  product detail => /api/v1/Product/:id
export const getProductDetail = async (req, res, next) => {
    try {
        let product = await Product.findById(req?.params?.id);
        if (!product) {
            // return res.status(400).json({
            //     error: "Product not found"
            // });
            return next(new ErrorHandler("Product not found",404));
        }
        res.status(200).json({
            product,
        });

    } catch (error) {
        // res.json({
        //     error: "Product not found catch"
        // });
        return next(new ErrorHandler("Product not found 123",404));
    }
}

//  update product detail => /api/v1/Product/:id
export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req?.params?.id);
        if (!product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }

        product = await Product.findByIdAndUpdate(req?.params?.id,req.body,{new:true});

        res.status(200).json({
            product,
        });

    } catch (error) {
        res.json({
            error: "Product not found"
        });
    }
}

//  update product detail => /api/v1/Product/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req?.params?.id);
        if (!product) {
            return res.status(400).json({
                error: "Product not found"
            });
        }
        await product.deleteOne();
        res.status(200).json({
            product,
        });
    } catch (error) {
        res.json({
            error: "Product not found"
        });
    }
}


// Create new review   =>   /api/v1/review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    console.log("product.ratings: "+ product.ratings);

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    console.log("product.ratings newwww: "+ product.ratings);
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})


// Get Product Reviews   =>   /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,        
        reviews: product.reviews
    })
})

// Delete Product Review   =>   /api/v1/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);
    // lay review khac reviewid va cua sp find o tren
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    //product.reviews.reduce(...) initiates a reduction operation on the product.reviews array. 
    //This operation iterates over each review in the array and reduces it to a single value.
    //(acc, item) => item.rating + acc is the reducer function. 
    //It takes two parameters: acc (short for "accumulator") là giá trị hiện tại của accumulator
    //, được cập nhật sau mỗi lần gọi của hàm reducer. 
    // and item, which represents each review in the array
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})