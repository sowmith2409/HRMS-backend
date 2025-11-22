const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const SECRET = process.env.JWT_SECRET || "default_secret";

exports.registerOrg = async (req, res) => {
  const { orgName, name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const org = await pool.query(
    `INSERT INTO organisations (name) VALUES ($1) RETURNING id`,
    [orgName]
  );

  const user = await pool.query(
    `INSERT INTO users (organisation_id, email, name, password_hash)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [org.rows[0].id, email, name, hashed]
  );

  const token = jwt.sign(
    { userId: user.rows[0].id, orgId: org.rows[0].id },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: "Invalid email" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { userId: user.id, orgId: user.organisation_id },
    SECRET,
    { expiresIn: "8h" }
  );

  res.json({ token });
};
