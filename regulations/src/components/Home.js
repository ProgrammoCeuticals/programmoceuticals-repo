import React from "react";
import { Link } from "react-router-dom";

const Home = ({ isLoggedIn }) => {
  const cardStyle = {
    background: "white",
    border: "1px solid #ddd",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  };

  const sectionTitleStyle = {
    fontSize: "12px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "1rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #193441",
    paddingBottom: "0.5rem",
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem 0.5rem" }}>
      <div style={{ background: "white", border: "1px solid #ddd", padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ borderBottom: "3px solid #193441", paddingBottom: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          {/* Logo */}
          <img
            src="/logo.png"
            alt="ProgrammoCeuticals Logo"
            style={{ width: "64px", height: "64px", marginBottom: "1rem" }}
          />
          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "22px", fontWeight: "700", color: "#2c3e50", textTransform: "uppercase", letterSpacing: "1px" }}>
            DRT — Dossier Review Team
          </h1>
          <p style={{ margin: "0 0 1.75rem 0", fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
            Professional pharmaceutical dossier compliance assessment and regulatory screening platform
          </p>

          {/* Primary CTA */}
          {isLoggedIn ? (
            <Link
              to="/upload"
              style={{
                background: "#193441",
                color: "white",
                padding: "0.75rem 2.5rem",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
                letterSpacing: "0.5px",
              }}
            >
              Go to App →
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                to="/login"
                style={{
                  background: "#193441",
                  color: "white",
                  padding: "0.75rem 2.5rem",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-block",
                  letterSpacing: "0.5px",
                  transition: "background 0.2s",
                }}
              >
                Login to DRT
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Regulatory Challenges Addressed</h2>
            <ul style={{ lineHeight: "1.9", color: "#555", fontSize: "13px", paddingLeft: "1rem", margin: 0 }}>
              <li>Manual dossier review inefficiencies</li>
              <li>Regulatory compliance verification delays</li>
              <li>Product eligibility assessment complexity</li>
              <li>Document structure validation challenges</li>
              <li>Bioequivalence requirement determination</li>
            </ul>
          </div>
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Professional Capabilities</h2>
            <ul style={{ lineHeight: "1.9", color: "#555", fontSize: "13px", paddingLeft: "1rem", margin: 0 }}>
              <li>Automated CTD structure validation</li>
              <li>NAFDAC regulatory list verification</li>
              <li>Intelligent document screening</li>
              <li>f2 similarity factor calculations</li>
              <li>Comprehensive compliance reporting</li>
            </ul>
          </div>
        </div>

        {/* Workflow */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ ...sectionTitleStyle, textAlign: "center", borderBottom: "none", marginBottom: "1.5rem" }}>Assessment Workflow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
            {[
              { step: "1", title: "Upload Dossier", desc: "Upload pharmaceutical dossier ZIP/RAR archive for assessment" },
              { step: "2", title: "Conduct Screening", desc: "Automated compliance and regulatory screening assessment" },
              { step: "3", title: "Generate Report", desc: "Review documents and generate compliance reports" },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ ...cardStyle, textAlign: "center" }}>
                <div style={{ width: "44px", height: "44px", background: "#193441", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", color: "white", fontSize: "14px", fontWeight: "700" }}>
                  {step}
                </div>
                <h3 style={{ margin: "0 0 0.4rem 0", fontSize: "13px", fontWeight: "600", color: "#2c3e50" }}>{title}</h3>
                <p style={{ color: "#666", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ ...sectionTitleStyle, textAlign: "center", borderBottom: "none", marginBottom: "1.5rem" }}>Professional Assessment Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ ...cardStyle, textAlign: "center", borderLeft: "3px solid #193441" }}>
              <h3 style={{ color: "#193441", margin: "0 0 0.5rem 0", fontSize: "13px", fontWeight: "600" }}>Product Compliance Checker</h3>
              <p style={{ color: "#666", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>
                Verify product eligibility against NAFDAC regulatory lists and policies
              </p>
            </div>
            <div style={{ ...cardStyle, textAlign: "center", borderLeft: "3px solid #193441" }}>
              <h3 style={{ color: "#193441", margin: "0 0 0.5rem 0", fontSize: "13px", fontWeight: "600" }}>f2 Similarity Calculator</h3>
              <p style={{ color: "#666", margin: 0, fontSize: "13px", lineHeight: "1.5" }}>
                Calculate dissolution profile similarity factors for bioequivalence assessment
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#f8f9fa", padding: "1.5rem", border: "1px solid #dee2e6", textAlign: "center" }}>
          <h2 style={sectionTitleStyle}>Development Information</h2>
          <p style={{ color: "#666", lineHeight: "1.6", margin: "0 0 1rem 0", fontSize: "13px" }}>
            Developed by <strong>Wilson Zimthamaha</strong> at ProgrammoCeuticals
            <br />
            Specialized pharmaceutical software solutions for regulatory compliance and quality assurance
          </p>
          <a href="https://algorizimcodes.vercel.app/" target="_blank" rel="noopener noreferrer"
            style={{ background: "#193441", color: "white", textDecoration: "none", padding: "0.6rem 1.5rem", fontSize: "13px", fontWeight: "600", display: "inline-block" }}>
            Developer Portfolio
          </a>
        </div>

      </div>
    </div>
  );
};

export default Home;
