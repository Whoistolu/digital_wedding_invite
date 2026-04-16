import React, { useState, useEffect, useCallback } from "react";

const ADMIN_PASSWORD = "A&C2025Admin";

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${color}40`,
      borderRadius: 12,
      padding: "24px 28px",
      flex: "1 1 180px",
      minWidth: 0,
    }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "0.78rem", color: "#a89880", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>{label}</div>
    </div>
  );
}

function Badge({ attendance }) {
  const isYes = attendance === "yes";
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 12px",
      borderRadius: 20,
      fontSize: "0.75rem",
      fontWeight: 600,
      letterSpacing: "0.05em",
      background: isYes ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
      color: isYes ? "#4ade80" : "#f87171",
      border: `1px solid ${isYes ? "#4ade8040" : "#f8717140"}`,
    }}>
      {isYes ? "Attending" : "Not Attending"}
    </span>
  );
}

function exportCSV(rsvps) {
  const headers = ["#", "Name", "Email", "Attendance", "Guests", "Message", "Submitted"];
  const rows = rsvps.map((r, i) => [
    i + 1,
    `"${(r.name || "").replace(/"/g, '""')}"`,
    `"${(r.email || "").replace(/"/g, '""')}"`,
    r.attendance === "yes" ? "Attending" : "Not Attending",
    r.guest_count || 0,
    `"${(r.message || "").replace(/"/g, '""')}"`,
    new Date(r.created_at).toLocaleString(),
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding-rsvps.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [rsvps, setRsvps] = useState([]);
  const [stats, setStats] = useState({ total: 0, attending: 0, not_attending: 0, total_guests: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchRsvps = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/rsvps")
      .then(r => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`);
        return r.json();
      })
      .then(data => {
        setRsvps(data.rsvps || []);
        setStats(data.stats || {});
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (authed) fetchRsvps();
  }, [authed, fetchRsvps]);

  function handleLogin(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  }

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a1410 0%, #0f0b08 40%, #1a0e0e 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 16,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>💌</div>
          <h1 style={{ color: "#c9a84c", fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 400, marginBottom: 6 }}>
            Wedding Admin
          </h1>
          <p style={{ color: "#a89880", fontSize: "0.85rem", marginBottom: 28 }}>Adaeze &amp; Chukwuemeka</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid ${passwordError ? "#f87171" : "rgba(201,168,76,0.3)"}`,
                background: "rgba(255,255,255,0.06)",
                color: "#f5f0e8",
                fontSize: "0.95rem",
                outline: "none",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />
            {passwordError && (
              <p style={{ color: "#f87171", fontSize: "0.8rem", marginBottom: 12 }}>Incorrect password. Try again.</p>
            )}
            <button type="submit" style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: "linear-gradient(135deg, #c9a84c, #a8872a)",
              color: "#1a1410",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              marginTop: 8,
            }}>
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = rsvps
    .filter(r => {
      if (filter === "attending") return r.attendance === "yes";
      if (filter === "not_attending") return r.attendance === "no";
      return true;
    })
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (r.name || "").toLowerCase().includes(q) || (r.email || "").toLowerCase().includes(q);
    });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1a1410 0%, #0f0b08 40%, #1a0e0e 100%)",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "#f5f0e8",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 400, color: "#c9a84c", margin: 0 }}>
            RSVP Dashboard
          </h1>
          <p style={{ color: "#7a6552", fontSize: "0.8rem", margin: "2px 0 0", letterSpacing: "0.1em" }}>
            ADAEZE &amp; CHUKWUEMEKA · June 28, 2025
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={fetchRsvps}
            style={{
              padding: "8px 18px", borderRadius: 8,
              border: "1px solid rgba(201,168,76,0.4)",
              background: "transparent", color: "#c9a84c",
              fontSize: "0.82rem", cursor: "pointer", letterSpacing: "0.05em",
            }}
          >
            Refresh
          </button>
          <button
            onClick={() => exportCSV(rsvps)}
            disabled={rsvps.length === 0}
            style={{
              padding: "8px 18px", borderRadius: 8,
              border: "none",
              background: rsvps.length === 0 ? "rgba(201,168,76,0.2)" : "linear-gradient(135deg, #c9a84c, #a8872a)",
              color: rsvps.length === 0 ? "#7a6552" : "#1a1410",
              fontSize: "0.82rem", fontWeight: 600, cursor: rsvps.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Export CSV
          </button>
          <a href="/" style={{ color: "#7a6552", fontSize: "0.8rem", textDecoration: "none" }}>← Invitation</a>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
          <StatCard label="Total RSVPs" value={stats.total || 0} color="#c9a84c" icon="📬" />
          <StatCard label="Attending" value={stats.attending || 0} color="#4ade80" icon="✓" />
          <StatCard label="Not Attending" value={stats.not_attending || 0} color="#f87171" icon="✗" />
          <StatCard label="Total Guests" value={stats.total_guests || 0} color="#818cf8" icon="👥" />
        </div>

        {/* Filters & Search */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
          {[
            { key: "all", label: `All (${rsvps.length})` },
            { key: "attending", label: `Attending (${stats.attending || 0})` },
            { key: "not_attending", label: `Not Attending (${stats.not_attending || 0})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "8px 16px", borderRadius: 20,
                border: `1px solid ${filter === key ? "#c9a84c" : "rgba(201,168,76,0.2)"}`,
                background: filter === key ? "rgba(201,168,76,0.15)" : "transparent",
                color: filter === key ? "#c9a84c" : "#7a6552",
                fontSize: "0.82rem", cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              marginLeft: "auto",
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid rgba(201,168,76,0.2)",
              background: "rgba(255,255,255,0.04)",
              color: "#f5f0e8",
              fontSize: "0.85rem",
              outline: "none",
              minWidth: 220,
            }}
          />
        </div>

        {/* Table */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7a6552" }}>Loading RSVPs...</div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#f87171" }}>
            Error: {error}
            <button onClick={fetchRsvps} style={{ marginLeft: 12, color: "#c9a84c", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
          </div>
        )}
        {!loading && !error && (
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(201,168,76,0.12)" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#7a6552" }}>
                {rsvps.length === 0 ? "No RSVPs received yet." : "No results match your filter."}
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", background: "rgba(255,255,255,0.03)" }}>
                    {["#", "Name", "Email", "Status", "Guests", "Message", "Submitted"].map(h => (
                      <th key={h} style={{
                        padding: "14px 16px",
                        textAlign: "left",
                        color: "#7a6552",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 16px", color: "#7a6552" }}>{i + 1}</td>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#e8d5b0", whiteSpace: "nowrap" }}>{r.name || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#a89880" }}>{r.email || "—"}</td>
                      <td style={{ padding: "14px 16px" }}><Badge attendance={r.attendance} /></td>
                      <td style={{ padding: "14px 16px", color: "#a89880", textAlign: "center" }}>
                        {r.attendance === "yes" ? (r.guest_count || 1) : "—"}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#7a6552", maxWidth: 220 }}>
                        <span title={r.message || ""} style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 200,
                        }}>
                          {r.message || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#7a6552", whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                        {new Date(r.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#3d2b1f", fontSize: "0.75rem", marginTop: 40 }}>
          Wedding RSVP Admin · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
