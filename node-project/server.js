require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./db/connection");

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));


app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();


app.use("/api/auth", require("./routes/auth"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/favorites", require("./routes/favorites"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
