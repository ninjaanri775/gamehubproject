import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { OffersProvider } from "./context/OffersContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <OffersProvider>
          <App />
        </OffersProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
