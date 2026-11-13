import React from "react";
import { Link } from "react-router-dom";

export default function Home({ isLoggedIn }) {
  const cardStyle = {
    background: "white", border: "1px solid #e2e8f0",
    padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  };
  const sectionTitle = {
    fontSize: "11px", fontWeight: 700, color: "#193441",
    textTransform: "uppercase", letterSpacing: "0.6px",
    borderBottom: "2px solid #193441", paddingBottom: "0.4rem",
    marginBottom: "1rem",
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1rem 0.5rem" }}>
      <div style={{ background: "white", border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>

        {/* Header */}
        <div style={{ borderBottom: "3px solid #193441", paddingBottom: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🧾</div>
          <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "20px", fontWeight: 800, color: "#193441", textTransform: "uppercase", letterSpacing: "1px" }}>
            GLSI — Global Listing Vetter
          </h1>
          <p style={{ margin: "0 0 1.5rem 0", fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
            Automated vetting of NAFDAC Global Listing Supermarket Inventory against the 19-point checklist
          </p>
          {isLoggedIn ? (
            <Link to="/vetter" style={{ background: "#193441", color: "white", padding: "0.7rem 2.5rem", fontSize: "13px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.5px" }}>
              Open Vetter →
            </Link>
          ) : (
            <Link to="/login" style={{ background: "#193441", color: "white", padding: "0.7rem 2.5rem", fontSize: "13px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.5px" }}>
              Login to GLSI
            </Link>
          )}
        </div>

        {/* Checklist codes */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={sectionTitle}>What Gets Checked (NAFDAC 19-Point Checklist)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.5rem" }}>
            {[
              ["Inc. T",   "Arithmetic check — Pack units × Cartons = Total"],
              ["Rep",      "Duplicate row detection"],
              ["Typo",     "Spelling errors in pack type, brand, units"],
              ["Fill",     "Empty required columns"],
              ["Unit",     "Missing unit of measurement (ml, g, L…)"],
              ["Ban",      "Banned products (soaps, detergents, body washes…)"],
              ["N/A reg",  "Products with therapeutic claims that require registration"],
              ["Abbv.",    "Abbreviated / coded product names"],
              ["Itemise",  "SET / KIT products that must be listed individually"],
              ["Country",  "Missing or multi-country origin"],
              ["Desc",     "Description too generic"],
              ["Clarify",  "Product name needs clarification"],
              ["P.T",      "Incorrect primary packaging type"],
              ["Brand",    "Brand column empty or missing"],
              ["Reg",      "Product appears in NAFDAC Greenbook (already registered)"],
            ].map(([code, desc]) => (
              <div key={code} style={{ ...cardStyle, display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ background: "#193441", color: "white", padding: "2px 8px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap", marginTop: 1 }}>{code}</span>
                <span style={{ fontSize: "12px", color: "#555", lineHeight: 1.5 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={sectionTitle}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              ["1", "Upload Excel", "Drop your GLSI inventory spreadsheet (.xlsx)"],
              ["2", "Auto-Vet",     "Engine checks all 19 codes across every row"],
              ["3", "Review",       "Browse flagged rows, read flag details, check clean rows"],
              ["4", "Export",       "Download annotated Excel report for submission"],
            ].map(([step, title, desc]) => (
              <div key={step} style={{ ...cardStyle, textAlign: "center" }}>
                <div style={{ width: 40, height: 40, background: "#193441", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem", fontSize: "14px", fontWeight: 800 }}>{step}</div>
                <h3 style={{ margin: "0 0 0.3rem 0", fontSize: "12px", fontWeight: 700, color: "#193441" }}>{title}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#666", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#f7f8fa", border: "1px solid #e2e8f0", padding: "1.25rem", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            Developed by <strong>Wilson Zimthamaha</strong> · ProgrammoCeuticals
          </p>
        </div>
      </div>
    </div>
  );
}
