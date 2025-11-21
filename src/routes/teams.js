const express = require("express");
const { getTeams, createTeam, deleteTeam, updateTeam } = require("../controllers/teamController");
const auth = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", auth, getTeams);
router.post("/", auth, createTeam);
router.delete("/:id", auth, deleteTeam);
router.put("/:id", auth, updateTeam);

module.exports = router;
