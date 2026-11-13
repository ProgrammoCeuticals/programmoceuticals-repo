import React, { useState } from "react";

const thStyle = {
  padding: "0.4rem 0.6rem",
  textAlign: "left",
  border: "1px solid #e2e8f0",
  fontWeight: "600",
  color: "#2c3e50",
  background: "#f7f8fa",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const tdStyle = {
  padding: "0.4rem 0.5rem",
  border: "1px solid #e2e8f0",
  color: "#444",
  verticalAlign: "middle",
};

const inputStyle = {
  width: "90px",
  padding: "0.3rem 0.5rem",
  border: "1px solid #ccc",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box",
};

const F2Calculator = () => {
  const [timePoints, setTimePoints] = useState([
    { time: 5, reference: "", test: "" },
    { time: 10, reference: "", test: "" },
    { time: 15, reference: "", test: "" },
    { time: 20, reference: "", test: "" },
    { time: 30, reference: "", test: "" },
    { time: 45, reference: "", test: "" },
    { time: 60, reference: "", test: "" },
    { time: 90, reference: "", test: "" },
    { time: 120, reference: "", test: "" },
  ]);
  const [f2Result, setF2Result] = useState(null);

  const addTimePoint = () => {
    const seq = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 1440];
    const used = timePoints.map((p) => p.time);
    const next = seq.find((t) => !used.includes(t)) || Math.max(...used) + 60;
    setTimePoints([...timePoints, { time: next, reference: "", test: "" }]);
  };

  const removeTimePoint = (index) => {
    if (timePoints.length > 1) setTimePoints(timePoints.filter((_, i) => i !== index));
  };

  const updateTimePoint = (index, field, value) => {
    const updated = [...timePoints];
    updated[index][field] = value;
    setTimePoints(updated);
  };

  const calculateF2 = () => {
    const valid = timePoints.filter(
      (p) => p.reference !== "" && p.test !== "" && !isNaN(parseFloat(p.reference)) && !isNaN(parseFloat(p.test))
    );
    if (valid.length < 3) { alert("At least 3 time points are required."); return; }

    const filtered = valid.filter((p) => parseFloat(p.reference) <= 85 || parseFloat(p.test) <= 85);
    if (filtered.length === 0) { alert("No valid time points found (at least one product must be ≤85% dissolved)."); return; }

    const n = filtered.length;
    const sumSq = filtered.reduce((sum, p) => {
      const diff = parseFloat(p.reference) - parseFloat(p.test);
      return sum + diff * diff;
    }, 0);
    const f2 = 50 * Math.log10(Math.pow(1 + sumSq / n, -0.5) * 100);
    setF2Result({ value: f2.toFixed(2), interpretation: f2 >= 50 ? "Similar" : "Not Similar", pointsUsed: filtered.length, totalPoints: valid.length });
  };

  const clearAll = () => {
    setTimePoints([5, 10, 15, 20, 30, 45, 60, 90, 120].map((t) => ({ time: t, reference: "", test: "" })));
    setF2Result(null);
  };

  const isSimilar = f2Result?.interpretation === "Similar";

  return (
    <div style={{ background: "white", border: "1px solid #ddd", padding: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ borderBottom: "3px solid #193441", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "20px", fontWeight: "700", color: "#2c3e50", textTransform: "uppercase", letterSpacing: "1px" }}>
          f2 Similarity Factor Calculator
        </h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          Calculate f2 similarity factor for dissolution profile comparison
        </p>
      </div>

      {/* Formula */}
      <div style={{ background: "#f8f9fa", border: "1px solid #dee2e6", borderLeft: "4px solid #193441", padding: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "0.5rem" }}>Formula</div>
        <div style={{ fontFamily: "monospace", fontSize: "14px", color: "#2c3e50", marginBottom: "0.5rem" }}>
          f2 = 50 × log<sub>10</sub>{"{[1 + (1/n)Σ(Rt − Tt)²]^(−0.5) × 100}"}
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
          Rt = reference %, Tt = test %, n = number of time points. Only points where either product ≤85% dissolved are used.
        </p>
      </div>

      {/* Table */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#555", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "0.5rem" }}>Dissolution Data (%)</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                <th style={thStyle}>Time (min)</th>
                <th style={thStyle}>Reference Product (%)</th>
                <th style={thStyle}>Test Product (%)</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {timePoints.map((point, index) => (
                <tr key={index} style={{ background: index % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={tdStyle}>
                    <input type="number" value={point.time} onChange={(e) => updateTimePoint(index, "time", e.target.value)} style={inputStyle} />
                  </td>
                  <td style={tdStyle}>
                    <input type="number" step="0.1" value={point.reference} onChange={(e) => updateTimePoint(index, "reference", e.target.value)} style={inputStyle} placeholder="0.0" />
                  </td>
                  <td style={tdStyle}>
                    <input type="number" step="0.1" value={point.test} onChange={(e) => updateTimePoint(index, "test", e.target.value)} style={inputStyle} placeholder="0.0" />
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    <button onClick={() => removeTimePoint(index)} disabled={timePoints.length <= 1}
                      style={{ padding: "0.25rem 0.6rem", fontSize: "12px", background: timePoints.length <= 1 ? "#f5f5f5" : "#dc3545", color: timePoints.length <= 1 ? "#bbb" : "white", border: "none", cursor: timePoints.length <= 1 ? "default" : "pointer" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={addTimePoint} style={{ padding: "0.55rem 1.2rem", background: "#2d6a4f", color: "white", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
          + Add Time Point
        </button>
        <button onClick={calculateF2} style={{ padding: "0.55rem 1.2rem", background: "#193441", color: "white", border: "none", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
          Calculate f2
        </button>
        <button onClick={clearAll} style={{ padding: "0.55rem 1.2rem", background: "white", color: "#555", border: "1px solid #ccc", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}>
          Clear All
        </button>
      </div>

      {/* Result */}
      {f2Result && (
        <div style={{ background: isSimilar ? "#f0fff4" : "#fff5f5", border: `2px solid ${isSimilar ? "#276749" : "#c53030"}`, padding: "1.25rem" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#666", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "0.75rem" }}>f2 Calculation Result</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>f2 Value</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#2c3e50" }}>{f2Result.value}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>Interpretation</div>
              <span style={{ background: isSimilar ? "#276749" : "#c53030", color: "white", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>
                {f2Result.interpretation}
              </span>
            </div>
            <div>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "2px" }}>Points Used</div>
              <div style={{ fontSize: "16px", fontWeight: "600", color: "#2c3e50" }}>{f2Result.pointsUsed}/{f2Result.totalPoints}</div>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#555", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
            <strong>Criteria:</strong> f2 ≥ 50 indicates similar dissolution profiles.
            {f2Result.pointsUsed < f2Result.totalPoints && (
              <span style={{ marginLeft: "0.5rem", color: "#856404" }}>⚠ Some time points excluded (&gt;85% dissolution in both products).</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Calculations = () => (
  <div style={{ maxWidth: "100%", margin: "0 auto", padding: "1rem 0.5rem" }}>
    <F2Calculator />
  </div>
);

export default Calculations;
