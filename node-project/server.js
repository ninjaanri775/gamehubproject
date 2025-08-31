require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connection");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*", credentials: true }));
app.use(express.json());

// Serve images in uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/favorites", require("./routes/favorites"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
