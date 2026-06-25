// ── Spoločné UI komponenty ─────────────────────────────
export const iS = {
  width:"100%", padding:"10px 14px", borderRadius:12,
  border:"1.5px solid #e0e0e0", fontFamily:"inherit",
  fontSize:13, outline:"none", boxSizing:"border-box"
};
export const sS = { ...iS, background:"white", cursor:"pointer" };

export function Toast({ t }) {
  if (!t) return null;
  return (
    <div style={{
      position:"fixed", bottom:90, left:"50%",
      transform:"translateX(-50%)",
      background: t.c || "#1A1A2E", color:"white",
      padding:"12px 24px", borderRadius:30, fontSize:14,
      fontWeight:800, zIndex:999,
      boxShadow:"0 6px 24px rgba(0,0,0,0.25)",
      whiteSpace:"nowrap", animation:"fu 0.3s ease",
      pointerEvents:"none"
    }}>{t.m}</div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background:"white", borderRadius:20,
      padding:"14px 16px",
      boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
      ...style
    }}>{children}</div>
  );
}

export function Sect({ children }) {
  return (
    <p style={{
      color:"#777", fontSize:11, fontWeight:800,
      margin:"0 0 8px", textTransform:"uppercase", letterSpacing:0.8
    }}>{children}</p>
  );
}

export function Btn({ children, onClick, color, style = {}, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding:"12px 20px", borderRadius:14, border:"none",
        background: disabled ? "#eee" : (color || "#1A1A2E"),
        color: disabled ? "#bbb" : "white",
        fontWeight:800, fontSize:14,
        cursor: disabled ? "default" : "pointer",
        fontFamily:"inherit", transition:"all 0.15s",
        ...style
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.95)"; }}
      onMouseUp={e   => { e.currentTarget.style.transform = "scale(1)"; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.95)"; }}
      onTouchEnd={e   => { e.currentTarget.style.transform = "scale(1)"; }}
    >{children}</button>
  );
}

export function TabBar({ tabs, active, onSelect, color }) {
  return (
    <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none", paddingBottom:2 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            flexShrink:0, padding:"8px 14px", borderRadius:20,
            border:"none", fontFamily:"inherit", fontSize:12,
            fontWeight:800, cursor:"pointer", whiteSpace:"nowrap",
            background: active === t.id ? color : "white",
            color: active === t.id ? "white" : "#888",
            boxShadow: active === t.id
              ? `0 4px 12px ${color}55`
              : "0 1px 4px rgba(0,0,0,0.08)",
            transition:"all 0.2s",
            position:"relative"
          }}
        >
          {t.label}
          {t.badge > 0 && (
            <span style={{
              position:"absolute", top:-4, right:-4,
              background:"#FF5252", color:"white",
              borderRadius:"50%", width:16, height:16,
              fontSize:9, fontWeight:900,
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>{t.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function SegmentControl({ options, value, onChange }) {
  return (
    <div style={{
      display:"flex", background:"rgba(0,0,0,0.05)",
      borderRadius:14, padding:3
    }}>
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex:1, padding:"8px 0", borderRadius:11, border:"none",
            fontFamily:"inherit", fontSize:12, fontWeight:800,
            cursor:"pointer",
            background: value === o.id ? "white" : "transparent",
            color: value === o.id ? (o.color || "#1A1A2E") : "#aaa",
            boxShadow: value === o.id ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
            transition:"all 0.2s"
          }}
        >{o.label}</button>
      ))}
    </div>
  );
}
