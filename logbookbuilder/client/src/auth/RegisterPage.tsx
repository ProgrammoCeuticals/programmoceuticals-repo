import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { BookOpen } from "lucide-react";

const FIELDS = [
  {
    label: "Organisation name",
    field: "organizationName" as const,
    type: "text",
    placeholder: "Acme Regulatory Agency",
  },
  {
    label: "Your full name",
    field: "name" as const,
    type: "text",
    placeholder: "Full name",
  },
  {
    label: "Email address",
    field: "email" as const,
    type: "email",
    placeholder: "you@organisation.com",
  },
  {
    label: "Password",
    field: "password" as const,
    type: "password",
    placeholder: "Minimum 8 characters",
  },
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    organizationName: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Registration failed. Please try again.");
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
          <h1 className="auth-title">Create your organisation</h1>
          <p className="auth-subtitle">Set up your logbook workspace</p>

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
            {FIELDS.map(({ label, field, type, placeholder }) => (
              <label key={field} className="lb-field-label">
                {label}
                <input
                  type={type}
                  value={form[field]}
                  onChange={set(field)}
                  required
                  placeholder={placeholder}
                  className="pc-input"
                />
              </label>
            ))}

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
              {loading ? "Creating…" : "Create organisation"}
            </button>
          </form>

          <p className="auth-footnote">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
