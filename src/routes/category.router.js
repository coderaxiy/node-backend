const { Router } = require("express");

const {
  createCategory,
  getListCategories,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
} = require("../controllers/category.controller");

const router = Router();

//routers
router.post("/", createCategory);
router.get("/", getListCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategoryById);
router.delete("/:id", deleteCategoryById);

module.exports = router;
