const ApiError = require("../errors/ApiError");
const mongoose = require("mongoose");
const Status = require("../models/Status.model");

const createStatus = async (req, res) => {
  try {
    const { title, description } = req.body;

    const check = await Status.findOne({ title });

    if (check) {
      return res
        .status(403)
        .send({ message: "Canceled, cannot be a duplicate" });
    }

    const status = await Status({
      title,
      description,
    });

    await status.save();

    res.status(200).send({ message: "Created successfully", data: status });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListStatuses = async (req, res) => {
  try {
    const allStatuses = await Status.find({});

    res.status(200).send({
      message: "Comleted successfully",
      success: true,
      data: allStatuses,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const status = await Status.findById(id);

    if (!status) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res.status(200).send({
      message: "Completed successfully.",
      success: true,
      data: status,
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const { title, description } = req.body;

    const updatedStatus = await Status.findByIdAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    if (!updatedStatus) {
      res.status(404).send({ message: "Canceled, could not be found." });
    }

    await updatedStatus.save();

    res
      .status(200)
      .send({ message: "Updated succeessfully.", data: updatedStatus });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteStatusById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedStatus = await Status.findByIdAndDelete(id);

    if (!deletedStatus) {
      return res
        .status(404)
        .send({ message: "Not Found, could not be found." });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully.", data: deletedStatus });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createStatus,
  getStatusById,
  getListStatuses,
  updateStatusById,
  deleteStatusById,
};
