const express = require("express");
const { getEmployees, createEmployee, deleteEmployee, updateEmployee } = require("../controllers/employeeController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", auth, getEmployees);
router.post("/", auth, createEmployee);
router.delete("/:id", auth, deleteEmployee); 
router.put("/:id", auth, updateEmployee);

module.exports = router;
