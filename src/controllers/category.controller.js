const ApiError = require("../errors/ApiError");
const mongoose = require("mongoose");
const Category = require("../models/Category.model");

const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;

    const category = await Category({
      title,
      description,
    });

    await category.save();

    res.status(200).send({ message: "Created successfully", data: category });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({});

    res
      .status(200)
      .send({ message: "Comleted successfully", data: allCategories });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .send({ message: "Not Found! Could not be found." });
    }

    res.status(200).send({ message: "Comleted successfully.", data: category });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const { title, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).send({ message: "Canceled, Could not be found." });
    }

    updatedCategory.save();

    res
      .status(200)
      .send({ message: "Updated succeessfully.", data: updatedCategory });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .send({ message: "Not Found, Could not be found." });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully.", data: deletedCategory });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createCategory,
  getListCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
