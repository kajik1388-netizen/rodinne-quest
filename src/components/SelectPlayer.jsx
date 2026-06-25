import { useState } from "react";
import { AVTS, MaggieSVG } from "./Avatars.jsx";
import { Btn } from "./UI.jsx";
import { YELLOW, DARK, DARK2 } from "../data.js";

// ═══════════════════════════════════════════════════════
//  SELECT PLAYER
// ═══════════════════════════════════════════════════════
export function SelectPlayer({ members, onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#87CEEB 0%,#5BB8F5 40%,#2196F3 100%)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"space-between",
      padding:"36px 20px 28px", position:"relative", overflow:"hidden"
    }}>
      {/* Mraky */}
      {[{l:2,t:6,s:1.1},{l:52,t:2,s:0.9},{l:72,t:10,s:1},{l:28,t:18,s:0.8}].map((c,i)=>(
        <div key={i} style={{
          position:"absolute", left:`${c.l}%`, top:`${c.t}%`,
          transform:`scale(${c.s})`, opacity:0.75, fontSize:44,
          pointerEvents:"none"
        }}>☁️</div>
      ))}

      {/* Nadpis */}
      <div style={{ textAlign:"center", zIndex:1 }}>
        <h1 style={{
          color:YELLOW, fontSize:32, margin:"0 0 4px", fontWeight:900,
          textShadow:"3px 3px 0 #B8860B, 0 4px 20px rgba(0,0,0,0.25)",
          letterSpacing:1
        }}>🏠 Rodinné Quest</h1>
        <p style={{ color:"white", fontSize:15, margin:0, fontWeight:700, textShadow:"0 1px 6px rgba(0,0,0,0.3)" }}>
          Kto hrá dnes?
        </p>
      </div>

      {/* Avatary */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, width:"100%", maxWidth:390, zIndex:1 }}>
        {members.map(m => {
          const Av = AVTS[m.id];
          const isH = hover === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelect(m)}
              onMouseEnter={() => setHover(m.id)}
              onMouseLeave={() => setHover(null)}
              onTouchStart={() => setHover(m.id)}
              onTouchEnd={() => setTimeout(() => setHover(null), 300)}
              style={{
                background: isH ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
                border:`3px solid ${isH ? m.color : "rgba(255,255,255,0.5)"}`,
                borderRadius:28, padding:"20px 12px 14px",
                cursor:"pointer", display:"flex", flexDirection:"column",
                alignItems:"center", gap:6,
                transform: isH ? "scale(1.06) translateY(-5px)" : "scale(1)",
                transition:"all 0.18s ease",
                boxShadow: isH
                  ? `0 14px 36px rgba(0,0,0,0.18), 0 4px 12px ${m.color}55`
                  : "0 4px 16px rgba(0,0,0,0.1)"
              }}
            >
              <Av size={74}/>
              <p style={{ color:"#1A1A2E", fontSize:18, fontWeight:900, margin:"4px 0 0" }}>{m.name}</p>
              <span style={{
                background: m.role==="admin" ? YELLOW : `${m.color}18`,
                color: m.role==="admin" ? "#1A1A2E" : m.color,
                borderRadius:20, padding:"2px 12px", fontSize:11, fontWeight:800
              }}>{m.label}</span>
              {m.streak >= 3 && (
                <span style={{ background:"#FF6B3518", color:"#FF6B35", borderRadius:12, padding:"1px 8px", fontSize:11, fontWeight:800 }}>
                  🔥 {m.streak}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Maggie */}
      <div style={{
        display:"flex", alignItems:"center", gap:14,
        background:"rgba(255,255,255,0.88)", borderRadius:24,
        padding:"12px 20px", width:"100%", maxWidth:390,
        boxSizing:"border-box", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", zIndex:1
      }}>
        <MaggieSVG size={54}/>
        <div>
          <p style={{ color:"#E91E63", fontSize:13, fontWeight:900, margin:0 }}>🐹 Maggie hovorí:</p>
          <p style={{ color:"#555", fontSize:13, margin:"2px 0 0", fontWeight:700 }}>"Nakŕmte ma dnes! Som hladná 😤"</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PIN LOGIN
// ═══════════════════════════════════════════════════════
export function PinLogin({ member, onSuccess, onBack }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const Av = AVTS[member.id];

  const press = (n) => {
    if (pin.length >= 4) return;
    const next = pin + n;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === member.pin) {
          onSuccess(member);
        } else {
          setShake(true);
          setError(true);
          setTimeout(() => { setShake(false); setPin(""); }, 700);
        }
      }, 200);
    }
  };

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(160deg,${DARK},${DARK2},#0F3460)`,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:24
    }}>
      <button onClick={onBack} style={{
        position:"absolute", top:20, left:20,
        background:"rgba(255,255,255,0.1)", border:"none", borderRadius:12,
        color:"white", padding:"8px 16px", fontSize:14, cursor:"pointer", fontFamily:"inherit"
      }}>← Späť</button>

      <div style={{ marginBottom:8 }}><Av size={96}/></div>
      <h2 style={{ color:YELLOW, fontSize:28, margin:"0 0 4px", fontWeight:900 }}>Ahoj, {member.name}!</h2>

      {member.pin !== "" ? (
        <>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, margin:"0 0 24px" }}>Zadaj svoj PIN</p>
          <div style={{ display:"flex", gap:18, marginBottom:8, animation: shake ? "shake 0.6s" : "none" }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width:22, height:22, borderRadius:"50%",
                background: error ? "#FF5252" : i < pin.length ? YELLOW : "rgba(255,255,255,0.15)",
                border:`2px solid ${error ? "#FF5252" : i < pin.length ? YELLOW : "rgba(255,255,255,0.25)"}`,
                transition:"all 0.15s",
                transform: i < pin.length ? "scale(1.3)" : "scale(1)"
              }}/>
            ))}
          </div>
          {error
            ? <p style={{ color:"#FF5252", fontSize:13, fontWeight:800, margin:"8px 0 12px" }}>Nesprávny PIN!</p>
            : <div style={{ height:36 }}/>
          }
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, width:234 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button
                key={n}
                onClick={() => press(String(n))}
                style={{
                  height:70, borderRadius:18,
                  border:"2px solid rgba(255,255,255,0.08)",
                  background:"rgba(255,255,255,0.06)",
                  color:"white", fontSize:30, fontWeight:800,
                  cursor:"pointer", fontFamily:"inherit"
                }}
                onMouseDown={e => { e.currentTarget.style.transform="scale(0.9)"; e.currentTarget.style.background=`${member.color}44`; }}
                onMouseUp={e   => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.background="rgba(255,255,255,0.06)"; }}
              >{n}</button>
            ))}
            <div/>
            <button
              onClick={() => press("0")}
              style={{ height:70, borderRadius:18, border:"2px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.06)", color:"white", fontSize:30, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}
            >0</button>
            <button
              onClick={() => setPin(p => p.slice(0,-1))}
              style={{ height:70, borderRadius:18, border:"2px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:26, cursor:"pointer" }}
            >⌫</button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12, marginTop:24 }}>Demo PIN: 1234</p>
        </>
      ) : (
        <>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, margin:"0 0 32px" }}>
            Žiadny PIN — môžeš rovno vstúpiť!
          </p>
          <Btn
            onClick={() => onSuccess(member)}
            color={member.color}
            style={{ fontSize:18, padding:"18px 48px", boxShadow:`0 8px 24px ${member.color}66` }}
          >Vstúpiť →</Btn>
          <p style={{ color:"rgba(255,255,255,0.25)", fontSize:12, marginTop:20 }}>
            PIN môžeš nastaviť v Profile
          </p>
        </>
      )}
    </div>
  );
}
