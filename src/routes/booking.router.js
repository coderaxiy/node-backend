const { Router } = require("express");
const {
  createBooking,
  getListBookings,
  getBookingById,
  deleteBookingById,
  updateBookingById,
} = require("../controllers/booking.controller");

const router = Router();

//routers
router.post("/", createBooking);
router.get("/", getListBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBookingById);
router.delete("/:id", deleteBookingById);

module.exports = router;
