export default (err, req, res, next) => {
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || "Internal Server Error",
    };

    console.log("errors:" + process.env.NODE_ENV);
    if(process.env.NODE_ENV === 'development') {

        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack:err?.stack
        })


    };
    if(process.env.NODE_ENV === "production") {
        res.status(error.statusCode).json({
            message: error.message,
        })
    };  

     // Handling Mongoose duplicate key errors
     if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        error = new ErrorHandler(message, 400)
    }

    // Handling wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'JSON Web Token is invalid. Try Again!!!'
        error = new ErrorHandler(message, 400)
    }

    // Handling Expired JWT error
    if (err.name === 'TokenExpiredError') {
        const message = 'JSON Web Token is expired. Try Again!!!'
        error = new ErrorHandler(message, 400)
    }
    
}