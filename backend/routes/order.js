import express from 'express';
const router = express.Router();

import {
    newOrder,
    getSingleOrder,
    myOrders,
    allOrders,
    updateOrder,
    deleteOrder

} from '../controllers/orderController.js';

import { isAuthenticateUser, authorizeRoles } from '../middlewares/auth.js';

router.route('/orders/new').post(isAuthenticateUser, newOrder);

router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/me/orders').get(isAuthenticateUser, myOrders);

router.route('/admin/orders/').get(isAuthenticateUser, authorizeRoles('admin'), allOrders);
router.route('/admin/order/:id')
    .put(isAuthenticateUser, authorizeRoles('admin'), updateOrder)
    .delete(isAuthenticateUser, authorizeRoles('admin'), deleteOrder);

export default router;