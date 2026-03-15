import { useState, useEffect, useRef } from “react”;

// ── Data ───────────────────────────────────────────────────────────────────
const DRILLS = {
1: [
{ id: “stationary_dribble”, name: “Stationary Dribble”, emoji: “🏀”, reps: “30 sec each hand”, timed: 30, tips: “Keep your eyes UP — don’t look at the ball! Fingertips only, not your palm. Stay low like you’re sitting in a chair.” },
{ id: “pound_dribble”, name: “Pound Dribble”, emoji: “💥”, reps: “20 pounds each hand”, timed: null, tips: “Dribble as HARD as you can! Slap the ball into the floor and let it come back up. This builds strong hands.” },
{ id: “around_the_world”, name: “Around the World”, emoji: “🌍”, reps: “5 circles each direction”, timed: null, tips: “Move the ball around your waist in a big circle. Start slow, then speed up. Don’t drop it!” },
],
2: [
{ id: “stationary_dribble”, name: “Stationary Dribble”, emoji: “🏀”, reps: “45 sec each hand”, timed: 45, tips: “Keep your eyes UP! Fingertips only, not your palm. Stay low like you’re sitting in a chair.” },
{ id: “pound_dribble”, name: “Pound Dribble”, emoji: “💥”, reps: “25 pounds each hand”, timed: null, tips: “Dribble as HARD as you can! Slap the ball into the floor and let it come back up.” },
{ id: “figure_eight”, name: “Figure Eight”, emoji: “8️⃣”, reps: “10 slow, 10 fast”, timed: null, tips: “Weave the ball through your legs in a figure 8. Go slow first, then speed up without dropping!” },
{ id: “around_the_world”, name: “Around the World”, emoji: “🌍”, reps: “8 circles each direction”, timed: null, tips: “Move the ball around your waist in a big circle. Start slow, then speed up.” },
],
3: [
{ id: “stationary_dribble”, name: “Stationary Dribble”, emoji: “🏀”, reps: “60 sec each hand”, timed: 60, tips: “Eyes UP! Fingertips only. Stay low like you’re sitting in a chair.” },
{ id: “crossover_dribble”, name: “Crossover Dribble”, emoji: “↔️”, reps: “20 crossovers”, timed: null, tips: “Push the ball from one hand to the other in front of you. Keep it low! High crossovers are easy to steal.” },
{ id: “figure_eight”, name: “Figure Eight”, emoji: “8️⃣”, reps: “15 reps”, timed: null, tips: “Weave the ball through your legs in a figure 8. Speed up without dropping!” },
{ id: “spider_dribble”, name: “Spider Dribble”, emoji: “🕷️”, reps: “30 seconds”, timed: 30, tips: “Dribble both hands alternating — front then behind legs. Like a spider walking! Feet wide apart.” },
],
4: [
{ id: “stationary_dribble”, name: “Stationary Dribble”, emoji: “🏀”, reps: “60 sec each hand”, timed: 60, tips: “Eyes UP! Fingertips only. Stay low like you’re sitting in a chair.” },
{ id: “crossover_dribble”, name: “Crossover Dribble”, emoji: “↔️”, reps: “30 crossovers — fast!”, timed: null, tips: “Push the ball low from one hand to the other. Speed is the goal now!” },
{ id: “between_legs”, name: “Between the Legs”, emoji: “🦵”, reps: “10 each leg, walking”, timed: null, tips: “Step forward and bounce the ball between your legs to the other hand. Stay low and keep moving. Real pro move!” },
{ id: “spider_dribble”, name: “Spider Dribble”, emoji: “🕷️”, reps: “45 seconds”, timed: 45, tips: “Dribble both hands alternating — front then behind legs. Feet wide apart.” },
{ id: “two_ball_dribble”, name: “Two Ball Dribble”, emoji: “🏀🏀”, reps: “30 seconds”, timed: 30, tips: “Dribble TWO basketballs at the same time! Same time, then alternating. Super hard but super fun!” },
],
};

const WEEK_LABELS = [“Week 1 — Getting Started 🌱”, “Week 2 — Building Up 💪”, “Week 3 — Level Up! ⚡”, “Week 4 — Pro Mode 🏆”];
const COLORS = [”#FF6B6B”, “#FFD93D”, “#6BCB77”, “#4D96FF”, “#C77DFF”, “#FF9A3C”];
const DAY_NAMES = [“Mon”, “Wed”, “Fri”, “Sat”];

// Zone definitions: id, label, court position (cx,cy as % of SVG viewBox 200x180)
const ZONES = [
{ id: “paint”,    label: “Paint”,       emoji: “🟦”, cx: 100, cy: 148, color: “#4D96FF” },
{ id: “ft”,       label: “Free Throw”,  emoji: “🎯”, cx: 100, cy: 115, color: “#C77DFF” },
{ id: “elbow_l”,  label: “Left Elbow”,  emoji: “📐”, cx:  62, cy: 108, color: “#FF9A3C” },
{ id: “elbow_r”,  label: “Right Elbow”, emoji: “📐”, cx: 138, cy: 108, color: “#FF9A3C” },
{ id: “wing_l”,   label: “Left Wing”,   emoji: “🏹”, cx:  28, cy:  88, color: “#FFD93D” },
{ id: “wing_r”,   label: “Right Wing”,  emoji: “🏹”, cx: 172, cy:  88, color: “#FFD93D” },
{ id: “corner_l”, label: “Left Corner”, emoji: “📍”, cx:  18, cy: 148, color: “#FF6B6B” },
{ id: “corner_r”, label: “Right Corner”,emoji: “📍”, cx: 182, cy: 148, color: “#FF6B6B” },
];

function getFGPct(makes, total) { return total ? Math.round((makes / total) * 100) : 0; }
function formatDate(d) { return new Date(d).toLocaleDateString(“en-US”, { month: “short”, day: “numeric” }); }
function getZone(id) { return ZONES.find(z => z.id === id) || { label: “Unknown”, color: “#aaa”, emoji: “📍” }; }

// ── Timer ──────────────────────────────────────────────────────────────────
function Timer({ seconds, onDone }) {
const [remaining, setRemaining] = useState(seconds);
const [running, setRunning] = useState(false);
const ref = useRef(null);
useEffect(() => {
if (running && remaining > 0) { ref.current = setInterval(() => setRemaining(r => r - 1), 1000); }
else if (remaining === 0) { clearInterval(ref.current); setRunning(false); onDone && onDone(); }
return () => clearInterval(ref.current);
}, [running, remaining]);
const pct = ((seconds - remaining) / seconds) * 100;
return (
<div style={{ display: “flex”, alignItems: “center”, gap: 10, marginTop: 8 }}>
<div style={{ position: “relative”, width: 48, height: 48 }}>
<svg width=“48” height=“48” style={{ transform: “rotate(-90deg)” }}>
<circle cx="24" cy="24" r="20" fill="none" stroke="#eee" strokeWidth="5" />
<circle cx=“24” cy=“24” r=“20” fill=“none” stroke=”#FF6B6B” strokeWidth=“5”
strokeDasharray={`${2 * Math.PI * 20}`} strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`}
style={{ transition: “stroke-dashoffset 0.5s” }} />
</svg>
<span style={{ position: “absolute”, inset: 0, display: “flex”, alignItems: “center”, justifyContent: “center”, fontWeight: 800, fontSize: 13, color: “#333” }}>{remaining}s</span>
</div>
<button onClick={() => setRunning(r => !r)} style={{ padding: “6px 14px”, borderRadius: 20, border: “none”, background: running ? “#FF6B6B” : “#6BCB77”, color: “#fff”, fontWeight: 800, fontSize: 13, cursor: “pointer” }}>
{running ? “⏸ Pause” : remaining < seconds ? “▶ Resume” : “▶ Start”}
</button>
<button onClick={() => { setRemaining(seconds); setRunning(false); }} style={{ padding: “6px 12px”, borderRadius: 20, border: “none”, background: “#eee”, color: “#555”, fontWeight: 700, fontSize: 13, cursor: “pointer” }}>↺</button>
</div>
);
}

// ── Drill Card ─────────────────────────────────────────────────────────────
function DrillCard({ drill, done, reps, onToggle, onRepsChange, color }) {
const [expanded, setExpanded] = useState(false);
const [timerDone, setTimerDone] = useState(false);
return (
<div style={{ borderRadius: 20, background: done ? `${color}22` : “#fff”, border: `3px solid ${done ? color : "#f0f0f0"}`, padding: “14px 16px”, marginBottom: 12, boxShadow: done ? `0 4px 16px ${color}33` : “0 2px 8px rgba(0,0,0,0.06)”, transition: “all 0.3s” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 12 }}>
<button onClick={onToggle} style={{ width: 36, height: 36, borderRadius: “50%”, border: `3px solid ${color}`, background: done ? color : “transparent”, cursor: “pointer”, fontSize: 16, display: “flex”, alignItems: “center”, justifyContent: “center”, flexShrink: 0, transition: “all 0.2s” }}>{done ? “✓” : “”}</button>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 7 }}>
<span style={{ fontSize: 18 }}>{drill.emoji}</span>
<span style={{ fontWeight: 800, fontSize: 14, color: “#222”, textDecoration: done ? “line-through” : “none”, opacity: done ? 0.6 : 1 }}>{drill.name}</span>
</div>
<div style={{ fontSize: 11, color: “#888”, marginTop: 2 }}>{drill.reps}</div>
</div>
<button onClick={() => setExpanded(e => !e)} style={{ background: “none”, border: “none”, fontSize: 16, cursor: “pointer”, color: “#aaa” }}>{expanded ? “▲” : “▼”}</button>
</div>
{expanded && (
<div style={{ marginTop: 12, borderTop: “2px dashed #f0f0f0”, paddingTop: 12 }}>
<div style={{ background: “#fffbe6”, border: “2px solid #FFD93D”, borderRadius: 12, padding: “10px 14px”, marginBottom: 10 }}>
<span style={{ fontSize: 12, fontWeight: 800, color: “#b8860b” }}>💡 Coach’s Tip: </span>
<span style={{ fontSize: 12, color: “#555” }}>{drill.tips}</span>
</div>
{drill.timed && <div><div style={{ fontSize: 12, fontWeight: 700, color: “#888”, marginBottom: 4 }}>⏱ TIMER</div><Timer seconds={drill.timed} onDone={() => setTimerDone(true)} />{timerDone && <div style={{ marginTop: 6, color: “#6BCB77”, fontWeight: 800, fontSize: 13 }}>🎉 Time’s up! Great work!</div>}</div>}
<div style={{ marginTop: 10 }}>
<div style={{ fontSize: 12, fontWeight: 700, color: “#888”, marginBottom: 4 }}>📝 LOG REPS / NOTES</div>
<input type=“text” value={reps || “”} onChange={e => onRepsChange(e.target.value)} placeholder=“e.g. 30 reps, felt good!” style={{ width: “100%”, padding: “8px 12px”, borderRadius: 12, border: “2px solid #f0f0f0”, fontSize: 13, outline: “none”, boxSizing: “border-box”, fontFamily: “inherit” }} />
</div>
</div>
)}
</div>
);
}

// ── Court Diagram with zone picker ─────────────────────────────────────────
function CourtPicker({ selectedZone, onSelect }) {
const W = 200, H = 170;
return (
<div style={{ position: “relative”, width: “100%” }}>
<svg viewBox={`0 0 ${W} ${H}`} style={{ width: “100%”, display: “block”, borderRadius: 16, overflow: “hidden” }}>
{/* Court floor */}
<rect x="0" y="0" width={W} height={H} fill="#f5e6c8" rx="10" />
{/* Baseline */}
<line x1=“10” y1={H - 8} x2={W - 10} y2={H - 8} stroke=”#c9a96e” strokeWidth=“1.5” />
{/* Sidelines */}
<line x1=“10” y1=“20” x2=“10” y2={H - 8} stroke=”#c9a96e” strokeWidth=“1.5” />
<line x1={W - 10} y1=“20” x2={W - 10} y2={H - 8} stroke=”#c9a96e” strokeWidth=“1.5” />
{/* Paint box */}
<rect x="68" y="118" width="64" height="44" fill="#e8d5a3" stroke="#c9a96e" strokeWidth="1.5" rx="2" />
{/* FT circle top half */}
<path d={`M 68 118 A 32 32 0 0 1 132 118`} fill=“none” stroke=”#c9a96e” strokeWidth=“1.5” />
{/* Basket backboard */}
<rect x=“88” y={H - 12} width=“24” height=“3” fill=”#c9a96e” rx=“1” />
{/* Basket rim */}
<circle cx={W / 2} cy={H - 10} r=“6” fill=“none” stroke=”#e07020” strokeWidth=“2” />
{/* 3pt arc */}
<path d={`M 18 ${H - 8} L 18 105 A 82 82 0 0 1 182 105 L 182 ${H - 8}`} fill=“none” stroke=”#c9a96e” strokeWidth=“1.5” />
{/* Zone tap areas + labels */}
{ZONES.map(z => {
const sel = selectedZone === z.id;
return (
<g key={z.id} onClick={() => onSelect(z.id)} style={{ cursor: “pointer” }}>
<circle cx={z.cx} cy={z.cy} r={sel ? 13 : 11}
fill={sel ? z.color : “rgba(255,255,255,0.7)”}
stroke={z.color} strokeWidth={sel ? 3 : 2}
style={{ transition: “all 0.15s”, filter: sel ? `drop-shadow(0 0 5px ${z.color})` : “none” }} />
<text x={z.cx} y={z.cy + 1} textAnchor=“middle” dominantBaseline=“middle”
fontSize={sel ? “9” : “8”} fontWeight=“900”
fill={sel ? “#fff” : z.color}>
{z.id === “paint” ? “P” : z.id === “ft” ? “FT” : z.id.startsWith(“elbow”) ? “EL” : z.id.startsWith(“wing”) ? “WG” : “CO”}
</text>
</g>
);
})}
</svg>
{/* Legend row */}
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 5, marginTop: 8, justifyContent: “center” }}>
{ZONES.map(z => (
<button key={z.id} onClick={() => onSelect(z.id)}
style={{ padding: “4px 9px”, borderRadius: 20, border: `2px solid ${z.color}`, background: selectedZone === z.id ? z.color : “transparent”, color: selectedZone === z.id ? “#fff” : z.color, fontWeight: 800, fontSize: 10, cursor: “pointer”, transition: “all 0.15s” }}>
{z.label}
</button>
))}
</div>
</div>
);
}

// ── Zone breakdown chart ───────────────────────────────────────────────────
function ZoneBreakdown({ shots }) {
const byZone = {};
shots.forEach(s => {
if (!byZone[s.zone]) byZone[s.zone] = { makes: 0, total: 0 };
byZone[s.zone].total++;
if (s.result === “make”) byZone[s.zone].makes++;
});
const rows = ZONES.filter(z => byZone[z.id]).map(z => ({ …z, …byZone[z.id] }));
if (!rows.length) return null;
return (
<div style={{ background: “#fff”, borderRadius: 20, padding: “14px 16px”, marginBottom: 14, boxShadow: “0 2px 10px rgba(0,0,0,0.05)” }}>
<div style={{ fontSize: 12, fontWeight: 800, color: “#aaa”, letterSpacing: 1, marginBottom: 10 }}>📍 BY ZONE</div>
{rows.map(z => {
const pct = getFGPct(z.makes, z.total);
return (
<div key={z.id} style={{ display: “flex”, alignItems: “center”, gap: 10, marginBottom: 8 }}>
<div style={{ width: 28, height: 28, borderRadius: 8, background: `${z.color}22`, border: `2px solid ${z.color}`, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 12, flexShrink: 0 }}>{z.emoji}</div>
<div style={{ flex: 1 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 3 }}>
<span style={{ fontSize: 12, fontWeight: 700, color: “#333” }}>{z.label}</span>
<span style={{ fontSize: 12, fontWeight: 900, color: pct >= 50 ? “#6BCB77” : “#FF6B6B” }}>{pct}% <span style={{ fontSize: 10, color: “#aaa”, fontWeight: 600 }}>({z.makes}/{z.total})</span></span>
</div>
<div style={{ height: 6, borderRadius: 3, background: “#f0f0f0” }}>
<div style={{ height: “100%”, borderRadius: 3, width: `${pct}%`, background: pct >= 50 ? “#6BCB77” : “#FF6B6B”, transition: “width 0.4s” }} />
</div>
</div>
</div>
);
})}
</div>
);
}

// ── Shot Tracker Tab ───────────────────────────────────────────────────────
function ShotTracker({ sessions, onNewSession, onAddShot, onRemoveShot, onClearSession }) {
const [selectedZone, setSelectedZone] = useState(null);
const [confirmClear, setConfirmClear] = useState(false);
const current = sessions[sessions.length - 1];
const makes = current.shots.filter(s => s.result === “make”).length;
const total = current.shots.length;
const pct = getFGPct(makes, total);
const allTime = sessions.reduce((a, s) => {
a.makes += s.shots.filter(x => x.result === “make”).length;
a.total += s.shots.length;
return a;
}, { makes: 0, total: 0 });

const handleShot = (result) => {
if (!selectedZone) return;
onAddShot({ result, zone: selectedZone });
};

return (
<div style={{ padding: “16px 16px 0” }}>
{/* Header */}
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 14 }}>
<div>
<div style={{ fontWeight: 900, fontSize: 18, color: “#222” }}>🎯 Shot Tracker</div>
<div style={{ fontSize: 11, color: “#aaa”, fontWeight: 700 }}>Session {sessions.length}</div>
</div>
<div style={{ display: “flex”, gap: 7, alignItems: “center” }}>
{total > 0 && !confirmClear && (
<button onClick={() => setConfirmClear(true)} style={{ padding: “7px 12px”, borderRadius: 20, border: “2px solid #f0e0e0”, background: “#fff8f8”, color: “#FF6B6B”, fontWeight: 800, fontSize: 11, cursor: “pointer” }}>🗑 Clear</button>
)}
{confirmClear && (
<>
<button onClick={() => { onClearSession(); setConfirmClear(false); }} style={{ padding: “7px 12px”, borderRadius: 20, border: “none”, background: “#FF6B6B”, color: “#fff”, fontWeight: 800, fontSize: 11, cursor: “pointer” }}>Yes, clear</button>
<button onClick={() => setConfirmClear(false)} style={{ padding: “7px 12px”, borderRadius: 20, border: “2px solid #eee”, background: “#fff”, color: “#aaa”, fontWeight: 800, fontSize: 11, cursor: “pointer” }}>Cancel</button>
</>
)}
{!confirmClear && (
<button onClick={onNewSession} style={{ padding: “8px 14px”, borderRadius: 20, border: “none”, background: “linear-gradient(135deg, #FF6B6B, #FF9A3C)”, color: “#fff”, fontWeight: 800, fontSize: 12, cursor: “pointer”, boxShadow: “0 3px 10px rgba(255,107,107,0.35)” }}>+ New</button>
)}
</div>
</div>

```
  {/* FG% ring */}
  <div style={{ background: "#fff", borderRadius: 22, padding: "18px 16px 14px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginBottom: 14 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#6BCB77", lineHeight: 1 }}>{makes}</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", marginTop: 2 }}>MAKES ✅</div>
      </div>
      <div style={{ position: "relative", width: 84, height: 84 }}>
        <svg width="84" height="84" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="42" cy="42" r="35" fill="none" stroke="#f0f0f0" strokeWidth="9" />
          <circle cx="42" cy="42" r="35" fill="none" stroke={total === 0 ? "#e0e0e0" : pct >= 50 ? "#6BCB77" : "#FF6B6B"} strokeWidth="9"
            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 35}`}
            strokeDashoffset={`${2 * Math.PI * 35 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.4s, stroke 0.3s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#222" }}>{total === 0 ? "—" : `${pct}%`}</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#aaa" }}>FG%</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#FF6B6B", lineHeight: 1 }}>{total - makes}</div>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", marginTop: 2 }}>MISSES ❌</div>
      </div>
    </div>

    {/* Shot dots — tap to remove */}
    {total > 0 && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: "#ccc", fontWeight: 700, textAlign: "center", marginBottom: 5, letterSpacing: 0.5 }}>TAP A DOT TO REMOVE IT</div>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 5, maxHeight: 72, overflow: "hidden" }}>
          {current.shots.map((s, i) => {
            const z = getZone(s.zone);
            return (
              <button key={i} onClick={() => onRemoveShot(i)} title={`${s.result === "make" ? "✓ Make" : "✗ Miss"} — ${z.label}\nTap to remove`}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.transform = "scale(1.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                style={{ width: 24, height: 24, borderRadius: "50%", background: s.result === "make" ? "#6BCB77" : "#FF6B6B", border: `2.5px solid ${z.color}`, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 900, cursor: "pointer", transition: "transform 0.12s, opacity 0.12s" }}>
                {s.result === "make" ? "✓" : "✗"}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </div>

  {/* Court zone picker */}
  <div style={{ background: "#fff", borderRadius: 22, padding: "14px 14px 16px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}>
    <div style={{ fontSize: 12, fontWeight: 800, color: "#aaa", letterSpacing: 1, marginBottom: 10, textAlign: "center" }}>
      {selectedZone ? `📍 ${getZone(selectedZone).label} — Now tap MAKE or MISS` : "① TAP THE COURT TO PICK A ZONE"}
    </div>
    <CourtPicker selectedZone={selectedZone} onSelect={setSelectedZone} />

    {/* Make / Miss buttons */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
      <button onClick={() => handleShot("make")} disabled={!selectedZone}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.95)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        style={{ padding: "18px 10px", borderRadius: 20, border: "none", background: selectedZone ? "linear-gradient(135deg, #6BCB77, #4CAF50)" : "#e8e8e8", color: "#fff", fontWeight: 900, fontSize: 22, cursor: selectedZone ? "pointer" : "not-allowed", boxShadow: selectedZone ? "0 5px 18px rgba(107,203,119,0.4)" : "none", transition: "all 0.15s", opacity: selectedZone ? 1 : 0.5 }}>
        ✅<br /><span style={{ fontSize: 14 }}>MAKE</span>
      </button>
      <button onClick={() => handleShot("miss")} disabled={!selectedZone}
        onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
        onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
        onTouchStart={e => e.currentTarget.style.transform = "scale(0.95)"}
        onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        style={{ padding: "18px 10px", borderRadius: 20, border: "none", background: selectedZone ? "linear-gradient(135deg, #FF6B6B, #e53935)" : "#e8e8e8", color: "#fff", fontWeight: 900, fontSize: 22, cursor: selectedZone ? "pointer" : "not-allowed", boxShadow: selectedZone ? "0 5px 18px rgba(255,107,107,0.4)" : "none", transition: "all 0.15s", opacity: selectedZone ? 1 : 0.5 }}>
        ❌<br /><span style={{ fontSize: 14 }}>MISS</span>
      </button>
    </div>
    {!selectedZone && <div style={{ textAlign: "center", fontSize: 11, color: "#ccc", fontWeight: 700, marginTop: 8 }}>Pick a zone on the court first ☝️</div>}
  </div>

  {/* Zone breakdown */}
  <ZoneBreakdown shots={current.shots} />

  {/* All-time */}
  <div style={{ background: "linear-gradient(135deg, #4D96FF18, #C77DFF18)", border: "2px solid #4D96FF28", borderRadius: 20, padding: "13px 16px", marginBottom: 14 }}>
    <div style={{ fontSize: 11, fontWeight: 800, color: "#4D96FF", letterSpacing: 1, marginBottom: 9 }}>📊 ALL-TIME · {sessions.length} sessions</div>
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {[{ label: "FG%", val: `${getFGPct(allTime.makes, allTime.total)}%`, color: "#4D96FF" }, { label: "Makes", val: allTime.makes, color: "#6BCB77" }, { label: "Shots", val: allTime.total, color: "#333" }].map(s => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
          <div style={{ fontSize: 10, color: "#aaa", fontWeight: 700 }}>{s.label}</div>
        </div>
      ))}
    </div>
  </div>

  {/* Session history */}
  {sessions.length > 0 && (
    <div style={{ background: "#fff", borderRadius: 20, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#aaa", letterSpacing: 1, marginBottom: 10 }}>📅 SESSION HISTORY</div>
      {/* Bar chart */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 50, marginBottom: 12 }}>
        {sessions.map((s, i) => {
          const sm = s.shots.filter(x => x.result === "make").length;
          const sp = getFGPct(sm, s.shots.length);
          const isLast = i === sessions.length - 1;
          return (
            <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: s.shots.length ? (sp >= 50 ? "#6BCB77" : "#FF6B6B") : "#eee" }}>{s.shots.length ? `${sp}%` : ""}</div>
              <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: s.shots.length ? (sp >= 50 ? "#6BCB77" : "#FF6B6B") : "#f0f0f0", height: s.shots.length ? `${Math.max(5, sp * 0.38)}px` : 5, outline: isLast ? "2px solid #FFD93D" : "none", transition: "height 0.4s" }} />
              <div style={{ fontSize: 8, color: "#ddd", fontWeight: 700 }}>S{i + 1}</div>
            </div>
          );
        })}
      </div>
      {[...sessions].reverse().map((s, i) => {
        const sm = s.shots.filter(x => x.result === "make").length;
        const st = s.shots.length;
        const sp = getFGPct(sm, st);
        const isLatest = i === 0;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < sessions.length - 1 ? "1px solid #f5f5f5" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: isLatest ? "#FFD93D22" : "#f8f8f8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: isLatest ? "#b8860b" : "#bbb", border: isLatest ? "2px solid #FFD93D" : "2px solid transparent", flexShrink: 0 }}>S{sessions.length - i}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>{formatDate(s.date)} {isLatest && <span style={{ fontSize: 9, background: "#FFD93D", color: "#a07000", borderRadius: 5, padding: "1px 5px", fontWeight: 800 }}>NOW</span>}</div>
              <div style={{ fontSize: 10, color: "#ccc" }}>{sm} makes · {st - sm} misses · {st} shots</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 19, fontWeight: 900, color: st === 0 ? "#ccc" : sp >= 50 ? "#6BCB77" : "#FF6B6B" }}>{st === 0 ? "—" : `${sp}%`}</div>
              <div style={{ height: 3, width: 44, borderRadius: 2, background: "#f0f0f0", marginTop: 2 }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${sp}%`, background: sp >= 50 ? "#6BCB77" : "#FF6B6B" }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
```

);
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
const [tab, setTab] = useState(“home”);
const [selectedWeek, setSelectedWeek] = useState(1);
const [selectedDay, setSelectedDay] = useState(null);
const [drillView, setDrillView] = useState(“calendar”);
const [completed, setCompleted] = useState({});
const [repsLog, setRepsLog] = useState({});
const [sessions, setSessions] = useState([{ id: Date.now(), date: Date.now(), shots: [] }]);

const toggleDrill = (w, d, id) => setCompleted(c => ({ …c, [`${w}-${d}-${id}`]: !c[`${w}-${d}-${id}`] }));
const logReps = (w, d, id, v) => setRepsLog(r => ({ …r, [`${w}-${d}-${id}`]: v }));
const getDayPct = (w, d) => { const dr = DRILLS[w] || []; return dr.length ? Math.round(dr.filter(x => completed[`${w}-${d}-${x.id}`]).length / dr.length * 100) : 0; };
const getWeekPct = (w) => { let tot = 0, done = 0; for (let d = 1; d <= 4; d++) { const dr = DRILLS[w] || []; tot += dr.length; done += dr.filter(x => completed[`${w}-${d}-${x.id}`]).length; } return tot ? Math.round(done / tot * 100) : 0; };

const addShot = (shot) => setSessions(prev => { const u = […prev]; u[u.length - 1] = { …u[u.length - 1], shots: […u[u.length - 1].shots, shot] }; return u; });
const removeShot = (idx) => setSessions(prev => { const u = […prev]; const l = { …u[u.length - 1] }; l.shots = l.shots.filter((_, i) => i !== idx); u[u.length - 1] = l; return u; });
const clearSession = () => setSessions(prev => { const u = […prev]; u[u.length - 1] = { …u[u.length - 1], shots: [] }; return u; });
const newSession = () => setSessions(p => […p, { id: Date.now(), date: Date.now(), shots: [] }]);

const cur = sessions[sessions.length - 1];
const curMakes = cur.shots.filter(s => s.result === “make”).length;
const curPct = getFGPct(curMakes, cur.shots.length);
const allTime = sessions.reduce((a, s) => { a.makes += s.shots.filter(x => x.result === “make”).length; a.total += s.shots.length; return a; }, { makes: 0, total: 0 });
const drills = DRILLS[selectedWeek] || [];

return (
<div style={{ minHeight: “100vh”, background: “linear-gradient(135deg, #FFF4E6 0%, #E8F4FD 50%, #F0FFF4 100%)”, fontFamily: “‘Nunito’, system-ui, sans-serif”, paddingBottom: 76 }}>

```
  {/* Header */}
  <div style={{ background: "linear-gradient(135deg, #FF6B6B, #FFD93D)", padding: "18px 20px 14px", textAlign: "center", borderRadius: "0 0 26px 26px", boxShadow: "0 6px 28px rgba(255,107,107,0.3)" }}>
    <div style={{ fontSize: 32 }}>🏀</div>
    <h1 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>Ball Handler Training</h1>
    <div style={{ color: "rgba(255,255,255,0.88)", fontSize: 11, fontWeight: 700 }}>4-Week Program 🌟</div>
  </div>

  {/* ── HOME ── */}
  {tab === "home" && (
    <div style={{ padding: "16px 16px 0" }}>
      {/* Shot widget */}
      <div onClick={() => setTab("shots")} style={{ background: "#fff", borderRadius: 22, padding: "15px 16px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,0.08)", cursor: "pointer", border: "2px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#222" }}>🎯 Shot Tracker</div>
            <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>Session {sessions.length} · Tap to open →</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: cur.shots.length === 0 ? "#ddd" : curPct >= 50 ? "#6BCB77" : "#FF6B6B", lineHeight: 1 }}>{cur.shots.length === 0 ? "—" : `${curPct}%`}</div>
            <div style={{ fontSize: 10, color: "#aaa", fontWeight: 700 }}>TODAY FG%</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#f0f0f0" }}>
            <div style={{ height: "100%", borderRadius: 4, width: `${curPct}%`, background: "linear-gradient(90deg, #6BCB77, #4D96FF)", transition: "width 0.4s" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#6BCB77" }}>{curMakes}✅</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#FF6B6B" }}>{cur.shots.length - curMakes}❌</span>
        </div>
        {allTime.total > 0 && <div style={{ marginTop: 6, fontSize: 10, color: "#ccc", fontWeight: 700 }}>All-time: {getFGPct(allTime.makes, allTime.total)}% · {allTime.total} shots · {sessions.length} sessions</div>}
      </div>

      {/* FG% mini trend */}
      {sessions.some(s => s.shots.length > 0) && (
        <div style={{ background: "#fff", borderRadius: 18, padding: "11px 14px", marginBottom: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#aaa", letterSpacing: 1, marginBottom: 7 }}>📈 FG% TREND</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 40 }}>
            {sessions.map((s, i) => {
              const sm = s.shots.filter(x => x.result === "make").length;
              const sp = getFGPct(sm, s.shots.length);
              return (
                <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, color: s.shots.length ? (sp >= 50 ? "#6BCB77" : "#FF6B6B") : "#eee" }}>{s.shots.length ? `${sp}%` : ""}</div>
                  <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: s.shots.length ? (sp >= 50 ? "#6BCB77" : "#FF6B6B") : "#f0f0f0", height: s.shots.length ? `${Math.max(4, sp * 0.3)}px` : 4 }} />
                  <div style={{ fontSize: 8, color: "#ddd" }}>S{i + 1}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week progress */}
      <div style={{ fontSize: 11, fontWeight: 800, color: "#aaa", letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>Drill Progress</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {[1, 2, 3, 4].map(w => {
          const pct = getWeekPct(w); const color = COLORS[w - 1];
          return (
            <button key={w} onClick={() => { setSelectedWeek(w); setDrillView("calendar"); setTab("drills"); }}
              style={{ borderRadius: 16, border: `3px solid ${pct > 0 ? color : "#e8e8e8"}`, background: pct === 100 ? color : "#fff", padding: "10px 4px", cursor: "pointer", transition: "all 0.2s", boxShadow: pct > 0 ? `0 3px 10px ${color}33` : "none" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: pct === 100 ? "#fff" : "#333" }}>W{w}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: pct === 100 ? "rgba(255,255,255,0.9)" : "#bbb", marginTop: 1 }}>{pct}%</div>
              <div style={{ marginTop: 3, height: 4, borderRadius: 2, background: pct === 100 ? "rgba(255,255,255,0.35)" : "#f0f0f0" }}>
                <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: pct === 100 ? "#fff" : color, transition: "width 0.5s" }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  )}

  {/* ── DRILLS ── */}
  {tab === "drills" && (
    <div>
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 7 }}>
          {[1, 2, 3, 4].map(w => {
            const pct = getWeekPct(w); const color = COLORS[w - 1]; const active = selectedWeek === w;
            return (
              <button key={w} onClick={() => { setSelectedWeek(w); setSelectedDay(null); setDrillView("calendar"); }}
                style={{ borderRadius: 14, border: `3px solid ${active ? color : "#e8e8e8"}`, background: active ? color : "#fff", padding: "8px 4px", cursor: "pointer", transition: "all 0.2s", boxShadow: active ? `0 4px 14px ${color}55` : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 900, color: active ? "#fff" : "#333" }}>W{w}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: active ? "rgba(255,255,255,0.85)" : "#bbb", marginTop: 1 }}>{pct}%</div>
                <div style={{ marginTop: 3, height: 4, borderRadius: 2, background: active ? "rgba(255,255,255,0.35)" : "#f0f0f0" }}>
                  <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: active ? "#fff" : color }} />
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 6, textAlign: "center", fontSize: 12, fontWeight: 800, color: "#777" }}>{WEEK_LABELS[selectedWeek - 1]}</div>
      </div>

      {drillView === "calendar" && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#aaa", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>Pick a Practice Day</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9 }}>
            {[0, 1, 2, 3].map(i => {
              const pct = getDayPct(selectedWeek, i + 1); const color = COLORS[i + 1];
              return (
                <button key={i} onClick={() => { setSelectedDay(i + 1); setDrillView("drills"); }}
                  style={{ borderRadius: 17, border: `3px solid ${pct === 100 ? color : "#e8e8e8"}`, background: pct === 100 ? `${color}22` : "#fff", padding: "13px 5px", cursor: "pointer", textAlign: "center", boxShadow: pct === 100 ? `0 4px 12px ${color}33` : "0 2px 7px rgba(0,0,0,0.05)", transition: "all 0.2s" }}>
                  <div style={{ fontSize: 19 }}>{pct === 100 ? "⭐" : "🏀"}</div>
                  <div style={{ fontWeight: 900, fontSize: 13, color: "#333", marginTop: 3 }}>Day {i + 1}</div>
                  <div style={{ fontSize: 10, color: "#aaa", fontWeight: 700 }}>{DAY_NAMES[i]}</div>
                  <div style={{ marginTop: 6, height: 5, borderRadius: 3, background: "#f0f0f0" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${pct}%`, background: color, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: pct === 100 ? color : "#ddd", marginTop: 2 }}>{pct}%</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 13, background: "#fff", borderRadius: 17, padding: "13px 15px", boxShadow: "0 2px 9px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ fontWeight: 800, fontSize: 13 }}>Week {selectedWeek} Progress</span>
              <span style={{ fontWeight: 900, fontSize: 16, color: COLORS[selectedWeek - 1] }}>{getWeekPct(selectedWeek)}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "#f0f0f0" }}>
              <div style={{ height: "100%", borderRadius: 4, width: `${getWeekPct(selectedWeek)}%`, background: `linear-gradient(90deg, ${COLORS[selectedWeek - 1]}, ${COLORS[selectedWeek] || "#FF9A3C"})`, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>
      )}

      {drillView === "drills" && selectedDay && (
        <div style={{ padding: "12px 16px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
            <button onClick={() => setDrillView("calendar")} style={{ background: "#fff", border: "2px solid #eee", borderRadius: 11, padding: "5px 11px", cursor: "pointer", fontWeight: 800, fontSize: 12, color: "#666" }}>← Back</button>
            <div><div style={{ fontWeight: 900, fontSize: 14, color: "#333" }}>Day {selectedDay} Drills</div><div style={{ fontSize: 10, color: "#aaa", fontWeight: 700 }}>Week {selectedWeek} · {drills.length} drills</div></div>
            <div style={{ marginLeft: "auto", fontWeight: 900, fontSize: 19, color: COLORS[selectedDay] }}>{getDayPct(selectedWeek, selectedDay)}%</div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: "#f0f0f0", marginBottom: 11 }}>
            <div style={{ height: "100%", borderRadius: 3, width: `${getDayPct(selectedWeek, selectedDay)}%`, background: "linear-gradient(90deg, #FF6B6B, #FFD93D)", transition: "width 0.4s" }} />
          </div>
          {drills.map((drill, i) => (
            <DrillCard key={drill.id} drill={drill}
              done={!!completed[`${selectedWeek}-${selectedDay}-${drill.id}`]}
              reps={repsLog[`${selectedWeek}-${selectedDay}-${drill.id}`]}
              onToggle={() => toggleDrill(selectedWeek, selectedDay, drill.id)}
              onRepsChange={v => logReps(selectedWeek, selectedDay, drill.id, v)}
              color={COLORS[i % COLORS.length]} />
          ))}
          {getDayPct(selectedWeek, selectedDay) === 100 && (
            <div style={{ textAlign: "center", padding: "17px", background: "linear-gradient(135deg, #6BCB77, #4D96FF)", borderRadius: 21, color: "#fff", fontWeight: 900, fontSize: 16, marginBottom: 12 }}>
              ⭐ DAY COMPLETE! ⭐<br /><span style={{ fontSize: 11, fontWeight: 700, opacity: 0.9 }}>You crushed it today! 🏀🔥</span>
            </div>
          )}
        </div>
      )}
    </div>
  )}

  {/* ── SHOTS ── */}
  {tab === "shots" && (
    <ShotTracker sessions={sessions} onNewSession={newSession} onAddShot={addShot} onRemoveShot={removeShot} onClearSession={clearSession} />
  )}

  {/* Bottom nav */}
  <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "2px solid #f0f0f0", display: "flex", boxShadow: "0 -4px 16px rgba(0,0,0,0.08)", zIndex: 100 }}>
    {[{ id: "home", emoji: "🏠", label: "Home" }, { id: "drills", emoji: "🏀", label: "Drills" }, { id: "shots", emoji: "🎯", label: "Shots" }].map(n => (
      <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "9px 0 11px", border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 21 }}>{n.emoji}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: tab === n.id ? "#FF6B6B" : "#bbb", letterSpacing: 0.5 }}>{n.label.toUpperCase()}</span>
        {tab === n.id && <div style={{ width: 18, height: 3, borderRadius: 2, background: "#FF6B6B" }} />}
      </button>
    ))}
  </div>
</div>
```

);
