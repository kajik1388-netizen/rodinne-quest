import { useState, useEffect, useCallback, useRef } from "react";

import { SelectPlayer, PinLogin } from "./components/SelectPlayer.jsx";
import { Dashboard, AdminDash }   from "./components/Dashboard.jsx";
import { Leaderboard, Chat, Profile } from "./components/Screens.jsx";
import { Shop, Inventory, AdminShop, SHOP_ITEMS } from "./components/Inventory.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { Toast }  from "./components/UI.jsx";
import { fbSave, fbLoad, fbListen } from "./firebase.js";

import {
  YELLOW, DARK, BG,
  INIT_MEMBERS, INIT_ACTIVE, INIT_REWARDS, INIT_SEASONS, INIT_CHAT, INIT_PROPOSALS,
  taskForMember,
} from "./data.js";

function ShopAndRewards({ member, members, setMembers, shopItems, setShopItems, rewards, proposals, setProposals, showToast }) {
  const [tab, setTab] = useState("shop");
  const [propText, setPropText] = useState("");
  const [propEmoji, setPropEmoji] = useState("🎁");
  const [showProp, setShowProp] = useState(false);
  const [useDialog, setUseDialog] = useState(null); // proposal ktorú chce použiť
  const [useDate, setUseDate] = useState("");

  const myProposals = proposals.filter(p => p.from === member.name && p.type === "reward");
  const approvedProposals = myProposals.filter(p => p.status === "approved");

  // Minimálny dátum = dnes
  const today = new Date().toISOString().split("T")[0];

  const requestUse = () => {
    if (!useDialog || !useDate) return;
    setProposals(prev => prev.map(p => p.id === useDialog.id ? {
      ...p,
      status: "use_pending",
      useDate: useDate,
      useRequestedAt: Date.now()
    } : p));
    setUseDialog(null);
    setUseDate("");
    showToast("📨 Žiadosť o odmenu odoslaná!", member.color);
  };

  return (
    <div>
      <div style={{ display:"flex", background:"#f5f5f5", padding:"10px 16px 0" }}>
        {[{ id:"shop", l:"🛍️ Obchod" },{ id:"rewards", l:"🎁 Odmeny" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:"10px 0", border:"none", fontFamily:"inherit", fontSize:13, fontWeight:800, cursor:"pointer", background:"transparent", color:tab===t.id?member.color:"#bbb", borderBottom:`3px solid ${tab===t.id?member.color:"transparent"}`, transition:"all 0.2s" }}>{t.l}</button>
        ))}
      </div>

      {tab === "shop" && <Shop member={member} members={members} setMembers={setMembers} shopItems={shopItems} setShopItems={setShopItems} showToast={showToast}/>}

      {tab === "rewards" && (
        <div>
          <div style={{ background:`linear-gradient(135deg,#1A1A2E,#2C1654)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
            <h2 style={{ color:YELLOW, fontSize:20, margin:"0 0 4px", fontWeight:900 }}>🎁 Odmeny</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.name} · ⭐ {member.totalPts||0}b</p>
          </div>
          <div style={{ padding:"14px 16px" }}>

            {/* Schválené návrhy — možnosť použiť */}
            {approvedProposals.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:900, color:"#2E7D32", margin:"0 0 10px" }}>✅ SCHVÁLENÉ ODMENY</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {approvedProposals.map(p => (
                    <div key={p.id} style={{ background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", border:`2px solid ${p.status==="use_pending"?"#FF9800":p.status==="used"?"#bbb":"#66BB6A44"}` }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:28 }}>{p.emoji}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:800, color:p.status==="used"?"#bbb":"#1A1A2E", margin:"0 0 2px", textDecoration:p.status==="used"?"line-through":"none" }}>{p.text}</p>
                          <p style={{ fontSize:11, color:member.color, fontWeight:700, margin:0 }}>⭐ {p.points||0}b</p>
                          {p.status==="use_pending" && (
                            <p style={{ fontSize:11, color:"#FF9800", fontWeight:700, margin:"2px 0 0" }}>⏳ Čaká na schválenie · {p.useDate}</p>
                          )}
                          {p.status==="use_approved" && (
                            <p style={{ fontSize:11, color:"#66BB6A", fontWeight:700, margin:"2px 0 0" }}>✅ Schválené na {p.useDate}</p>
                          )}
                          {p.adminNote && p.status==="use_pending" && (
                            <p style={{ fontSize:11, color:"#FF7043", fontStyle:"italic", margin:"2px 0 0" }}>💬 „{p.adminNote}"</p>
                          )}
                          {p.status==="used" && (
                            <p style={{ fontSize:11, color:"#bbb", margin:"2px 0 0" }}>✓ Použité {p.usedAt}</p>
                          )}
                        </div>
                        {p.status==="approved" && (
                          <button onClick={() => { setUseDialog(p); setUseDate(today); }} style={{ background:member.color, border:"none", borderRadius:12, padding:"8px 14px", color:"white", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
                            🎁 Použiť
                          </button>
                        )}
                        {p.status==="use_approved" && (
                          <span style={{ background:"#E8F5E9", color:"#2E7D32", borderRadius:10, padding:"4px 10px", fontSize:11, fontWeight:800, flexShrink:0 }}>✅</span>
                        )}
                        {p.status==="used" && (
                          <span style={{ background:"#f0f0f0", color:"#bbb", borderRadius:10, padding:"4px 10px", fontSize:11, fontWeight:800, flexShrink:0 }}>✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dostupné odmeny od admina */}
            {rewards.filter(r => r.active && (r.who==="Všetci"||r.who.includes(member.name))).length > 0 && (
              <div style={{ marginBottom:16 }}>
                <p style={{ fontSize:12, fontWeight:900, color:"#888", margin:"0 0 10px" }}>DOSTUPNÉ ODMENY</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {rewards.filter(r => r.active && (r.who==="Všetci"||r.who.includes(member.name))).map(r => (
                    <div key={r.id} style={{ background:"white", borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                      <span style={{ fontSize:28 }}>{r.emoji}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:14, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px" }}>{r.name}</p>
                        <p style={{ fontSize:12, color:member.color, fontWeight:700, margin:0 }}>⭐ {r.points}b</p>
                      </div>
                      {r.addedAt && Date.now()-r.addedAt < 48*60*60*1000 && (
                        <span style={{ background:"#FF5252", color:"white", borderRadius:8, padding:"2px 8px", fontSize:10, fontWeight:900 }}>NOVÉ</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navrhnúť odmenu */}
            <div style={{ background:`${member.color}12`, border:`1.5px dashed ${member.color}66`, borderRadius:18, padding:"14px 16px", marginBottom:16 }}>
              <p style={{ color:member.color, fontSize:13, fontWeight:900, margin:"0 0 8px" }}>💡 Navrhnúť vlastnú odmenu</p>
              {showProp ? (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <div style={{ display:"flex", gap:8 }}>
                    <input value={propEmoji} onChange={e=>setPropEmoji(e.target.value)} style={{ width:52, height:44, borderRadius:12, border:"1.5px solid #eee", textAlign:"center", fontSize:22, fontFamily:"inherit" }}/>
                    <input value={propText} onChange={e=>setPropText(e.target.value)} placeholder="Napr. Výlet do ZOO..." style={{ flex:1, height:44, borderRadius:12, border:"1.5px solid #eee", padding:"0 12px", fontFamily:"inherit", fontSize:13 }} autoFocus/>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={() => { if(!propText.trim())return; setProposals(p=>[...p,{ id:`prop_${Date.now()}`, from:member.name, fromColor:member.color, emoji:propEmoji, text:propText, type:"reward", status:"pending", date:new Date().toLocaleDateString("sk") }]); setPropText(""); setPropEmoji("🎁"); setShowProp(false); showToast("💡 Návrh odoslaný rodičom!", member.color); }} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", background:member.color, color:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Odoslať 📨</button>
                    <button onClick={() => setShowProp(false)} style={{ padding:"10px 16px", borderRadius:12, border:"1px solid #eee", background:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:"#888" }}>Zrušiť</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowProp(true)} style={{ width:"100%", padding:"10px 0", borderRadius:12, border:"none", background:member.color, color:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>+ Navrhnúť odmenu</button>
              )}
            </div>

            {/* Čakajúce a zamietnuté návrhy */}
            {myProposals.filter(p => p.status==="pending"||p.status==="rejected").length > 0 && (
              <div>
                <p style={{ fontSize:12, fontWeight:900, color:"#888", margin:"0 0 10px" }}>MOJE NÁVRHY</p>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {myProposals.filter(p => p.status==="pending"||p.status==="rejected").map(p => (
                    <div key={p.id} style={{ background:"white", borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
                      <span style={{ fontSize:24 }}>{p.emoji}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:13, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px" }}>{p.text}</p>
                        <p style={{ fontSize:11, color:"#aaa", margin:0 }}>{p.date}</p>
                        {p.adminNote && <p style={{ fontSize:11, color:"#FF7043", fontStyle:"italic", margin:"2px 0 0" }}>„{p.adminNote}"</p>}
                      </div>
                      <span style={{ borderRadius:10, padding:"4px 10px", fontSize:11, fontWeight:800, background:p.status==="rejected"?"#FFF3F3":"#FFF3CD", color:p.status==="rejected"?"#FF5252":"#F57F17" }}>
                        {p.status==="rejected"?"❌ Zamietnuté":"⏳ Čaká"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog — vybrať dátum použitia */}
      {useDialog && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:40, textAlign:"center", margin:"0 0 8px" }}>{useDialog.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{useDialog.text}</h3>
            <p style={{ textAlign:"center", color:member.color, fontSize:14, fontWeight:800, margin:"0 0 16px" }}>⭐ {useDialog.points||0}b</p>
            <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 6px" }}>KEDY CHCEŠ ODMENU POUŽIŤ?</p>
            <input type="date" min={today} value={useDate} onChange={e=>setUseDate(e.target.value)} style={{ width:"100%", padding:"12px", borderRadius:12, border:"1.5px solid #eee", fontFamily:"inherit", fontSize:15, marginBottom:16, boxSizing:"border-box" }}/>
            <p style={{ fontSize:11, color:"#aaa", margin:"0 0 16px", textAlign:"center" }}>Rodič schváli alebo navrhne iný termín</p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => { setUseDialog(null); setUseDate(""); }} style={{ flex:1, padding:"12px", borderRadius:14, border:"1px solid #eee", background:"white", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit", color:"#888" }}>Zrušiť</button>
              <button onClick={requestUse} disabled={!useDate} style={{ flex:2, padding:"12px", borderRadius:14, border:"none", background:useDate?member.color:"#eee", color:useDate?"white":"#bbb", fontWeight:800, fontSize:13, cursor:useDate?"pointer":"default", fontFamily:"inherit" }}>📨 Odoslať žiadosť</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [screen,   setScreen]   = useState("select");
  const [selected, setSelected] = useState(null);
  const [member,   setMember]   = useState(null);
  const [navTab,   setNavTab]   = useState(0);
  const [loaded,   setLoaded]   = useState(false);

  const [members,     setMembers]     = useState(INIT_MEMBERS);
  const [activeTasks, setActiveTasks] = useState(INIT_ACTIVE);
  const [rewards,     setRewards]     = useState(INIT_REWARDS);
  const [seasons,     setSeasons]     = useState(INIT_SEASONS);
  const [doneTasks,   setDoneTasks]   = useState({});
  const [chat,        setChat]        = useState(INIT_CHAT);
  const [privateChat, setPrivateChat] = useState([]);
  const [proposals,   setProposals]   = useState(INIT_PROPOSALS);
  const [shopItems,   setShopItems]   = useState(SHOP_ITEMS);
  const [toast,       setToast]       = useState(null);

  const memberRef      = useRef(null);
  const activeTasksRef = useRef([]);
  const rewardsRef     = useRef([]);
  const fbReady        = useRef(false);

  const showToast = useCallback((m, c = "#1A1A2E") => {
    setToast({ m, c });
    setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    const init = async () => {
      const keys = [
        ["members",     setMembers,     INIT_MEMBERS],
        ["activeTasks", setActiveTasks, INIT_ACTIVE],
        ["rewards",     setRewards,     INIT_REWARDS],
        ["seasons",     setSeasons,     INIT_SEASONS],
        ["doneTasks",   setDoneTasks,   {}],
        ["chat",        setChat,        INIT_CHAT],
        ["privateChat", setPrivateChat, []],
        ["proposals",   setProposals,   INIT_PROPOSALS],
        ["shopItems",   setShopItems,   SHOP_ITEMS],
      ];

      await Promise.all(keys.map(async ([key, setter, def]) => {
        const val = await fbLoad(key);
        if (val !== null) setter(val);
        else await fbSave(key, def);
      }));

      fbReady.current = true;
      setLoaded(true);

      keys.forEach(([key, setter]) => {
        fbListen(key, (val) => {
          if (!fbReady.current) return;
          const currentMember = memberRef.current;
          if (currentMember && currentMember.role !== "admin") {
            if (key === "activeTasks" && Array.isArray(val)) {
              const prev = activeTasksRef.current || [];
              const newTasks = val.filter(at => {
                if (!at.addedAt) return false;
                if (Date.now() - at.addedAt > 5 * 60 * 1000) return false;
                if (!taskForMember(at, currentMember.id, "school") && !taskForMember(at, currentMember.id, "holiday")) return false;
                return !prev.find(p => p.id === at.id);
              });
              if (newTasks.length > 0) showToast(`🆕 Nová úloha: "${newTasks[0].name}"!`, "#4A90D9");
              activeTasksRef.current = val;
            }
            if (key === "rewards" && Array.isArray(val)) {
              const prev = rewardsRef.current || [];
              const newRewards = val.filter(r => {
                if (!r.addedAt) return false;
                if (Date.now() - r.addedAt > 5 * 60 * 1000) return false;
                return !prev.find(p => p.id === r.id);
              });
              if (newRewards.length > 0) showToast(`🎁 Nová odmena: "${newRewards[0].name}"!`, "#9C27B0");
              rewardsRef.current = val;
            }
            // Notifikácia keď admin schváli použitie odmeny
            if (key === "proposals" && Array.isArray(val)) {
              const prev = (proposals || []);
              val.forEach(p => {
                if (p.from === currentMember.name && p.status === "use_approved") {
                  const old = prev.find(x => x.id === p.id);
                  if (old && old.status !== "use_approved") {
                    showToast(`🎉 Odmena "${p.text}" schválená na ${p.useDate}!`, "#66BB6A");
                  }
                }
              });
            }
          }
          setter(val);
        });
      });
    };
    init();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const checkReset = () => {
      const now = new Date();
      const todayStr = now.toDateString();
      const lastReset = localStorage.getItem("lastDailyReset");
      if (now.getHours() === 23 && now.getMinutes() >= 50 && lastReset !== todayStr) {
        localStorage.setItem("lastDailyReset", todayStr);
        setDoneTasks(prev => {
          const nd = { ...prev };
          Object.keys(nd).forEach(memberId => {
            if (nd[memberId][todayStr]) {
              const dayDone = { ...nd[memberId][todayStr] };
              Object.keys(dayDone).forEach(taskId => {
                if (dayDone[taskId] === "pending") delete dayDone[taskId];
              });
              nd[memberId][todayStr] = dayDone;
            }
          });
          if (fbReady.current) fbSave("doneTasks", nd);
          return nd;
        });
        showToast("🔄 Denné úlohy resetované!", YELLOW);
      }
    };
    checkReset();
    const interval = setInterval(checkReset, 60 * 1000);
    return () => clearInterval(interval);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const todayStr  = new Date().toDateString();
    const yesterStr = new Date(Date.now() - 86400000).toDateString();
    const streakKey = `streakChecked_${todayStr}`;
    if (localStorage.getItem(streakKey)) return;
    setMembers(prev => {
      const updated = prev.map(m => {
        if (m.role === "admin") return m;
        const todayDone  = doneTasks[m.id]?.[todayStr]  || {};
        const yesterDone = doneTasks[m.id]?.[yesterStr] || {};
        const didToday     = Object.values(todayDone).some(v => v === "done");
        const didYesterday = Object.values(yesterDone).some(v => v === "done");
        let streak = m.streak || 0;
        if (didToday) {
          if (didYesterday || streak === 0) streak = (m.streak || 0) + 1;
        } else {
          if (new Date().getHours() >= 23 && !didToday) streak = 0;
        }
        return { ...m, streak };
      });
      if (fbReady.current) fbSave("members", updated);
      return updated;
    });
    localStorage.setItem(streakKey, "1");
  }, [loaded, doneTasks]);

  const updateMembers     = useCallback((v) => { const val = typeof v === "function" ? v(members)     : v; setMembers(val);     if (fbReady.current) fbSave("members",     val); }, [members]);
  const updateActiveTasks = useCallback((v) => { const val = typeof v === "function" ? v(activeTasks) : v; setActiveTasks(val); if (fbReady.current) fbSave("activeTasks", val); }, [activeTasks]);
  const updateRewards     = useCallback((v) => { const val = typeof v === "function" ? v(rewards)     : v; setRewards(val);     if (fbReady.current) fbSave("rewards",     val); }, [rewards]);
  const updateSeasons     = useCallback((v) => { const val = typeof v === "function" ? v(seasons)     : v; setSeasons(val);     if (fbReady.current) fbSave("seasons",     val); }, [seasons]);
  const updateDoneTasks   = useCallback((v) => { const val = typeof v === "function" ? v(doneTasks)   : v; setDoneTasks(val);   if (fbReady.current) fbSave("doneTasks",   val); }, [doneTasks]);
  const updateChat        = useCallback((v) => { const val = typeof v === "function" ? v(chat)        : v; setChat(val);        if (fbReady.current) fbSave("chat",        val); }, [chat]);
  const updatePrivateChat = useCallback((v) => { const val = typeof v === "function" ? v(privateChat) : v; setPrivateChat(val); if (fbReady.current) fbSave("privateChat", val); }, [privateChat]);
  const updateProposals   = useCallback((v) => { const val = typeof v === "function" ? v(proposals)   : v; setProposals(val);   if (fbReady.current) fbSave("proposals",   val); }, [proposals]);
  const updateShopItems   = useCallback((v) => { const val = typeof v === "function" ? v(shopItems)   : v; setShopItems(val);   if (fbReady.current) fbSave("shopItems",   val); }, [shopItems]);

  const logout = () => { setMember(null); setSelected(null); setScreen("select"); setNavTab(0); };
  const activeMember = member ? (members.find(m => m.id === member.id) || member) : null;

  const globalCSS = `
    * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    body { margin:0; background:${BG}; font-family:'Nunito',sans-serif; }
    ::-webkit-scrollbar { display:none; }
    @keyframes fu { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-12px)} 30%{transform:translateX(12px)} 45%{transform:translateX(-9px)} 60%{transform:translateX(9px)} 75%{transform:translateX(-5px)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @media(min-width:480px) { .shell { max-width:480px; margin:0 auto; box-shadow:0 0 60px rgba(0,0,0,0.15); } }
  `;

  if (!loaded) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{globalCSS}</style>
      <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${DARK},#16213E)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20 }}>
        <div style={{ fontSize:60 }}>🏠</div>
        <p style={{ color:YELLOW, fontSize:24, fontWeight:900, margin:0 }}>Rodinné Quest</p>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:14, margin:0 }}>Načítavam dáta...</p>
        <div style={{ width:40, height:40, border:`3px solid rgba(255,255,255,0.2)`, borderTop:`3px solid ${YELLOW}`, borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
      </div>
    </>
  );

  if (screen === "select") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{globalCSS}</style>
      <SelectPlayer members={members} onSelect={m => { setSelected(m); setScreen("pin"); }}/>
    </>
  );

  if (screen === "pin") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{globalCSS}</style>
      <PinLogin member={selected} onSuccess={m => { setMember(m); setScreen("app"); }} onBack={() => setScreen("select")}/>
    </>
  );

  if (screen === "app" && activeMember) {
    const color   = activeMember.color;
    const isAdmin = activeMember.role === "admin";
    const todayKey = new Date().toDateString();
    const isSchool = seasons.find(s => s.id === "school")?.active;
    const seasonId = isSchool ? "school" : "holiday";

    memberRef.current      = activeMember;
    activeTasksRef.current = activeTasks;
    rewardsRef.current     = rewards;

    const pendingVerifyCount = isAdmin
      ? members.filter(m => m.role !== "admin").reduce((t,m) =>
          t + Object.values(doneTasks[m.id]?.[todayKey] || {}).filter(v => v === "pending").length, 0)
      : 0;
    const chatUnread  = chat.filter(m => m.unread && m.from !== activeMember.id).length;
    const privUnread  = privateChat.filter(m => m.unread && m.from !== activeMember.id).length;
    const totalUnread = chatUnread + privUnread;

    const shopNewCount = shopItems.filter(i => {
      if (!i.id.startsWith("custom_")) return false;
      const ts = Number(i.id.replace("custom_", ""));
      return Date.now() - ts < 48 * 60 * 60 * 1000;
    }).length;

    const newRewardsCount = !isAdmin ? rewards.filter(r => {
      if (!r.addedAt) return false;
      const seen = localStorage.getItem(`seenReward_${r.id}_${activeMember.id}`);
      return !seen && Date.now() - r.addedAt < 48 * 60 * 60 * 1000;
    }).length : 0;

    const newTasksCount = !isAdmin ? activeTasks.filter(at => {
      if (!at.addedAt) return false;
      if (!taskForMember(at, activeMember.id, seasonId)) return false;
      const seen = localStorage.getItem(`seenTask_${at.id}_${activeMember.id}`);
      return !seen && Date.now() - at.addedAt < 24 * 60 * 60 * 1000;
    }).length : 0;

    if (navTab === 0 && !isAdmin) {
      activeTasks.forEach(at => {
        if (at.addedAt && taskForMember(at, activeMember.id, seasonId)) {
          localStorage.setItem(`seenTask_${at.id}_${activeMember.id}`, "1");
        }
      });
    }
    if (navTab === 2 && !isAdmin) {
      rewards.forEach(r => {
        if (r.addedAt) localStorage.setItem(`seenReward_${r.id}_${activeMember.id}`, "1");
      });
    }

    const rewardProposalCount = isAdmin
      ? proposals.filter(p => p.type === "reward" && (p.status === "pending" || p.status === "use_pending")).length
      : 0;

    const NAV = isAdmin ? [
      { icon:"🏠", label:"Domov" },
      { icon:"🏆", label:"Rebríček" },
      { icon:"🛍️", label:"Obchod", badge: shopNewCount },
      { icon:"🎒", label:"Inventár" },
      { icon:"💬", label:"Chat", badge: totalUnread },
      { icon:"👤", label:"Profil" },
      { icon:"⚙️", label:"Admin", badge: pendingVerifyCount + rewardProposalCount },
      { icon:"🚪", label:"Odísť", action: logout },
    ] : [
      { icon:"🏠", label:"Domov", badge: newTasksCount },
      { icon:"🏆", label:"Rebríček" },
      { icon:"🛍️", label:"Obchod", badge: shopNewCount + newRewardsCount },
      { icon:"🎒", label:"Inventár" },
      { icon:"💬", label:"Chat", badge: totalUnread },
      { icon:"👤", label:"Profil" },
      { icon:"🚪", label:"Odísť", action: logout },
    ];

    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
        <style>{globalCSS}</style>
        <div className="shell" style={{ background:BG, fontFamily:"'Nunito',sans-serif", paddingBottom:82, minHeight:"100vh" }}>
          <div style={{ overflowY:"auto" }}>
            {navTab === 0 && (isAdmin
              ? <AdminDash member={activeMember} members={members} activeTasks={activeTasks} doneTasks={doneTasks} seasons={seasons} setMembers={updateMembers} setActiveTasks={updateActiveTasks} setDoneTasks={updateDoneTasks} proposals={proposals} setProposals={updateProposals} showToast={showToast}/>
              : <Dashboard member={activeMember} members={members} activeTasks={activeTasks} setActiveTasks={updateActiveTasks} doneTasks={doneTasks} setDoneTasks={updateDoneTasks} setMembers={updateMembers} setChat={updateChat} seasons={seasons} showToast={showToast}/>
            )}
            {navTab === 1 && <Leaderboard member={activeMember} members={members}/>}
            {navTab === 2 && (isAdmin
              ? <Shop member={activeMember} members={members} setMembers={updateMembers} shopItems={shopItems} setShopItems={updateShopItems} showToast={showToast}/>
              : <ShopAndRewards member={activeMember} members={members} setMembers={updateMembers} shopItems={shopItems} setShopItems={updateShopItems} rewards={rewards} proposals={proposals} setProposals={updateProposals} showToast={showToast}/>
            )}
            {navTab === 3 && <Inventory member={activeMember} members={members} setMembers={updateMembers} showToast={showToast}/>}
            {navTab === 4 && <Chat member={activeMember} chat={chat} setChat={updateChat} privateChat={privateChat} setPrivateChat={updatePrivateChat} members={members} activeTasks={activeTasks} setActiveTasks={updateActiveTasks} showToast={showToast}/>}
            {navTab === 5 && <Profile member={activeMember} members={members} setMembers={updateMembers} showToast={showToast}/>}
            {navTab === 6 && isAdmin && (
              <AdminPanel
                member={activeMember} members={members} setMembers={updateMembers}
                activeTasks={activeTasks} setActiveTasks={updateActiveTasks}
                rewards={rewards} setRewards={updateRewards}
                proposals={proposals} setProposals={updateProposals}
                seasons={seasons} setSeasons={updateSeasons}
                doneTasks={doneTasks} setDoneTasks={updateDoneTasks}
                shopItems={shopItems} setShopItems={updateShopItems}
                showToast={showToast}
              />
            )}
          </div>
          <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"white", borderTop:"1px solid #eee", display:"flex", padding:"8px 0", paddingBottom:"max(10px,env(safe-area-inset-bottom))", boxShadow:"0 -4px 24px rgba(0,0,0,0.08)", zIndex:50 }}>
            {NAV.map((t, i) => (
              <button key={i} onClick={() => t.action ? t.action() : setNavTab(i)} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", gap:2, cursor:"pointer", padding:"4px 0", minHeight:44, position:"relative" }}>
                <span style={{ fontSize:18 }}>{t.icon}</span>
                {t.badge > 0 && (
                  <span style={{ position:"absolute", top:0, right:"calc(50% - 16px)", background:"#FF5252", color:"white", borderRadius:"50%", width:15, height:15, fontSize:8, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{t.badge}</span>
                )}
                <span style={{ fontSize:8, color:!t.action && navTab===i ? color : "#bbb", fontWeight:!t.action && navTab===i ? 900 : 400, fontFamily:"inherit" }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Toast t={toast}/>
      </>
    );
  }

  return null;
}