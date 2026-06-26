import { useState } from "react";
import { AVTS } from "./Avatars.jsx";
import { Card, Sect, Btn, iS, sS, SegmentControl } from "./UI.jsx";
import { YELLOW, DARK, DAYS_SK, TASK_LIBRARY, taskForMember, taskForToday } from "../data.js";
import { AdminShop } from "./Inventory.jsx";

const WHO_OPTIONS = [
  { id:"bart",  l:"Bart"   },
  { id:"lisa",  l:"Lisa"   },
  { id:"homer", l:"Homer"  },
  { id:"marge", l:"Marge"  },
  { id:"kids",  l:"Bart & Lisa" },
  { id:"all",   l:"Všetci" },
];
const TYPE_OPTIONS = [
  { id:"mandatory", l:"⚠️ Povinná",    c:"#FF5252" },
  { id:"voluntary", l:"🙋 Dobrovoľná", c:"#9C27B0" },
  { id:"bonus",     l:"⚡ Bonusová",   c:"#FF9800" },
];

function whoLabel(who) {
  const map = { kids:"Bart & Lisa", all:"Všetci", bart:"Bart", lisa:"Lisa", homer:"Homer", marge:"Marge" };
  return map[who] || who;
}
function typeStyle(type) {
  const map = {
    mandatory:["#FFF3F3","#FF5252","⚠️ Povinná"],
    voluntary:["#F3E5F5","#9C27B0","🙋 Dobrovoľná"],
    bonus:["#FFF8E1","#FF9800","⚡ Bonusová"]
  };
  return map[type] || ["#f0f0f0","#888","Úloha"];
}

// Výber dní — chip selector
function DaysPicker({ value, onChange, color }) {
  const isEvery = value === "every";
  const isAny   = value === "anytime";
  const selDays = Array.isArray(value) ? value : [];

  const toggleDay = (di) => {
    const cur = Array.isArray(value) ? value : [];
    const ns  = cur.includes(di) ? cur.filter(x => x !== di) : [...cur, di];
    onChange(ns.length === 0 ? [] : ns);
  };

  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      <button onClick={() => onChange("every")} style={{
        padding:"7px 12px", borderRadius:20, border:`2px solid ${isEvery ? color : "#eee"}`,
        background: isEvery ? `${color}15` : "white", fontWeight:800, fontSize:11,
        cursor:"pointer", fontFamily:"inherit", color: isEvery ? color : "#888"
      }}>Každý deň</button>
      <button onClick={() => onChange("anytime")} style={{
        padding:"7px 12px", borderRadius:20, border:`2px solid ${isAny ? "#9C27B0" : "#eee"}`,
        background: isAny ? "#F3E5F5" : "white", fontWeight:800, fontSize:11,
        cursor:"pointer", fontFamily:"inherit", color: isAny ? "#9C27B0" : "#888"
      }}>Ľubovoľne</button>
      {DAYS_SK.map((d, di) => {
        const sel = selDays.includes(di);
        return (
          <button key={di} onClick={() => toggleDay(di)} style={{
            padding:"7px 10px", borderRadius:20, border:`2px solid ${sel ? color : "#eee"}`,
            background: sel ? `${color}15` : "white", fontWeight:800, fontSize:11,
            cursor:"pointer", fontFamily:"inherit", color: sel ? color : "#888"
          }}>{d}</button>
        );
      })}
    </div>
  );
}

// Multi-select osôb
function WhoPicker({ value, onChange, color, adminOnly = false }) {
  const opts = adminOnly
    ? WHO_OPTIONS.filter(o => o.id === "homer" || o.id === "marge")
    : WHO_OPTIONS;

  const isSelected = (id) => {
    if (Array.isArray(value)) return value.includes(id);
    return value === id;
  };

  const toggle = (id) => {
    // Ak je "kids" alebo "all" — jednoduchý select
    if (id === "kids" || id === "all") { onChange(id); return; }
    // Inak multi-select jednotlivcov
    const cur = Array.isArray(value) ? value : (value && value !== "kids" && value !== "all" ? [value] : []);
    const ns  = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    onChange(ns.length === 1 ? ns[0] : ns.length === 0 ? "" : ns);
  };

  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
      {opts.map(({ id, l }) => (
        <button key={id} onClick={() => toggle(id)} style={{
          padding:"8px 14px", borderRadius:20,
          border:`2px solid ${isSelected(id) ? color : "#eee"}`,
          background: isSelected(id) ? `${color}15` : "white",
          fontWeight:800, fontSize:11, cursor:"pointer",
          fontFamily:"inherit", color: isSelected(id) ? color : "#888"
        }}>{l}</button>
      ))}
    </div>
  );
}

export default function AdminPanel({
  member, members, setMembers,
  activeTasks, setActiveTasks,
  rewards, setRewards,
  proposals, setProposals,
  seasons, setSeasons,
  doneTasks, setDoneTasks,
  shopItems, setShopItems,
  showToast
}) {
  const [tab, setTab]           = useState("verify");
  const [taskView, setTaskView] = useState("list");
  const [sf, setSf]             = useState("school");
  const [cf, setCf]             = useState(null);
  const [assignTask, setAssignTask] = useState(null);
  const [assignForm, setAssignForm] = useState({ who:"kids", days:"every", type:"mandatory" });
  const [showAdd, setShowAdd]   = useState(false);
  const [newTask, setNewTask]   = useState({ name:"", icon:"✅", pts:3, season:"always", who:"kids", days:"every", type:"mandatory" });
  const [editAt, setEditAt]     = useState(null);
  const [confirmReset, setConfirmReset] = useState(null);
  const [adjPts, setAdjPts]     = useState({ homer:"", marge:"", bart:"", lisa:"" });
  const [rejectId, setRejectId] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [approveItem, setApproveItem] = useState(null);
  const [approvePts, setApprovePts]   = useState("");
  const [expandedKid, setExpandedKid] = useState(null);

  const todayKey     = new Date().toDateString();
  const pending      = proposals.filter(p => p.status === "pending").length;
  const isSchool     = seasons.find(s => s.id === "school")?.active;
  const seasonId     = isSchool ? "school" : "holiday";
  const pendingVerify = members.filter(m => m.role !== "admin").reduce((t,m) =>
    t + Object.values(doneTasks[m.id]?.[todayKey] || {}).filter(v => v === "pending").length, 0);

  const allCats = [...new Set(TASK_LIBRARY.map(t => t.cat))];
  const filteredLib = TASK_LIBRARY.filter(t => {
    if (sf === "school"  && t.season === "holiday") return false;
    if (sf === "holiday" && t.season === "school")  return false;
    if (sf === "always"  && t.season !== "always")  return false;
    if (cf && t.cat !== cf) return false;
    return true;
  });
  const activeIds = new Set(activeTasks.map(at => at.taskId));

  const filteredActive = activeTasks.filter(at => {
    if (sf === "school"  && at.season === "holiday") return false;
    if (sf === "holiday" && at.season === "school")  return false;
    if (sf === "always"  && at.season !== "always")  return false;
    if (cf && at.cat !== cf) return false;
    return true;
  });

  const assignFn = (task) => {
    const newAt = {
      id: `at_${Date.now()}`, taskId: task.id,
      name: task.name, icon: task.icon, pts: task.pts, cat: task.cat,
      ...assignForm,
      season: task.season === "always" ? "always" : seasonId
    };
    setActiveTasks(prev => [...prev, newAt]);
    setAssignTask(null);
    showToast(`✅ "${task.name}" pridelená!`, member.color);
  };

  const removeAt = (atId) => {
    setActiveTasks(prev => prev.filter(at => at.id !== atId));
    showToast("↩️ Úloha odobraná", "#888");
  };

  const copyAt = (at) => {
    const idx  = activeTasks.findIndex(x => x.id === at.id);
    const copy = { ...at, id:`at_${Date.now()}`, name: at.name + " (kópia)" };
    const arr  = [...activeTasks];
    arr.splice(idx + 1, 0, copy);
    setActiveTasks(arr);
    showToast("📋 Skopírované!", member.color);
  };

  const moveAt = (atId, dir) => {
    const arr = [...activeTasks];
    const i   = arr.findIndex(x => x.id === atId);
    const j   = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setActiveTasks(arr);
  };

  const addCustom = () => {
    if (!newTask.name.trim()) return;
    const at = {
      id: `at_${Date.now()}`, taskId:`custom_${Date.now()}`,
      name: newTask.name, icon: newTask.icon, pts: newTask.pts, cat:"⚡ Vlastné",
      who: newTask.who, days: newTask.days, type: newTask.type, season: newTask.season
    };
    setActiveTasks(prev => [...prev, at]);
    setNewTask({ name:"", icon:"✅", pts:3, season:"always", who:"kids", days:"every", type:"mandatory" });
    setShowAdd(false);
    showToast("✅ Úloha pridaná!", member.color);
  };

  const daysLabel = (days) => {
    if (days === "every")   return "Každý deň";
    if (days === "anytime") return "Ľubovoľne";
    if (Array.isArray(days)) return days.map(d => DAYS_SK[d]).join(", ");
    return "—";
  };

  const TABS = [
    { id:"verify",    label:`⏳ Overenie${pendingVerify>0?` (${pendingVerify})`:""}`},
    { id:"proposals", label:`💡 Návrhy${pending>0?` (${pending})`:""}`},
    { id:"tasks",     label:"📋 Úlohy" },
    { id:"rewards",   label:"🎁 Odmeny" },
    { id:"shop",      label:"🛍️ Obchod" },
    { id:"points",    label:"👥 Body" },
    { id:"seasons",   label:"🗓️ Sezóny" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${DARK},#0F3460)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <h2 style={{ color:YELLOW, fontSize:22, margin:0, fontWeight:900 }}>⚙️ Admin — {member.name}</h2>
        <div style={{ display:"flex", gap:10, marginTop:6, flexWrap:"wrap" }}>
          {pendingVerify>0 && <span style={{ background:"rgba(255,152,0,0.2)", color:"#FFB74D", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:800 }}>🕐 {pendingVerify} čaká na overenie</span>}
          {pending>0       && <span style={{ background:"rgba(255,82,82,0.2)",  color:"#FF8080", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:800 }}>💡 {pending} návrhov</span>}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", gap:6, padding:"12px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none",
            fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer",
            background: tab===t.id ? member.color : "white",
            color: tab===t.id ? "white" : "#888",
            boxShadow: tab===t.id ? `0 4px 12px ${member.color}55` : "0 1px 4px rgba(0,0,0,0.08)",
            transition:"all 0.2s", whiteSpace:"nowrap"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:"14px 16px" }}>

        {/* ── OVERENIE ── */}
        {tab==="verify" && (
          pendingVerify===0
            ? <Card style={{textAlign:"center",padding:32}}><p style={{fontSize:40,margin:"0 0 10px"}}>✅</p><p style={{color:"#1A1A2E",fontWeight:800,fontSize:16,margin:0}}>Všetko overené!</p></Card>
            : members.filter(m=>m.role!=="admin").map(m=>{
                const mDone  = doneTasks[m.id]?.[todayKey]||{};
                const pTasks = Object.entries(mDone).filter(([,v])=>v==="pending")
                  .map(([tid]) => activeTasks.find(a=>a.id===tid))
                  .filter(Boolean).map(at=>({...at,memberId:m.id,memberName:m.name,memberColor:m.color}));
                if (!pTasks.length) return null;
                const MAv = AVTS[m.id];
                return (
                  <div key={m.id} style={{marginBottom:16}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <MAv size={32}/>
                      <p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:0}}>{m.name} — {pTasks.length} čaká</p>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {pTasks.map(at=>(
                        <Card key={at.id} style={{borderLeft:`4px solid ${at.memberColor}`}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                            <span style={{fontSize:20}}>{at.icon}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 3px",wordBreak:"break-word"}}>{at.name}</p>
                              <span style={{background:`${member.color}18`,color:member.color,borderRadius:8,padding:"1px 8px",fontSize:11,fontWeight:800}}>+{at.pts}b</span>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <Btn onClick={()=>{
                              setDoneTasks(prev=>{const nd={...prev};if(!nd[at.memberId])nd[at.memberId]={};if(!nd[at.memberId][todayKey])nd[at.memberId][todayKey]={};nd[at.memberId][todayKey][at.id]="done";return nd;});
                              setMembers(prev=>prev.map(x=>{
                                if(x.id===at.memberId) return {...x,weekPts:(x.weekPts||0)+at.pts,totalPts:(x.totalPts||0)+at.pts};
                                return x;
                              }));
                              showToast(`✅ +${at.pts}b pre ${at.memberName}!`,"#66BB6A");
                            }} color="#66BB6A" style={{flex:1,padding:"10px 0",fontSize:13}}>✅ Potvrdiť</Btn>
                            <Btn onClick={()=>{
                              setDoneTasks(prev=>{const nd={...prev};if(nd[at.memberId]?.[todayKey]?.[at.id])delete nd[at.memberId][todayKey][at.id];return nd;});
                              showToast("❌ Zamietnuté","#FF5252");
                            }} color="#FF5252" style={{flex:1,padding:"10px 0",fontSize:13}}>❌ Zamietnuť</Btn>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
        )}

        {/* ── NÁVRHY ── */}
        {tab==="proposals" && (
          <>
            {["pending","approved","rejected"].map(status=>{
              const items=proposals.filter(p=>p.status===status);
              if(!items.length) return null;
              const labels={pending:"⏳ Čakajú",approved:"✅ Schválené",rejected:"❌ Zamietnuté"};
              return(
                <div key={status} style={{marginBottom:16}}>
                  <Sect>{labels[status]}</Sect>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {items.map(p=>(
                      <Card key={p.id} style={{borderLeft:`4px solid ${p.fromColor}`}}>
                        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:status==="pending"?12:0}}>
                          <span style={{fontSize:22,flexShrink:0}}>{p.emoji}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                              <span style={{background:`${p.fromColor}18`,color:p.fromColor,borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:800}}>{p.from}</span>
                              <span style={{background:"#f0f0f0",color:"#888",borderRadius:8,padding:"2px 8px",fontSize:11}}>{p.type==="reward"?"🎁 odmena":"📋 úloha"}</span>
                              <span style={{color:"#ccc",fontSize:11,marginLeft:"auto"}}>{p.date}</span>
                            </div>
                            <p style={{fontSize:13,color:"#1A1A2E",fontWeight:700,margin:0,lineHeight:1.4,wordBreak:"break-word"}}>{p.text}</p>
                            {p.points&&<p style={{color:member.color,fontSize:12,fontWeight:800,margin:"4px 0 0"}}>⭐ {p.points}b</p>}
                            {p.adminNote&&<p style={{color:"#FF7043",fontSize:12,margin:"4px 0 0",fontStyle:"italic"}}>"{p.adminNote}"</p>}
                          </div>
                        </div>
                        {status==="pending"&&(
                          <div style={{display:"flex",gap:8}}>
                            <Btn onClick={()=>{setApproveItem(p);setApprovePts(p.points||"");}} color="#66BB6A" style={{flex:1,padding:"10px 0",fontSize:13}}>✅ Schváliť</Btn>
                            <Btn onClick={()=>{setRejectId(p.id);setRejectNote("");}} color="#FF5252" style={{flex:1,padding:"10px 0",fontSize:13}}>❌ Zamietnuť</Btn>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
            {proposals.length===0&&<Card style={{textAlign:"center",padding:32}}><p style={{fontSize:36,margin:"0 0 10px"}}>💡</p><p style={{color:"#aaa",fontSize:14,margin:0}}>Žiadne návrhy</p></Card>}
          </>
        )}

        {/* ── ÚLOHY ── */}
        {tab==="tasks" && (
          <>
            <div style={{marginBottom:12}}>
              <SegmentControl value={taskView} onChange={setTaskView} options={[{id:"list",label:"📋 Zoznam"},{id:"persons",label:"👥 Podľa osôb"}]}/>
            </div>

            {taskView==="persons" ? (
              <>
                {["bart","lisa","homer","marge"].map(mid=>{
                  const m=members.find(x=>x.id===mid); if(!m) return null;
                  const MAv=AVTS[mid];
                  const mTasks=activeTasks.filter(at=>{
                    if(Array.isArray(at.who)) return at.who.includes(mid);
                    return at.who===mid||at.who==="all"||(at.who==="kids"&&(mid==="bart"||mid==="lisa"));
                  });
                  const kDone = mTasks.filter(at => doneTasks[mid]?.[todayKey]?.[at.id]==="done").length;
                  const kPend = mTasks.filter(at => doneTasks[mid]?.[todayKey]?.[at.id]==="pending").length;
                  const isExpanded = expandedKid === mid;
                  return(
                    <Card key={mid} style={{marginBottom:12,borderLeft:`4px solid ${m.color}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:isExpanded&&mTasks.length>0?10:0}}>
                        <MAv size={36}/>
                        <div style={{flex:1}}>
                          <p style={{fontSize:14,fontWeight:900,color:"#1A1A2E",margin:0}}>{m.name}</p>
                          <button onClick={()=>setExpandedKid(isExpanded?null:mid)} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"inherit"}}>
                            <p style={{fontSize:11,color:m.color,margin:"2px 0 0",fontWeight:800,textDecoration:"underline"}}>
                              {kDone}/{mTasks.length} splnených {kPend>0?`· 🕐 ${kPend} čaká`:""} {isExpanded?"▲":"▼"}
                            </p>
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        mTasks.length===0
                          ? <p style={{color:"#ccc",fontSize:12,margin:0,textAlign:"center",padding:"8px 0"}}>Žiadne úlohy</p>
                          : <div style={{display:"flex",flexDirection:"column",gap:6}}>
                              {mTasks.map(at=>{
                                const st = doneTasks[mid]?.[todayKey]?.[at.id];
                                return(
                                  <div key={at.id} style={{display:"flex",alignItems:"center",gap:8,background: st==="done"?"#F1F8E9":st==="pending"?"#FFF8E1":"#f8f8f8",borderRadius:12,padding:"8px 10px",border:`1.5px solid ${st==="done"?"#A5D6A7":st==="pending"?"#FFE082":"transparent"}`}}>
                                    <span style={{fontSize:16,flexShrink:0}}>{at.icon}</span>
                                    <div style={{flex:1,minWidth:0}}>
                                      <p style={{fontSize:12,fontWeight:700,color:"#1A1A2E",margin:"0 0 2px",wordBreak:"break-word",textDecoration:st==="done"?"line-through":"none"}}>{at.name}</p>
                                      <p style={{fontSize:10,color:"#bbb",margin:0}}>{daysLabel(at.days)}</p>
                                    </div>
                                    <span style={{fontSize:10,fontWeight:800,color:st==="done"?"#66BB6A":st==="pending"?"#FF9800":"#bbb",flexShrink:0}}>
                                      {st==="done"?"✅":st==="pending"?"🕐":"○"}
                                    </span>
                                    <span style={{background:`${m.color}18`,color:m.color,borderRadius:7,padding:"1px 7px",fontSize:11,fontWeight:800,flexShrink:0}}>+{at.pts}b</span>
                                    <button onClick={()=>removeAt(at.id)} style={{background:"#FFF3F3",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:12,flexShrink:0}}>🗑️</button>
                                  </div>
                                );
                              })}
                            </div>
                      )}
                    </Card>
                  );
                })}
              </>
            ) : (
              <>
                {/* Sezóna filter */}
                <div style={{marginBottom:10}}>
                  <SegmentControl value={sf} onChange={v=>{setSf(v);setCf(null);}} options={[
                    {id:"school",label:"🎒 Školský",color:"#1A237E"},
                    {id:"holiday",label:"🌞 Prázdniny",color:"#E65100"},
                    {id:"always",label:"📋 Vždy",color:"#555"},
                  ]}/>
                </div>

                {/* Kategória filter */}
                <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4,scrollbarWidth:"none"}}>
                  <button onClick={()=>setCf(null)} style={{flexShrink:0,padding:"5px 12px",borderRadius:14,border:"none",fontFamily:"inherit",fontSize:11,fontWeight:800,cursor:"pointer",background:!cf?member.color:"white",color:!cf?"white":"#888",whiteSpace:"nowrap"}}>Všetky</button>
                  {allCats.map(c=>(
                    <button key={c} onClick={()=>setCf(c)} style={{flexShrink:0,padding:"5px 12px",borderRadius:14,border:"none",fontFamily:"inherit",fontSize:11,fontWeight:800,cursor:"pointer",background:cf===c?member.color:"white",color:cf===c?"white":"#888",whiteSpace:"nowrap"}}>{c}</button>
                  ))}
                </div>

                {/* + Vlastná úloha */}
                <button onClick={()=>setShowAdd(p=>!p)} style={{width:"100%",padding:"12px",borderRadius:16,border:`1.5px dashed ${member.color}66`,background:"transparent",color:member.color,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:12}}>
                  + Pridať vlastnú úlohu
                </button>
                {showAdd && (
                  <Card style={{marginBottom:12,border:`2px solid ${member.color}44`}}>
                    <p style={{fontWeight:900,fontSize:14,margin:"0 0 12px",color:member.color}}>➕ Nová vlastná úloha</p>
                    <div style={{display:"grid",gridTemplateColumns:"50px 1fr",gap:8,marginBottom:8}}>
                      <input style={{...iS,textAlign:"center",fontSize:22}} value={newTask.icon} onChange={e=>setNewTask(p=>({...p,icon:e.target.value}))} placeholder="🏠"/>
                      <input style={iS} value={newTask.name} onChange={e=>setNewTask(p=>({...p,name:e.target.value}))} placeholder="Názov úlohy..."/>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                      <div><p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 3px"}}>BODY</p><input style={iS} type="number" min={1} max={30} value={newTask.pts} onChange={e=>setNewTask(p=>({...p,pts:Number(e.target.value)}))}/></div>
                      <div><p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 3px"}}>SEZÓNA</p>
                        <select style={sS} value={newTask.season} onChange={e=>setNewTask(p=>({...p,season:e.target.value}))}>
                          <option value="always">Vždy</option>
                          <option value="school">Školský rok</option>
                          <option value="holiday">Prázdniny</option>
                        </select>
                      </div>
                    </div>
                    <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>KOMU</p>
                    <div style={{marginBottom:10}}>
                      <WhoPicker value={newTask.who} onChange={v=>setNewTask(p=>({...p,who:v}))} color={member.color}/>
                    </div>
                    <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>DNI</p>
                    <div style={{marginBottom:10}}>
                      <DaysPicker value={newTask.days} onChange={v=>setNewTask(p=>({...p,days:v}))} color={member.color}/>
                    </div>
                    <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>TYP</p>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:12}}>
                      {TYPE_OPTIONS.map(({id,l,c})=><button key={id} onClick={()=>setNewTask(p=>({...p,type:id}))} style={{padding:"7px 4px",borderRadius:8,border:`2px solid ${newTask.type===id?c:"#eee"}`,background:newTask.type===id?`${c}15`:"white",fontWeight:800,fontSize:10,cursor:"pointer",fontFamily:"inherit",color:newTask.type===id?c:"#888"}}>{l}</button>)}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <Btn onClick={addCustom} color={member.color} style={{flex:1}}>Pridať ✓</Btn>
                      <Btn onClick={()=>setShowAdd(false)} color="#eee" style={{color:"#888"}}>Zrušiť</Btn>
                    </div>
                  </Card>
                )}

                {/* AKTÍVNE */}
                {filteredActive.length>0 && (
                  <div style={{marginBottom:16}}>
                    <Sect>✅ Aktívne — pridelené ({filteredActive.length})</Sect>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {filteredActive.map((at,idx,arr)=>{
                        const [tbg,tc,tlabel]=typeStyle(at.type);
                        return(
                          editAt?.id===at.id ? (
                            <Card key={at.id} style={{border:`2px solid ${member.color}44`}}>
                              <p style={{fontWeight:900,fontSize:13,margin:"0 0 10px",color:member.color}}>✏️ Editovať</p>
                              <div style={{display:"grid",gridTemplateColumns:"48px 1fr",gap:8,marginBottom:8}}>
                                <input style={{...iS,textAlign:"center",fontSize:20}} value={editAt.icon} onChange={e=>setEditAt(p=>({...p,icon:e.target.value}))}/>
                                <input style={iS} value={editAt.name} onChange={e=>setEditAt(p=>({...p,name:e.target.value}))}/>
                              </div>
                              <input style={{...iS,marginBottom:8}} type="number" value={editAt.pts} onChange={e=>setEditAt(p=>({...p,pts:Number(e.target.value)}))} placeholder="Body"/>
                              <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>KOMU</p>
                              <div style={{marginBottom:10}}>
                                <WhoPicker value={editAt.who} onChange={v=>setEditAt(p=>({...p,who:v}))} color={member.color}/>
                              </div>
                              <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>DNI</p>
                              <div style={{marginBottom:10}}>
                                <DaysPicker value={editAt.days} onChange={v=>setEditAt(p=>({...p,days:v}))} color={member.color}/>
                              </div>
                              <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 6px"}}>TYP</p>
                              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:12}}>
                                {TYPE_OPTIONS.map(({id,l,c})=><button key={id} onClick={()=>setEditAt(p=>({...p,type:id}))} style={{padding:"7px 4px",borderRadius:8,border:`2px solid ${editAt.type===id?c:"#eee"}`,background:editAt.type===id?`${c}15`:"white",fontWeight:800,fontSize:10,cursor:"pointer",fontFamily:"inherit",color:editAt.type===id?c:"#888"}}>{l}</button>)}
                              </div>
                              <div style={{display:"flex",gap:8}}>
                                <Btn onClick={()=>{setActiveTasks(prev=>prev.map(x=>x.id===editAt.id?editAt:x));setEditAt(null);showToast("💾 Uložené!",member.color);}} color={member.color} style={{flex:1,padding:"10px 0",fontSize:13}}>Uložiť ✓</Btn>
                                <Btn onClick={()=>setEditAt(null)} color="#eee" style={{padding:"10px 14px",fontSize:13,color:"#888"}}>Zrušiť</Btn>
                              </div>
                            </Card>
                          ) : (
                            <Card key={at.id} style={{borderLeft:`4px solid ${tc}`,padding:"10px 12px"}}>
                              <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                                <span style={{fontSize:18,flexShrink:0,marginTop:2}}>{at.icon}</span>
                                <div style={{flex:1,minWidth:0}}>
                                  <p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:"0 0 4px",wordBreak:"break-word"}}>{at.name}</p>
                                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                                    <span style={{background:"#f0f0f0",color:"#666",borderRadius:7,padding:"1px 6px",fontSize:10,fontWeight:700}}>{whoLabel(Array.isArray(at.who)?at.who.join(", "):at.who)}</span>
                                    <span style={{background:`${member.color}18`,color:member.color,borderRadius:7,padding:"1px 6px",fontSize:11,fontWeight:800}}>+{at.pts}b</span>
                                    <span style={{background:tbg,color:tc,borderRadius:7,padding:"1px 6px",fontSize:10,fontWeight:800}}>{tlabel}</span>
                                    <span style={{fontSize:10,color:"#bbb"}}>{daysLabel(at.days)}</span>
                                  </div>
                                </div>
                              </div>
                              <div style={{display:"flex",gap:5}}>
                                <button onClick={()=>setEditAt({...at})} style={{flex:1,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:11,cursor:"pointer",fontWeight:700,color:"#555"}}>✏️ Edit</button>
                                <button onClick={()=>copyAt(at)} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:14,cursor:"pointer"}}>📋</button>
                                <button onClick={()=>moveAt(at.id,-1)} disabled={idx===0} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:14,cursor:idx===0?"default":"pointer",opacity:idx===0?0.3:1}}>⬆️</button>
                                <button onClick={()=>moveAt(at.id,1)} disabled={idx===arr.length-1} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:14,cursor:idx===arr.length-1?"default":"pointer",opacity:idx===arr.length-1?0.3:1}}>⬇️</button>
                                <button onClick={()=>removeAt(at.id)} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"#FFF3F3",fontSize:14,cursor:"pointer"}}>🗑️</button>
                              </div>
                            </Card>
                          )
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DOSTUPNÉ z knižnice */}
                <div>
                  <Sect>➕ Dostupné — klikni pre pridelenie</Sect>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {filteredLib.filter(t=>!activeIds.has(t.id)).length===0
                      ? <p style={{color:"#bbb",fontSize:13,textAlign:"center",padding:"16px 0"}}>Všetky úlohy tejto kategórie sú aktívne ✅</p>
                      : filteredLib.filter(t=>!activeIds.has(t.id)).map(task=>(
                          <div key={task.id} style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.6)",borderRadius:14,padding:"10px 12px",opacity:0.7,border:"1.5px dashed #ddd"}}>
                            <span style={{fontSize:16,flexShrink:0}}>{task.icon}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <p style={{fontSize:12,fontWeight:700,color:"#888",margin:"0 0 2px",wordBreak:"break-word"}}>{task.name}</p>
                              <p style={{fontSize:10,color:"#bbb",margin:0}}>{task.cat} · +{task.pts}b</p>
                            </div>
                            <button onClick={()=>{setAssignTask(task);setAssignForm({who:"kids",days:"every",type:"mandatory"});}} style={{flexShrink:0,padding:"6px 12px",borderRadius:12,border:`1.5px solid ${member.color}44`,background:`${member.color}12`,color:member.color,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>➕ Prideliť</button>
                          </div>
                        ))
                    }
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── OBCHOD ── */}
        {tab==="shop" && <AdminShop member={member} shopItems={shopItems} setShopItems={setShopItems} showToast={showToast}/>}

        {/* ── ODMENY ── */}
        {tab==="rewards" && (
          <>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
              {rewards.map(r=>(
                <Card key={r.id} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24,flexShrink:0}}>{r.emoji}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px",wordBreak:"break-word"}}>{r.name}</p>
                    <p style={{fontSize:11,color:"#888",margin:0}}>Pre: {r.who} · ⭐ {r.points}b</p>
                  </div>
                  <button onClick={()=>setRewards(p=>p.filter(x=>x.id!==r.id))} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"#FFF3F3",fontSize:13,cursor:"pointer",flexShrink:0}}>🗑️</button>
                </Card>
              ))}
            </div>
            <button onClick={()=>{const name=prompt("Názov odmeny:");if(!name)return;const pts=Number(prompt("Počet bodov:"));const emoji=prompt("Emoji:");setRewards(p=>[...p,{id:`r_${Date.now()}`,name,emoji:emoji||"🎁",points:pts||50,who:"Všetci",active:true}]);showToast("✅ Odmena pridaná!",member.color);}} style={{width:"100%",padding:"12px",borderRadius:16,border:`1.5px dashed ${member.color}66`,background:"transparent",color:member.color,fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>+ Pridať odmenu</button>
          </>
        )}

        {/* ── BODY ── */}
        {tab==="points" && (
          <>
            <Card style={{marginBottom:14,border:"2px solid #FF525444"}}>
              <p style={{fontWeight:900,fontSize:14,color:"#1A1A2E",margin:"0 0 8px"}}>🔄 Reset bodov</p>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>setConfirmReset("week")} color="#FF9800" style={{flex:1,fontSize:12}}>🔄 Týždenné</Btn>
                <Btn onClick={()=>setConfirmReset("all")}  color="#FF5252" style={{flex:1,fontSize:12}}>⚠️ Všetky</Btn>
              </div>
            </Card>
            <Sect>Upraviť body jednotlivo</Sect>
            {members.map(m=>{
              const MAv=AVTS[m.id];
              return(
                <Card key={m.id} style={{marginBottom:10,borderLeft:`3px solid ${m.color}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <MAv size={40}/>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,fontWeight:900,color:"#1A1A2E",margin:0}}>{m.name}</p>
                      <p style={{fontSize:12,color:"#888",margin:"2px 0 0"}}>Týždeň: <b style={{color:m.color}}>{m.weekPts||0}b</b> · Celkovo: <b style={{color:m.color}}>{m.totalPts||0}b</b></p>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <input type="number" min={1} placeholder="Body..." value={adjPts[m.id]||""} onChange={e=>setAdjPts(p=>({...p,[m.id]:e.target.value}))} style={{...iS,flex:1,margin:0}}/>
                    <Btn onClick={()=>{const v=Number(adjPts[m.id]);if(!v||v<=0)return;setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:(x.weekPts||0)+v,totalPts:(x.totalPts||0)+v}:x));setAdjPts(p=>({...p,[m.id]:""}));showToast(`+${v}b pre ${m.name}!`,"#66BB6A");}} color="#66BB6A" style={{padding:"10px 14px",fontSize:13}}>➕</Btn>
                    <Btn onClick={()=>{const v=Number(adjPts[m.id]);if(!v||v<=0)return;setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:Math.max(0,(x.weekPts||0)-v),totalPts:Math.max(0,(x.totalPts||0)-v)}:x));setAdjPts(p=>({...p,[m.id]:""}));showToast(`-${v}b pre ${m.name}`,"#FF5252");}} color="#FF5252" style={{padding:"10px 14px",fontSize:13}}>➖</Btn>
                    <Btn onClick={()=>{setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:0,totalPts:0}:x));showToast(`Reset pre ${m.name}`,"#FF9800");}} color="#FF9800" style={{padding:"10px 10px",fontSize:12}}>0</Btn>
                  </div>
                </Card>
              );
            })}
          </>
        )}

        {/* ── SEZÓNY ── */}
        {tab==="seasons" && (
          <>
            <Sect>Prepni režim pre celú rodinu</Sect>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {seasons.map(s=>{
                const ia=s.active;
                const colors=s.id==="school"?{bg:"#1A237E",acc:"#5C6BC0"}:{bg:"#E65100",acc:"#FF9800"};
                return(
                  <button key={s.id} onClick={()=>{setSeasons(prev=>prev.map(x=>({...x,active:x.id===s.id})));showToast(`${s.emoji} ${s.name} aktivovaný!`,colors.acc);}} style={{padding:"20px 12px",borderRadius:24,border:`3px solid ${ia?colors.acc:"#eee"}`,background:ia?`linear-gradient(135deg,${colors.bg},${colors.acc})`:"white",cursor:"pointer",fontFamily:"inherit",transition:"all 0.25s",boxShadow:ia?`0 8px 24px ${colors.acc}55`:"0 2px 8px rgba(0,0,0,0.06)",textAlign:"center"}}>
                    <p style={{fontSize:44,margin:"0 0 8px"}}>{s.emoji}</p>
                    <p style={{fontSize:15,fontWeight:900,color:ia?"white":"#1A1A2E",margin:"0 0 4px"}}>{s.name}</p>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:ia?"rgba(255,255,255,0.2)":"#f0f0f0",borderRadius:20,padding:"4px 12px"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:ia?"#69F0AE":"#bbb"}}/>
                      <span style={{fontSize:11,fontWeight:800,color:ia?"white":"#aaa"}}>{ia?"AKTÍVNY":"vypnutý"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <Card style={{background:`linear-gradient(135deg,${DARK},#2C2C54)`}}>
              <p style={{color:YELLOW,fontSize:14,fontWeight:900,margin:"0 0 6px"}}>🔄 Reset denných úloh</p>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,margin:"0 0 12px"}}>Automaticky každý deň o 23:00.</p>
              <Btn onClick={()=>showToast("🔄 Resetované!",YELLOW)} color="rgba(255,217,15,0.15)" style={{width:"100%",border:"1px solid rgba(255,217,15,0.3)",color:YELLOW,fontSize:13}}>🔄 Resetovať teraz</Btn>
            </Card>
          </>
        )}
      </div>

      {/* ASSIGN DIALOG */}
      {assignTask && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto"}}>
            <p style={{fontSize:28,textAlign:"center",margin:"0 0 4px"}}>{assignTask.icon}</p>
            <h3 style={{textAlign:"center",fontSize:16,fontWeight:900,color:"#1A1A2E",margin:"0 0 16px",wordBreak:"break-word"}}>{assignTask.name}</h3>
            <p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 8px"}}>KOMU</p>
            <div style={{marginBottom:14}}>
              <WhoPicker value={assignForm.who} onChange={v=>setAssignForm(p=>({...p,who:v}))} color={member.color}/>
            </div>
            <p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 8px"}}>DNI</p>
            <div style={{marginBottom:14}}>
              <DaysPicker value={assignForm.days} onChange={v=>setAssignForm(p=>({...p,days:v}))} color={member.color}/>
            </div>
            <p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 8px"}}>TYP ÚLOHY</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:20}}>
              {TYPE_OPTIONS.map(({id,l,c})=><button key={id} onClick={()=>setAssignForm(p=>({...p,type:id}))} style={{padding:"9px 4px",borderRadius:10,border:`2px solid ${assignForm.type===id?c:"#eee"}`,background:assignForm.type===id?`${c}15`:"white",fontWeight:800,fontSize:10,cursor:"pointer",fontFamily:"inherit",color:assignForm.type===id?c:"#888"}}>{l}</button>)}
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setAssignTask(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={()=>assignFn(assignTask)} color={member.color} style={{flex:2}}>Prideliť ✓</Btn>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET */}
      {confirmReset && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <p style={{fontSize:44,textAlign:"center",margin:"0 0 8px"}}>⚠️</p>
            <h3 style={{textAlign:"center",fontSize:18,fontWeight:900,color:"#1A1A2E",margin:"0 0 8px"}}>{confirmReset==="week"?"Reset týždenných bodov?":"Reset VŠETKÝCH bodov?"}</h3>
            <p style={{textAlign:"center",color:"#aaa",fontSize:13,margin:"0 0 20px"}}>{confirmReset==="week"?"Týždenné body sa vynulujú. Celkové ostanú.":"Všetky body sa vynulujú pre celú rodinu!"}</p>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setConfirmReset(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={()=>{if(confirmReset==="week")setMembers(prev=>prev.map(m=>({...m,weekPts:0})));else setMembers(prev=>prev.map(m=>({...m,weekPts:0,totalPts:0})));setConfirmReset(null);showToast("🔄 Body resetované!",confirmReset==="week"?"#FF9800":"#FF5252");}} color={confirmReset==="week"?"#FF9800":"#FF5252"} style={{flex:2}}>✓ Potvrdiť</Btn>
            </div>
          </div>
        </div>
      )}

      {/* APPROVE */}
      {approveItem && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <p style={{fontSize:36,textAlign:"center",margin:"0 0 6px"}}>{approveItem.emoji}</p>
            <h3 style={{textAlign:"center",fontSize:16,fontWeight:900,color:"#1A1A2E",margin:"0 0 16px",wordBreak:"break-word"}}>{approveItem.text}</h3>
            <input style={{...iS,fontSize:18,fontWeight:900,textAlign:"center",marginBottom:16}} type="number" value={approvePts} onChange={e=>setApprovePts(e.target.value)} placeholder="Body"/>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setApproveItem(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={()=>{setProposals(p=>p.map(x=>x.id===approveItem.id?{...x,status:"approved",points:approvePts?Number(approvePts):x.points}:x));setApproveItem(null);showToast("✅ Schválené!","#66BB6A");}} color="#66BB6A" style={{flex:2}}>✅ Schváliť</Btn>
            </div>
          </div>
        </div>
      )}

      {/* REJECT */}
      {rejectId && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <h3 style={{fontSize:18,fontWeight:900,color:"#1A1A2E",margin:"0 0 6px"}}>❌ Zamietnuť návrh</h3>
            <input style={{...iS,marginBottom:16}} value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Dôvod..." autoFocus/>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setRejectId(null)} color="#eee" style={{flex:1,color:"#888"}}>Späť</Btn>
              <Btn onClick={()=>{setProposals(p=>p.map(x=>x.id===rejectId?{...x,status:"rejected",adminNote:rejectNote}:x));setRejectId(null);showToast("❌ Zamietnuté","#FF5252");}} color="#FF5252" style={{flex:2}}>❌ Zamietnuť</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}