const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      reference: "User",
    },

    booking_id: {
      type: Schema.Types.ObjectId,
      reference: "Booking",
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("Order", orderSchema);
