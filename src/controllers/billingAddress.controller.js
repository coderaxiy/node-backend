const ApiError = require("../errors/ApiError");
const BillingAddress = require("../models/BillingAddress.model");
const User = require("../models/User.model");
const Plant = require("../models/Plant.model");
const Order = require("../models/Order.model");
const mongoose = require("mongoose");

const createBillingAddress = async (req, res) => {
  try {
    const { user_id, plant_id, order_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${order_id}`) ||
      !mongoose.isValidObjectId(`${plant_id}`) ||
      !mongoose.isValidObjectId(`${user_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const checkOrder = await Order.findById(order_id);
    const checkUser = await User.findById(user_id);
    const checkPlant = await Plant.findById(plant_id);

    if (!checkOrder || !checkPlant || !checkUser) {
      return res.status(404).send({
        message: "Not Found, could not be found which one.",
        success: false,
      });
    }

    const { phone_number, house_street, zip, country, city, state } = req.body;

    const newBillingAddress = await BillingAddress({
      user_id,
      plant_id,
      order_id,
      phone_number,
      house_street,
      zip,
      country,
      city,
      state,
    });

    await newBillingAddress.save();

    res.status(200).send({
      message: "Created successfully",
      success: true,
      data: newBillingAddress,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListBillingAddress = async (req, res) => {
  try {
    const billingAddresses = await BillingAddress.find({});

    res.status(200).send({
      messsage: "Comleted successfully",
      success: true,
      data: billingAddresses,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getBillingAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const billingAddress = await BillingAddress.findById(id);

    if (!billingAddress) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found.", success: false });
    }

    res.status(200).send({
      message: "Completed successfully",
      success: true,
      data: billingAddress,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateBillingAddressById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const { user_id, plant_id, order_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${order_id}`) ||
      !mongoose.isValidObjectId(`${plant_id}`) ||
      !mongoose.isValidObjectId(`${user_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const checkOrder = await Order.findById(order_id);
    const checkUser = await User.findById(user_id);
    const checkPlant = await Plant.findById(plant_id);

    if (!checkOrder || !checkPlant || !checkUser) {
      return res.status(404).send({
        message: "Not Found, could not be found which one.",
        success: false,
      });
    }

    const { phone_number, house_street, zip, country, city, state } = req.body;

    const updatedBillingAddress = await BillingAddress.findByIdAndUpdate(
      { _id: id },
      {
        user_id,
        plant_id,
        order_id,
        phone_number,
        house_street,
        zip,
        country,
        city,
        state,
      },
      { new: true }
    );

    if (!updatedBillingAddress) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    await updatedBillingAddress.save();

    res.status(200).send({
      message: "Updated successfully",
      success: true,
      data: updatedBillingAddress,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteBillingAddresById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedBillingAddress = await BillingAddress.findByIdAndDelete(id);

    if (!deletedBillingAddress) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    res.status(200).send({
      message: "Deleted successfully",
      success: true,
      data: deletedBillingAddress,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createBillingAddress,
  getListBillingAddress,
  getBillingAddressById,
  updateBillingAddressById,
  deleteBillingAddresById,
};
