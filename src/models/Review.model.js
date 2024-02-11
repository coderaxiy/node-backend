const { Schema, model } = require('mongoose')

const reviewSchema = new Schema(
    {
        rate: {
            type: String,
            trim: true,
        },

        comment: {
            type: String,
            trim: true,
        },

        plant_id: {
            type: Schema.Types.ObjectId,
            reference: 'Plant',
            required: true,
        },

        user_id: {
            type: Schema.Types.ObjectId,
            reference: 'User',
            required: true,
        }
    },

    {
        timestamps: true,
        versionKey: false,
    }
)

module.exports = model("Review", reviewSchema)
