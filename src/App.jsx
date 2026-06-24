import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
//  GLOBÁLNE ŠTÝLY & KONŠTANTY
// ═══════════════════════════════════════════════════════

const C = {
  bg:      "#F0EEF8",
  dark:    "#1A1A2E",
  dark2:   "#16213E",
  yellow:  "#FFD90F",
  shadow:  "0 2px 12px rgba(0,0,0,0.08)",
};

const MEMBER_COLORS = {
  homer:"#4A90D9", marge:"#8CC63F", bart:"#E53935", lisa:"#E91E63", "Ktokoľvek":"#9C27B0"
};

const MEMBERS = [
  { id:"homer", name:"Homer", role:"admin",  color:"#4A90D9", label:"Admin 🍩", pin:"1234", weekPoints:22, totalPoints:180, streak:2, level:3 },
  { id:"marge", name:"Marge", role:"admin",  color:"#8CC63F", label:"Admin 💙", pin:"1234", weekPoints:31, totalPoints:240, streak:7, level:4 },
  { id:"bart",  name:"Bart",  role:"player", color:"#E53935", label:"14 rokov 🛹", pin:"",  weekPoints:38, totalPoints:247, streak:3, level:4 },
  { id:"lisa",  name:"Lisa",  role:"player", color:"#E91E63", label:"10 rokov 🎷", pin:"",  weekPoints:47, totalPoints:310, streak:5, level:4 },
];

const LEVELS = ["🌱 Začiatočník","⚡ Pomocník","🌟 Šikovný","🔥 Expert","🏆 Majster","👑 Legenda"];
const LEVEL_PTS = [0,50,150,300,500,800];

const ROOMS = ["🍳 Kuchyňa","🛋️ Obývačka","🚿 Kúpeľňa 1","🚿 Kúpeľňa 2","🛏️ Izba Barta","🛏️ Izba Lisy","🛏️ Izba rodičov","💼 Pracovňa","🌿 Záhrada","🏊 Bazén","🐹 Maggie","🌸 Kvety","♻️ Smeti","🛒 Nákupy","⭐ Špeciálne"];
const FREQS = ["Denne","Týždeň","Mesiac","Jednorazová"];

const iStyle = { width:"100%", padding:"10px 14px", borderRadius:12, border:"1.5px solid #e0e0e0", fontFamily:"inherit", fontSize:13, outline:"none", boxSizing:"border-box" };
const sStyle = { ...iStyle, background:"white", cursor:"pointer" };

// ═══════════════════════════════════════════════════════
//  AVATARY — SVG
// ═══════════════════════════════════════════════════════

function HomerSVG({ size=80 }) {
  return (
    <svg width={size} height={size*1.25} viewBox="0 0 100 125" fill="none">
      <ellipse cx="50" cy="105" rx="28" ry="18" fill="#E8E8E8" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="24" y="108" width="52" height="14" rx="4" fill="#5B7FA6" stroke="#1a1a1a" strokeWidth="2"/>
      <rect x="42" y="76" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M30 36 Q32 26 38 28" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M38 28 Q44 22 50 26" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="18" cy="56" rx="7" ry="9" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="82" cy="56" rx="7" ry="9" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M26 42 Q34 38 40 42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M60 42 Q66 38 74 42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <ellipse cx="34" cy="50" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="66" cy="50" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="35" cy="51" r="5" fill="#1a1a1a"/><circle cx="67" cy="51" r="5" fill="#1a1a1a"/>
      <circle cx="37" cy="49" r="2" fill="white"/><circle cx="69" cy="49" r="2" fill="white"/>
      <path d="M50 58 Q58 60 62 66 Q56 70 50 68 Q44 68 38 66 Q42 60 50 58Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M34 72 Q50 82 66 72" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M36 90 L50 102 L64 90 L64 88 L36 88Z" fill="#E8E8E8" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="74" rx="14" ry="4" fill="#C8A800" opacity="0.35"/>
    </svg>
  );
}

function MargeSVG({ size=80 }) {
  return (
    <svg width={size} height={size*1.6} viewBox="0 0 100 160" fill="none">
      <ellipse cx="50" cy="140" rx="26" ry="20" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="26" y="112" width="48" height="30" rx="6" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M34 106 Q50 114 66 106" stroke="#CC2222" strokeWidth="5" strokeLinecap="round"/>
      {[38,44,50,56,62].map((x,i)=><circle key={i} cx={x} cy={108+Math.sin(i)*1.5} r="3" fill="#CC2222" stroke="#1a1a1a" strokeWidth="1"/>)}
      <rect x="42" y="94" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="82" rx="28" ry="26" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="22" cy="82" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="78" cy="82" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M22 72 Q20 50 28 30 Q34 10 50 8 Q66 6 72 28 Q78 48 78 72" fill="#42A5F5" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M36 14 Q38 32 36 52" stroke="#1565C0" strokeWidth="2" opacity="0.4"/>
      <path d="M50 10 Q52 30 50 54" stroke="#1565C0" strokeWidth="2" opacity="0.4"/>
      <path d="M64 14 Q66 32 64 52" stroke="#1565C0" strokeWidth="2" opacity="0.4"/>
      <path d="M28 76 Q36 72 42 76" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M58 76 Q64 72 72 76" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="24" y1="72" x2="22" y2="68" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="28" y1="70" x2="27" y2="66" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="68" y1="70" x2="70" y2="66" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="72" y1="72" x2="74" y2="68" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="34" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="66" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="35" cy="81" r="4" fill="#1a1a1a"/><circle cx="67" cy="81" r="4" fill="#1a1a1a"/>
      <circle cx="36" cy="79" r="1.5" fill="white"/><circle cx="68" cy="79" r="1.5" fill="white"/>
      <path d="M50 86 Q56 88 58 93 Q52 96 50 95 Q48 96 42 93 Q44 88 50 86Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M36 96 Q50 104 64 96" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function BartSVG({ size=80 }) {
  return (
    <svg width={size} height={size*1.3} viewBox="0 0 100 130" fill="none">
      <rect x="28" y="96" width="44" height="28" rx="6" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="26" y="82" width="48" height="22" rx="6" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="42" y="70" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="52" rx="30" ry="28" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="20" cy="52" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="80" cy="52" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M20 40 L16 24 L28 36 L26 18 L36 32 L38 12 L44 28 L50 8 L56 28 L62 12 L64 32 L74 18 L72 36 L84 24 L80 40" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M24 38 Q32 34 40 38" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M60 38 Q68 34 76 38" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="33" cy="48" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="67" cy="48" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="34" cy="49" r="5" fill="#1a1a1a"/><circle cx="68" cy="49" r="5" fill="#1a1a1a"/>
      <circle cx="36" cy="47" r="2" fill="white"/><circle cx="70" cy="47" r="2" fill="white"/>
      <path d="M50 54 Q58 56 60 62 Q54 66 50 64 Q46 66 40 62 Q42 56 50 54Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M34 68 Q42 76 50 74 Q58 76 66 68" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function LisaSVG({ size=80 }) {
  return (
    <svg width={size} height={size*1.35} viewBox="0 0 100 135" fill="none">
      <path d="M24 98 Q20 130 50 132 Q80 130 76 98Z" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="28" y="86" width="44" height="18" rx="8" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M30 88 Q40 96 50 94 Q60 96 70 88 Q60 84 50 86 Q40 84 30 88Z" fill="white" stroke="#1a1a1a" strokeWidth="1.5"/>
      <rect x="43" y="74" width="14" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="54" rx="30" ry="28" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="20" cy="54" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="80" cy="54" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M20 44 L15 26 L26 40 L24 20 L34 36 L36 14 L43 32 L50 10 L57 32 L64 14 L66 36 L76 20 L74 40 L85 26 L80 44" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/>
      <path d="M30 20 Q36 12 44 18 Q40 24 30 20Z" fill="#FF80AB" stroke="#1a1a1a" strokeWidth="2"/>
      <path d="M50 18 Q58 12 66 20 Q58 24 50 18Z" fill="#FF80AB" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="48" cy="18" rx="5" ry="4" fill="#FF4081" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M44 22 Q40 30 38 34" stroke="#FF80AB" strokeWidth="2" strokeLinecap="round"/>
      <path d="M52 22 Q56 30 58 34" stroke="#FF80AB" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 42 Q34 37 40 41" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M60 41 Q66 37 74 42" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="33" cy="51" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="67" cy="51" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="33" cy="52" rx="6" ry="7" fill="#42A5F5"/>
      <ellipse cx="67" cy="52" rx="6" ry="7" fill="#42A5F5"/>
      <ellipse cx="33" cy="53" rx="4" ry="5" fill="#1a1a1a"/>
      <ellipse cx="67" cy="53" rx="4" ry="5" fill="#1a1a1a"/>
      <circle cx="36" cy="49" r="2.2" fill="white"/><circle cx="70" cy="49" r="2.2" fill="white"/>
      {[24,27,30,33,36].map((x,i)=><line key={i} x1={x} y1="42" x2={x-1+i*0.5} y2="37" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}
      {[58,61,64,67,70].map((x,i)=><line key={i} x1={x} y1="42" x2={x+i*0.5} y2="37" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}
      <ellipse cx="20" cy="60" rx="7" ry="4" fill="#FFB7C5" opacity="0.6"/>
      <ellipse cx="80" cy="60" rx="7" ry="4" fill="#FFB7C5" opacity="0.6"/>
      <path d="M50 60 Q54 62 55 66 Q52 68 50 68 Q48 68 45 66 Q46 62 50 60Z" fill="#F5B800" stroke="#1a1a1a" strokeWidth="1.2"/>
      <path d="M36 72 Q43 80 50 78 Q57 80 64 72" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {[34,38,42,46,50,54,58,62,66].map((x,i)=><circle key={i} cx={x} cy={86+Math.sin(i*0.7)*1.5} r="2.2" fill="white" stroke="#ddd" strokeWidth="0.8"/>)}
    </svg>
  );
}

function MaggieSVG({ size=80 }) {
  return (
    <svg width={size} height={size*1.1} viewBox="0 0 100 110" fill="none">
      <ellipse cx="50" cy="85" rx="34" ry="26" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="36" cy="80" rx="10" ry="8" fill="#C8860A" opacity="0.45"/>
      <ellipse cx="64" cy="88" rx="9" ry="7" fill="#C8860A" opacity="0.35"/>
      <ellipse cx="28" cy="104" rx="8" ry="5" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="72" cy="104" rx="8" ry="5" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="38" cy="108" rx="7" ry="4" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="62" cy="108" rx="7" ry="4" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/>
      {[24,28,32].map((x,i)=><line key={i} x1={x} y1="107" x2={x} y2="111" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>)}
      {[58,62,66].map((x,i)=><line key={i} x1={x} y1="107" x2={x} y2="111" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>)}
      <ellipse cx="50" cy="50" rx="32" ry="30" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="50" cy="58" rx="17" ry="13" fill="white" opacity="0.55"/>
      <ellipse cx="20" cy="32" rx="13" ry="14" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="20" cy="32" rx="7" ry="8" fill="#FFB7C5"/>
      <ellipse cx="80" cy="32" rx="13" ry="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="80" cy="32" rx="7" ry="8" fill="#FFB7C5"/>
      <path d="M34 22 Q32 12 37 10 Q38 18 34 22Z" fill="#C8860A" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M43 18 Q43 7 48 7 Q47 16 43 18Z" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M50 16 Q53 5 57 7 Q55 15 50 16Z" fill="#C8860A" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M58 20 Q63 11 67 13 Q63 20 58 20Z" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M26 38 Q32 33 38 37" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M62 37 Q68 33 74 38" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <ellipse cx="33" cy="47" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="67" cy="47" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="33" cy="48" rx="6" ry="7" fill="#8B4513"/>
      <ellipse cx="67" cy="48" rx="6" ry="7" fill="#8B4513"/>
      <ellipse cx="33" cy="49" rx="4" ry="5" fill="#1a1a1a"/>
      <ellipse cx="67" cy="49" rx="4" ry="5" fill="#1a1a1a"/>
      <circle cx="36" cy="45" r="2.5" fill="white"/><circle cx="70" cy="45" r="2.5" fill="white"/>
      {[24,27,30].map((x,i)=><line key={i} x1={x} y1="38" x2={x-1} y2="33" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}
      {[58,61,64].map((x,i)=><line key={i} x1={x} y1="38" x2={x+2} y2="33" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}
      <ellipse cx="19" cy="56" rx="8" ry="5" fill="#FFB7C5" opacity="0.65"/>
      <ellipse cx="81" cy="56" rx="8" ry="5" fill="#FFB7C5" opacity="0.65"/>
      <ellipse cx="50" cy="58" rx="8" ry="6" fill="#FFB7C5" stroke="#1a1a1a" strokeWidth="1.5"/>
      <circle cx="47" cy="58" r="2.2" fill="#1a1a1a"/><circle cx="53" cy="58" r="2.2" fill="#1a1a1a"/>
      <line x1="18" y1="58" x2="38" y2="57" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="63" x2="38" y2="61" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="62" y1="57" x2="82" y2="58" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="62" y1="61" x2="84" y2="63" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
      <ellipse cx="50" cy="70" rx="9" ry="7" fill="#FF8F00" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="50" cy="70" rx="5.5" ry="4" fill="#FFB300"/>
      <ellipse cx="50" cy="72" rx="3" ry="2" fill="#FF8F00" stroke="#1a1a1a" strokeWidth="1"/>
    </svg>
  );
}

const AVATARS = { homer:HomerSVG, marge:MargeSVG, bart:BartSVG, lisa:LisaSVG };

// ═══════════════════════════════════════════════════════
//  POMOCNÉ KOMPONENTY
// ═══════════════════════════════════════════════════════

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:toast.color||C.dark, color:"white", padding:"12px 24px", borderRadius:30, fontSize:14, fontWeight:800, zIndex:999, boxShadow:"0 6px 24px rgba(0,0,0,0.25)", whiteSpace:"nowrap", animation:"fadeUp 0.3s ease", pointerEvents:"none" }}>
      {toast.msg}
    </div>
  );
}

function Btn({ children, onClick, color, style={}, disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:"12px 20px", borderRadius:14, border:"none", background:disabled?"#eee":color||C.dark, color:disabled?"#bbb":"white", fontWeight:800, fontSize:14, cursor:disabled?"default":"pointer", fontFamily:"inherit", transition:"all 0.15s", ...style }}
      onMouseDown={e=>{ if(!disabled) e.currentTarget.style.transform="scale(0.96)"; }}
      onMouseUp={e=>{ e.currentTarget.style.transform="scale(1)"; }}
      onTouchStart={e=>{ if(!disabled) e.currentTarget.style.transform="scale(0.96)"; }}
      onTouchEnd={e=>{ e.currentTarget.style.transform="scale(1)"; }}
    >{children}</button>
  );
}

function Card({ children, style={} }) {
  return <div style={{ background:"white", borderRadius:20, padding:"14px 16px", boxShadow:C.shadow, ...style }}>{children}</div>;
}

function SectionTitle({ children }) {
  return <p style={{ color:"#666", fontSize:12, fontWeight:800, margin:"0 0 10px", textTransform:"uppercase", letterSpacing:0.8 }}>{children}</p>;
}

// ═══════════════════════════════════════════════════════
//  PIN LOGIN
// ═══════════════════════════════════════════════════════

function PinLogin({ member, onSuccess, onBack }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const Av = AVATARS[member.id];

  const press = (n) => {
    if (pin.length >= 4) return;
    const next = pin + n;
    setPin(next); setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === member.pin) { onSuccess(member); }
        else { setShake(true); setError(true); setTimeout(()=>{ setShake(false); setPin(""); }, 700); }
      }, 200);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${C.dark},${C.dark2},#0F3460)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Nunito',sans-serif" }}>
      <button onClick={onBack} style={{ position:"absolute", top:20, left:20, background:"rgba(255,255,255,0.1)", border:"none", borderRadius:12, color:"white", padding:"8px 16px", fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>← Späť</button>
      <div style={{ marginBottom:8 }}><Av size={96}/></div>
      <h2 style={{ color:C.yellow, fontSize:28, margin:"0 0 4px", fontWeight:900 }}>Ahoj, {member.name}!</h2>

      {member.pin !== "" ? (
        <>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, margin:"0 0 24px" }}>Zadaj svoj PIN</p>
          <div style={{ display:"flex", gap:18, marginBottom:8, animation:shake?"shake 0.6s":"none" }}>
            {[0,1,2,3].map(i=>(
              <div key={i} style={{ width:22, height:22, borderRadius:"50%", background:error?"#FF5252":i<pin.length?C.yellow:"rgba(255,255,255,0.15)", border:`2px solid ${error?"#FF5252":i<pin.length?C.yellow:"rgba(255,255,255,0.25)"}`, transition:"all 0.15s", transform:i<pin.length?"scale(1.3)":"scale(1)" }}/>
            ))}
          </div>
          {error ? <p style={{ color:"#FF5252", fontSize:13, fontWeight:800, margin:"8px 0 12px" }}>Nesprávny PIN!</p> : <div style={{ height:36 }}/>}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, width:234 }}>
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} onClick={()=>press(String(n))} style={{ height:70, borderRadius:18, border:"2px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.06)", color:"white", fontSize:30, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}
                onMouseDown={e=>{e.currentTarget.style.transform="scale(0.9)";e.currentTarget.style.background=`${member.color}44`;}}
                onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
              >{n}</button>
            ))}
            <div/>
            <button onClick={()=>press("0")} style={{ height:70, borderRadius:18, border:"2px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.06)", color:"white", fontSize:30, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>0</button>
            <button onClick={()=>setPin(p=>p.slice(0,-1))} style={{ height:70, borderRadius:18, border:"2px solid rgba(255,255,255,0.08)", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:26, cursor:"pointer" }}>⌫</button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12, marginTop:24 }}>Demo PIN: 1234</p>
        </>
      ) : (
        <>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14, margin:"0 0 32px" }}>Žiadny PIN — môžeš rovno vstúpiť!</p>
          <Btn onClick={()=>onSuccess(member)} color={member.color} style={{ fontSize:18, padding:"18px 48px", boxShadow:`0 8px 24px ${member.color}66` }}>Vstúpiť →</Btn>
          <p style={{ color:"rgba(255,255,255,0.25)", fontSize:12, marginTop:20 }}>PIN môžeš nastaviť v admin paneli</p>
        </>
      )}
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-12px)}30%{transform:translateX(12px)}45%{transform:translateX(-9px)}60%{transform:translateX(9px)}75%{transform:translateX(-5px)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════

function Dashboard({ member }) {
  const Av = AVATARS[member.id];
  const [pts, setPts] = useState(member.weekPoints);
  const [tasks, setTasks] = useState({
    morning:[
      {id:1,text:"Vstať načas",points:2,done:false},
      {id:2,text:"Umyť zuby ráno",points:2,done:false},
      {id:3,text:"Naraňajkovať sa",points:2,done:false},
    ],
    daily:[
      {id:4,text:"Ustlať posteľ",points:2,done:false},
      {id:5,text:"Vyniesť smeti",points:3,done:false},
      {id:6,text:"🐹 Nakŕmiť Maggie",points:3,done:false},
      {id:7,text:"Polievať kvety",points:3,done:false},
    ],
    evening:[
      {id:8,text:"Umyť zuby večer",points:2,done:false},
      {id:9,text:"Upratať veci na zajtra",points:2,done:false},
    ],
  });

  const toggle = (g, id) => {
    const t = tasks[g].find(x=>x.id===id);
    setTasks(p=>({...p,[g]:p[g].map(x=>x.id===id?{...x,done:!x.done}:x)}));
    setPts(p=>t.done?p-t.points:p+t.points);
  };

  const done = Object.values(tasks).flat().filter(t=>t.done).length;
  const total = Object.values(tasks).flat().length;
  const lvl = LEVEL_PTS.findIndex((p,i)=>member.totalPoints<(LEVEL_PTS[i+1]||9999));
  const lvlPct = Math.min((member.totalPoints-LEVEL_PTS[lvl])/(LEVEL_PTS[Math.min(lvl+1,5)]-LEVEL_PTS[lvl])*100,100);

  return (
    <div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${C.dark},${C.dark2})`, padding:"20px 20px 24px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Prihlásený ako</p>
            <h2 style={{ color:C.yellow, fontSize:22, margin:"2px 0 0", fontWeight:900 }}>{member.name}</h2>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, margin:0 }}>Streak</p>
              <p style={{ color:"#FF6B35", fontSize:22, margin:0, fontWeight:900 }}>🔥 {member.streak}</p>
            </div>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
          <Av size={58}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{LEVELS[lvl]}</span>
              <span style={{ color:C.yellow, fontSize:15, fontWeight:900 }}>⭐ {pts}b</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${lvlPct}%`, background:`linear-gradient(90deg,${C.yellow},${member.color})`, borderRadius:99, transition:"width 0.4s" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>{LEVEL_PTS[Math.min(lvl+1,5)]-member.totalPoints}b do ďalšieho levelu</span>
              <span style={{ color:"rgba(255,255,255,0.3)", fontSize:10 }}>{done}/{total} dnes</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 16px" }}>
        {/* Úlohy */}
        {[{key:"morning",icon:"🌅",label:"Ranná rutina"},{key:"daily",icon:"☀️",label:"Dnešné úlohy"},{key:"evening",icon:"🌙",label:"Večerná rutina"}].map(s=>(
          <div key={s.key} style={{ marginBottom:14 }}>
            <SectionTitle>{s.icon} {s.label}</SectionTitle>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {tasks[s.key].map(task=>(
                <button key={task.id} onClick={()=>toggle(s.key,task.id)} style={{ display:"flex", alignItems:"center", gap:12, background:"white", border:`2px solid ${task.done?member.color:"transparent"}`, borderRadius:16, padding:"12px 14px", cursor:"pointer", boxShadow:C.shadow, opacity:task.done?0.7:1, transition:"all 0.2s", textAlign:"left", fontFamily:"inherit", width:"100%" }}>
                  <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:task.done?member.color:"transparent", border:`2.5px solid ${task.done?member.color:"#ddd"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:14, transition:"all 0.2s" }}>{task.done?"✓":""}</div>
                  <span style={{ flex:1, fontSize:14, fontWeight:700, color:task.done?"#bbb":"#1A1A2E", textDecoration:task.done?"line-through":"none" }}>{task.text}</span>
                  <span style={{ background:task.done?"#f0f0f0":`${member.color}18`, color:task.done?"#ccc":member.color, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800 }}>+{task.points}b</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Maggie */}
        <div style={{ background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)", border:"1.5px solid #FFE082", borderRadius:20, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
          <MaggieSVG size={50}/>
          <div>
            <p style={{ color:"#F57F17", fontSize:13, fontWeight:900, margin:0 }}>🐹 Maggie čaká!</p>
            <p style={{ color:"#8D6E63", fontSize:12, margin:"2px 0 0" }}>Nakŕmte ju a doplňte vodu 💧</p>
          </div>
        </div>

        {/* Bonusy */}
        <div style={{ background:`linear-gradient(135deg,${C.dark},#2C2C54)`, borderRadius:20, padding:"14px 16px" }}>
          <p style={{ color:C.yellow, fontSize:13, fontWeight:900, margin:"0 0 10px" }}>⚡ Bonusové úlohy</p>
          {[{text:"Umyť auto",pts:15},{text:"Pomôcť s varením",pts:10},{text:"Vyčistiť pivnicu",pts:20}].map((b,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:i<2?8:0 }}>
              <div style={{ width:28, height:28, borderRadius:8, border:"2px solid rgba(255,217,15,0.3)", background:"rgba(255,217,15,0.08)", flexShrink:0 }}/>
              <span style={{ flex:1, color:"rgba(255,255,255,0.8)", fontSize:14, fontWeight:700 }}>{b.text}</span>
              <span style={{ background:"rgba(255,217,15,0.15)", color:C.yellow, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800 }}>+{b.pts}b</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  REBRÍČEK
// ═══════════════════════════════════════════════════════

function Leaderboard({ member }) {
  const [view, setView] = useState("week");
  const sorted = [...MEMBERS].sort((a,b)=>view==="week"?b.weekPoints-a.weekPoints:b.totalPoints-a.totalPoints);
  const motivations = { homer:"D'oh! Homer, ešte nie si porazený 🍩", marge:"Marge drží krok! Skvelá práca 💙", bart:"Bart, Lisa vedie o 9b. Daj do toho! 💪", lisa:"Lisa je na vrchole tento týždeň! 👑" };

  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.06)", borderRadius:14, padding:3, marginBottom:16 }}>
        {[{v:"week",l:"📅 Tento týždeň"},{v:"total",l:"🏆 Celkovo"}].map(({v,l})=>(
          <button key={v} onClick={()=>setView(v)} style={{ flex:1, padding:"8px 0", borderRadius:11, border:"none", fontFamily:"inherit", fontSize:13, fontWeight:800, cursor:"pointer", background:view===v?"white":"transparent", color:view===v?"#1A1A2E":"#999", boxShadow:view===v?"0 2px 8px rgba(0,0,0,0.1)":"none", transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={{ background:`linear-gradient(135deg,${C.dark},#2C2C54)`, borderRadius:24, padding:"20px 16px 16px", marginBottom:12 }}>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:800, textAlign:"center", margin:"0 0 16px", letterSpacing:1 }}>{view==="week"?"TENTO TÝŽDEŇ":"CELKOVO"}</p>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8 }}>
          {[1,0,2].map(pos=>{
            const m = sorted[pos];
            if (!m) return null;
            const Av = AVATARS[m.id];
            const isFirst = pos===0;
            const medals = ["🥇","🥈","🥉"];
            return (
              <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:isFirst?1.2:1 }}>
                <div style={{ position:"relative" }}>
                  {isFirst && <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", fontSize:22 }}>👑</div>}
                  <Av size={isFirst?70:54}/>
                </div>
                <div style={{ background:isFirst?`${m.color}33`:"rgba(255,255,255,0.08)", border:`2px solid ${isFirst?m.color+"66":"rgba(255,255,255,0.1)"}`, borderRadius:14, padding:"8px 6px", marginTop:6, width:"100%", textAlign:"center" }}>
                  <p style={{ color:["#FFD700","#C0C0C0","#CD7F32"][pos], fontSize:isFirst?22:18, margin:"0 0 2px" }}>{medals[pos]}</p>
                  <p style={{ color:"white", fontSize:isFirst?15:13, fontWeight:900, margin:"0 0 2px" }}>{m.name}</p>
                  <p style={{ color:C.yellow, fontSize:isFirst?18:15, fontWeight:900, margin:0 }}>{view==="week"?m.weekPoints:m.totalPoints}b</p>
                  <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, margin:"2px 0 0" }}>🔥 {m.streak}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {sorted[3] && (()=>{ const m=sorted[3]; const Av=AVATARS[m.id]; return (
        <Card style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, border:m.id===member.id?`2px solid ${m.color}`:"2px solid transparent" }}>
          <span style={{ fontSize:20, color:"#aaa", fontWeight:900, minWidth:24 }}>4.</span>
          <Av size={48}/>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:15, fontWeight:900, color:"#1A1A2E", margin:0 }}>{m.name}</p>
            <p style={{ fontSize:12, color:"#aaa", margin:"2px 0 0" }}>🔥 {m.streak} dní</p>
          </div>
          <span style={{ color:m.color, fontSize:16, fontWeight:900 }}>{view==="week"?m.weekPoints:m.totalPoints}b</span>
        </Card>
      );})()}

      <div style={{ background:`${member.color}12`, border:`1.5px solid ${member.color}44`, borderRadius:16, padding:"12px 16px", textAlign:"center" }}>
        <p style={{ color:member.color, fontSize:14, fontWeight:800, margin:0 }}>{motivations[member.id]}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ODMENY
// ═══════════════════════════════════════════════════════

function Rewards({ member }) {
  const [tab, setTab] = useState("real");
  const [pts, setPts] = useState(member.totalPoints);
  const [pending, setPending] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg,color)=>{setToast({msg,color});setTimeout(()=>setToast(null),2500);};

  const realRewards = [
    {id:1,name:"Extra čas na mobile",emoji:"📱",points:50},
    {id:2,name:"Pizza večer",emoji:"🍕",points:80},
    {id:3,name:"Neskoršia večierka",emoji:"🌙",points:100},
    {id:4,name:"Výber sobotného filmu",emoji:"🎬",points:120},
    {id:5,name:"Nové vlasy / účes",emoji:"💇",points:200},
    {id:6,name:"Nová kabelka",emoji:"👜",points:250},
    {id:7,name:"Nové oblečenie",emoji:"👗",points:300},
    {id:8,name:"Výlet podľa výberu",emoji:"🗺️",points:200},
    {id:9,name:"Niečo nové do izby",emoji:"🛏️",points:400},
  ];

  const skins = [
    {id:1,name:"Základný",emoji:"🟡",points:0,owned:true,active:true},
    {id:2,name:"Zlatá",emoji:"🌟",points:100,owned:false,active:false},
    {id:3,name:"Kostým Maggie",emoji:"🐹",points:150,owned:false,active:false},
    {id:4,name:"Superhrdinka",emoji:"🦸",points:200,owned:false,active:false},
    {id:5,name:"Čarodejnica",emoji:"🧙",points:300,owned:false,active:false},
    {id:6,name:"Jazzová hviezda",emoji:"🎷",points:250,owned:false,active:false},
  ];

  const request = (r) => {
    if (pts < r.points) { showToast("❌ Málo bodov!","#FF5252"); return; }
    setConfirm(r);
  };
  const confirmReq = () => {
    setPts(p=>p-confirm.points);
    setPending(p=>[...p,{...confirm,status:"pending",date:new Date().toLocaleDateString("sk")}]);
    setConfirm(null);
    showToast("📨 Žiadosť odoslaná rodičom!",member.color);
  };

  const tabs = [{id:"real",l:"🎁 Odmeny"},{id:"skins",l:"🎨 Skiny"},{id:"pending",l:`📬 Čaká${pending.length>0?` (${pending.length})`:""}`}];

  return (
    <div style={{ padding:"0 0 8px" }}>
      <div style={{ background:`linear-gradient(135deg,${C.dark},#2C1654)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28, marginBottom:14 }}>
        <h2 style={{ color:C.yellow, fontSize:20, margin:"0 0 4px", fontWeight:900 }}>🛍️ Obchod s odmenami</h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.name} · 🔥 {member.streak}</p>
          <div style={{ background:`${member.color}22`, border:`1.5px solid ${member.color}66`, borderRadius:20, padding:"6px 16px", display:"flex", gap:6, alignItems:"center" }}>
            <span style={{ fontSize:16 }}>⭐</span>
            <span style={{ color:C.yellow, fontSize:20, fontWeight:900 }}>{pts}</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>b</span>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:8, padding:"0 16px", marginBottom:14 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer", background:tab===t.id?member.color:"white", color:tab===t.id?"white":"#888", boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:C.shadow, transition:"all 0.2s" }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding:"0 16px" }}>
        {tab==="real" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {realRewards.map(r=>{
              const ok = pts>=r.points;
              return (
                <div key={r.id} style={{ background:"white", borderRadius:18, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:C.shadow, opacity:ok?1:0.6 }}>
                  <span style={{ fontSize:30, flexShrink:0 }}>{r.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px" }}>{r.name}</p>
                    <p style={{ fontSize:12, color:ok?member.color:"#bbb", fontWeight:700, margin:0 }}>⭐ {r.points}b</p>
                  </div>
                  <Btn onClick={()=>request(r)} color={ok?member.color:"#eee"} style={{ padding:"8px 14px", fontSize:12, color:ok?"white":"#ccc" }} disabled={!ok}>
                    {ok?"Chcem!":"🔒"}
                  </Btn>
                </div>
              );
            })}
          </div>
        )}

        {tab==="skins" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {skins.map(s=>{
              const ok = pts>=s.points;
              return (
                <div key={s.id} style={{ background:"white", borderRadius:20, padding:"16px 12px", textAlign:"center", boxShadow:C.shadow, border:s.active?`2.5px solid ${member.color}`:s.owned?"2.5px solid #66BB6A":"2.5px solid transparent" }}>
                  {s.active && <div style={{ background:member.color, color:"white", borderRadius:8, padding:"2px 6px", fontSize:9, fontWeight:900, marginBottom:6 }}>AKTÍVNY</div>}
                  <div style={{ fontSize:40, marginBottom:8, filter:!ok&&!s.owned?"grayscale(0.7) opacity(0.5)":"none" }}>{s.emoji}</div>
                  <p style={{ fontSize:12, fontWeight:800, color:ok||s.owned?"#1A1A2E":"#bbb", margin:"0 0 6px" }}>{s.name}</p>
                  {s.points>0 && <p style={{ fontSize:11, color:ok?member.color:"#ccc", fontWeight:700, margin:"0 0 8px" }}>⭐ {s.points}b</p>}
                  <button style={{ width:"100%", padding:"8px 0", borderRadius:10, border:"none", fontFamily:"inherit", fontSize:11, fontWeight:800, cursor:ok||s.owned?"pointer":"default", background:s.active?`${member.color}18`:s.owned?"#E8F5E9":ok?member.color:"#f0f0f0", color:s.active?member.color:s.owned?"#2E7D32":ok?"white":"#ccc" }}>
                    {s.active?"✓ Nasadený":s.owned?"Nasadiť":ok?"Kúpiť 🛍️":"🔒"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab==="pending" && (
          pending.length===0
            ? <Card style={{ textAlign:"center", padding:32 }}><p style={{ fontSize:40, margin:"0 0 12px" }}>📬</p><p style={{ color:"#aaa", fontSize:14, margin:0 }}>Žiadne čakajúce žiadosti</p></Card>
            : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {pending.map((r,i)=>(
                  <Card key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:26 }}>{r.emoji}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px" }}>{r.name}</p>
                      <p style={{ fontSize:11, color:"#aaa", margin:0 }}>{r.date}</p>
                    </div>
                    <span style={{ background:"#FFF3CD", color:"#F57F17", borderRadius:10, padding:"4px 10px", fontSize:11, fontWeight:800 }}>⏳ Čaká</span>
                  </Card>
                ))}
              </div>
        )}
      </div>

      {/* Confirm */}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:44, textAlign:"center", margin:"0 0 8px" }}>{confirm.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{confirm.name}</h3>
            <p style={{ textAlign:"center", color:member.color, fontSize:16, fontWeight:800, margin:"0 0 8px" }}>⭐ {confirm.points} bodov</p>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:13, margin:"0 0 20px" }}>Žiadosť pôjde rodičom na schválenie. Body sa odčítajú teraz.</p>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>setConfirm(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={confirmReq} color={member.color} style={{ flex:2, boxShadow:`0 6px 20px ${member.color}55` }}>Odoslať žiadosť ✓</Btn>
            </div>
          </div>
        </div>
      )}
      <Toast toast={toast}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN PANEL (skrátený, ale funkčný)
// ═══════════════════════════════════════════════════════

function AdminPanel() {
  const [tab, setTab] = useState("proposals");
  const [toast, setToast] = useState(null);
  const showToast = (msg,color)=>{setToast({msg,color});setTimeout(()=>setToast(null),2500);};

  const [proposals, setProposals] = useState([
    {id:1,from:"Bart",fromColor:"#E53935",emoji:"🎮",text:"Chcem odmenu: nová hra",type:"reward",status:"pending",date:"23.6."},
    {id:2,from:"Lisa",fromColor:"#E91E63",emoji:"🐾",text:"Chcem odmenu: navštíviť útulok",type:"reward",status:"pending",date:"23.6."},
    {id:3,from:"Bart",fromColor:"#E53935",emoji:"🚗",text:"Navrhujem úlohu: Umyť auto každú sobotu",type:"task",status:"pending",points:15,date:"22.6."},
  ]);

  const [rejectId, setRejectId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [approveItem, setApproveItem] = useState(null);
  const [approvePts, setApprovePts] = useState("");
  const [showPunish, setShowPunish] = useState(false);
  const [punishForm, setPunishForm] = useState({target:"Bart",type:"points",value:"",reason:""});

  const pending = proposals.filter(p=>p.status==="pending").length;
  const tabs = [
    {id:"proposals",l:`💡 Návrhy${pending>0?` (${pending})`:""}`},
    {id:"tasks",l:"📋 Úlohy"},
    {id:"rewards",l:"🛍️ Odmeny"},
    {id:"punish",l:"⚖️ Tresty"},
    {id:"seasons",l:"🗓️ Sezóny"},
  ];

  const approve = () => {
    setProposals(p=>p.map(x=>x.id===approveItem.id?{...x,status:"approved",points:approvePts?Number(approvePts):x.points}:x));
    setApproveItem(null); showToast("✅ Schválené!","#66BB6A");
  };
  const reject = () => {
    setProposals(p=>p.map(x=>x.id===rejectId?{...x,status:"rejected",adminNote:rejectNote}:x));
    setRejectId(null); showToast("❌ Zamietnuté","#FF5252");
  };

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${C.dark},#0F3460)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <h2 style={{ color:C.yellow, fontSize:22, margin:0, fontWeight:900 }}>⚙️ Admin — Marge</h2>
        {pending>0 && <p style={{ color:"#FF8080", fontSize:13, margin:"4px 0 0", fontWeight:700 }}>{pending} návrhov čaká na schválenie</p>}
      </div>

      <div style={{ display:"flex", gap:6, padding:"14px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer", background:tab===t.id?"#8CC63F":"white", color:tab===t.id?"white":"#888", boxShadow:tab===t.id?"0 4px 12px #8CC63F55":C.shadow, transition:"all 0.2s" }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding:"14px 16px" }}>
        {tab==="proposals" && (
          <>
            {["pending","approved","rejected"].map(status=>{
              const items = proposals.filter(p=>p.status===status);
              if (!items.length) return null;
              const labels={pending:"⏳ Čakajú",approved:"✅ Schválené",rejected:"❌ Zamietnuté"};
              return (
                <div key={status} style={{ marginBottom:16 }}>
                  <SectionTitle>{labels[status]}</SectionTitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {items.map(p=>(
                      <Card key={p.id} style={{ borderLeft:`4px solid ${p.fromColor}` }}>
                        <div style={{ display:"flex", gap:10, marginBottom:status==="pending"?12:0 }}>
                          <span style={{ fontSize:24 }}>{p.emoji}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", gap:6, marginBottom:4, flexWrap:"wrap" }}>
                              <span style={{ background:`${p.fromColor}18`, color:p.fromColor, borderRadius:8, padding:"2px 8px", fontSize:11, fontWeight:800 }}>{p.from}</span>
                              <span style={{ background:"#f0f0f0", color:"#888", borderRadius:8, padding:"2px 8px", fontSize:11 }}>{p.type==="reward"?"🎁 odmena":p.type==="task"?"📋 úloha":"💬 žiadosť"}</span>
                            </div>
                            <p style={{ fontSize:14, color:"#1A1A2E", fontWeight:700, margin:0 }}>{p.text}</p>
                            {p.points && <p style={{ color:"#8CC63F", fontSize:12, fontWeight:800, margin:"4px 0 0" }}>⭐ {p.points}b</p>}
                            {p.adminNote && <p style={{ color:"#FF7043", fontSize:12, margin:"4px 0 0", fontStyle:"italic" }}>"{p.adminNote}"</p>}
                          </div>
                        </div>
                        {status==="pending" && (
                          <div style={{ display:"flex", gap:8 }}>
                            <Btn onClick={()=>{setApproveItem(p);setApprovePts(p.points||"");}} color="#66BB6A" style={{ flex:1, padding:"10px 0" }}>✅ Schváliť</Btn>
                            <Btn onClick={()=>{setRejectId(p.id);setRejectNote("");}} color="#FF5252" style={{ flex:1, padding:"10px 0" }}>❌ Zamietnuť</Btn>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {(tab==="tasks"||tab==="rewards") && (
          <Card style={{ textAlign:"center", padding:32 }}>
            <p style={{ fontSize:36, margin:"0 0 10px" }}>{tab==="tasks"?"📋":"🛍️"}</p>
            <p style={{ color:"#1A1A2E", fontWeight:800, fontSize:16, margin:"0 0 6px" }}>{tab==="tasks"?"Správa úloh":"Správa odmien"}</p>
            <p style={{ color:"#aaa", fontSize:13, margin:0 }}>Editácia, pridávanie, mazanie — pripravujeme 🚧</p>
          </Card>
        )}

        {tab==="punish" && (
          <>
            <Btn onClick={()=>setShowPunish(true)} color="#FF5252" style={{ width:"100%", marginBottom:14, fontSize:15, boxShadow:"0 4px 16px rgba(255,82,82,0.35)" }}>⚖️ Udeliť trest alebo bonus</Btn>
            {showPunish && (
              <Card style={{ marginBottom:14, border:"2px solid #FF525244" }}>
                <p style={{ fontWeight:900, fontSize:15, margin:"0 0 14px" }}>⚖️ Trest / Bonus</p>
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 5px" }}>KOMU</p>
                  <select style={sStyle} value={punishForm.target} onChange={e=>setPunishForm(p=>({...p,target:e.target.value}))}>
                    {["Homer","Marge","Bart","Lisa"].map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:10 }}>
                  {[{id:"points",l:"💸 Odpočítať body"},{id:"bonus",l:"🎉 Pridať body"},{id:"notv",l:"📺 Zákaz TV"},{id:"nomobile",l:"📱 Zákaz mobilu"}].map(t=>(
                    <button key={t.id} onClick={()=>setPunishForm(p=>({...p,type:t.id}))} style={{ padding:"10px 8px", borderRadius:10, border:`2px solid ${punishForm.type===t.id?(t.id==="bonus"?"#66BB6A":"#FF5252"):"#eee"}`, background:punishForm.type===t.id?(t.id==="bonus"?"#E8F5E9":"#FFF3F3"):"white", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", color:punishForm.type===t.id?(t.id==="bonus"?"#2E7D32":"#FF5252"):"#888" }}>{t.l}</button>
                  ))}
                </div>
                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 5px" }}>HODNOTA</p>
                  <input style={iStyle} value={punishForm.value} onChange={e=>setPunishForm(p=>({...p,value:e.target.value}))} placeholder="napr. 10"/>
                </div>
                <div style={{ marginBottom:14 }}>
                  <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 5px" }}>DÔVOD</p>
                  <input style={iStyle} value={punishForm.reason} onChange={e=>setPunishForm(p=>({...p,reason:e.target.value}))} placeholder="Napr. Výborné správanie..."/>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <Btn onClick={()=>{ showToast(punishForm.type==="bonus"?`🎉 Bonus pre ${punishForm.target}!`:`⚠️ Trest pre ${punishForm.target}!`,punishForm.type==="bonus"?"#66BB6A":"#FF5252"); setShowPunish(false); }} color={punishForm.type==="bonus"?"#66BB6A":"#FF5252"} style={{ flex:1 }}>
                    {punishForm.type==="bonus"?"🎉 Pridať bonus":"⚠️ Udeliť trest"}
                  </Btn>
                  <Btn onClick={()=>setShowPunish(false)} color="#eee" style={{ color:"#888" }}>Zrušiť</Btn>
                </div>
              </Card>
            )}
          </>
        )}

        {tab==="seasons" && (
          <>
            <SectionTitle>Sezónne prepínače</SectionTitle>
            {[{icon:"🎒",name:"Školský rok",desc:"Domáce úlohy, taška",active:true},{icon:"🏊",name:"Bazénová sezóna",desc:"Starostlivosť o bazén",active:false},{icon:"🌿",name:"Záhradná sezóna",desc:"Polievanie, kosenie",active:true},{icon:"❄️",name:"Zimná údržba",desc:"Odhŕňanie snehu",active:false}].map((s,i)=>(
              <Card key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
                <span style={{ fontSize:30 }}>{s.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px" }}>{s.name}</p>
                  <p style={{ fontSize:12, color:"#aaa", margin:0 }}>{s.desc}</p>
                </div>
                <div style={{ width:52, height:28, borderRadius:14, background:s.active?"#8CC63F":"#ddd", cursor:"pointer", position:"relative" }}>
                  <div style={{ position:"absolute", top:4, left:s.active?28:4, width:20, height:20, borderRadius:"50%", background:"white", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }}/>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Dialógy */}
      {approveItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:36, textAlign:"center", margin:"0 0 6px" }}>{approveItem.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 16px" }}>{approveItem.text}</h3>
            {approveItem.type!=="request" && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:800, color:"#666", margin:"0 0 6px" }}>⭐ Počet bodov (môžeš zmeniť)</p>
                <input style={{...iStyle,fontSize:18,fontWeight:900,textAlign:"center"}} type="number" value={approvePts} onChange={e=>setApprovePts(e.target.value)} placeholder="napr. 10"/>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>setApproveItem(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={approve} color="#66BB6A" style={{ flex:2, boxShadow:"0 6px 20px rgba(102,187,106,0.4)" }}>✅ Schváliť</Btn>
            </div>
          </div>
        </div>
      )}

      {rejectId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <h3 style={{ fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 6px" }}>❌ Zamietnuť návrh</h3>
            <p style={{ color:"#aaa", fontSize:13, margin:"0 0 14px" }}>Napíš dôvod — dieťa ho uvidí</p>
            <input style={{...iStyle,marginBottom:16}} value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Napr. Skúsime to neskôr 😊" autoFocus/>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>setRejectId(null)} color="#eee" style={{ flex:1, color:"#888" }}>Späť</Btn>
              <Btn onClick={reject} color="#FF5252" style={{ flex:2 }}>❌ Zamietnuť</Btn>
            </div>
          </div>
        </div>
      )}
      <Toast toast={toast}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════════════

function Chat({ member }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([
    {id:1,from:"system",  text:"🔥 Lisa má 5-dňový streak! Skvelá práca!", time:"08:00",color:"#9C27B0"},
    {id:2,from:"homer",   name:"Homer",  text:"Kto dnes vyčistí bazén?",          time:"09:14",color:"#4A90D9"},
    {id:3,from:"bart",    name:"Bart",   text:"Ja! Ale až po obede 🤙",           time:"09:16",color:"#E53935"},
    {id:4,from:"lisa",    name:"Lisa",   text:"Mama, môžem ísť k Zuzke?",         time:"09:17",color:"#E91E63"},
    {id:5,from:"marge",   name:"Marge",  text:"Áno Lisa, o 15:00 domov 🌸",       time:"09:20",color:"#8CC63F"},
    {id:6,from:"maggie",  name:"🐹 Maggie",text:"Nakŕmte ma! Som hladná 😤",      time:"10:00",color:"#FF8F00"},
    {id:7,from:"system",  text:"✅ Bart splnil všetky ranné úlohy",               time:"10:15",color:"#66BB6A"},
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMessages(p=>[...p,{id:Date.now(),from:member.id,name:member.name,text:msg.trim(),time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}),color:member.color}]);
    setMsg("");
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)" }}>
      <div style={{ background:`linear-gradient(135deg,${C.dark},${C.dark2})`, padding:"16px 20px", borderBottomLeftRadius:24, borderBottomRightRadius:24 }}>
        <h2 style={{ color:C.yellow, fontSize:20, margin:0, fontWeight:900 }}>💬 Rodinný chat</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, margin:"2px 0 0" }}>Všetci vidia všetko · 07:00–22:00</p>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.map(m=>(
          <div key={m.id}>
            {m.from==="system" ? (
              <div style={{ textAlign:"center" }}>
                <span style={{ background:`${m.color}18`, color:m.color, borderRadius:12, padding:"4px 14px", fontSize:12, fontWeight:700 }}>{m.text}</span>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:m.from===member.id?"flex-end":"flex-start" }}>
                {m.from!==member.id && <p style={{ color:"#aaa", fontSize:11, fontWeight:700, margin:"0 0 3px 10px" }}>{m.name}</p>}
                <div style={{ maxWidth:"78%", background:m.from===member.id?member.color:m.from==="maggie"?"#FFF3CD":"white", borderRadius:m.from===member.id?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", boxShadow:C.shadow }}>
                  <p style={{ color:m.from===member.id?"white":m.from==="maggie"?"#E65100":"#1A1A2E", fontSize:14, fontWeight:600, margin:"0 0 4px", lineHeight:1.4 }}>{m.text}</p>
                  <p style={{ color:m.from===member.id?"rgba(255,255,255,0.6)":"#bbb", fontSize:10, margin:0, textAlign:"right" }}>{m.time}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ padding:"12px 16px", background:"white", borderTop:"1px solid #f0f0f0", display:"flex", gap:10, alignItems:"center" }}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Napíš správu..." style={{ ...iStyle, flex:1, margin:0 }}/>
        <button onClick={send} style={{ width:44, height:44, borderRadius:14, border:"none", background:member.color, color:"white", fontSize:20, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SELECT PLAYER
// ═══════════════════════════════════════════════════════

function SelectPlayer({ onSelect }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#87CEEB 0%,#5BB8F5 40%,#2196F3 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between", padding:"36px 20px 28px", fontFamily:"'Nunito',sans-serif", position:"relative", overflow:"hidden" }}>
      {[{l:2,t:6,s:1.1},{l:52,t:2,s:0.9},{l:72,t:10,s:1},{l:28,t:18,s:0.8}].map((c,i)=>(
        <div key={i} style={{ position:"absolute", left:`${c.l}%`, top:`${c.t}%`, transform:`scale(${c.s})`, opacity:0.75, fontSize:44, pointerEvents:"none" }}>☁️</div>
      ))}

      <div style={{ textAlign:"center", zIndex:1 }}>
        <h1 style={{ color:C.yellow, fontSize:32, margin:"0 0 4px", fontWeight:900, textShadow:"3px 3px 0 #B8860B, 0 4px 20px rgba(0,0,0,0.25)", letterSpacing:1 }}>🏠 Rodinné Quest</h1>
        <p style={{ color:"white", fontSize:15, margin:0, fontWeight:700, textShadow:"0 1px 6px rgba(0,0,0,0.3)" }}>Kto hrá dnes?</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, width:"100%", maxWidth:390, zIndex:1 }}>
        {MEMBERS.map(m=>{
          const Av = AVATARS[m.id];
          const isH = hover===m.id;
          return (
            <button key={m.id} onClick={()=>onSelect(m)}
              onMouseEnter={()=>setHover(m.id)} onMouseLeave={()=>setHover(null)}
              onTouchStart={()=>setHover(m.id)} onTouchEnd={()=>setTimeout(()=>setHover(null),300)}
              style={{ background:isH?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.88)", border:`3px solid ${isH?m.color:"rgba(255,255,255,0.5)"}`, borderRadius:28, padding:"20px 12px 14px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, transform:isH?"scale(1.06) translateY(-5px)":"scale(1)", transition:"all 0.18s ease", boxShadow:isH?`0 14px 36px rgba(0,0,0,0.18),0 4px 12px ${m.color}55`:"0 4px 16px rgba(0,0,0,0.1)" }}>
              <Av size={74}/>
              <p style={{ color:"#1A1A2E", fontSize:19, fontWeight:900, margin:"4px 0 0" }}>{m.name}</p>
              <span style={{ background:m.role==="admin"?C.yellow:`${m.color}18`, color:m.role==="admin"?"#1A1A2E":m.color, borderRadius:20, padding:"2px 12px", fontSize:11, fontWeight:800 }}>{m.label}</span>
              {m.streak>=3 && <span style={{ background:"#FF6B3518", color:"#FF6B35", borderRadius:12, padding:"1px 8px", fontSize:11, fontWeight:800 }}>🔥 {m.streak}</span>}
            </button>
          );
        })}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(255,255,255,0.88)", borderRadius:24, padding:"12px 20px", width:"100%", maxWidth:390, boxSizing:"border-box", boxShadow:"0 4px 16px rgba(0,0,0,0.1)", zIndex:1 }}>
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
//  HLAVNÁ APPKA
// ═══════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen]   = useState("select");
  const [selected, setSelected] = useState(null);
  const [member, setMember]   = useState(null);
  const [navTab, setNavTab]   = useState(0);
  const [toast, setToast]     = useState(null);

  const showToast = (msg,color)=>{setToast({msg,color});setTimeout(()=>setToast(null),2500);};

  const logout = () => { setMember(null); setSelected(null); setScreen("select"); setNavTab(0); };

  const NAV = [
    {icon:"🏠", label:"Domov"},
    {icon:"🏆", label:"Rebríček"},
    {icon:"🛍️", label:"Odmeny"},
    {icon:"💬", label:"Chat"},
    ...(member?.role==="admin" ? [{icon:"⚙️",label:"Admin"}] : []),
  ];

  if (screen==="select") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <SelectPlayer onSelect={m=>{ setSelected(m); setScreen("pin"); }}/>
    </>
  );

  if (screen==="pin") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <PinLogin member={selected} onSuccess={m=>{ setMember(m); setScreen("app"); }} onBack={()=>setScreen("select")}/>
    </>
  );

  if (screen==="app" && member) {
    const color = member.color;
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
        <style>{`
          * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
          body { margin:0; background:${C.bg}; }
          ::-webkit-scrollbar { display:none; }
          @keyframes fadeUp { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
          @media (min-width:768px) {
            .app-shell { max-width:480px; margin:0 auto; min-height:100vh; box-shadow:0 0 60px rgba(0,0,0,0.15); position:relative; }
          }
        `}</style>
        <div className="app-shell" style={{ background:C.bg, fontFamily:"'Nunito',sans-serif", paddingBottom:80, minHeight:"100vh" }}>

          {/* Obsah podľa tabu */}
          <div style={{ overflowY:"auto" }}>
            {navTab===0 && <Dashboard member={member}/>}
            {navTab===1 && <Leaderboard member={member}/>}
            {navTab===2 && <Rewards member={member}/>}
            {navTab===3 && <Chat member={member}/>}
            {navTab===4 && member.role==="admin" && <AdminPanel/>}
          </div>

          {/* Bottom nav — MOBILE FIRST */}
          <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"white", borderTop:"1px solid #eee", display:"flex", padding:"8px 0", paddingBottom:"max(8px, env(safe-area-inset-bottom))", boxShadow:"0 -4px 24px rgba(0,0,0,0.08)", zIndex:50 }}>
            {NAV.map((t,i)=>(
              <button key={i} onClick={()=>setNavTab(i)} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"4px 0", minHeight:44 }}>
                <span style={{ fontSize:22 }}>{t.icon}</span>
                <span style={{ fontSize:10, color:navTab===i?color:"#ccc", fontWeight:navTab===i?900:400, fontFamily:"inherit" }}>{t.label}</span>
              </button>
            ))}
            <button onClick={logout} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"4px 0", minHeight:44 }}>
              <span style={{ fontSize:22 }}>🚪</span>
              <span style={{ fontSize:10, color:"#ccc", fontFamily:"inherit" }}>Odísť</span>
            </button>
          </div>
        </div>
        <Toast toast={toast}/>
      </>
    );
  }

  return null;
}
