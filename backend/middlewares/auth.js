import User from '../models/user.js';
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";

export const isAuthenticateUser  = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.token;
    //console.log("TOKEN123:" + token1);
    //const  token = req.headers.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
   
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }
    //const tokenValue = token.split('=')[1];   
    //console.log("TOKEN:" + tokenValue);
    //const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded:" + decoded.id);
    req.user = await User.findById(decoded.id);
    console.log("req.user: "+req.user );
    next();
})
// authorize user role
export const authorizeRoles  = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}