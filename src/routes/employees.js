const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const router = express.Router();

router.get("/", auth, getEmployees);
router.post("/", auth, createEmployee);
router.put("/:id", auth, updateEmployee);
router.delete("/:id", auth, deleteEmployee);

module.exports = router;
