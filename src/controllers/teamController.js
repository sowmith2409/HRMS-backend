const initDB = require("../db");

exports.getTeams = async (req, res) => {
  const db = await initDB();
  const teams = await db.all(
    `SELECT * FROM teams WHERE organisation_id = ?`,
    [req.user.orgId]
  );
  res.json(teams);
};

exports.createTeam = async (req, res) => {
  const db = await initDB();
  const { name, description } = req.body;

  const result = await db.run(
    `INSERT INTO teams (organisation_id, name, description)
     VALUES (?, ?, ?)`,
    [req.user.orgId, name, description]
  );

  res.json({ id: result.lastID });
};

exports.deleteTeam = async (req, res) => {
  const db = await initDB();
  const { id } = req.params;

  await db.run(
    `DELETE FROM teams WHERE id = ? AND organisation_id = ?`,
    [id, req.user.orgId]
  );

  res.json({ message: "Team deleted successfully" });
};

exports.updateTeam = async (req, res) => {
  const db = await initDB();
  const id = req.params.id;
  const { name, description } = req.body;

  const result = await db.run(
    `UPDATE teams 
     SET name=?, description=? 
     WHERE id=? AND organisation_id=?`,
    [name, description, id, req.user.orgId]
  );

  if (result.changes === 0) {
    return res.status(404).json({ message: "Team not found" });
  }

  res.json({ message: "Team updated successfully" });
};
