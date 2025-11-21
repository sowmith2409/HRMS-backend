const jwt = require("jsonwebtoken");
const SECRET = "MY_SECRET_KEY";

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      orgId: user.organisation_id,
      role: user.role
    },
    SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = { generateToken, SECRET };
