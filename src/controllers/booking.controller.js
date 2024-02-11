const Booking = require("../models/Booking.model");
const User = require("../models/User.model");
const Plant = require("../models/Plant.model");
const PaymentMethod = require("../models/PaymentMethod.model");
const BillingAddress = require("../models/BillingAddress.model");
const ApiError = require("../errors/ApiError");
const mongoose = require("mongoose");
const Status = require("../models/Status.model");

const createBooking = async (req, res) => {
  try {
    const {
      user_id,
      plant_id,
      payment_method_id,
      billing_address_id,
      status_id,
    } = req.body;

    if (
      !mongoose.isValidObjectId(`${user_id}`) ||
      !mongoose.isValidObjectId(`${plant_id}`) ||
      !mongoose.isValidObjectId(`${payment_method_id}`) ||
      !mongoose.isValidObjectId(`${billing_address_id}`) ||
      !mongoose.isValidObjectId(`${status_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const checkUser = await User.findById(user_id);
    const checkPlant = await Plant.findById(plant_id);
    const checkPaymentMethod = await PaymentMethod.findById(payment_method_id);
    const checkBillingAddress = await BillingAddress.findById(
      billing_address_id
    );
    const checkStatus = await Status.findById(status_id);

    if (
      !checkPlant ||
      !checkUser ||
      !checkPaymentMethod ||
      !checkBillingAddress ||
      !checkStatus
    ) {
      return res.status(404).send({
        message: "Not Found, could not be found which one.",
        success: false,
      });
    }

    const { start_time, end_time } = req.body;

    const newBooking = await Booking({
      user_id,
      plant_id,
      payment_method_id,
      billing_address_id,
      status_id,
      start_time,
      end_time,
    });

    await newBooking.save();

    res.status(200).send({
      message: "Created successfully",
      success: true,
      data: newBooking,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListBookings = async (req, res) => {
  try {
    const allBookings = await Booking.find({});

    res
      .status(200)
      .send({ message: "Comleted successfully", data: allBookings });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, you sent the invalid id" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).send({ message: "Not Found, could not be found" });
    }

    res.status(200).send({ message: "Completed successfully", data: booking });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const {
      user_id,
      plant_id,
      payment_method_id,
      billing_address_id,
      status_id,
    } = req.body;

    if (
      !mongoose.isValidObjectId(`${user_id}`) ||
      !mongoose.isValidObjectId(`${plant_id}`) ||
      !mongoose.isValidObjectId(`${payment_method_id}`) ||
      !mongoose.isValidObjectId(`${billing_address_id}`) ||
      !mongoose.isValidObjectId(`${status_id}`)
    ) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    const checkUser = await User.findById(user_id);
    const checkPlant = await Plant.findById(plant_id);
    const checkPaymentMethod = await PaymentMethod.findById(payment_method_id);
    const checkBillingAddress = await BillingAddress.findById(
      billing_address_id
    );
    const checkStatus = await Status.findById(status_id);

    if (
      !checkPlant ||
      !checkUser ||
      !checkPaymentMethod ||
      !checkBillingAddress ||
      !checkStatus
    ) {
      return res.status(404).send({
        message: "Not Found, could not be found which one.",
        success: false,
      });
    }

    const { start_time, end_time } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      { _id: id },
      {
        user_id,
        plant_id,
        payment_method_id,
        billing_address_id,
        status_id,
        start_time,
        end_time,
      },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(400)
        .send({ message: "Bad Request, operation canceled." });
    }

    await updatedBooking.save();

    res.status(200).send({
      message: "Updated successfully",
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res
        .status(200)
        .send({ message: "Not Found, could not be found", success: false });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully", data: deletedBooking });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createBooking,
  getListBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
};
