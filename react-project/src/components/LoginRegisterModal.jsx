// LoginRegisterModal.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginRegisterModal({ isOpen, onClose }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", repeatPassword: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && form.password !== form.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const endpoint = isLogin
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        login(data.token);
      } else {
        setIsLogin(true);
        setForm({ name: "", email: form.email, password: "", repeatPassword: "" });
        return;
      }

      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Login/Register error:", err);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="switch-buttons">
          <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>Login</button>
          <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>Register</button>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {!isLogin && (
            <div style={{ position: "relative" }}>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                placeholder="Repeat Password"
                value={form.repeatPassword}
                onChange={handleChange}
                required
              />
              <span
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                onClick={() => setShowRepeatPassword((prev) => !prev)}
              >
                {showRepeatPassword ? "🙈" : "👁️"}
              </span>
            </div>
          )}

          <button type="submit">Confirm</button>
        </form>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
