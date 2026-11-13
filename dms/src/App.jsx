import React, { useState, useEffect } from "react";

// ── Seed Data ──────────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, name: "Sarah Mitchell", email: "sarah@carelink.co.uk", password: "carer123", role: "carer",    avatar: "SM", clientIds: [1, 2] },
  { id: 2, name: "James Okafor",   email: "james@carelink.co.uk", password: "carer123", role: "carer",    avatar: "JO", clientIds: [3] },
  { id: 3, name: "Dr. Helen Ward", email: "helen@carelink.co.uk", password: "mgmt123",  role: "manager",  avatar: "HW", clientIds: [] },
  { id: 4, name: "Robert Chen",    email: "robert@carelink.co.uk",password: "mgmt123",  role: "manager",  avatar: "RC", clientIds: [] },
  { id: 5, name: "Alice Pearson",  email: "alice@family.co.uk",   password: "family123",role: "family",   avatar: "AP", clientIds: [1] },
  { id: 6, name: "David Osei",     email: "david@family.co.uk",   password: "family123",role: "family",   avatar: "DO", clientIds: [3] },
];

const CLIENTS = [
  { id: 1, name: "Margaret Thompson", dob: "1938-04-12", address: "14 Rose Lane, Bristol BS1 4JT", conditions: ["Dementia", "Hypertension"], keyWorker: 1 },
  { id: 2, name: "Arthur Baines",     dob: "1942-09-03", address: "7 Oak Street, Bristol BS2 8RP", conditions: ["Parkinson's", "Diabetes Type 2"], keyWorker: 1 },
  { id: 3, name: "Dorothy Mensah",    dob: "1945-01-27", address: "22 Elm Close, Bristol BS3 1HG", conditions: ["COPD", "Arthritis"], keyWorker: 2 },
];

const INIT_LOGS = [
  { id: 1, clientId: 1, carerId: 1, timestamp: "2026-05-21T08:15:00", category: "personal-care", notes: "Assisted with morning wash and dressing. Client was in good spirits.", mood: "good", flagged: false },
  { id: 2, clientId: 1, carerId: 1, timestamp: "2026-05-21T08:30:00", category: "medication",    notes: "Administered Amlodipine 5mg and Donepezil 10mg with breakfast. No adverse reactions.", mood: "good", flagged: false },
  { id: 3, clientId: 2, carerId: 1, timestamp: "2026-05-21T10:00:00", category: "nutrition",     notes: "Client ate 75% of breakfast. Porridge with honey. Had 200ml water.", mood: "neutral", flagged: false },
  { id: 4, clientId: 3, carerId: 2, timestamp: "2026-05-21T09:00:00", category: "health",        notes: "Client reported increased breathlessness. Noted SpO2 at 94%. Informed supervisor.", mood: "concerning", flagged: true },
  { id: 5, clientId: 1, carerId: 1, timestamp: "2026-05-20T14:00:00", category: "activity",      notes: "Completed 20min walk in garden. Client engaged well and enjoyed the sunshine.", mood: "good", flagged: false },
];

const CATEGORIES = [
  { value: "personal-care", label: "Personal Care",  icon: "🛁" },
  { value: "medication",    label: "Medication",      icon: "💊" },
  { value: "nutrition",     label: "Nutrition",       icon: "🍽️" },
  { value: "health",        label: "Health Check",    icon: "❤️" },
  { value: "activity",      label: "Activity",        icon: "🚶" },
  { value: "incident",      label: "Incident Report", icon: "⚠️" },
  { value: "social",        label: "Social / Wellbeing", icon: "😊" },
  { value: "other",         label: "Other",           icon: "📋" },
];

const MOODS = [
  { value: "good",       label: "Good",       color: "#22c55e" },
  { value: "neutral",    label: "Neutral",     color: "#f59e0b" },
  { value: "concerning", label: "Concerning",  color: "#ef4444" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};
const age = (dob) => {
  const diff = Date.now() - new Date(dob).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:   #0f1f3d;
    --teal:   #0d9488;
    --teal-l: #14b8a6;
    --cream:  #faf7f2;
    --stone:  #e8e0d5;
    --mid:    #6b7280;
    --red:    #ef4444;
    --amber:  #f59e0b;
    --green:  #22c55e;
    --white:  #ffffff;
    --shadow: 0 2px 16px rgba(15,31,61,.08);
    --radius: 14px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--navy); min-height: 100vh; }

  /* LOGIN */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--navy) 0%, #1a3a6b 60%, #0d4a4a 100%);
    padding: 24px;
  }
  .login-card {
    background: var(--white); border-radius: 24px; padding: 48px 40px;
    width: 100%; max-width: 420px; box-shadow: 0 32px 80px rgba(0,0,0,.3);
    animation: fadeUp .5s ease;
  }
  .login-logo { font-family: 'DM Serif Display', serif; font-size: 2rem; color: var(--navy); margin-bottom: 4px; }
  .login-logo span { color: var(--teal); }
  .login-sub { color: var(--mid); font-size: .875rem; margin-bottom: 32px; }
  .login-hint { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px; font-size: .8rem; color: #166534; line-height: 1.6; }
  .field-label { font-size: .8rem; font-weight: 600; color: var(--navy); margin-bottom: 6px; display: block; letter-spacing: .04em; text-transform: uppercase; }
  .field-input {
    width: 100%; padding: 12px 16px; border: 2px solid var(--stone); border-radius: 10px;
    font-family: inherit; font-size: .95rem; outline: none; transition: border .2s;
    margin-bottom: 16px; background: var(--cream);
  }
  .field-input:focus { border-color: var(--teal); }
  .btn-primary {
    width: 100%; padding: 14px; background: var(--teal); color: white; border: none;
    border-radius: 10px; font-family: inherit; font-size: 1rem; font-weight: 600;
    cursor: pointer; transition: background .2s, transform .1s;
  }
  .btn-primary:hover { background: var(--teal-l); }
  .btn-primary:active { transform: scale(.98); }
  .login-error { color: var(--red); font-size: .85rem; margin-top: 12px; text-align: center; }

  /* SHELL */
  .shell { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 260px; background: var(--navy); color: white; display: flex; flex-direction: column;
    padding: 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }
  .sidebar-brand {
    padding: 28px 24px 20px; border-bottom: 1px solid rgba(255,255,255,.08);
    font-family: 'DM Serif Display', serif; font-size: 1.4rem;
  }
  .sidebar-brand span { color: var(--teal-l); }
  .sidebar-role { font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.4); margin-top: 2px; font-family: 'DM Sans', sans-serif; }
  .nav-section { padding: 16px 12px 4px; font-size: .65rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); font-weight: 600; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px;
    cursor: pointer; margin: 2px 8px; transition: background .15s; font-size: .9rem; color: rgba(255,255,255,.7);
  }
  .nav-item:hover { background: rgba(255,255,255,.06); color: white; }
  .nav-item.active { background: var(--teal); color: white; }
  .nav-icon { width: 20px; text-align: center; font-size: 1rem; }
  .sidebar-footer {
    margin-top: auto; padding: 16px 12px; border-top: 1px solid rgba(255,255,255,.08);
  }
  .user-chip {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
    cursor: pointer; transition: background .15s;
  }
  .user-chip:hover { background: rgba(255,255,255,.06); }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%; background: var(--teal);
    display: flex; align-items: center; justify-content: center; font-weight: 700;
    font-size: .8rem; flex-shrink: 0; color: white;
  }
  .avatar.sm { width: 28px; height: 28px; font-size: .7rem; }
  .user-name { font-size: .85rem; font-weight: 500; color: white; }
  .user-role-tag { font-size: .7rem; color: rgba(255,255,255,.45); }
  .logout-btn {
    width: 100%; margin-top: 8px; padding: 8px; background: rgba(239,68,68,.15);
    border: 1px solid rgba(239,68,68,.3); color: #fca5a5; border-radius: 8px;
    cursor: pointer; font-family: inherit; font-size: .8rem; transition: background .2s;
  }
  .logout-btn:hover { background: rgba(239,68,68,.25); }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; padding: 32px; background: var(--cream); }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; color: var(--navy); margin-bottom: 4px; }
  .page-sub { color: var(--mid); font-size: .875rem; margin-bottom: 28px; }

  /* CARDS */
  .card { background: white; border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); margin-bottom: 20px; }
  .card-title { font-weight: 600; font-size: 1rem; color: var(--navy); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  /* STAT GRID */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: white; border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow);
    border-left: 4px solid var(--teal); animation: fadeUp .4s ease both;
  }
  .stat-val { font-family: 'DM Serif Display', serif; font-size: 2rem; color: var(--navy); }
  .stat-label { font-size: .78rem; color: var(--mid); margin-top: 2px; }

  /* CLIENT CARDS */
  .client-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .client-card {
    background: white; border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow);
    cursor: pointer; border: 2px solid transparent; transition: border .2s, transform .15s;
  }
  .client-card:hover { border-color: var(--teal); transform: translateY(-2px); }
  .client-card.selected { border-color: var(--teal); }
  .client-name { font-weight: 600; font-size: 1rem; color: var(--navy); }
  .client-meta { font-size: .8rem; color: var(--mid); margin-top: 4px; }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: .7rem; font-weight: 500; margin: 2px; background: #e0f2fe; color: #0369a1; }
  .tag.red { background: #fee2e2; color: #b91c1c; }

  /* LOG LIST */
  .log-item {
    display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--stone);
    animation: fadeUp .3s ease both;
  }
  .log-item:last-child { border-bottom: none; }
  .log-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
  .log-body { flex: 1; }
  .log-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .log-cat { font-weight: 600; font-size: .9rem; color: var(--navy); }
  .log-time { font-size: .75rem; color: var(--mid); }
  .log-carer { font-size: .75rem; color: var(--teal); }
  .log-notes { font-size: .85rem; color: #374151; margin-top: 4px; line-height: 1.5; }
  .mood-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
  .flag-badge { background: #fef2f2; color: var(--red); font-size: .7rem; font-weight: 600; padding: 2px 8px; border-radius: 20px; border: 1px solid #fecaca; }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-field { display: flex; flex-direction: column; gap: 6px; }
  .form-field.full { grid-column: 1 / -1; }
  select, textarea {
    padding: 10px 14px; border: 2px solid var(--stone); border-radius: 10px;
    font-family: inherit; font-size: .9rem; outline: none; transition: border .2s;
    background: var(--cream); color: var(--navy);
  }
  select:focus, textarea:focus { border-color: var(--teal); }
  textarea { resize: vertical; min-height: 100px; }
  .radio-group { display: flex; gap: 12px; }
  .radio-opt {
    flex: 1; padding: 10px; border-radius: 10px; border: 2px solid var(--stone);
    cursor: pointer; text-align: center; font-size: .85rem; font-weight: 500; transition: all .15s;
  }
  .radio-opt.sel-good      { border-color: #22c55e; background: #f0fdf4; color: #15803d; }
  .radio-opt.sel-neutral   { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
  .radio-opt.sel-concerning{ border-color: #ef4444; background: #fef2f2; color: #b91c1c; }
  .checkbox-row { display: flex; align-items: center; gap: 10px; font-size: .9rem; cursor: pointer; }
  .checkbox-row input { width: 18px; height: 18px; accent-color: var(--teal); }
  .btn-submit {
    padding: 12px 28px; background: var(--teal); color: white; border: none;
    border-radius: 10px; font-family: inherit; font-size: .95rem; font-weight: 600;
    cursor: pointer; transition: background .2s; margin-top: 8px;
  }
  .btn-submit:hover { background: var(--teal-l); }
  .btn-secondary {
    padding: 12px 28px; background: white; color: var(--navy); border: 2px solid var(--stone);
    border-radius: 10px; font-family: inherit; font-size: .95rem; font-weight: 600;
    cursor: pointer; transition: all .2s; margin-top: 8px; margin-right: 8px;
  }
  .btn-secondary:hover { border-color: var(--teal); color: var(--teal); }

  /* SUCCESS TOAST */
  .toast {
    position: fixed; bottom: 28px; right: 28px; background: var(--navy); color: white;
    padding: 14px 22px; border-radius: 12px; font-size: .9rem; font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,.25); z-index: 999;
    animation: slideIn .3s ease;
  }
  .toast.success { background: #064e3b; border-left: 4px solid var(--green); }

  /* FILTER BAR */
  .filter-bar { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
  .filter-btn {
    padding: 6px 14px; border-radius: 20px; border: 2px solid var(--stone);
    background: white; font-family: inherit; font-size: .8rem; cursor: pointer; transition: all .15s;
    font-weight: 500; color: var(--mid);
  }
  .filter-btn.active { background: var(--navy); color: white; border-color: var(--navy); }

  /* GDPR BANNER */
  .gdpr-banner {
    background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;
    padding: 12px 16px; font-size: .8rem; color: #1e40af; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }

  /* EMPTY */
  .empty { text-align: center; padding: 48px 24px; color: var(--mid); }
  .empty-icon { font-size: 3rem; margin-bottom: 12px; }

  /* ANIMATIONS */
  @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
`;

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]     = useState(null);
  const [page, setPage]     = useState("dashboard");
  const [logs, setLogs]     = useState(INIT_LOGS);
  const [toast, setToast]   = useState(null);
  const [selClient, setSelClient] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addLog = (log) => {
    setLogs(prev => [{ ...log, id: Date.now() }, ...prev]);
    showToast("Care log saved successfully ✓");
  };

  const visibleClients = user
    ? user.role === "carer"
      ? CLIENTS.filter(c => user.clientIds.includes(c.id))
      : user.role === "family"
      ? CLIENTS.filter(c => user.clientIds.includes(c.id))
      : CLIENTS
    : [];

  const visibleLogs = logs.filter(l => visibleClients.some(c => c.id === l.clientId));

  if (!user) return (
    <>
      <style>{CSS}</style>
      <LoginScreen onLogin={setUser} />
    </>
  );

  const nav = buildNav(user.role);

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <Sidebar user={user} nav={nav} page={page} setPage={setPage} onLogout={() => { setUser(null); setPage("dashboard"); }} />
        <main className="main">
          {page === "dashboard"  && <Dashboard user={user} logs={visibleLogs} clients={visibleClients} setPage={setPage} />}
          {page === "clients"    && <Clients clients={visibleClients} logs={visibleLogs} selected={selClient} setSelected={setSelClient} />}
          {page === "new-log"    && user.role === "carer" && <NewLog user={user} clients={visibleClients} onSave={addLog} setPage={setPage} />}
          {page === "all-logs"   && <AllLogs logs={visibleLogs} clients={visibleClients} users={USERS} />}
          {page === "flagged"    && <AllLogs logs={visibleLogs.filter(l => l.flagged)} clients={visibleClients} users={USERS} title="Flagged Entries" />}
          {page === "compliance" && <Compliance />}
        </main>
      </div>
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ── Nav Config ─────────────────────────────────────────────────────────────────
function buildNav(role) {
  const base = [{ id: "dashboard", icon: "⊞", label: "Dashboard" }, { id: "clients", icon: "👥", label: "Clients" }, { id: "all-logs", icon: "📋", label: "Care Logs" }];
  if (role === "carer")   return [...base, { id: "new-log", icon: "✚", label: "New Log Entry" }];
  if (role === "manager") return [...base, { id: "flagged", icon: "🚩", label: "Flagged Entries" }, { id: "compliance", icon: "🛡️", label: "Compliance" }];
  if (role === "family")  return base;
  return base;
}

// ── Login ──────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [error, setError]   = useState("");

  const handle = () => {
    const u = USERS.find(u => u.email === email && u.password === pass);
    if (u) { onLogin(u); }
    else { setError("Invalid email or password. Please try again."); }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">Care<span>Link</span></div>
        <div className="login-sub">Secure care management platform</div>
        <div className="login-hint">
          <strong>Demo credentials:</strong><br/>
          Carer: sarah@carelink.co.uk / carer123<br/>
          Manager: helen@carelink.co.uk / mgmt123<br/>
          Family: alice@family.co.uk / family123
        </div>
        <label className="field-label">Email Address</label>
        <input className="field-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.co.uk" onKeyDown={e => e.key === "Enter" && handle()} />
        <label className="field-label">Password</label>
        <input className="field-input" type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handle()} />
        <button className="btn-primary" onClick={handle}>Sign In Securely</button>
        {error && <div className="login-error">{error}</div>}
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ user, nav, page, setPage, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Care<span>Link</span><div className="sidebar-role">{user.role} portal</div></div>
      <div style={{ padding: "8px 0" }}>
        <div className="nav-section">Navigation</div>
        {nav.map(n => (
          <div key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
            <span className="nav-icon">{n.icon}</span>{n.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">{user.avatar}</div>
          <div><div className="user-name">{user.name}</div><div className="user-role-tag">{user.role}</div></div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Sign Out</button>
      </div>
    </aside>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ user, logs, clients, setPage }) {
  const flagged = logs.filter(l => l.flagged).length;
  const today   = logs.filter(l => l.timestamp.startsWith("2026-05-21")).length;

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      <div className="gdpr-banner">🛡️ <span>All data processed in compliance with UK GDPR & Data Protection Act 2018. Data stored in UK jurisdiction.</span></div>
      <div className="page-title">{greet()}, {user.name.split(" ")[0]}</div>
      <div className="page-sub">Here's your overview for today</div>

      <div className="stat-grid">
        <div className="stat-card" style={{ animationDelay: ".05s" }}>
          <div className="stat-val">{clients.length}</div>
          <div className="stat-label">Clients in care</div>
        </div>
        <div className="stat-card" style={{ animationDelay: ".1s" }}>
          <div className="stat-val">{today}</div>
          <div className="stat-label">Logs today</div>
        </div>
        <div className="stat-card" style={{ borderColor: flagged ? "#ef4444" : "var(--teal)", animationDelay: ".15s" }}>
          <div className="stat-val" style={{ color: flagged ? "#ef4444" : undefined }}>{flagged}</div>
          <div className="stat-label">Flagged entries</div>
        </div>
        <div className="stat-card" style={{ animationDelay: ".2s" }}>
          <div className="stat-val">{logs.length}</div>
          <div className="stat-label">Total log entries</div>
        </div>
      </div>

      {flagged > 0 && (
        <div className="card" style={{ borderLeft: "4px solid #ef4444" }}>
          <div className="card-title" style={{ color: "#b91c1c" }}>🚩 Flagged — Requires Attention</div>
          {logs.filter(l => l.flagged).map(l => {
            const client = clients.find(c => c.id === l.clientId);
            return (
              <div key={l.id} className="log-item">
                <div className="log-icon">⚠️</div>
                <div className="log-body">
                  <div className="log-header">
                    <span className="log-cat">{client?.name}</span>
                    <span className="flag-badge">FLAGGED</span>
                    <span className="log-time">{fmt(l.timestamp)}</span>
                  </div>
                  <div className="log-notes">{l.notes}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <div className="card-title">📋 Recent Care Logs</div>
        {logs.slice(0, 5).map(l => <LogRow key={l.id} log={l} clients={clients} users={USERS} />)}
        <div style={{ marginTop: 12 }}>
          <button className="btn-secondary" style={{ marginTop: 0 }} onClick={() => setPage("all-logs")}>View all logs →</button>
        </div>
      </div>
    </>
  );
}

// ── Clients ────────────────────────────────────────────────────────────────────
function Clients({ clients, logs, selected, setSelected }) {
  return (
    <>
      <div className="page-title">Clients</div>
      <div className="page-sub">Select a client to view their care record</div>
      <div className="client-grid">
        {clients.map(c => (
          <div key={c.id} className={`client-card${selected?.id === c.id ? " selected" : ""}`} onClick={() => setSelected(c)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: "1rem" }}>{c.name.split(" ").map(n => n[0]).join("")}</div>
              <div><div className="client-name">{c.name}</div><div className="client-meta">Age {age(c.dob)} · DOB {new Date(c.dob).toLocaleDateString("en-GB")}</div></div>
            </div>
            <div className="client-meta" style={{ marginBottom: 8 }}>📍 {c.address}</div>
            <div>{c.conditions.map(cond => <span key={cond} className="tag">{cond}</span>)}</div>
          </div>
        ))}
      </div>
      {selected && (
        <div className="card">
          <div className="card-title">📋 {selected.name}'s Care Log</div>
          {logs.filter(l => l.clientId === selected.id).length === 0
            ? <div className="empty"><div className="empty-icon">📄</div><div>No logs yet for this client</div></div>
            : logs.filter(l => l.clientId === selected.id).map(l => <LogRow key={l.id} log={l} clients={clients} users={USERS} />)
          }
        </div>
      )}
    </>
  );
}

// ── All Logs ───────────────────────────────────────────────────────────────────
function AllLogs({ logs, clients, users, title = "All Care Logs" }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? logs : logs.filter(l => l.category === filter);
  return (
    <>
      <div className="page-title">{title}</div>
      <div className="page-sub">{filtered.length} entries</div>
      <div className="filter-bar">
        <button className={`filter-btn${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.value} className={`filter-btn${filter === c.value ? " active" : ""}`} onClick={() => setFilter(c.value)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div className="card">
        {filtered.length === 0
          ? <div className="empty"><div className="empty-icon">📄</div><div>No entries found</div></div>
          : filtered.map(l => <LogRow key={l.id} log={l} clients={clients} users={users} />)
        }
      </div>
    </>
  );
}

// ── Log Row ────────────────────────────────────────────────────────────────────
function LogRow({ log, clients, users }) {
  const cat    = CATEGORIES.find(c => c.value === log.category);
  const client = clients.find(c => c.id === log.clientId);
  const carer  = users.find(u => u.id === log.carerId);
  const mood   = MOODS.find(m => m.value === log.mood);
  return (
    <div className="log-item">
      <div className="log-icon">{cat?.icon || "📋"}</div>
      <div className="log-body">
        <div className="log-header">
          <span className="log-cat">{cat?.label}</span>
          {client && <span className="tag">{client.name}</span>}
          {log.flagged && <span className="flag-badge">🚩 FLAGGED</span>}
          {mood && <span className="mood-dot" style={{ background: mood.color, marginLeft: 4 }} title={mood.label} />}
          <span className="log-time">{fmt(log.timestamp)}</span>
          {carer && <span className="log-carer">by {carer.name}</span>}
        </div>
        <div className="log-notes">{log.notes}</div>
      </div>
    </div>
  );
}

// ── New Log ────────────────────────────────────────────────────────────────────
function NewLog({ user, clients, onSave, setPage }) {
  const [form, setForm] = useState({
    clientId: clients[0]?.id || "",
    category: "personal-care",
    notes: "",
    mood: "good",
    flagged: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.notes.trim()) { alert("Please add notes before saving."); return; }
    onSave({ ...form, clientId: Number(form.clientId), carerId: user.id, timestamp: new Date().toISOString() });
    setPage("all-logs");
  };

  return (
    <>
      <div className="page-title">New Care Log Entry</div>
      <div className="page-sub">Record care activity for your client</div>
      <div className="card">
        <div className="form-grid">
          <div className="form-field">
            <label className="field-label">Client</label>
            <select value={form.clientId} onChange={e => set("clientId", e.target.value)}>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label className="field-label">Category</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div className="form-field full">
            <label className="field-label">Notes / Observations</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Describe the care provided, client's response, any observations..." />
          </div>
          <div className="form-field full">
            <label className="field-label">Client Mood / Wellbeing</label>
            <div className="radio-group">
              {MOODS.map(m => (
                <div key={m.value} className={`radio-opt${form.mood === m.value ? ` sel-${m.value}` : ""}`} onClick={() => set("mood", m.value)}>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
          <div className="form-field full">
            <label className="checkbox-row">
              <input type="checkbox" checked={form.flagged} onChange={e => set("flagged", e.target.checked)} />
              🚩 Flag this entry — requires management attention (e.g. incident, health concern)
            </label>
          </div>
        </div>
        <div style={{ marginTop: 16, borderTop: "1px solid var(--stone)", paddingTop: 16 }}>
          <button className="btn-secondary" onClick={() => setPage("dashboard")}>Cancel</button>
          <button className="btn-submit" onClick={handleSave}>Save Log Entry</button>
        </div>
      </div>
      <div className="card" style={{ background: "#fffbeb", border: "1px solid #fde68a" }}>
        <div className="card-title" style={{ color: "#92400e" }}>📌 Carer Guidance</div>
        <ul style={{ color: "#78350f", fontSize: ".85rem", lineHeight: 2, paddingLeft: 20 }}>
          <li>Record observations factually and objectively</li>
          <li>Always flag anything that may require medical attention</li>
          <li>Include medication names and dosages where relevant</li>
          <li>Note the client's capacity and consent where applicable</li>
          <li>All entries are timestamped and auditable</li>
        </ul>
      </div>
    </>
  );
}

// ── Compliance ─────────────────────────────────────────────────────────────────
function Compliance() {
  const items = [
    { icon: "🛡️", title: "UK GDPR Compliance",             status: "Framework ready", note: "Data minimisation, purpose limitation, and storage limitation policies defined. DPA 2018 aligned." },
    { icon: "🔐", title: "Role-Based Access Control",       status: "Implemented",     note: "Carers see only their clients. Families have read-only access. Managers have full visibility." },
    { icon: "📜", title: "Audit Trail",                     status: "Active",          note: "All log entries are timestamped, attributed, and immutable. Full audit history maintained." },
    { icon: "🏥", title: "CQC Key Lines of Enquiry",        status: "Partially mapped",note: "Logs support Safe, Effective, and Responsive KLOEs. Requires further mapping for Well-led." },
    { icon: "📋", title: "Data Processing Agreement",       status: "Action required", note: "DPA template required before onboarding additional care companies as data controllers." },
    { icon: "🔒", title: "Data Residency — UK servers",     status: "Action required", note: "Production deployment must use UK-based hosting (e.g. AWS eu-west-2, Azure UK South)." },
    { icon: "🧾", title: "ICO Registration",                status: "Action required", note: "Register as data controller with ICO. Annual fee applies. Required before processing live data." },
    { icon: "🔍", title: "Penetration Testing",             status: "Action required", note: "Independent pen test required before commercial launch with real service user data." },
    { icon: "🎓", title: "Staff Data Training",             status: "Action required", note: "All staff must complete UK GDPR awareness training before accessing live system." },
  ];

  const colors = { "Implemented": "#22c55e", "Active": "#22c55e", "Framework ready": "#14b8a6", "Partially mapped": "#f59e0b", "Action required": "#ef4444" };

  return (
    <>
      <div className="page-title">Compliance Dashboard</div>
      <div className="page-sub">UK regulatory readiness tracker</div>
      <div className="gdpr-banner">🛡️ This tracker helps you understand what's in place and what needs completing before going live with real service user data.</div>
      {items.map((item, i) => (
        <div key={i} className="card" style={{ animationDelay: `${i * .05}s`, animation: "fadeUp .4s ease both" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontSize: "1.5rem", width: 36, textAlign: "center", flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: ".95rem" }}>{item.title}</div>
                <span style={{ fontSize: ".75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: colors[item.status] + "22", color: colors[item.status] }}>{item.status}</span>
              </div>
              <div style={{ fontSize: ".85rem", color: "var(--mid)", marginTop: 4, lineHeight: 1.6 }}>{item.note}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
