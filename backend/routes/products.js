import express from 'express';
import { createProductReview, deleteProduct, deleteReview, getProductDetail, getProductReviews, getProducts, newProducts, updateProduct } from '../controllers/productControllers.js';
import { authorizeRoles, isAuthenticateUser } from '../middlewares/auth.js';
const router = express.Router();


//router.route("/products").get(authorizeRoles("admin"),getProducts);
//router.route("/products").get(isAuthenticateUser,authorizeRoles("admin"),getProducts);
router.route("/products").get(getProducts);
router.route("/admin/products").post(newProducts);
router.route("/products/:id").get(getProductDetail);
router.route("/admin/products/:id")
.put(updateProduct)
.delete(deleteProduct);

router.route("/review").put(isAuthenticateUser,createProductReview);
router.route("/reviews").get(isAuthenticateUser,getProductReviews);
router.route("/admin/reviews").delete(isAuthenticateUser,authorizeRoles("admin"),deleteReview);
export default router;