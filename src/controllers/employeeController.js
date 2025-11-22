const { pool } = require("../db");

exports.getEmployees = async (req, res) => {
  const orgId = req.user.orgId;

  const result = await pool.query(
    `SELECT * FROM employees WHERE organisation_id = $1`,
    [orgId]
  );

  res.json(result.rows);
};

exports.createEmployee = async (req, res) => {
  const orgId = req.user.orgId;
  const { first_name, last_name, email, phone } = req.body;

  const result = await pool.query(
    `INSERT INTO employees (organisation_id, first_name, last_name, email, phone)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [orgId, first_name, last_name, email, phone]
  );

  res.json({ id: result.rows[0].id });
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  await pool.query(
    `UPDATE employees SET first_name=$1, last_name=$2, email=$3, phone=$4 WHERE id=$5`,
    [first_name, last_name, email, phone, id]
  );

  res.json({ message: "Employee updated" });
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  await pool.query(`DELETE FROM employees WHERE id=$1`, [id]);

  res.json({ message: "Employee deleted" });
};
