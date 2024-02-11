const { Schema, model } = require("mongoose");

const roleSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Role", roleSchema);
