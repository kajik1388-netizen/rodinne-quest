import { useState, useEffect, useCallback } from "react";

import { SelectPlayer, PinLogin } from "./components/SelectPlayer.jsx";
import { Dashboard, AdminDash }   from "./components/Dashboard.jsx";
import { Leaderboard, Rewards, Chat, Profile } from "./components/Screens.jsx";
import { Shop, Inventory, AdminShop, SHOP_ITEMS } from "./components/Inventory.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import { Toast }  from "./components/UI.jsx";

import {
  YELLOW, DARK, BG,
  save, load,
  INIT_MEMBERS, INIT_ACTIVE, INIT_REWARDS, INIT_SEASONS, INIT_CHAT, INIT_PROPOSALS,
} from "./data.js";

export default function App() {
  const [screen,   setScreen]   = useState("select");
  const [selected, setSelected] = useState(null);
  const [member,   setMember]   = useState(null);
  const [navTab,   setNavTab]   = useState(0);

  const [members,      setMembers]      = useState(() => load("rq_members",   INIT_MEMBERS));
  const [activeTasks,  setActiveTasks]  = useState(() => load("rq_active",    INIT_ACTIVE));
  const [rewards,      setRewards]      = useState(() => load("rq_rewards",   INIT_REWARDS));
  const [seasons,      setSeasons]      = useState(() => load("rq_seasons",   INIT_SEASONS));
  const [doneTasks,    setDoneTasks]    = useState(() => load("rq_done",      {}));
  const [chat,         setChat]         = useState(() => load("rq_chat",      INIT_CHAT));
  const [privateChat,  setPrivateChat]  = useState(() => load("rq_private",   []));
  const [proposals,    setProposals]    = useState(() => load("rq_proposals", INIT_PROPOSALS));
  const [shopItems,    setShopItems]    = useState(() => load("rq_shop",      SHOP_ITEMS));
  const [toast,        setToast]        = useState(null);

  const showToast = useCallback((m, c = "#1A1A2E") => {
    setToast({ m, c });
    setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => save("rq_members",   members),     [members]);
  useEffect(() => save("rq_active",    activeTasks),  [activeTasks]);
  useEffect(() => save("rq_rewards",   rewards),      [rewards]);
  useEffect(() => save("rq_seasons",   seasons),      [seasons]);
  useEffect(() => save("rq_done",      doneTasks),    [doneTasks]);
  useEffect(() => save("rq_chat",      chat),         [chat]);
  useEffect(() => save("rq_private",   privateChat),  [privateChat]);
  useEffect(() => save("rq_proposals", proposals),    [proposals]);
  useEffect(() => save("rq_shop",      shopItems),    [shopItems]);

  const logout = () => { setMember(null); setSelected(null); setScreen("select"); setNavTab(0); };
  const activeMember = member ? (members.find(m => m.id === member.id) || member) : null;

  const globalCSS = `
    * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    body { margin:0; background:${BG}; font-family:'Nunito',sans-serif; }
    ::-webkit-scrollbar { display:none; }
    @keyframes fu { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-12px)} 30%{transform:translateX(12px)} 45%{transform:translateX(-9px)} 60%{transform:translateX(9px)} 75%{transform:translateX(-5px)} }
    @media(min-width:480px) { .shell { max-width:480px; margin:0 auto; box-shadow:0 0 60px rgba(0,0,0,0.15); } }
  `;

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
              : <Dashboard member={activeMember} members={members} activeTasks={activeTasks} setActiveTasks={setActiveTasks} doneTasks={doneTasks} setDoneTasks={setDoneTasks} setMembers={setMembers} setChat={setChat} seasons={seasons} showToast={showToast}/>
            )}
            {navTab === 1 && <Leaderboard member={activeMember} members={members}/>}
            {navTab === 2 && <Shop member={activeMember} members={members} setMembers={setMembers} shopItems={shopItems} setShopItems={setShopItems} showToast={showToast}/>}
            {navTab === 3 && <Inventory member={activeMember} members={members} setMembers={setMembers} showToast={showToast}/>}
            {navTab === 4 && <Chat member={activeMember} chat={chat} setChat={setChat} privateChat={privateChat} setPrivateChat={setPrivateChat} members={members} activeTasks={activeTasks} setActiveTasks={setActiveTasks} showToast={showToast}/>}
            {navTab === 5 && <Profile member={activeMember} members={members} setMembers={setMembers} showToast={showToast}/>}
            {navTab === 6 && isAdmin && (
              <AdminPanel
                member={activeMember} members={members} setMembers={setMembers}
                activeTasks={activeTasks} setActiveTasks={setActiveTasks}
                rewards={rewards} setRewards={setRewards}
                proposals={proposals} setProposals={setProposals}
                seasons={seasons} setSeasons={setSeasons}
                doneTasks={doneTasks} setDoneTasks={setDoneTasks}
                shopItems={shopItems} setShopItems={setShopItems}
                showToast={showToast}
              />
            )}
          </div>

          {/* BOTTOM NAV */}
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

export default function App() {
  const [screen,   setScreen]   = useState("select");
  const [selected, setSelected] = useState(null);
  const [member,   setMember]   = useState(null);
  const [navTab,   setNavTab]   = useState(0);

  // ── Globálny stav ────────────────────────────────────
  const [members,      setMembers]      = useState(() => load("rq_members",   INIT_MEMBERS));
  const [activeTasks,  setActiveTasks]  = useState(() => load("rq_active",    INIT_ACTIVE));
  const [rewards,      setRewards]      = useState(() => load("rq_rewards",   INIT_REWARDS));
  const [seasons,      setSeasons]      = useState(() => load("rq_seasons",   INIT_SEASONS));
  const [doneTasks,    setDoneTasks]    = useState(() => load("rq_done",      {}));
  const [chat,         setChat]         = useState(() => load("rq_chat",      INIT_CHAT));
  const [privateChat,  setPrivateChat]  = useState(() => load("rq_private",   []));
  const [proposals,    setProposals]    = useState(() => load("rq_proposals", INIT_PROPOSALS));
  const [toast,        setToast]        = useState(null);

  const showToast = useCallback((m, c = "#1A1A2E") => {
    setToast({ m, c });
    setTimeout(() => setToast(null), 2600);
  }, []);

  // ── Ukladanie ────────────────────────────────────────
  useEffect(() => save("rq_members",   members),     [members]);
  useEffect(() => save("rq_active",    activeTasks),  [activeTasks]);
  useEffect(() => save("rq_rewards",   rewards),      [rewards]);
  useEffect(() => save("rq_seasons",   seasons),      [seasons]);
  useEffect(() => save("rq_done",      doneTasks),    [doneTasks]);
  useEffect(() => save("rq_chat",      chat),         [chat]);
  useEffect(() => save("rq_private",   privateChat),  [privateChat]);
  useEffect(() => save("rq_proposals", proposals),    [proposals]);

  const logout = () => { setMember(null); setSelected(null); setScreen("select"); setNavTab(0); };

  // Vždy čítaj aktuálneho člena zo state (lebo sa môžu zmeniť body/farby)
  const activeMember = member ? (members.find(m => m.id === member.id) || member) : null;

  // ── CSS globálny štýl ─────────────────────────────
  const globalCSS = `
    * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
    body { margin:0; background:${BG}; font-family:'Nunito',sans-serif; }
    ::-webkit-scrollbar { display:none; }
    @keyframes fu { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 15%{transform:translateX(-12px)} 30%{transform:translateX(12px)} 45%{transform:translateX(-9px)} 60%{transform:translateX(9px)} 75%{transform:translateX(-5px)} }
    @media(min-width:480px) { .shell { max-width:480px; margin:0 auto; box-shadow:0 0 60px rgba(0,0,0,0.15); } }
  `;

  // ── SELECT PLAYER ────────────────────────────────────
  if (screen === "select") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{globalCSS}</style>
      <SelectPlayer members={members} onSelect={m => { setSelected(m); setScreen("pin"); }}/>
    </>
  );

  // ── PIN ──────────────────────────────────────────────
  if (screen === "pin") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{globalCSS}</style>
      <PinLogin
        member={selected}
        onSuccess={m => { setMember(m); setScreen("app"); }}
        onBack={() => setScreen("select")}
      />
    </>
  );

  // ── HLAVNÁ APPKA ─────────────────────────────────────
  if (screen === "app" && activeMember) {
    const color   = activeMember.color;
    const isAdmin = activeMember.role === "admin";
    const todayKey = new Date().toDateString();

    // Badgey
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
      { icon:"🛍️", label:"Odmeny"   },
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
          {/* Obsah */}
          <div style={{ overflowY:"auto" }}>
            {navTab === 0 && (isAdmin
              ? <AdminDash member={activeMember} members={members} activeTasks={activeTasks} doneTasks={doneTasks} seasons={seasons}/>
              : <Dashboard member={activeMember} activeTasks={activeTasks} doneTasks={doneTasks} setDoneTasks={setDoneTasks} setMembers={setMembers} setChat={setChat} seasons={seasons} showToast={showToast}/>
            )}
            {navTab === 1 && <Leaderboard member={activeMember} members={members}/>}
            {navTab === 2 && <Rewards member={activeMember} rewards={rewards} proposals={proposals} setProposals={setProposals} showToast={showToast}/>}
            {navTab === 3 && <Chat member={activeMember} chat={chat} setChat={setChat} privateChat={privateChat} setPrivateChat={setPrivateChat} members={members} showToast={showToast}/>}
            {navTab === 4 && <Profile member={activeMember} members={members} setMembers={setMembers} showToast={showToast}/>}
            {navTab === 5 && isAdmin && (
              <AdminPanel
                member={activeMember} members={members} setMembers={setMembers}
                activeTasks={activeTasks} setActiveTasks={setActiveTasks}
                rewards={rewards} setRewards={setRewards}
                proposals={proposals} setProposals={setProposals}
                seasons={seasons} setSeasons={setSeasons}
                doneTasks={doneTasks} setDoneTasks={setDoneTasks}
                showToast={showToast}
              />
            )}
          </div>

          {/* BOTTOM NAV */}
          <div style={{
            position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
            width:"100%", maxWidth:480,
            background:"white", borderTop:"1px solid #eee",
            display:"flex", padding:"8px 0",
            paddingBottom:"max(10px,env(safe-area-inset-bottom))",
            boxShadow:"0 -4px 24px rgba(0,0,0,0.08)", zIndex:50
          }}>
            {NAV.map((t, i) => (
              <button
                key={i}
                onClick={() => t.action ? t.action() : setNavTab(i)}
                style={{
                  flex:1, background:"none", border:"none",
                  display:"flex", flexDirection:"column",
                  alignItems:"center", gap:2,
                  cursor:"pointer", padding:"4px 0",
                  minHeight:44, position:"relative"
                }}
              >
                <span style={{ fontSize:20 }}>{t.icon}</span>
                {t.badge > 0 && (
                  <span style={{
                    position:"absolute", top:0, right:"calc(50% - 18px)",
                    background:"#FF5252", color:"white", borderRadius:"50%",
                    width:16, height:16, fontSize:9, fontWeight:900,
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>{t.badge}</span>
                )}
                <span style={{
                  fontSize:9,
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
