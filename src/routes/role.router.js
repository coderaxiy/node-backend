const { Router } = require("express");

const {
  createRole,
  getListRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} = require("../controllers/role.controller");

const router = Router();

//routers
router.post("/", createRole);
router.get("/", getListRoles);
router.get("/:id", getRoleById);
router.put("/:id", updateRoleById);
router.delete("/:id", deleteRoleById);

module.exports = router;
