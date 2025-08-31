require("dotenv").config();
const jwt = require("jsonwebtoken");

// Only the token string, no <>, no "Bearer "
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YjFjNTUyNDI0M2MyZGE0YmVmYmQ3NSIsImlhdCI6MTc1NjQ4MDg2OSwiZXhwIjoxNzU3MDg1NjY5fQ.JNqpvr1fAsN-sO9ayDKG1ps-0jSvHyJt2eTCtfQJb8E";

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Token valid:", decoded);
} catch (err) {
  console.log(err.name, "-", err.message);
}
