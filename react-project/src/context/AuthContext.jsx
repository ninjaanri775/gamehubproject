import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("JWT payload:", payload);

      setUser({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role, // will now be "admin" or "user"
      });
    } catch (err) {
      console.error("Invalid token", err);
      setUser(null);
    }
  } else {
    setUser(null);
  }
}, [token]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};