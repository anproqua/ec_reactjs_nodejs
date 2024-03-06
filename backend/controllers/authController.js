import User from "../models/user.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/jwtToken.js";
// const sendToken = require('../utils/jwtToken');
import sendEmail from '../utils/sendEmail.js';
import crypto  from 'crypto';
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";
// const cloudinary = require('cloudinary');
// Register a user   => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: 'avatars',
    //     width: 150,
    //     crop: "scale"
    // })
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        // avatar: {
        //     public_id: result.public_id,
        //     url: result.secure_url
        // }
    });
    sendToken(user,201,res);
   /* const token = await user.getJwtToken();
    res.status(201).json({
        // user,
        success:true,
        token,

    }); */
})
// Login User  =>  /a[i/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }
    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password !!!', 401));
    }
    sendToken(user, 200, res);
    /* const token = await user.getJwtToken();
     res.status(201).json({
         token,
     }); */   
})

// Logout user   =>   /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

// Forgot Password   =>  /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { return next(new ErrorHandler('User not found with this email', 404));}
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    //const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    
    const message = getResetPasswordTemplate(user.name,resetUrl);
    console.log("Toi day roi!");
    console.log("Gui email den:"+ user.email);
    console.log("resetToken:"+ resetToken);
    // resetToken:2d3188a1b42f5e7340cce71c73c44f2f64ffe6d4
    try {
        await sendEmail({email: user.email, subject: 'ShopIT Password Recovery', message});
        res.status(200).json({ success: true, message: `Email sent to: ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password   =>  /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log("resetPasswordToken:" + resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }
    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res)
})


// Get currently logged in user details   =>   /api/v1/me
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})


// Update Password  =>  /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {

     // vi models set thuoc tinh select cua password la false nen phai su dung select('password')
    const user = await User.findById(req?.user?._id).select("+password");
  
    // Check the previous user password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old Password is incorrect", 400));
    }
  
    user.password = req.body.password;
    user.save();
  
    res.status(200).json({
      success: true,
    });
  });


// Update user profile   =>   /api/v1/me/update
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // Update avatar
   /* if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id)

        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }*/

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false, 
        
    })

    res.status(200).json({
        success: true,
        user,        
    })
})




// Admin Routes

// Get all users   =>   /api/v1/admin/users
export const allUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})


// Get user details   =>   /api/v1/admin/user/:id
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user profile   =>   /api/v1/admin/user/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user,
    })
})

// Delete user   =>   /api/v1/admin/user/:id
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // Remove avatar from cloudinary
  /*  const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);*/

    await user.deleteOne();

    res.status(200).json({
        success: true,
    })    
})

// Upload user avatar   =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
    const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");
  
    // Remove previous avatar
    if (req?.user?.avatar?.url) {
      await delete_file(req?.user?.avatar?.public_id);
    }
  
    const user = await User.findByIdAndUpdate(req?.user?._id, {
      avatar: avatarResponse,
    });
  
    res.status(200).json({
      user,
    });
  });