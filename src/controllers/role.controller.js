const ApiError = require("../errors/ApiError");
const mongoose = require("mongoose");
const Role = require("../models/Role.model");

const createRole = async (req, res) => {
  try {
    const { title, description } = req.body;

    const role = await Role({
      title,
      description,
    });

    await role.save();

    res.status(200).send({ message: "Created successfully", data: role });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getListRoles = async (req, res) => {
  try {
    const allRoles = await Role.find({});

    res.status(200).send({ message: "Comleted successfully", data: allRoles });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const role = await Role.findById(id);

    if (!role) {
      return res
        .status(404)
        .send({ message: "Not Found! Could not be found." });
    }

    res.status(200).send({ message: "Comleted successfully.", data: role });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const updateRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const { title, description } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      { _id: id },
      { title, description },
      { new: true }
    );

    if (!updatedRole) {
      res.status(404).send({ message: "Canceled, Could not be found." });
    }

    updatedRole.save();

    res
      .status(200)
      .send({ message: "Updated succeessfully.", data: updatedRole });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

const deleteRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(`${id}`)) {
      return res
        .status(400)
        .send({ message: "Canceled, sent the invalid id." });
    }

    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res
        .status(404)
        .send({ message: "Not Found, Could not be found." });
    }

    res
      .status(200)
      .send({ message: "Deleted successfully.", data: deletedRole });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Internal Error.",
    });
  }
};

module.exports = {
  createRole,
  getListRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
};
