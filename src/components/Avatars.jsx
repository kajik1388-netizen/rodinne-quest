// ═══════════════════════════════════════════════════════
//  AVATARY — Simpsonovci SVG
// ═══════════════════════════════════════════════════════

export function HomerSVG({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.25} viewBox="0 0 100 125" fill="none">
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
    </svg>
  );
}

export function MargeSVG({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.6} viewBox="0 0 100 160" fill="none">
      <ellipse cx="50" cy="140" rx="26" ry="20" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <rect x="26" y="112" width="48" height="30" rx="6" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/>
      <path d="M34 106 Q50 114 66 106" stroke="#CC2222" strokeWidth="5" strokeLinecap="round"/>
      {[38,44,50,56,62].map((x,i) => <circle key={i} cx={x} cy={108} r="3" fill="#CC2222" stroke="#1a1a1a" strokeWidth="1"/>)}
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
      <ellipse cx="34" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <ellipse cx="66" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="35" cy="81" r="4" fill="#1a1a1a"/><circle cx="67" cy="81" r="4" fill="#1a1a1a"/>
      <circle cx="36" cy="79" r="1.5" fill="white"/><circle cx="68" cy="79" r="1.5" fill="white"/>
      <path d="M50 86 Q56 88 58 93 Q52 96 50 95 Q48 96 42 93 Q44 88 50 86Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M36 96 Q50 104 64 96" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function BartSVG({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.3} viewBox="0 0 100 130" fill="none">
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

export function LisaSVG({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.35} viewBox="0 0 100 135" fill="none">
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

export function MaggieSVG({ size = 80 }) {
  const s = size;
  return (
    <svg width={s} height={s * 1.1} viewBox="0 0 100 110" fill="none">
      <ellipse cx="50" cy="85" rx="34" ry="26" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2.5"/>
      <ellipse cx="36" cy="80" rx="10" ry="8" fill="#C8860A" opacity="0.45"/>
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
    </svg>
  );
}

export const AVTS = {
  homer: HomerSVG,
  marge: MargeSVG,
  bart:  BartSVG,
  lisa:  LisaSVG,
};
