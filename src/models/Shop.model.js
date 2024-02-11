const { Schema, model } = require("mongoose");

const shopSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    lat: {
      type: String,
      trim: true,
    },

    long: {
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

module.exports = model("Shop", shopSchema);
