const { Schema, model } = require("mongoose");

const billingAddressSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      reference: "User",
    },

    plant_id: {
      type: Schema.Types.ObjectId,
      reference: "Plant",
    },

    order_id: {
      type: Schema.Types.ObjectId,
      reference: "Order",
    },

    phone_number: {
      type: String,
    },

    house_street: {
      type: String,
      trim: true,
    },

    zip: {
      type: String,
    },

    country: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("BillingAddress", billingAddressSchema);
