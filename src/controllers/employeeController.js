const initDB = require("../db");

exports.getEmployees = async (req, res) => {
  const db = await initDB();
  const employees = await db.all(
    `SELECT * FROM employees WHERE organisation_id = ?`,
    [req.user.orgId]
  );
  res.json(employees);
};

exports.createEmployee = async (req, res) => {
  const db = await initDB();
  const { first_name, last_name, email, phone } = req.body;

  const result = await db.run(
    `INSERT INTO employees (organisation_id, first_name, last_name, email, phone)
    VALUES (?, ?, ?, ?, ?)`,
    [req.user.orgId, first_name, last_name, email, phone]
  );

  res.json({ id: result.lastID });
};
 
// Delete Employee
exports.deleteEmployee = async (req, res) => {
  const db = await initDB();
  const { id } = req.params;

  const result = await db.run(
    `DELETE FROM employees WHERE id = ? AND organisation_id = ?`,
    [id, req.user.orgId]
  );

  if (result.changes === 0) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json({ message: "Employee deleted successfully" });
};

exports.updateEmployee = async (req, res) => {
  const db = await initDB();
  const { id } = req.params;
  const { first_name, last_name, email, phone } = req.body;

  try {
    await db.run(
      `UPDATE employees 
       SET first_name = ?, last_name = ?, email = ?, phone = ?
       WHERE id = ? AND organisation_id = ?`,
      [first_name, last_name, email, phone, id, req.user.orgId]
    );

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
};
