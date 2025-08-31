const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  const header = req.header("Authorization");
  const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // has role, name, email, etc.
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
