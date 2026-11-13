import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useMock } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const loginEmail = useMock ? "demo@demo.com" : email;
    const loginPassword = useMock ? "demo" : password;

    const { error: err } = await login(loginEmail, loginPassword);
    setLoading(false);
    if (err) {
      setError(err.message || "Invalid credentials. Please try again.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          border: "1px solid var(--border)",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌿</div>
          <h1
            style={{
              margin: "0 0 0.25rem 0",
              fontSize: "16px",
              fontWeight: 800,
              color: "var(--brand)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            AGROVET POS
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>
            Veterinary &amp; Agro Chemical Point of Sale
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "4px",
              }}
            >
              Email
            </label>
            <input
              className="search-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required={!useMock}
              placeholder={useMock ? "demo@demo.com" : ""}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.4px",
                marginBottom: "4px",
              }}
            >
              Password
            </label>
            <input
              className="search-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required={!useMock}
              placeholder={useMock ? "demo" : ""}
            />
          </div>

          {error && (
            <div
              style={{
                borderLeft: "3px solid var(--danger)",
                background: "#fff5f5",
                color: "#9b1c1c",
                padding: "0.6rem 0.75rem",
                fontSize: "12px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn"
            type="submit"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.7rem",
              fontSize: "13px",
            }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {useMock && (
            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "var(--muted)",
                marginTop: "0.75rem",
              }}
            >
              Demo mode — click Sign In to continue
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
