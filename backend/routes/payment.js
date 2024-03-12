import express from "express";
const router = express.Router();

import { isAuthenticateUser } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";

router
  .route("/payment/checkout_session")
  .post(isAuthenticateUser, stripeCheckoutSession);

router.route("/payment/webhook").post(stripeWebhook);
export default router;