const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const teamRoutes = require("./routes/teams");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);

app.get("/", (req, res) => res.send("HRMS API is running"));

const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
