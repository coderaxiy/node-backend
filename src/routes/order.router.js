const { Router } = require("express");
const {
  createOrder,
  getListOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require("../controllers/order.controller");

const router = Router();

router.post("/", createOrder);
router.get("/", getListOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderById);
router.delete("/:id", deleteOrderById);

module.exports = router;
