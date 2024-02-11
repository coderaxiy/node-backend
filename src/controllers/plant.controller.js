const ApiError = require("../errors/ApiError");
const Plant = require("../models/Plant.model");
const Category = require("../models/Category.model");
const Shop = require("../models/Shop.model");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const fs = require("fs/promises");
const {writeLogs} = require("../utils/writeLogs");

const createPlant = async (req, res) => {
  try {
    const { category_id, shop_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${category_id}`) ||
      !mongoose.isValidObjectId(`${shop_id}`)
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID." });
    }

    const checkCategory = await Category.findById(category_id);
    const checkShop = await Shop.findById(shop_id);

    if (!checkCategory || !checkShop) {
      return res
        .status(400)
        .send({ success: false, message: "Category or Shop parameters are invalid" });
    }

    const { title, price, size, sku_number, description } = req.body;

    const newPlant = await Plant({
      title,
      price,
      size,
      sku_number,
      description,
      category_id,
      shop_id,
    });

    newPlant.save();

    res.status(200).send({ success: true, data: newPlant });
  } catch (error) {
    writeLogs('createPlant', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const createPlantImage = async (req, res) => {
  if (req.params.id && !mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, error: 'Invalid plant ID' });
  }

  if (req.file) {
    const filename = req.params.id + path.extname(req.file.originalname);

    try {
      const plant = await Plant.findByIdAndUpdate({id:req.params.id}, {
        $push: {image: path.join(config.get('baseUrl'), 'plant/image/', filename)}
      }, { new: true });

      if (!plant) {
        return res.status(404).json({ success: false, error: 'Plant not found' });
      }

      await plant.save();

      res.status(200).json({ success: true });
    } catch (error) {
      writeLogs('createPlantImage', error)

      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ success: false, message: 'File must not be blank' });
  }
};

const getPlantImage = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiError.badRequest(res, {
        success: false,
        message: 'Bad Request'
      });
    }

    const id = req.params.id.split('.')[0];

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, error: 'Invalid plant ID' });
    }

    const filePath = path.join(__dirname, '../store/plant', req.params.id);

    res.sendFile(filePath, (err) => {
      if (err) return  ApiError.notFound(res, ({ success: false, message: 'Not Found' }));
    });

  } catch (error) {
    writeLogs('getPlantImage', error)

    if (error.code === 'ENOENT') {
      ApiError.notFound(res, ({ success: false, message: 'Not Found' }));
    } else {
      ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
    }
  }
};

const getListPlants = async (req, res) => {
  try {
    const allPlants = await Plant.find({});

    res
      .status(200)
      .send({ success: true, data: allPlants });
  } catch (error) {
    writeLogs('getListPlants', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Invalid ID" });
    }

    const plant = await Plant.findById(id);

    if (!plant) {
      return res
        .status(404)
        .send({ message: "Not Found" });
    }

    res.status(200).send(plant);
  } catch (error) {
    writeLogs('getPlantById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const updatePlantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Invalid ID" });
    }

    const { category_id, shop_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${category_id}`) ||
      !mongoose.isValidObjectId(`${shop_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Invalid Category or Shop ID" });
    }

    const checkCategory = await Category.findById(category_id);
    const checkShop = await Shop.findById(shop_id);

    if (!checkCategory || !checkShop) {
      return res
        .status(400)
        .send({ message: "Category and Shop are required" });
    }

    const { image, title, price, size, sku_number, description } = req.body;

    const updatedPlant = await Plant.findByIdAndUpdate(
      { _id: id },
      {
        image,
        title,
        price,
        size,
        sku_number,
        description,
        category_id,
        shop_id,
      },
      { new: true }
    );

    if (!updatedPlant) {
      return res
        .status(400)
        .send({ success: false, message: "Bad Request" });
    }

    updatedPlant.save();

    res
      .status(200)
      .send({ success: true, data: updatedPlant });
  } catch (error) {
    writeLogs('updatePlantById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

const deletePlantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid ID" });
    }

    const deletedPlant = await Plant.findByIdAndDelete(id);

    if (!deletedPlant) {
      return res
        .status(404)
        .send({ success: false, message: `Not Found` });
    }

    const plantImgDir = path.join(__dirname, '../store/plant')
    const files = await fs.readdir(plantImgDir);

    for (const file of files) {
      if (file.split('.')[0] === id) {
        await fs.unlink(path.join(plantImgDir, file));
        break;
      }
    }

    res
      .status(200)
      .send({ success: true, data: deletedPlant });
  } catch (error) {
    writeLogs('deletePlantById', error)

    ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
  }
};

module.exports = {
  createPlant,
  getListPlants,
  getPlantById,
  updatePlantById,
  deletePlantById,
  createPlantImage,
  getPlantImage
};
