import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const getStatusColor = (r) =>
  r === "yes" ? "#28a745" : r === "no" ? "#dc3545" : r === "na" ? "#ffc107" : "#6c757d";

const getStatusLabel = (r) =>
  r === "yes" ? "✅ YES" : r === "no" ? "❌ NO" : r === "na" ? "⚠️ N/A" : "—";

const hydrateReportData = (reportData) => ({
  ...reportData,
  gatewayResponses: reportData.gatewayResponses instanceof Map
    ? reportData.gatewayResponses
    : new Map(Array.isArray(reportData.gatewayResponses) ? reportData.gatewayResponses : Object.entries(reportData.gatewayResponses || {})),
  responses: reportData.responses instanceof Map
    ? reportData.responses
    : new Map(Array.isArray(reportData.responses) ? reportData.responses : Object.entries(reportData.responses || {})),
  notes: reportData.notes instanceof Map
    ? reportData.notes
    : new Map(Array.isArray(reportData.notes) ? reportData.notes : Object.entries(reportData.notes || {})),
});

const DMFReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const raw = location.state?.reportData;

  if (!raw) {
    navigate("/dmf-screening");
    return null;
  }

  const reportData = hydrateReportData(raw);

  const { dmfName, reviewerName, gatewayResponses, responses, notes, checklist, gatewayQuestions, generatedAt } = reportData;

  const g1 = gatewayResponses.get("g1");
  const g2 = gatewayResponses.get("g2");
  const isBlocked = g1 === "no" || g2 === "yes";

  const yesCount = [...responses.values()].filter((r) => r === "yes").length;
  const noCount = [...responses.values()].filter((r) => r === "no").length;
  const naCount = [...responses.values()].filter((r) => r === "na").length;
  const answered = responses.size;
  const unanswered = checklist.filter((item) => !responses.has(item.id));
  const completeness = checklist.length > 0 ? Math.round((answered / checklist.length) * 100) : 0;

  const overallStatus = isBlocked
    ? g1 === "no" ? "INCOMPLETE" : "COMPLETE"
    : noCount === 0 && answered === checklist.length ? "COMPLETE"
    : noCount > 0 ? "INCOMPLETE"
    : "IN PROGRESS";

  const statusColor = overallStatus === "COMPLETE" ? "#28a745" : overallStatus === "INCOMPLETE" ? "#dc3545" : "#ffc107";

  const sections = [...new Set(checklist.map((i) => i.section))];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
      <div style={{
        padding: "2rem", background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #ddd",
        fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: "1.5", color: "#000"
      }}>

        {/* Header */}
        <div style={{ borderBottom: "3px solid #2c3e50", paddingBottom: "1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "14px", fontWeight: "700", color: "#2c3e50", textTransform: "uppercase", letterSpacing: "1px" }}>
            NAFDAC API DMF/ASMF Screening Report
          </h1>
          <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
            <div><strong>DMF/API Name:</strong> {dmfName}</div>
            {reviewerName && <div><strong>Primary Reviewer:</strong> {reviewerName}</div>}
            <div><strong>Report Generated:</strong> {new Date(generatedAt).toLocaleDateString()} at {new Date(generatedAt).toLocaleTimeString()}</div>
          </div>
          <div style={{
            marginTop: "1rem", display: "inline-block",
            padding: "0.4rem 1.5rem", background: statusColor,
            color: "white", fontWeight: "700", fontSize: "14px", letterSpacing: "1px"
          }}>
            {overallStatus}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", paddingBottom: "2rem", borderBottom: "1px solid #ddd" }}>
          <button
            onClick={() => navigate("/dmf-screening")}
            style={{ padding: "0.75rem 1.5rem", background: "#555", color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
          >
            ← Back to Screening
          </button>
          <button
            onClick={() => window.print()}
            style={{ padding: "0.75rem 1.5rem", background: "#193441", color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* Summary Stats */}
        {!isBlocked && (
          <div style={{ marginBottom: "2rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              {[
                { label: "Total Items", value: checklist.length, color: "#2c3e50" },
                { label: "Reviewed", value: answered, color: "#3498db" },
                { label: "YES", value: yesCount, color: "#28a745" },
                { label: "NO", value: noCount, color: "#dc3545" },
                { label: "N/A", value: naCount, color: "#ffc107" },
                { label: "Skipped", value: unanswered.length, color: "#6c757d" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ padding: "0.75rem", border: `2px solid ${color}`, textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: "700", color }}>{value}</div>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: "600" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#f8f9fa", padding: "0.75rem 1rem", border: "1px solid #dee2e6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#2c3e50", marginBottom: "0.4rem" }}>
                <span>Checklist Completeness</span>
                <span>{completeness}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#dee2e6", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{
                  width: `${completeness}%`, height: "100%", borderRadius: "4px",
                  background: completeness === 100 ? "#28a745" : completeness >= 70 ? "#ffc107" : "#dc3545",
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          </div>
        )}

        {/* Gateway Results */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50", marginBottom: "1rem", borderBottom: "2px solid #2c3e50", paddingBottom: "0.5rem" }}>
            Pre-Screening Gateway
          </h2>
          {gatewayQuestions.map((gq) => {
            const r = gatewayResponses.get(gq.id);
            if (!r) return null;
            return (
              <div key={gq.id} style={{
                border: "1px solid #ddd", borderLeft: `4px solid ${getStatusColor(r)}`,
                padding: "1rem", marginBottom: "0.75rem", display: "flex", gap: "1rem", alignItems: "flex-start"
              }}>
                <div style={{
                  background: getStatusColor(r), color: "white", width: "36px", height: "36px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "700", fontSize: "12px", flexShrink: 0
                }}>
                  {gq.id === "g1" ? "G1" : "G2"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "0.3rem" }}>{gq.question}</div>
                  <div style={{ fontSize: "13px", color: getStatusColor(r), fontWeight: "600" }}>{getStatusLabel(r)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Blocked message */}
        {isBlocked && (
          <div style={{
            padding: "1.5rem", marginBottom: "2rem",
            background: g1 === "no" ? "#fff5f5" : "#f0fff4",
            border: `2px solid ${g1 === "no" ? "#dc3545" : "#28a745"}`,
            fontSize: "15px", fontWeight: "600",
            color: g1 === "no" ? "#dc3545" : "#28a745", textAlign: "center"
          }}>
            {g1 === "no"
              ? "❌ DMF is INCOMPLETE per policy. Issue Incomplete Letter to DMF holder."
              : "✅ DMF is COMPLETE per policy. No further checklist review required."}
          </div>
        )}

        {/* Checklist Results grouped by section */}
        {!isBlocked && answered > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#2c3e50", marginBottom: "1.5rem", borderBottom: "2px solid #2c3e50", paddingBottom: "0.5rem" }}>
              Detailed Checklist Results
            </h2>
            {sections.map((section) => {
              const sectionItems = checklist.filter((i) => i.section === section && responses.has(i.id));
              if (sectionItems.length === 0) return null;
              return (
                <div key={section} style={{ marginBottom: "1.5rem" }}>
                  <div style={{
                    background: "#2c3e50", color: "white", padding: "0.5rem 1rem",
                    fontSize: "12px", fontWeight: "600", marginBottom: "0.5rem", letterSpacing: "0.5px"
                  }}>
                    {section}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {sectionItems.map((item) => {
                      const r = responses.get(item.id);
                      const note = notes.get(item.id) || "";
                      return (
                        <div key={item.id} style={{
                          border: "1px solid #ddd", borderLeft: `4px solid ${getStatusColor(r)}`,
                          padding: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start"
                        }}>
                          <div style={{
                            background: getStatusColor(r), color: "white", width: "32px", height: "32px",
                            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: "700", fontSize: "12px", flexShrink: 0
                          }}>
                            {item.id}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "11px", color: "#666", fontWeight: "600", marginBottom: "0.2rem" }}>{item.moduleRef}</div>
                            <div style={{ fontWeight: "600", color: "#2c3e50", marginBottom: "0.4rem", fontSize: "13px" }}>{item.question}</div>
                            <div style={{ fontSize: "13px", color: getStatusColor(r), fontWeight: "600", marginBottom: note ? "0.5rem" : 0 }}>
                              {getStatusLabel(r)}
                            </div>
                            {note && (
                              <div style={{
                                background: "#f8f9fa", padding: "0.75rem",
                                borderLeft: `4px solid ${getStatusColor(r)}`,
                                fontSize: "13px", color: "#495057", whiteSpace: "pre-wrap", lineHeight: "1.5"
                              }}>
                                {note}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unanswered / Skipped Items */}
        {!isBlocked && unanswered.length > 0 && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#6c757d", marginBottom: "1rem", borderBottom: "2px solid #6c757d", paddingBottom: "0.5rem" }}>
              Not Reviewed ({unanswered.length} items)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {unanswered.map((item) => (
                <div key={item.id} style={{
                  border: "1px solid #dee2e6", borderLeft: "4px solid #6c757d",
                  padding: "0.75rem 1rem", display: "flex", gap: "1rem", alignItems: "center",
                  background: "#f8f9fa"
                }}>
                  <div style={{
                    background: "#6c757d", color: "white", width: "28px", height: "28px",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "700", fontSize: "11px", flexShrink: 0
                  }}>
                    {item.id}
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#999", fontWeight: "600" }}>{item.section} — {item.moduleRef}</div>
                    <div style={{ fontSize: "13px", color: "#6c757d" }}>{item.question}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          background: "#f8f9fa", padding: "1.5rem", textAlign: "center",
          fontSize: "13px", color: "#666", borderTop: "3px solid #193441", marginTop: "2rem"
        }}>
          <div style={{ fontWeight: "600", color: "#2c3e50" }}>Programmoceuticals DMF Screening System</div>
        </div>
      </div>
    </div>
  );
};

export default DMFReport;
