import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const u = creds.username.toLowerCase().trim();
    const p = creds.password.toLowerCase().trim();
    if (u === "glsi" && p === "glsi") {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
      <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "2.5rem 2rem", width: "100%", maxWidth: 360, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🧾</div>
          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "16px", fontWeight: 800, color: "#193441", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            GLSI Vetter
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Global Listing Supermarket Inventory</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>
              Username
            </label>
            <input
              type="text"
              value={creds.username}
              onChange={(e) => setCreds({ ...creds, username: e.target.value })}
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none" }}
              autoComplete="username"
              required
            />
          </div>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "4px" }}>
              Password
            </label>
            <input
              type="password"
              value={creds.password}
              onChange={(e) => setCreds({ ...creds, password: e.target.value })}
              style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none" }}
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <div style={{ background: "#fff5f5", border: "1px solid #feb2b2", color: "#9b1c1c", padding: "0.6rem 0.75rem", fontSize: "12px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn" style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "13px" }}>
            Login to GLSI
          </button>
        </form>
      </div>
    </div>
  );
}
