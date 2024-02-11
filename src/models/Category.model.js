const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    }
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Category", categorySchema);
