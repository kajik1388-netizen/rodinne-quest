import { useState } from "react";
import { AVTS, MaggieSVG } from "./Avatars.jsx";
import { Card, Sect, Btn, iS, sS } from "./UI.jsx";
import { YELLOW, DARK, DARK2, LEVELS, LPTS, DAYS_SK, getLvl, getLvlPct, getTodayIdx, taskForMember, taskForToday } from "../data.js";

const TIME_SLOTS = [
  { id:"morning",   label:"🌅 Ráno",       keywords:["ráno","zuby","tvár","raňajky","škola","tašku","vstať"] },
  { id:"afternoon", label:"☀️ Obed",        keywords:["obed","desiata","kosačka"] },
  { id:"evening",   label:"🌙 Večer",       keywords:["večer","pyžamo","uprac","postele","voda","nakrm","maggie","oblečenie","topánky","bunda","mikinu"] },
  { id:"anytime",   label:"⏰ Kedykoľvek",  keywords:[] },
];

function getTimeSlot(task) {
  if (task.timeSlot) return Array.isArray(task.timeSlot) ? task.timeSlot : [task.timeSlot];
  const name = task.name.toLowerCase();
  for (const slot of TIME_SLOTS.slice(0, 3)) {
    if (slot.keywords.some(k => name.includes(k))) return [slot.id];
  }
  return ["anytime"];
}

export function Dashboard({ member, members, activeTasks, setActiveTasks, doneTasks, setDoneTasks, setMembers, setChat, seasons, showToast }) {
  const Av = AVTS[member.id];
  const [selectedDay, setSelectedDay] = useState(null);
  const [tradeTask,   setTradeTask]   = useState(null);
  const [tradeForm,   setTradeForm]   = useState({ to:"", offer:"body", offerAmt:5, itemId:"" });
  const [excuseTask,  setExcuseTask]  = useState(null);
  const [excuseText,  setExcuseText]  = useState("");
  const [showSummary, setShowSummary] = useState(() => {
    const h = new Date().getHours();
    const key = `summary_${member.id}_${new Date().toDateString()}`;
    return h >= 20 && !localStorage.getItem(key);
  });

  const todayKey  = new Date().toDateString();
  const todayDone = doneTasks[member.id]?.[todayKey] || {};
  const isSchool  = seasons.find(s => s.id === "school")?.active;
  const seasonId  = isSchool ? "school" : "holiday";
  const todayIdx  = getTodayIdx();
  const viewIdx   = selectedDay !== null ? selectedDay : todayIdx;
  const isViewingToday = selectedDay === null || selectedDay === todayIdx;

  const dayTasks = activeTasks.filter(at => {
    if (!taskForMember(at, member.id, seasonId)) return false;
    if (at.days === "anytime") return false;
    if (at.days === "every") return true;
    if (Array.isArray(at.days)) return at.days.includes(viewIdx);
    return false;
  });

  const anytimeTasks = activeTasks.filter(at =>
    taskForMember(at, member.id, seasonId) && at.days === "anytime"
  );

  const myTasks = dayTasks;

  const tasksBySlot = TIME_SLOTS.reduce((acc, slot) => {
    acc[slot.id] = myTasks.filter(at => getTimeSlot(at).includes(slot.id) && at.type !== "bonus");
    return acc;
  }, {});
  const bonusTasks = myTasks.filter(at => at.type === "bonus");

  const doneCount = myTasks.filter(at => todayDone[at.id] === "done").length;
  const pct = myTasks.length > 0 ? Math.round(doneCount / myTasks.length * 100) : 0;
  const lvl    = getLvl(member.totalPts || 0);
  const lvlPct = getLvlPct(member.totalPts || 0);
  const myInventory = member.inventory || [];
  const otherKids   = members.filter(m => m.id !== member.id && m.role !== "admin");
  const rejectedTasks = isViewingToday ? myTasks.filter(at => todayDone[at.id] === "rejected") : [];

  const toggle = (atId) => {
    if (!isViewingToday) return;
    const status = todayDone[atId];
    if (status === "done" || status === "rejected") return;
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
      if (at) setChat(prev => [...prev, { id:Date.now(), from:"system", text:`🕐 ${member.name} splnil/a "${at.name}" — čaká na overenie`, time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), unread:true }]);
      showToast("🕐 Odoslané na overenie!", member.color);
    } else {
      showToast("↩️ Zrušené", "#888");
    }
  };

  const sendExcuse = () => {
    if (!excuseTask || !excuseText.trim()) return;
    setChat(prev => [...prev, { id:Date.now(), from:"system", text:`🙏 ${member.name} vysvetľuje nesplnenie "${excuseTask.name}": "${excuseText}"`, time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), unread:true, isExcuse:true, taskId:excuseTask.id, memberId:member.id }]);
    setExcuseTask(null); setExcuseText("");
    showToast("✉️ Vysvetlenie odoslané!", member.color);
  };

  const sendTrade = () => {
    if (!tradeForm.to || !tradeTask) return;
    const toM = members.find(m => m.id === tradeForm.to);
    const tradeRecord = { id:`trade_${Date.now()}`, fromId:member.id, fromName:member.name, toId:tradeForm.to, taskId:tradeTask.id, taskName:tradeTask.name, offer:tradeForm.offer, offerAmt:tradeForm.offerAmt, itemId:tradeForm.itemId, status:"pending" };
    setActiveTasks(prev => prev.map(at => at.id===tradeTask.id ? {...at,trade:tradeRecord} : at));
    const offerText = tradeForm.offer==="body" ? `${tradeForm.offerAmt} bodov 💰` : tradeForm.offer==="item" ? `predmet z inventára 🎁` : "zadarmo 😊";
    setChat(prev => [...prev, { id:Date.now(), from:"trade", name:"🤝 Ponuka", text:`🤝 ${member.name} žiada ${toM?.name}: Splníš za mňa "${tradeTask.name}"? Ponúkam: ${offerText}`, time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), color:"#FF9800", unread:true, tradeId:tradeRecord.id, taskId:tradeTask.id }]);
    setTradeTask(null); setTradeForm({ to:"", offer:"body", offerAmt:5, itemId:"" });
    showToast(`🤝 Ponuka odoslaná ${toM?.name}!`, "#FF9800");
  };

  const TaskRow = ({ at, dark = false, readOnly = false }) => {
    const status   = todayDone[at.id];
    const done     = status === "done";
    const pend     = status === "pending";
    const rejected = status === "rejected";
    const hasTrade = at.trade && at.trade.status === "pending";
    if (done) return null;
    return (
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, background:dark?(pend?"rgba(255,152,0,0.15)":"rgba(255,255,255,0.07)"):rejected?"#FFF3F3":"white", border:`2px solid ${pend?"#FF9800":rejected?"#FF525444":hasTrade?"#FF980066":dark?"rgba(255,217,15,0.3)":member.color+"22"}`, borderRadius:hasTrade?"16px 16px 0 0":16, padding:"12px 14px", boxShadow:dark?"none":"0 2px 8px rgba(0,0,0,0.05)" }}>
          {!readOnly && !rejected && (
            <button onClick={() => toggle(at.id)} style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:pend?"#FF9800":dark?"rgba(255,217,15,0.15)":"transparent", border:`2.5px solid ${pend?"#FF9800":dark?"rgba(255,217,15,0.4)":"#ddd"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:14, cursor:"pointer" }}>{pend?"🕐":""}</button>
          )}
          {rejected && <span style={{fontSize:20,flexShrink:0}}>❌</span>}
          <span style={{ fontSize:18, flexShrink:0 }}>{at.icon}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:700, margin:"0 0 2px", color:rejected?"#FF5252":dark?"white":"#1A1A2E", wordBreak:"break-word" }}>{at.name}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {pend     && <span style={{fontSize:10,color:"#FF9800",fontWeight:700}}>🕐 Čaká na overenie</span>}
              {rejected && <span style={{fontSize:10,color:"#FF5252",fontWeight:700}}>❌ Zamietnuté</span>}
              {hasTrade && <span style={{fontSize:10,color:"#FF9800",fontWeight:700}}>🤝 Ponuka odoslaná</span>}
              {at.tradedFrom && <span style={{fontSize:10,color:"#9C27B0",fontWeight:700}}>🔄 od {at.tradedFrom}</span>}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
            <span style={{ background:dark?"rgba(255,217,15,0.15)":`${member.color}18`, color:dark?YELLOW:member.color, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800 }}>+{at.pts}b</span>
            {!pend && !hasTrade && !rejected && !readOnly && otherKids.length > 0 && (
              <button onClick={() => { setTradeTask(at); setTradeForm({to:otherKids[0].id,offer:"body",offerAmt:5,itemId:""}); }} style={{ background:"rgba(255,152,0,0.12)", border:"1px solid rgba(255,152,0,0.4)", borderRadius:8, padding:"2px 8px", fontSize:10, fontWeight:800, color:"#FF9800", cursor:"pointer", fontFamily:"inherit" }}>🤝 Požiadať</button>
            )}
            {rejected && (
              <button onClick={() => { setExcuseTask(at); setExcuseText(""); }} style={{ background:"rgba(255,82,82,0.1)", border:"1px solid rgba(255,82,82,0.3)", borderRadius:8, padding:"2px 8px", fontSize:10, fontWeight:800, color:"#FF5252", cursor:"pointer", fontFamily:"inherit" }}>🙏 Vysvetliť</button>
            )}
          </div>
        </div>
        {hasTrade && (
          <div style={{ background:"#FFF8E1", border:"2px solid #FFE082", borderTop:"none", borderRadius:"0 0 16px 16px", padding:"8px 14px" }}>
            <p style={{ fontSize:11, color:"#E65100", fontWeight:700, margin:0 }}>🤝 Čaká na odpoveď od {members.find(m=>m.id===at.trade.toId)?.name}</p>
          </div>
        )}
      </div>
    );
  };

  const SlotSection = ({ slot, tasks, dark = false }) => {
    const [showSlotDone, setShowSlotDone] = useState(false);
    const visible  = tasks.filter(at => todayDone[at.id] !== "done" && todayDone[at.id] !== "rejected");
    const slotDone = isViewingToday ? tasks.filter(at => todayDone[at.id] === "done") : [];
    if (visible.length === 0 && slotDone.length === 0) return null;
    return (
      <div style={{ marginBottom:14 }}>
        <Sect>{slot.label}</Sect>
        <div style={{ display:"flex", flexDirection:"column", gap:8, ...(dark?{background:`linear-gradient(135deg,${DARK},#2C2C54)`,borderRadius:20,padding:12}:{}) }}>
          {visible.map(at => <TaskRow key={at.id} at={at} dark={dark} readOnly={!isViewingToday}/>)}
          {slotDone.length > 0 && (
            <div>
              <button onClick={() => setShowSlotDone(p=>!p)} style={{ width:"100%", background:"#F1F8E9", border:"1.5px solid #A5D6A7", borderRadius:12, padding:"7px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", fontFamily:"inherit", marginTop:visible.length>0?4:0 }}>
                <span style={{ fontSize:12, fontWeight:800, color:"#2E7D32" }}>✅ Splnené ({slotDone.length})</span>
                <span style={{ fontSize:12, color:"#66BB6A" }}>{showSlotDone?"▲":"▼"}</span>
              </button>
              {showSlotDone && (
                <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:5 }}>
                  {slotDone.map(at => (
                    <div key={at.id} style={{ display:"flex", alignItems:"center", gap:10, background:"#F9FBE7", border:"1.5px solid #C5E1A5", borderRadius:12, padding:"9px 12px" }}>
                      <span style={{ fontSize:16 }}>✅</span>
                      <span style={{ fontSize:12, fontWeight:700, color:"#aaa", flex:1, textDecoration:"line-through", wordBreak:"break-word" }}>{at.name}</span>
                      <span style={{ fontSize:11, color:"#A5D6A7", fontWeight:800 }}>+{at.pts}b</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const doneTasks_ = myTasks.filter(at => todayDone[at.id] === "done");

  return (
    <div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${DARK},${DARK2})`, padding:"20px 20px 16px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        {/* Meno + streak */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Prihlásený ako</p>
            <h2 style={{ color:YELLOW, fontSize:22, margin:"2px 0 0", fontWeight:900 }}>{member.name}</h2>
          </div>
          <div style={{ textAlign:"center" }}>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:10, margin:0 }}>Streak</p>
            <p style={{ color:"#FF6B35", fontSize:22, margin:0, fontWeight:900 }}>🔥 {member.streak}</p>
          </div>
        </div>

        {/* Avatar + level */}
        <div style={{ background:"rgba(255,255,255,0.07)", borderRadius:20, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <Av size={52}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:"rgba(255,255,255,0.5)", fontSize:11 }}>{LEVELS[lvl]}</span>
              <span style={{ color:YELLOW, fontSize:14, fontWeight:900 }}>⭐ {member.weekPts||0}b</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.1)", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${lvlPct}%`, background:`linear-gradient(90deg,${YELLOW},${member.color})`, borderRadius:99, transition:"width 0.4s" }}/>
            </div>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:10, margin:"3px 0 0" }}>{LPTS[Math.min(lvl+1,5)]-(member.totalPts||0)}b do ďalšieho levelu</p>
          </div>
        </div>

        {/* Progress bar dnešného postupu */}
        {isViewingToday && myTasks.length > 0 && (
          <div style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <span style={{ color:"rgba(255,255,255,0.6)", fontSize:12, fontWeight:800 }}>Dnešný postup</span>
              <span style={{ color:YELLOW, fontSize:18, fontWeight:900 }}>{pct}%</span>
            </div>
            <div style={{ height:10, background:"rgba(255,255,255,0.1)", borderRadius:99 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${YELLOW},${member.color})`, borderRadius:99, transition:"width 0.5s" }}/>
            </div>
            <p style={{ color:"rgba(255,255,255,0.3)", fontSize:10, margin:"4px 0 0" }}>{doneCount}/{myTasks.length} splnených</p>
          </div>
        )}

        {/* Týždenný kalendár */}
        <div style={{ display:"flex", gap:4, overflowX:"auto", scrollbarWidth:"none", paddingBottom:2 }}>
          {DAYS_SK.map((d, di) => {
            const isToday = di === todayIdx;
            const isSel   = selectedDay === di || (selectedDay === null && isToday);
            const cnt = activeTasks.filter(at => taskForMember(at,member.id,seasonId) && (at.days==="every"||(Array.isArray(at.days)&&at.days.includes(di)))).length;
            return (
              <button key={di} onClick={() => setSelectedDay(di === todayIdx ? null : di)} style={{ flexShrink:0, flex:1, padding:"6px 4px", borderRadius:12, border:`2px solid ${isSel?YELLOW:"rgba(255,255,255,0.1)"}`, background:isSel?`${YELLOW}22`:"transparent", cursor:"pointer", fontFamily:"inherit", textAlign:"center" }}>
                <p style={{ fontSize:10, fontWeight:800, color:isSel?YELLOW:"rgba(255,255,255,0.4)", margin:"0 0 2px" }}>{d}</p>
                {isToday && <div style={{ width:4, height:4, borderRadius:"50%", background:YELLOW, margin:"0 auto 2px" }}/>}
                <p style={{ fontSize:11, fontWeight:900, color:isSel?YELLOW:"rgba(255,255,255,0.3)", margin:0 }}>{cnt}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding:"14px 16px" }}>
        {/* Iný deň — info banner */}
        {!isViewingToday && (
          <div style={{ background:`${member.color}12`, border:`1.5px solid ${member.color}33`, borderRadius:14, padding:"8px 14px", marginBottom:14, textAlign:"center" }}>
            <p style={{ color:member.color, fontSize:13, fontWeight:800, margin:0 }}>👀 Prezeráš {DAYS_SK[viewIdx]} — len na čítanie</p>
          </div>
        )}

        {/* Žiadne úlohy */}
        {myTasks.length === 0 && anytimeTasks.length === 0 ? (
          <Card style={{ textAlign:"center", padding:32 }}>
            <p style={{ fontSize:36, margin:"0 0 10px" }}>🎉</p>
            <p style={{ color:"#1A1A2E", fontWeight:800, fontSize:15, margin:"0 0 6px" }}>Dnes žiadne úlohy!</p>
            <p style={{ color:"#aaa", fontSize:13, margin:0 }}>Admin ešte nepridelil úlohy.</p>
          </Card>
        ) : (
          <>
            {TIME_SLOTS.map(slot => (
              <SlotSection key={slot.id} slot={slot} tasks={tasksBySlot[slot.id] || []}/>
            ))}
            {bonusTasks.filter(at => todayDone[at.id] !== "done").length > 0 && (
              <div style={{ marginBottom:14 }}>
                <Sect>⚡ Bonusové úlohy</Sect>
                <div style={{ display:"flex", flexDirection:"column", gap:8, background:`linear-gradient(135deg,${DARK},#2C2C54)`, borderRadius:20, padding:12 }}>
                  {bonusTasks.filter(at => todayDone[at.id] !== "done").map(at => <TaskRow key={at.id} at={at} dark readOnly={!isViewingToday}/>)}
                </div>
              </div>
            )}
          </>
        )}

        {/* Zamietnuté */}
        {isViewingToday && rejectedTasks.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <Sect>❌ Zamietnuté</Sect>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {rejectedTasks.map(at => <TaskRow key={at.id} at={at}/>)}
            </div>
          </div>
        )}

        {/* Ľubovoľné úlohy */}
        {anytimeTasks.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <Sect>📋 Úlohy bez termínu</Sect>
            <div style={{ background:"#F3E5F5", borderRadius:16, padding:"10px 12px", marginBottom:8 }}>
              <p style={{ fontSize:11, color:"#9C27B0", fontWeight:700, margin:0 }}>Tieto úlohy môžeš splniť kedykoľvek — nie sú viazané na konkrétny deň</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {anytimeTasks.map(at => {
                const status = todayDone[at.id];
                const done = status === "done";
                const pend = status === "pending";
                return (
                  <div key={at.id} style={{ display:"flex", alignItems:"center", gap:10, background:"white", border:`2px solid ${done?"#66BB6A":pend?"#FF9800":"#9C27B055"}`, borderRadius:16, padding:"12px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                    <button onClick={() => toggle(at.id)} style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:done?"#66BB6A":pend?"#FF9800":"transparent", border:`2.5px solid ${done?"#66BB6A":pend?"#FF9800":"#9C27B055"}`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:14, cursor:done?"default":"pointer" }}>{done?"✓":pend?"🕐":""}</button>
                    <span style={{ fontSize:18, flexShrink:0 }}>{at.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:700, margin:0, color:done?"#bbb":"#1A1A2E", textDecoration:done?"line-through":"none", wordBreak:"break-word" }}>{at.name}</p>
                    </div>
                    <span style={{ background:`${member.color}18`, color:member.color, borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:800, flexShrink:0 }}>+{at.pts}b</span>
                  </div>
                );
              })}
            </div>
          </div>
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

      {/* DENNÝ SÚHRN po 20:00 */}
      {showSummary && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:300, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480, maxHeight:"85vh", overflowY:"auto" }}>
            <p style={{ fontSize:40, textAlign:"center", margin:"0 0 8px" }}>🌙</p>
            <h3 style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>Denný súhrn</h3>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:13, margin:"0 0 20px" }}>{new Date().toLocaleDateString("sk",{weekday:"long",day:"numeric",month:"long"})}</p>
            {doneTasks_.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:900, color:"#2E7D32", margin:"0 0 8px" }}>✅ SPLNENÉ ({doneTasks_.length})</p>
                {doneTasks_.map(at => (
                  <div key={at.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <span style={{ fontSize:16 }}>{at.icon}</span>
                    <span style={{ fontSize:13, color:"#1A1A2E", flex:1 }}>{at.name}</span>
                    <span style={{ fontSize:12, color:"#66BB6A", fontWeight:800 }}>+{at.pts}b</span>
                  </div>
                ))}
              </div>
            )}
            {myTasks.filter(at => !todayDone[at.id] || todayDone[at.id]==="rejected").length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:900, color:"#FF5252", margin:"0 0 8px" }}>❌ NESPLNENÉ</p>
                {myTasks.filter(at => !todayDone[at.id] || todayDone[at.id]==="rejected").map(at => (
                  <div key={at.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid #f5f5f5" }}>
                    <span style={{ fontSize:16 }}>{at.icon}</span>
                    <span style={{ fontSize:13, color:"#FF5252", flex:1 }}>{at.name}</span>
                    <button onClick={() => { setExcuseTask(at); setExcuseText(""); setShowSummary(false); }} style={{ background:"#FFF3E0", border:"none", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:800, color:"#FF9800", cursor:"pointer", fontFamily:"inherit" }}>🙏 Vysvetliť</button>
                  </div>
                ))}
              </div>
            )}
            <Btn onClick={() => { localStorage.setItem(`summary_${member.id}_${new Date().toDateString()}`, "1"); setShowSummary(false); }} color={member.color} style={{ width:"100%", fontSize:14 }}>OK, rozumiem 👍</Btn>
          </div>
        </div>
      )}

      {/* EXCUSE DIALOG */}
      {excuseTask && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:28, textAlign:"center", margin:"0 0 4px" }}>{excuseTask.icon}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{excuseTask.name}</h3>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:12, margin:"0 0 16px" }}>Vysvetli adminovi prečo si to nesplnil/a</p>
            <textarea value={excuseText} onChange={e=>setExcuseText(e.target.value)} placeholder="Napíš dôvod..." style={{ ...iS, height:100, resize:"none", marginBottom:12 }} autoFocus/>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => setExcuseTask(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={sendExcuse} color={member.color} style={{ flex:2 }} disabled={!excuseText.trim()}>✉️ Odoslať</Btn>
            </div>
          </div>
        </div>
      )}

      {/* TRADE DIALOG */}
      {tradeTask && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:480, maxHeight:"85vh", overflowY:"auto" }}>
            <p style={{ fontSize:28, textAlign:"center", margin:"0 0 4px" }}>{tradeTask.icon}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px", wordBreak:"break-word" }}>{tradeTask.name}</h3>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:12, margin:"0 0 20px" }}>Požiadaj niekoho aby to splnil za teba</p>
            <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 8px" }}>KOMU POSIELAM PONUKU</p>
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${otherKids.length},1fr)`, gap:8, marginBottom:16 }}>
              {otherKids.map(m => { const MAv=AVTS[m.id]; return (
                <button key={m.id} onClick={() => setTradeForm(p=>({...p,to:m.id}))} style={{ padding:"12px 8px", borderRadius:16, border:`2px solid ${tradeForm.to===m.id?m.color:"#eee"}`, background:tradeForm.to===m.id?`${m.color}15`:"white", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <MAv size={44}/><span style={{fontSize:12,fontWeight:800,color:tradeForm.to===m.id?m.color:"#888"}}>{m.name}</span><span style={{fontSize:10,color:"#bbb"}}>⭐ {m.weekPts||0}b</span>
                </button>
              ); })}
            </div>
            <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 8px" }}>ČO PONÚKAM ZA SPLNENIE</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:12 }}>
              {[{id:"body",l:"💰 Body"},{id:"item",l:"🎁 Predmet"},{id:"free",l:"😊 Zadarmo"}].map(o => (
                <button key={o.id} onClick={() => setTradeForm(p=>({...p,offer:o.id}))} style={{ padding:"10px 6px", borderRadius:12, border:`2px solid ${tradeForm.offer===o.id?member.color:"#eee"}`, background:tradeForm.offer===o.id?`${member.color}15`:"white", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", color:tradeForm.offer===o.id?member.color:"#888" }}>{o.l}</button>
              ))}
            </div>
            {tradeForm.offer==="body" && (
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 6px" }}>KOĽKO BODOV (mám: {member.totalPts||0}b)</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {[3,5,10,15,20].map(n => <button key={n} onClick={() => setTradeForm(p=>({...p,offerAmt:n}))} style={{ padding:"8px 14px", borderRadius:20, border:`2px solid ${tradeForm.offerAmt===n?member.color:"#eee"}`, background:tradeForm.offerAmt===n?`${member.color}15`:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:tradeForm.offerAmt===n?member.color:"#888" }}>{n}b</button>)}
                  <input type="number" min={1} max={member.totalPts||0} value={tradeForm.offerAmt} onChange={e=>setTradeForm(p=>({...p,offerAmt:Number(e.target.value)}))} style={{...iS,width:80,margin:0,textAlign:"center"}}/>
                </div>
              </div>
            )}
            {tradeForm.offer==="item" && (
              <div style={{ marginBottom:12 }}>
                <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 6px" }}>VYBER PREDMET Z INVENTÁRA</p>
                {myInventory.length===0 ? <p style={{color:"#bbb",fontSize:12,textAlign:"center",padding:"12px 0"}}>Inventár je prázdny — choď do Obchodu 🛍️</p> : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                    {myInventory.map(item => <button key={item.id} onClick={() => setTradeForm(p=>({...p,itemId:item.id}))} style={{ padding:"10px 6px", borderRadius:12, textAlign:"center", border:`2px solid ${tradeForm.itemId===item.id?member.color:"#eee"}`, background:tradeForm.itemId===item.id?`${member.color}15`:"white", cursor:"pointer", fontFamily:"inherit" }}><p style={{fontSize:22,margin:"0 0 2px"}}>{item.emoji}</p><p style={{fontSize:9,fontWeight:800,color:tradeForm.itemId===item.id?member.color:"#888",margin:0,lineHeight:1.2}}>{item.name}</p></button>)}
                  </div>
                )}
              </div>
            )}
            {tradeForm.offer==="free" && <div style={{background:"#F3E5F5",borderRadius:12,padding:"10px 14px",marginBottom:12}}><p style={{fontSize:12,color:"#9C27B0",fontWeight:700,margin:0}}>😊 Ponúkaš pomoc zadarmo — len ako priateľská služba</p></div>}
            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <Btn onClick={() => setTradeTask(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={sendTrade} color={member.color} style={{flex:2}} disabled={!tradeForm.to||(tradeForm.offer==="item"&&!tradeForm.itemId)}>🤝 Odoslať ponuku</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminDash({ member, members, activeTasks, doneTasks, seasons, setMembers, setActiveTasks, setDoneTasks, showToast }) {
  const Av = AVTS[member.id];
  const isSchool = seasons.find(s => s.id === "school")?.active;
  const seasonId = isSchool ? "school" : "holiday";
  const todayKey = new Date().toDateString();
  const lvl    = getLvl(member.totalPts || 0);
  const lvlPct = getLvlPct(member.totalPts || 0);
  const [expandedKid, setExpandedKid] = useState(null);
  const [summaryAction, setSummaryAction] = useState(null);
  const [deductPts, setDeductPts] = useState(5);

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${DARK},#16213E)`, padding:"20px 20px 24px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, margin:0 }}>Admin</p>
            <h2 style={{ color:YELLOW, fontSize:22, margin:"2px 0 0", fontWeight:900 }}>{member.name}</h2>
          </div>
          <span style={{ background:isSchool?"rgba(63,81,181,0.3)":"rgba(230,81,0,0.3)", color:isSchool?"#90CAF9":"#FFCC02", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800 }}>{isSchool?"🎒 Školský":"🌞 Prázdniny"}</span>
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
        {["bart","lisa","homer","marge"].map(kid => {
          const km = members.find(m => m.id === kid); if (!km) return null;
          const KAv = AVTS[kid];
          const kTasks = activeTasks.filter(at => taskForMember(at,kid,seasonId) && taskForToday(at));
          const kDone  = kTasks.filter(at => doneTasks[kid]?.[todayKey]?.[at.id]==="done").length;
          const kPend  = kTasks.filter(at => doneTasks[kid]?.[todayKey]?.[at.id]==="pending").length;
          const isExp  = expandedKid === kid;
          return (
            <Card key={kid} style={{ marginBottom:10, borderLeft:`4px solid ${km.color}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <KAv size={44}/>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:15, fontWeight:900, color:"#1A1A2E", margin:"0 0 3px" }}>{km.name}</p>
                  <button onClick={() => setExpandedKid(isExp?null:kid)} style={{ background:"none", border:"none", padding:0, cursor:"pointer", fontFamily:"inherit" }}>
                    <p style={{ fontSize:12, color:km.color, margin:0, fontWeight:800, textDecoration:"underline" }}>{kDone}/{kTasks.length} splnených{kPend>0?` · 🕐 ${kPend} čaká`:""} {isExp?"▲":"▼"}</p>
                  </button>
                  {kTasks.length > 0 && (
                    <div style={{ height:6, background:"#f0f0f0", borderRadius:99, marginTop:6 }}>
                      <div style={{ height:"100%", width:`${kDone/kTasks.length*100}%`, background:km.color, borderRadius:99, transition:"width 0.4s" }}/>
                    </div>
                  )}
                </div>
                {kPend > 0 && <span style={{ background:"#FFF3E0", color:"#FF9800", borderRadius:10, padding:"4px 10px", fontSize:12, fontWeight:800 }}>🕐 {kPend}</span>}
              </div>
              {isExp && (
                <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:6 }}>
                  {kTasks.map(at => {
                    const st = doneTasks[kid]?.[todayKey]?.[at.id];
                    return (
                      <div key={at.id} style={{ display:"flex", alignItems:"center", gap:8, background:st==="done"?"#F1F8E9":st==="pending"?"#FFF8E1":"#f8f8f8", borderRadius:12, padding:"8px 10px", border:`1.5px solid ${st==="done"?"#A5D6A7":st==="pending"?"#FFE082":"transparent"}` }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>{at.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontSize:12, fontWeight:700, color:"#1A1A2E", margin:"0 0 2px", wordBreak:"break-word", textDecoration:st==="done"?"line-through":"none" }}>{at.name}</p>
                        </div>
                        <span style={{ fontSize:10, fontWeight:800, color:st==="done"?"#66BB6A":st==="pending"?"#FF9800":"#bbb", flexShrink:0 }}>{st==="done"?"✅":st==="pending"?"🕐":"○"}</span>
                        {!st && new Date().getHours() >= 20 && (
                          <div style={{ display:"flex", gap:4 }}>
                            <button onClick={() => setSummaryAction({type:"extend",memberId:kid,task:at})} style={{ background:"#E3F2FD", border:"none", borderRadius:6, padding:"3px 6px", fontSize:10, fontWeight:800, color:"#1565C0", cursor:"pointer" }}>⏳</button>
                            <button onClick={() => setSummaryAction({type:"forgive",memberId:kid,task:at})} style={{ background:"#F1F8E9", border:"none", borderRadius:6, padding:"3px 6px", fontSize:10, fontWeight:800, color:"#2E7D32", cursor:"pointer" }}>✅</button>
                            <button onClick={() => { setSummaryAction({type:"deduct",memberId:kid,task:at}); setDeductPts(at.pts); }} style={{ background:"#FFF3F3", border:"none", borderRadius:6, padding:"3px 6px", fontSize:10, fontWeight:800, color:"#FF5252", cursor:"pointer" }}>➖</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
        <div style={{ background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)", border:"1.5px solid #FFE082", borderRadius:20, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginTop:8 }}>
          <MaggieSVG size={50}/>
          <div>
            <p style={{ color:"#F57F17", fontSize:13, fontWeight:900, margin:0 }}>🐹 Maggie čaká!</p>
            <p style={{ color:"#8D6E63", fontSize:12, margin:"2px 0 0" }}>Nakŕmte ju a doplňte vodu 💧</p>
          </div>
        </div>
      </div>

      {summaryAction && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:28, textAlign:"center", margin:"0 0 4px" }}>{summaryAction.task.icon}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{summaryAction.task.name}</h3>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:12, margin:"0 0 20px" }}>{summaryAction.type==="extend"?"⏳ Predĺžiť termín na zajtra":summaryAction.type==="forgive"?"✅ Odpustiť — bez následkov":"➖ Odpočítať body"}</p>
            {summaryAction.type==="deduct" && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 8px" }}>KOĽKO BODOV ODPOČÍTAŤ</p>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:8 }}>
                  {[1,2,3,5,10].map(n => <button key={n} onClick={() => setDeductPts(n)} style={{ padding:"8px 14px", borderRadius:20, border:`2px solid ${deductPts===n?"#FF5252":"#eee"}`, background:deductPts===n?"#FFF3F3":"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:deductPts===n?"#FF5252":"#888" }}>{n}b</button>)}
                  <input type="number" min={1} value={deductPts} onChange={e=>setDeductPts(Number(e.target.value))} style={{...iS,width:70,margin:0,textAlign:"center"}}/>
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => setSummaryAction(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={() => {
                const { type, memberId, task } = summaryAction;
                if (type==="extend") { const ti=(getTodayIdx()+1)%7; setActiveTasks(prev=>prev.map(at=>at.id!==task.id?at:{...at,days:Array.isArray(at.days)?at.days.includes(ti)?at.days:[...at.days,ti]:[ti]})); showToast("⏳ Termín predĺžený!","#1565C0"); }
                else if (type==="forgive") { setDoneTasks(prev=>{const nd={...prev};if(!nd[memberId])nd[memberId]={};if(!nd[memberId][todayKey])nd[memberId][todayKey]={};nd[memberId][todayKey][task.id]="done";return nd;}); showToast("✅ Odpustené!","#66BB6A"); }
                else if (type==="deduct") { setMembers(prev=>prev.map(m=>m.id===memberId?{...m,weekPts:Math.max(0,(m.weekPts||0)-deductPts),totalPts:Math.max(0,(m.totalPts||0)-deductPts)}:m)); showToast(`➖ -${deductPts}b odpočítané!`,"#FF5252"); }
                setSummaryAction(null);
              }} color={summaryAction.type==="extend"?"#1565C0":summaryAction.type==="forgive"?"#66BB6A":"#FF5252"} style={{ flex:2 }}>
                {summaryAction.type==="extend"?"⏳ Predĺžiť":summaryAction.type==="forgive"?"✅ Odpustiť":"➖ Odpočítať"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}