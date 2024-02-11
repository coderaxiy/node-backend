const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      reference: "User",
    },

    plant_id: {
      type: Schema.Types.ObjectId,
      reference: "Plant",
    },

    payment_method_id: {
      type: Schema.Types.ObjectId,
      reference: "PaymentMethod",
    },

    billing_address_id: {
      type: Schema.Types.ObjectId,
      reference: "BillingAddress",
    },

    status_id: {
      type: Schema.Types.ObjectId,
      reference: "Status",
    },

    start_time: {
      type: String,
    },

    end_time: {
      type: String,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Booking", bookingSchema);
