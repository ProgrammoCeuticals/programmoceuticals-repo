import { useRef, useState, useEffect } from "react";
import { X, RotateCcw, PenLine, ShieldCheck } from "lucide-react";
import { signaturesApi } from "../api/signatures";
import type { LogColumn } from "../types";

interface Props {
  logId: string;
  recordId: string;
  recordNumber: string;
  column: LogColumn;
  onSuccess: () => void;
  onClose: () => void;
}

export function SignatureModal({
  logId,
  recordId,
  recordNumber,
  column,
  onSuccess,
  onClose,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const intent =
    (column.typeConfig.intent as string) ??
    "I certify the above information is accurate and complete";

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1a202c";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getPos(
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(...(Object.values(getPos(e, canvas)) as [number, number]));
    setDrawing(true);
    setHasDrawn(true);
  }
  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  function stopDraw() {
    setDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }

  async function handleSign() {
    if (!hasDrawn) {
      setError("Please draw your signature");
      return;
    }
    if (!password) {
      setError("Password is required to sign");
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    setError("");
    setSubmitting(true);
    try {
      await signaturesApi.sign(logId, recordId, {
        columnId: column.id,
        password,
        signatureImageBase64: canvas.toDataURL("image/png"),
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Signing failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,0.6)",
        padding: "1rem",
      }}
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PenLine size={14} color="#ffffff" />
            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 13 }}>
              Electronic Signature
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.1rem", display: "grid", gap: "1rem" }}>
          {/* Record ref */}
          <div
            style={{
              padding: "0.45rem 0.65rem",
              background: "var(--bg-header)",
              border: "1px solid var(--border)",
              fontSize: 12,
              color: "var(--muted)",
            }}
          >
            Signing record:{" "}
            <span
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {recordNumber}
            </span>
            <span style={{ marginLeft: "0.4rem" }}>— {column.label}</span>
          </div>

          {/* Intent */}
          <div className="intent-block">
            <ShieldCheck
              size={13}
              color="var(--accent)"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--text-mid)",
                fontStyle: "italic",
                lineHeight: 1.5,
              }}
            >
              "{intent}"
            </p>
          </div>

          {/* Canvas */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.35rem",
              }}
            >
              <label className="field-label" style={{ margin: 0 }}>
                Draw your signature
              </label>
              <button
                onClick={clearCanvas}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: 11,
                  color: "var(--muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "0.1rem 0",
                }}
              >
                <RotateCcw size={10} /> Clear
              </button>
            </div>
            <div
              style={{
                border: `2px solid ${hasDrawn ? "var(--accent)" : "var(--border-dark)"}`,
                background: "#fff",
                cursor: "crosshair",
                transition: "border-color 0.15s",
              }}
            >
              <canvas
                ref={canvasRef}
                width={480}
                height={140}
                style={{ width: "100%", display: "block", touchAction: "none" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              Sign within the box using mouse or touch input
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="field-label">
              Confirm password <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password to sign"
              className="inp"
            />
            <p
              style={{
                margin: "0.25rem 0 0",
                fontSize: 11,
                color: "var(--muted)",
              }}
            >
              Identity verified server-side before signature is recorded
            </p>
          </div>

          {error && <div className="pc-alert pc-alert-error">{error}</div>}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.5rem",
            padding: "0.75rem 1.1rem",
            borderTop: "1px solid var(--border)",
            background: "var(--bg-header)",
          }}
        >
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSign}
            disabled={submitting || !hasDrawn || !password}
            className="btn btn-primary"
          >
            <ShieldCheck size={12} />
            {submitting ? "Signing…" : "Sign Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
