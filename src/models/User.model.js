const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    image: {
      type: String,
    },

    first_name: {
      type: String,
      trim: true,
    },

    last_name: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
    },

    phone_number: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    is_active: {
      type: Boolean,
    },

    is_ban: {
      type: Boolean,
    },

    refresh_token: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);
