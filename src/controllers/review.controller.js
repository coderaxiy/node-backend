const ApiError = require('../errors/ApiError');
const Review = require('../models/Review.model');
const mongoose = require("mongoose");
const Plant = require("../models/Plant.model");
const {writeLogs} = require("../utils/writeLogs");


const createReview = async (req, res) => {
    try {
        const { rate, comment, plant_id, user_id } = req.body;

        const review = await Review({
            rate,
            comment,
            plant_id,
            user_id,
        });

        await review.save();

        res.status(200).send({ success: true, data: review });
    } catch (error) {
        ApiError.internal(res, {
            success: false,
            message: "Internal Error.",
        });
    }
};

const getReviewList = async (req, res) => {
    try {
        const allReviews = await Review.find({});

        res
            .status(200)
            .send({ success: true, data: allReviews });
    } catch (error) {
        writeLogs('getReviewList', error)

        ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
    }
};

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(`${id}`)) {
            return res
                .status(400)
                .send({ message: "Invalid ID" });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res
                .status(404)
                .send({ message: "Not Found" });
        }

        res.status(200).send({success: true, data: review});
    } catch (error) {
        writeLogs('getReviewById', error)

        ApiError.internal(res, ({ success: false, message: 'Internal Server Error' }));
    }
};


module.exports = {
    createReview,
    getReviewList
}
