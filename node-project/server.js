import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import offerRoutes from "./routes/offers.js";

dotenv.config();

const app = express();

// --- CORS setup ---
const allowedOrigins = process.env.CORS_ORIGIN.split(",");
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow Postman or server requests
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `CORS blocked: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/offers", offerRoutes);

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));