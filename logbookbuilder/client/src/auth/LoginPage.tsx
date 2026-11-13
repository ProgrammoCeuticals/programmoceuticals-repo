import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { BookOpen, Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Navy header */}
        <div className="auth-card-header">
          <div className="auth-icon-box">
            <BookOpen size={13} color="#ffffff" />
          </div>
          <span className="wordmark">
            Logbook<span>Builder</span>
          </span>
        </div>

        {/* Body */}
        <div className="auth-card-body">
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your workspace
          </p>

          {error && (
            <div
              className="pc-alert pc-alert-error"
              style={{ marginBottom: "0.5rem" }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "0.85rem" }}
          >
            <label className="lb-field-label">
              Email address
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@organisation.com"
                className="pc-input"
              />
            </label>

            <label className="lb-field-label">
              Password
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="pc-input"
                  style={{ paddingRight: "2.25rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--muted)",
                    display: "flex",
                    padding: "0.2rem",
                  }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="pc-btn pc-btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "0.25rem",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-footnote">
            No account? <Link to="/register">Create your organisation</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
