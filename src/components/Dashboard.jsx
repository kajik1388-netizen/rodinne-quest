import { useState } from "react";
import { AVTS, MaggieSVG } from "./Avatars.jsx";
import { Card, Sect, Btn } from "./UI.jsx";
import { YELLOW, DARK, DARK2, LEVELS, LPTS, DAYS_SK, getLvl, getLvlPct, getTodayIdx, taskForMember, taskForToday } from "../data.js";

export function Dashboard({ member, activeTasks, doneTasks, setDoneTasks, setMembers, setChat, seasons, showToast }) {
  const Av = AVTS[member.id];
  const [showWeek, setShowWeek] = useState(false);

  const todayKey   = new Date().toDateString();
  const todayDone  = doneTasks[member.id]?.[todayKey] || {};
  const isSchool   = seasons.find(s => s.id === "school")?.active;
  const seasonId   = isSchool ? "school" : "holiday";

  // Úlohy pre tohto hráča dnes
  const myTasks = activeTasks.filter(at =>
    taskForMember(at, member.id, seasonId) && taskForToday(at)
  );

  const mandatory = myTasks.filter(at => at.type === "mandatory");
  const voluntary = myTasks.filter(at => at.type === "voluntary");
  const bonus     = myTasks.filter(at => at.type === "bonus");

  const doneCount = myTasks.filter(at => todayDone[at.id] === "done").length;
  const pct       = myTasks.length > 0 ? Math.round(doneCount / myTasks.length * 100) : 0;
  const lvl       = getLvl(member.totalPts || 0);
  const lvlPct    = getLvlPct(member.totalPts || 0);
  const todayIdx  = getTodayIdx();

  const toggle = (atId, pts) => {
    const status = todayDone[atId];
    if (status === "done") return;
    const ns = status === "pending" ? undefined : "pending";
    setDoneTasks(prev => {
      const nd = { ...prev };
      if (!nd[member.id]) nd[member.id] = {};
      if (!nd[member.id][todayKey]) nd[member.id][todayKey] = {};
      if (ns === undefined) delete nd[member.id][todayKey][atId];
      else nd[member.id][todayKey][atId] = "pending";
      return nd;
    });
    if (ns === "pending") {
      const at = activeTasks.find(x => x.id === atId);
      if (at) {
        setChat(prev => [...prev, {
          id: Date.now(), from:"system",
          text:`🕐 ${member.name} splnil/a "${at.name}" — čaká na overenie`,
          time: new Date().toLocaleTimeString("sk", { hour:"2-digit", minute:"2-digit" }),
          unread: true
        }]);
      }
      showToast("🕐 Odoslané na overenie!", member.color);
    } else {
      showToast("↩️ Zrušené", "#888");
    }
  };

  const TaskRow = ({ at, dark = false }) => {
    const status = todayDone[at.id];
    const done   = status === "done";
    const pend   = status === "pending";
    return (
      <button
        onClick={() => toggle(at.id, at.pts)}
        style={{
          display:"flex", alignItems:"center", gap:10,
          background: dark
            ? (done ? "rgba(102,187,106,0.15)" : pend ? "rgba(255,152,0,0.15)" : "rgba(255,255,255,0.07)")
            : "white",
          border:`2px solid ${done ? "#66BB6A" : pend ? "#FF9800" : dark ? "rgba(255,217,15,0.3)" : member.color+"22"}`,
          borderRadius:16, padding:"12px 14px",
          cursor: done ? "default" : "pointer",
          textAlign:"left", fontFamily:"inherit", width:"100%",
          transition:"all 0.2s", boxShadow: dark ? "none" : "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{
          width:28, height:28, borderRadius:8, flexShrink:0,
          background: done ? "#66BB6A" : pend ? "#FF9800" : dark ? "rgba(255,217,15,0.15)" : "transparent",
          border:`2.5px solid ${done ? "#66BB6A" : pend ? "#FF9800" : dark ? "rgba(255,217,15,0.4)" : "#ddd"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontWeight:900, fontSize:14
        }}>
          {done ? "✓" : pend ? "🕐" : ""}
        </div>
        <span style={{ fontSize:18, flexShrink:0 }}>{at.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontSize:13, fontWeight:700, margin:"0 0 2px",
            color: done ? (dark ? "rgba(255,255,255,0.4)" : "#bbb") : dark ? "white" : "#1A1A2E",
            textDecoration: done ? "line-through" : "none",
            wordBreak:"break-word"
          }}>{at.name}</p>
          {pend && <span style={{ fontSize:10, color:"#FF9800", fontWeight:700 }}>🕐 Čaká na overenie</span>}
          {done && <span style={{ fontSize:10, color:"#66BB6A", fontWeight:700 }}>✅ Overené</span>}
        </div>
        <span style={{
          background: done ? (dark?"rgba(255,255,255,0.1)":"#f0f0f0") : dark ? "rgba(255,217,15,0.15)" : `${member.color}18`,
          color: done ? (dark?"rgba(255,255,255,0.3)":"#ccc") : dark ? YELLOW : member.color,
          borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800, flexShrink:0
        }}>+{at.pts}b</span>
      </button>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${DARK},${DARK2})`, padding:"20px 20px 24px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Prihlásený ako</p>
            <h2 style={{ color:YELLOW, fontSize:22, margin:"2px 0 0", fontWeight:900 }}>{member.name}</h2>
          </div>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, margin:0 }}>Streak</p>
            <p style={{ color:"#FF6B35", fontSize:22, margin:0, fontWeight:900 }}>🔥 {member.streak}</p>
          </div>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
          <Av size={56}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{LEVELS[lvl]}</span>
              <span style={{ color:YELLOW, fontSize:15, fontWeight:900 }}>⭐ {member.weekPts||0}b</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${lvlPct}%`, background:`linear-gradient(90deg,${YELLOW},${member.color})`, borderRadius:99, transition:"width 0.4s" }}/>
            </div>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:10, margin:"4px 0 0" }}>
              {LPTS[Math.min(lvl+1,5)] - (member.totalPts||0)}b do ďalšieho levelu
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 16px" }}>
        {/* Progress + týždeň */}
        <Card style={{ marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <p style={{ fontSize:13, fontWeight:800, color:"#1A1A2E", margin:0 }}>Dnešný postup</p>
                <button
                  onClick={() => setShowWeek(p => !p)}
                  style={{ background:`${member.color}18`, border:"none", borderRadius:10, padding:"3px 10px", color:member.color, fontSize:11, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}
                >{showWeek ? "✕ Zavrieť" : "📅 Týždeň"}</button>
              </div>
              <div style={{ height:8, background:"#f0f0f0", borderRadius:99 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${member.color}88,${member.color})`, borderRadius:99, transition:"width 0.4s" }}/>
              </div>
            </div>
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <p style={{ fontSize:20, fontWeight:900, color:member.color, margin:0 }}>{pct}%</p>
              <p style={{ fontSize:10, color:"#aaa", margin:0 }}>{doneCount}/{myTasks.length}</p>
            </div>
          </div>
        </Card>

        {/* Týždenný pohľad */}
        {showWeek && (
          <Card style={{ marginBottom:14, border:`1.5px solid ${member.color}44` }}>
            <p style={{ fontWeight:900, fontSize:14, color:"#1A1A2E", margin:"0 0 12px" }}>📅 Tento týždeň</p>
            {DAYS_SK.map((d, di) => {
              const dt = activeTasks.filter(at =>
                taskForMember(at, member.id, seasonId) &&
                (at.days === "every" || (Array.isArray(at.days) && at.days.includes(di)))
              );
              const isToday = di === todayIdx;
              return (
                <div key={d} style={{
                  display:"flex", alignItems:"flex-start", gap:10,
                  padding:"8px 0", borderBottom: di < 6 ? "1px solid #f5f5f5" : "none",
                  background: isToday ? `${member.color}08` : "transparent",
                  borderRadius: isToday ? 8 : 0, paddingLeft: isToday ? 8 : 0
                }}>
                  <span style={{ fontSize:12, fontWeight:900, color: isToday ? member.color : "#aaa", minWidth:24, marginTop:2 }}>{d}</span>
                  <div style={{ flex:1, display:"flex", gap:4, flexWrap:"wrap" }}>
                    {dt.slice(0,4).map(t => (
                      <span key={t.id} style={{ background:`${member.color}12`, color:member.color, borderRadius:8, padding:"2px 7px", fontSize:10, fontWeight:700 }}>
                        {t.icon} {t.name}
                      </span>
                    ))}
                    {dt.length > 4 && <span style={{ color:"#bbb", fontSize:10, marginTop:2 }}>+{dt.length-4}</span>}
                    {dt.length === 0 && <span style={{ color:"#ddd", fontSize:10, marginTop:2 }}>Voľný deň 🎉</span>}
                  </div>
                  <span style={{ fontSize:11, color:"#aaa", flexShrink:0 }}>{dt.reduce((a,t)=>a+t.pts,0)}b</span>
                </div>
              );
            })}
          </Card>
        )}

        {/* Žiadne úlohy */}
        {myTasks.length === 0 ? (
          <Card style={{ textAlign:"center", padding:32 }}>
            <p style={{ fontSize:36, margin:"0 0 10px" }}>🎉</p>
            <p style={{ color:"#1A1A2E", fontWeight:800, fontSize:15, margin:"0 0 6px" }}>Dnes žiadne úlohy!</p>
            <p style={{ color:"#aaa", fontSize:13, margin:0 }}>Admin ešte nepridelil úlohy na dnes.</p>
          </Card>
        ) : (
          <>
            {mandatory.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <Sect>⚠️ Povinné úlohy</Sect>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {mandatory.map(at => <TaskRow key={at.id} at={at}/>)}
                </div>
              </div>
            )}
            {voluntary.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <Sect>🙋 Dobrovoľné úlohy</Sect>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {voluntary.map(at => <TaskRow key={at.id} at={at}/>)}
                </div>
              </div>
            )}
            {bonus.length > 0 && (
              <div style={{ marginBottom:14 }}>
                <Sect>⚡ Bonusové úlohy</Sect>
                <div style={{ display:"flex", flexDirection:"column", gap:8, background:`linear-gradient(135deg,${DARK},#2C2C54)`, borderRadius:20, padding:12 }}>
                  {bonus.map(at => <TaskRow key={at.id} at={at} dark/>)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Maggie */}
        <div style={{ background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)", border:"1.5px solid #FFE082", borderRadius:20, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <MaggieSVG size={50}/>
          <div>
            <p style={{ color:"#F57F17", fontSize:13, fontWeight:900, margin:0 }}>🐹 Maggie čaká!</p>
            <p style={{ color:"#8D6E63", fontSize:12, margin:"2px 0 0" }}>Nakŕmte ju a doplňte vodu 💧</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN DASHBOARD — prehľad rodiny
// ═══════════════════════════════════════════════════════
export function AdminDash({ member, members, activeTasks, doneTasks, seasons }) {
  const Av = AVTS[member.id];
  const isSchool = seasons.find(s => s.id === "school")?.active;
  const seasonId = isSchool ? "school" : "holiday";
  const todayKey = new Date().toDateString();
  const lvl    = getLvl(member.totalPts || 0);
  const lvlPct = getLvlPct(member.totalPts || 0);

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${DARK},#16213E)`, padding:"20px 20px 24px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Admin</p>
            <h2 style={{ color:YELLOW, fontSize:22, margin:"2px 0 0", fontWeight:900 }}>{member.name}</h2>
          </div>
          <span style={{
            background: isSchool ? "rgba(63,81,181,0.3)" : "rgba(230,81,0,0.3)",
            color: isSchool ? "#90CAF9" : "#FFCC02",
            borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800
          }}>{isSchool ? "🎒 Školský" : "🌞 Prázdniny"}</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"12px 14px", display:"flex", alignItems:"center", gap:12 }}>
          <Av size={56}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{LEVELS[lvl]}</span>
              <span style={{ color:YELLOW, fontSize:15, fontWeight:900 }}>⭐ {member.weekPts||0}b</span>
            </div>
            <div style={{ height:8, background:"rgba(255,255,255,0.1)", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${lvlPct}%`, background:`linear-gradient(90deg,${YELLOW},${member.color})`, borderRadius:99 }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 16px" }}>
        <Sect>👨‍👩‍👧 Prehľad rodiny dnes</Sect>
        {["bart","lisa"].map(kid => {
          const km = members.find(m => m.id === kid);
          if (!km) return null;
          const KAv = AVTS[kid];
          const kTasks = activeTasks.filter(at =>
            taskForMember(at, kid, seasonId) && taskForToday(at)
          );
          const kDone  = kTasks.filter(at => doneTasks[kid]?.[todayKey]?.[at.id] === "done").length;
          const kPend  = kTasks.filter(at => doneTasks[kid]?.[todayKey]?.[at.id] === "pending").length;
          return (
            <Card key={kid} style={{ marginBottom:10, borderLeft:`4px solid ${km.color}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <KAv size={44}/>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:900, color:"#1A1A2E", margin:"0 0 3px" }}>{km.name}</p>
                  <p style={{ fontSize:12, color:"#888", margin:0 }}>
                    {kDone}/{kTasks.length} splnených
                    {kPend > 0 ? ` · 🕐 ${kPend} čaká` : ""}
                  </p>
                  {kTasks.length > 0 && (
                    <div style={{ height:6, background:"#f0f0f0", borderRadius:99, marginTop:6 }}>
                      <div style={{ height:"100%", width:`${kTasks.length > 0 ? kDone/kTasks.length*100 : 0}%`, background:km.color, borderRadius:99, transition:"width 0.4s" }}/>
                    </div>
                  )}
                </div>
                {kPend > 0 && (
                  <span style={{ background:"#FFF3E0", color:"#FF9800", borderRadius:10, padding:"4px 10px", fontSize:12, fontWeight:800 }}>
                    🕐 {kPend}
                  </span>
                )}
              </div>
            </Card>
          );
        })}

        {/* Maggie */}
        <div style={{ background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)", border:"1.5px solid #FFE082", borderRadius:20, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
          <MaggieSVG size={50}/>
          <div>
            <p style={{ color:"#F57F17", fontSize:13, fontWeight:900, margin:0 }}>🐹 Maggie čaká!</p>
            <p style={{ color:"#8D6E63", fontSize:12, margin:"2px 0 0" }}>Nakŕmte ju a doplňte vodu 💧</p>
          </div>
        </div>
      </div>
    </div>
  );
}
