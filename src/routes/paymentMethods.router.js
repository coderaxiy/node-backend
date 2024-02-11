const { Router } = require("express");
const {
  getListPaymentMethods,
  createPaymentMethod,
  updatePaymentMethodById,
  deletePaymentMethodById,
  getPaymentMethodById,
} = require("../controllers/paymentMethod.controller");

const router = Router();

//routers
router.get("/", getListPaymentMethods);
router.get("/:id", getPaymentMethodById);
router.post("/", createPaymentMethod);
router.patch("/:id", updatePaymentMethodById);
router.delete("/:id", deletePaymentMethodById);

module.exports = router;
