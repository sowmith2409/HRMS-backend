const bcrypt = require("bcrypt");
const initDB = require("../db");
const { generateToken } = require("../models/utils");

exports.registerOrg = async (req, res) => {
  const db = await initDB();
  const { orgName, name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const org = await db.run(
    `INSERT INTO organisations (name) VALUES (?)`,
    [orgName]
  );

  const user = await db.run(
    `INSERT INTO users (organisation_id, email, name, password_hash, role)
     VALUES (?, ?, ?, ?, 'admin')`,
    [org.lastID, email, name, hashedPassword]
  );

  const token = generateToken({
    id: user.lastID,
    organisation_id: org.lastID,
    role: "admin"
  });

  res.json({ token });
};

exports.login = async (req, res) => {
  const db = await initDB();
  const { email, password } = req.body;

  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ message: "Invalid password" });

  const token = generateToken(user);
  res.json({ token });
};
