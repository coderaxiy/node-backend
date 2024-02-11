const { Router } = require("express");
const {
  createStatus,
  getListStatuses,
  getStatusById,
  updateStatusById,
  deleteStatusById,
} = require("../controllers/status.controller");

const router = Router();

//routers
router.post("/", createStatus);
router.get("/", getListStatuses);
router.get("/:id", getStatusById);
router.put("/:id", updateStatusById);
router.delete("/:id", deleteStatusById);

module.exports = router;
