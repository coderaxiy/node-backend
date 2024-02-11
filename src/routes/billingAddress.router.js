const { Router } = require("express");

const router = Router();

const {
  getListBillingAddress,
  createBillingAddress,
  getBillingAddressById,
  updateBillingAddressById,
  deleteBillingAddresById,
} = require("../controllers/billingAddress.controller");

router.post("/", createBillingAddress);
router.get("/", getListBillingAddress);
router.get("/:id", getBillingAddressById);
router.put("/:id", updateBillingAddressById);
router.delete("/:id", deleteBillingAddresById);

module.exports = router;
