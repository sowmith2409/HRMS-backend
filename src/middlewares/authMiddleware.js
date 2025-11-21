const jwt = require("jsonwebtoken");
const SECRET = "MY_SECRET_KEY";

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({error: "Authorization header missing"})
    }

  const token = header.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid JWT Token" });
  }
};
