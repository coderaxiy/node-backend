const PaymentMethod = require("../models/PaymentMethod.model");
const mongoose = require("mongoose");
const ApiError = require("../errors/ApiError");

const createPaymentMethod = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newPaymentMethod = await PaymentMethod({
      title,
      description,
    });

    newPaymentMethod.save();

    res.status(200).send(newPaymentMethod);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListPaymentMethods = async (req, res) => {
  try {
    const listPaymentMethods = await PaymentMethod.find({});

    res.status(200).send(listPaymentMethods);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      res.status(404).send({ message: "Not found. Could not be found." });
    }

    res.status(200).send(paymentMethod);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updatePaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res.status(400).send({ message: "Canceled, sent the invalid id" });
    }

    const { title, description } = req.body;

    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    updatedPaymentMethod.save();

    res
      .status(200)
      .send({ message: "Successdully updated", data: updatedPaymentMethod });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deletePaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res.status(400).send({ message: "Canceled, sent the invalid id" });
    }

    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(id);

    res
      .status(200)
      .send({ message: "Successfully deleted", data: deletedPaymentMethod });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createPaymentMethod,
  getListPaymentMethods,
  updatePaymentMethodById,
  deletePaymentMethodById,
  getPaymentMethodById,
};
