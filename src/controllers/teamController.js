const { pool } = require("../db");

exports.getTeams = async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM teams WHERE organisation_id = $1`,
    [req.user.orgId]
  );
  res.json(result.rows);
};

exports.createTeam = async (req, res) => {
  const { name, description } = req.body;
  const result = await pool.query(
    `INSERT INTO teams (organisation_id, name, description)
     VALUES ($1, $2, $3) RETURNING id`,
    [req.user.orgId, name, description]
  );
  res.json({ id: result.rows[0].id });
};

exports.updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  await pool.query(
    `UPDATE teams SET name=$1, description=$2 WHERE id=$3`,
    [name, description, id]
  );

  res.json({ message: "Team updated" });
};

exports.deleteTeam = async (req, res) => {
  const { id } = req.params;

  await pool.query(`DELETE FROM teams WHERE id=$1`, [id]);

  res.json({ message: "Team deleted" });
};
