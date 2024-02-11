const { Router } = require("express");

const {
    createReview,
    getReviewList
} = require("../controllers/review.controller");

const router = Router();

//routers
router.post("/", createReview);
router.get("/", getReviewList);

module.exports = router;
