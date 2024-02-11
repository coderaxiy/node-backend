const ApiError = require("../errors/ApiError");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model");

const createOrder = async (req, res) => {
  try {
    const { user_id, booking_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${user_id}`) ||
      !mongoose.isValidObjectId(`${booking_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const checkUser = await User.findById(user_id);
    const checkBooking = await Booking.findById(booking_id);

    if (!checkBooking || !checkUser) {
      console.log("booking: ", checkBooking, "user: ", checkUser);
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const newOrder = await Order({ user_id, booking_id });

    await newOrder.save();

    res
      .status(200)
      .send({ message: "Created successfully", success: true, data: newOrder });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user_id").exec();

    res
      .status(200)
      .send({ message: "Completed successfully", success: true, data: orders });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const order = await Order.findById(id).populate("user_id", "booking_id");

    if (!order) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res
      .status(200)
      .send({ message: "Completed successfully", success: true, data: order });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id." });
    }

    const { user_id, booking_id } = req.body;

    if (
      !mongoose.isValidObjectId(`${user_id}`) ||
      !mongoose.isValidObjectId(`${booking_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: id },
      { user_id, booking_id },
      { new: true }
    );

    await updatedOrder.save();

    res.status(200).send({
      message: "Updated succesfully",
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id." });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res.status(200).send({
      message: "Deleted successfully",
      success: true,
      data: deletedOrder,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createOrder,
  getListOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
};
