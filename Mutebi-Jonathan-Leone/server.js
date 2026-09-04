// Load environment variables
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db.js");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/beneficiaries", beneficiaryRoutes);

// View engine setup (Pug)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Serve static files (CSS, JS, images)
app.use(express.static(__dirname));

// Show main page for non-API routes
app.get("*", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
