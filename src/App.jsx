import { useState, useEffect, useCallback, useRef } from "react";

import { SelectPlayer, PinLogin } from "./components/SelectPlayer.jsx";
import { Dashboard, AdminDash }   from "./components/Dashboard.jsx";
import { Leaderboard, Rewards, Chat, Profile } from "./components/Screens.jsx";
import { Shop, Inventory, AdminShop, SHOP_ITEMS } from "./components/Inventory.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { Toast }  from "./components/UI.jsx";
import { fbSave, fbLoad, fbListen } from "./firebase.js";

import {
  YELLOW, DARK, BG,
  INIT_MEMBERS, INIT_ACTIVE, INIT_REWARDS, INIT_SEASONS, INIT_CHAT, INIT_PROPOSALS,
} from "./data.js";

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

  const showToast = useCallback((m, c = "#1A1A2E") => {
    setToast({ m, c });
    setTimeout(() => setToast(null), 2600);
  }, []);

  const fbReady = useRef(false);

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
          if (fbReady.current) setter(val);
        });
      });
    };

    init();
  }, []);

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

    const pendingVerifyCount = isAdmin
      ? members.filter(m => m.role !== "admin").reduce((t,m) =>
          t + Object.values(doneTasks[m.id]?.[todayKey] || {}).filter(v => v === "pending").length, 0)
      : 0;
    const chatUnread  = chat.filter(m => m.unread && m.from !== activeMember.id).length;
    const privUnread  = privateChat.filter(m => m.unread && m.from !== activeMember.id).length;
    const totalUnread = chatUnread + privUnread;

    const NAV = [
      { icon:"🏠", label:"Domov"    },
      { icon:"🏆", label:"Rebríček" },
      { icon:"🛍️", label:"Obchod"   },
      { icon:"🎒", label:"Inventár" },
      { icon:"💬", label:"Chat",    badge: totalUnread },
      { icon:"👤", label:"Profil"   },
      ...(isAdmin ? [{ icon:"⚙️", label:"Admin", badge: pendingVerifyCount }] : []),
      { icon:"🚪", label:"Odísť", action: logout },
    ];

    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
        <style>{globalCSS}</style>

        <div className="shell" style={{ background:BG, fontFamily:"'Nunito',sans-serif", paddingBottom:82, minHeight:"100vh" }}>
          <div style={{ overflowY:"auto" }}>
            {navTab === 0 && (isAdmin
              ? <AdminDash member={activeMember} members={members} activeTasks={activeTasks} doneTasks={doneTasks} seasons={seasons}/>
              : <Dashboard member={activeMember} members={members} activeTasks={activeTasks} setActiveTasks={updateActiveTasks} doneTasks={doneTasks} setDoneTasks={updateDoneTasks} setMembers={updateMembers} setChat={updateChat} seasons={seasons} showToast={showToast}/>
            )}
            {navTab === 1 && <Leaderboard member={activeMember} members={members}/>}
            {navTab === 2 && <Shop member={activeMember} members={members} setMembers={updateMembers} shopItems={shopItems} setShopItems={updateShopItems} showToast={showToast}/>}
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

          <div style={{
            position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
            width:"100%", maxWidth:480,
            background:"white", borderTop:"1px solid #eee",
            display:"flex", padding:"8px 0",
            paddingBottom:"max(10px,env(safe-area-inset-bottom))",
            boxShadow:"0 -4px 24px rgba(0,0,0,0.08)", zIndex:50
          }}>
            {NAV.map((t, i) => (
              <button key={i} onClick={() => t.action ? t.action() : setNavTab(i)} style={{
                flex:1, background:"none", border:"none",
                display:"flex", flexDirection:"column",
                alignItems:"center", gap:2,
                cursor:"pointer", padding:"4px 0",
                minHeight:44, position:"relative"
              }}>
                <span style={{ fontSize:18 }}>{t.icon}</span>
                {t.badge > 0 && (
                  <span style={{
                    position:"absolute", top:0, right:"calc(50% - 16px)",
                    background:"#FF5252", color:"white", borderRadius:"50%",
                    width:15, height:15, fontSize:8, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>{t.badge}</span>
                )}
                <span style={{
                  fontSize:8,
                  color: !t.action && navTab===i ? color : "#bbb",
                  fontWeight: !t.action && navTab===i ? 900 : 400,
                  fontFamily:"inherit"
                }}>{t.label}</span>
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