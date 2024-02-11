const { Router } = require("express");

const {
  createShop,
  getListShops,
  getShopById,
  updateShopById,
  deleteShopById,
} = require("../controllers/shop.controller");

const router = Router();

//routers
router.post("/", createShop);
router.get("/", getListShops);
router.get("/:id", getShopById);
router.put("/:id", updateShopById);
router.delete("/:id", deleteShopById);

module.exports = router;
