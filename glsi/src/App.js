import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";

const Home    = lazy(() => import("./components/Home"));
const Vetter  = lazy(() => import("./components/Vetter"));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("glsi_loggedIn") === "true");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (menuOpen && !e.target.closest(".nav")) setMenuOpen(false); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [menuOpen]);

  const handleLogin  = () => { setIsLoggedIn(true);  localStorage.setItem("glsi_loggedIn", "true"); };
  const handleLogout = () => { setIsLoggedIn(false); localStorage.removeItem("glsi_loggedIn"); };

  return (
    <Router>
      <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "#193441" }}>Loading…</div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/vetter" replace /> : <Login onLogin={handleLogin} />}
          />

          {/* Protected */}
          {isLoggedIn && (
            <Route
              path="/*"
              element={
                <div className="app">
                  <nav className="nav">
                    <div className="nav-container">
                      <div className="nav-brand">
                        <span style={{ fontSize: "1.25rem" }}>🧾</span>
                        <h1 className="nav-title">GLSI Vetter</h1>
                      </div>

                      <button
                        className="mobile-menu-toggle"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                      >
                        <span className={`hamburger ${menuOpen ? "open" : ""}`} />
                      </button>

                      <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
                        <NavLink
                          to="/vetter"
                          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                          onClick={() => setMenuOpen(false)}
                        >
                          Vetter
                        </NavLink>
                        <button
                          onClick={handleLogout}
                          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", padding: "0.45rem 0.85rem", fontSize: "0.8rem", fontWeight: 500 }}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </nav>

                  <main className="main-content">
                    <Routes>
                      <Route path="/vetter" element={<Vetter />} />
                      <Route path="*" element={<Navigate to="/vetter" replace />} />
                    </Routes>
                  </main>

                  <footer className="app-footer">
                    <p>
                      GLSI Vetter · Developed by{" "}
                      <a href="https://zimthamaha.programmoceuticals.com" target="_blank" rel="noopener noreferrer">
                        Wilson Zimthamaha (ProgrammoCeuticals)
                      </a>
                    </p>
                  </footer>
                </div>
              }
            />
          )}

          {!isLoggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
