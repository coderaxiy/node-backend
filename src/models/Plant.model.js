const { Schema, model } = require("mongoose");

const plantSchema = new Schema(
  {
    images: [
        {
            type: String,
            trim: true
        },
    ],

    title: {
      type: String,
      trim: true,
    },

    price: {
      type: String,
      trim: true,
    },

    size: {
      type: String,
      trim: true,
    },

    sku_number: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    shop_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Plant", plantSchema);
