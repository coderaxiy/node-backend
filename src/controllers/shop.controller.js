const ApiError = require("../errors/ApiError");
const Shop = require("../models/Shop.model");
const mongoose = require("mongoose");

const createShop = async (req, res) => {
  try {
    const { title, lat, long, description } = req.body;

    const newShop = await Shop({ title, lat, long, description });

    newShop.save();

    res.status(200).send({ message: "Created successfully", data: newShop });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListShops = async (req, res) => {
  try {
    const allShops = await Shop.find({});

    res
      .status(200)
      .send({ message: "Completed successfully.", data: allShops });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).send({ message: "Canceled, could not be found." });
    }

    res.status(200).send({ message: "Completed successfully.", data: shop });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateShopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const { title, lat, long, description } = req.body;

    const updatedShop = await Shop.findByIdAndUpdate(
      { _id: id },
      { title, lat, long, description },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(400).send({ message: "Bad Request, not completed." });
    }

    res
      .status(200)
      .send({ message: "Updated successfully.", data: updatedShop });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteShopById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return res.status(404).send({ message: "Canceled, could not be found." });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully.", data: deletedShop });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createShop,
  getListShops,
  getShopById,
  updateShopById,
  deleteShopById,
};
