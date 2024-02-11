const { Router } = require("express");

const {
  createPlant,
  getListPlants,
  getPlantById,
  updatePlantById,
  deletePlantById,
  createPlantImage,
  getPlantImage
} = require("../controllers/plant.controller");
const uploadImage = require("../utils/Upload");
const Plant = require("../models/Plant.model");

const router = Router();

//routers
router.post("/", createPlant);
router.get("/", getListPlants);
router.post("/image-upload/:id", uploadImage("../store/plant", Plant), createPlantImage);
router.get("/:id", getPlantById);
router.put("/:id", updatePlantById);
router.delete("/:id", deletePlantById);
router.get("/image/:id", getPlantImage);

module.exports = router;
