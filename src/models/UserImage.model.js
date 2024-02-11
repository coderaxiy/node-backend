const { Schema, model } = require('mongoose');

const UserImageSchema = new Schema(
    {
        url: {
            type: String,
            trim: true,
        },
    },

    {
        timestamp: true,
        versionKey: false
    }
)

module.exports = model("UserImage", UserImageSchema)
