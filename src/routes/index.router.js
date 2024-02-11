const { Router } = require("express");

const categoryRouter = require("./category.router");
const paymentMethodRouter = require("./paymentMethods.router");
const shopRouter = require("../routes/shop.router");
const plantRouter = require("./plant.router");
const roleRouter = require("./role.router");
const userRouter = require("./user.router");
const reviewRouter = require("./review.router");
const billingAddressRouter = require("./billingAddress.router");
const orderRouter = require("./order.router");
const bookingRouter = require("./booking.router");
const statusRouter = require("./status.router");

const router = Router();

//routers
router.use("/category", categoryRouter);
router.use("/payment-method", paymentMethodRouter);
router.use("/shop", shopRouter);
router.use("/plant", plantRouter);
router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/review", reviewRouter);
router.use("/billing-address", billingAddressRouter);
router.use("/order", orderRouter);
router.use("/booking", bookingRouter);
router.use("/status", statusRouter);

module.exports = router;
