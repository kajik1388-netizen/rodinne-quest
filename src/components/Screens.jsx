import { useState, useEffect, useRef } from "react";
import { AVTS } from "./Avatars.jsx";
import { Card, Sect, Btn, iS, sS } from "./UI.jsx";
import { YELLOW, DARK, DARK2, LEVELS, LPTS, getLvl, getLvlPct, ACHIEVEMENTS } from "../data.js";

export function Leaderboard({ member, members }) {
  const [view, setView] = useState("week");
  const sorted = [...members].sort((a,b) =>
    view==="week" ? (b.weekPts||0)-(a.weekPts||0) : (b.totalPts||0)-(a.totalPts||0)
  );
  const medals = ["🥇","🥈","🥉"];
  const motivations = {
    homer:"D'oh! Homer, ešte nie si porazený 🍩",
    marge:"Marge drží krok! Skvelá práca 💙",
    bart:"Bart, daj do toho! 💪",
    lisa:"Lisa je na vrchole! 👑"
  };

  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ display:"flex", background:"rgba(0,0,0,0.06)", borderRadius:14, padding:3, marginBottom:16 }}>
        {[{v:"week",l:"📅 Tento týždeň"},{v:"total",l:"🏆 Celkovo"}].map(({v,l})=>(
          <button key={v} onClick={()=>setView(v)} style={{ flex:1, padding:"8px 0", borderRadius:11, border:"none", fontFamily:"inherit", fontSize:13, fontWeight:800, cursor:"pointer", background:view===v?"white":"transparent", color:view===v?"#1A1A2E":"#999", boxShadow:view===v?"0 2px 8px rgba(0,0,0,0.1)":"none", transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ background:`linear-gradient(135deg,${DARK},#2C2C54)`, borderRadius:24, padding:"20px 12px 16px", marginBottom:12 }}>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:11, fontWeight:800, textAlign:"center", margin:"0 0 16px", letterSpacing:1 }}>{view==="week"?"TENTO TÝŽDEŇ":"CELKOVO"}</p>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:8 }}>
          {[1,0,2].map(pos => {
            const m=sorted[pos]; if(!m) return null;
            const Av=AVTS[m.id]; const isF=pos===0;
            return (
              <div key={m.id} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:isF?1.2:1 }}>
                <div style={{ position:"relative" }}>
                  {isF && <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", fontSize:22 }}>👑</div>}
                  <Av size={isF?70:54}/>
                </div>
                <div style={{ background:isF?`${m.color}33`:"rgba(255,255,255,0.08)", border:`2px solid ${isF?m.color+"66":"rgba(255,255,255,0.1)"}`, borderRadius:14, padding:"8px 6px", marginTop:6, width:"100%", textAlign:"center" }}>
                  <p style={{ color:["#FFD700","#C0C0C0","#CD7F32"][pos], fontSize:isF?20:16, margin:"0 0 2px" }}>{medals[pos]}</p>
                  <p style={{ color:"white", fontSize:isF?14:12, fontWeight:900, margin:"0 0 2px" }}>{m.name}</p>
                  <p style={{ color:YELLOW, fontSize:isF?17:13, fontWeight:900, margin:0 }}>{view==="week"?(m.weekPts||0):(m.totalPts||0)}b</p>
                  <p style={{ color:"rgba(255,255,255,0.4)", fontSize:9, margin:"2px 0 0" }}>🔥 {m.streak}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {sorted[3] && (() => { const m=sorted[3]; const Av=AVTS[m.id]; return (
        <Card style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, border:m.id===member.id?`2px solid ${m.color}`:"2px solid transparent" }}>
          <span style={{ fontSize:18, color:"#aaa", fontWeight:900, minWidth:20 }}>4.</span>
          <Av size={46}/>
          <div style={{ flex:1 }}><p style={{ fontSize:14, fontWeight:900, color:"#1A1A2E", margin:0 }}>{m.name}</p><p style={{ fontSize:11, color:"#aaa", margin:"2px 0 0" }}>🔥 {m.streak} dní</p></div>
          <span style={{ color:m.color, fontSize:15, fontWeight:900 }}>{view==="week"?(m.weekPts||0):(m.totalPts||0)}b</span>
        </Card>
      ); })()}
      <div style={{ background:`${member.color}12`, border:`1.5px solid ${member.color}44`, borderRadius:16, padding:"12px 16px", textAlign:"center" }}>
        <p style={{ color:member.color, fontSize:14, fontWeight:800, margin:0 }}>{motivations[member.id]||"Skvelá práca! 💪"}</p>
      </div>
    </div>
  );
}

export function Rewards({ member, rewards, proposals, setProposals, showToast }) {
  const [confirm, setConfirm] = useState(null);
  const [pending, setPending] = useState([]);
  const [propText, setPropText] = useState("");
  const [showProp, setShowProp] = useState(false);
  const [tab, setTab] = useState("shop");
  const pts = member.totalPts || 0;
  const myRewards = rewards.filter(r => r.active && (r.who==="Všetci"||r.who.includes(member.name)));

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${DARK},#2C1654)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <h2 style={{ color:YELLOW, fontSize:20, margin:"0 0 4px", fontWeight:900 }}>🛍️ Odmeny</h2>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.name}</p>
          <div style={{ background:`${member.color}22`, border:`1.5px solid ${member.color}66`, borderRadius:20, padding:"6px 16px", display:"flex", gap:6, alignItems:"center" }}>
            <span>⭐</span><span style={{ color:YELLOW, fontSize:20, fontWeight:900 }}>{pts}</span><span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>b</span>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, padding:"14px 16px 0" }}>
        {[{id:"shop",l:"🎁 Odmeny"},{id:"pending",l:`📬 Čaká${pending.length>0?` (${pending.length})`:""}`}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer", background:tab===t.id?member.color:"white", color:tab===t.id?"white":"#888", boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)", transition:"all 0.2s" }}>{t.l}</button>
        ))}
      </div>
      <div style={{ padding:"14px 16px" }}>
        {tab==="shop" && (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
              {myRewards.map(r => {
                const ok=pts>=r.points;
                return (
                  <div key={r.id} style={{ background:"white", borderRadius:18, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", opacity:ok?1:0.6 }}>
                    <span style={{ fontSize:28, flexShrink:0 }}>{r.emoji}</span>
                    <div style={{ flex:1, minWidth:0 }}><p style={{ fontSize:14, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px", wordBreak:"break-word" }}>{r.name}</p><p style={{ fontSize:12, color:ok?member.color:"#bbb", fontWeight:700, margin:0 }}>⭐ {r.points}b</p></div>
                    <Btn onClick={()=>{ if(pts<r.points){showToast("❌ Málo bodov!","#FF5252");return;} setConfirm(r); }} color={ok?member.color:"#eee"} style={{ padding:"8px 14px", fontSize:12, color:ok?"white":"#ccc", flexShrink:0 }} disabled={!ok}>{ok?"Chcem!":"🔒"}</Btn>
                  </div>
                );
              })}
            </div>
            <div style={{ background:`${member.color}12`, border:`1.5px dashed ${member.color}66`, borderRadius:18, padding:"14px 16px" }}>
              <p style={{ color:member.color, fontSize:13, fontWeight:900, margin:"0 0 8px" }}>💡 Navrhnúť vlastnú odmenu</p>
              {showProp ? (
                <div style={{ display:"flex", gap:8 }}>
                  <input value={propText} onChange={e=>setPropText(e.target.value)} placeholder="Napr. Nové slúchadlá..." style={{ ...iS, flex:1, margin:0 }} autoFocus/>
                  <Btn onClick={()=>{ if(!propText.trim())return; setProposals(p=>[...p,{id:Date.now(),from:member.name,fromColor:member.color,emoji:"💡",text:propText,type:"reward",status:"pending",date:new Date().toLocaleDateString("sk")}]); setPropText(""); setShowProp(false); showToast("💡 Návrh odoslaný!",member.color); }} color={member.color} style={{ padding:"10px 14px", fontSize:12 }}>Odoslať</Btn>
                  <Btn onClick={()=>setShowProp(false)} color="#eee" style={{ padding:"10px 12px", fontSize:12, color:"#888" }}>✕</Btn>
                </div>
              ) : (
                <Btn onClick={()=>setShowProp(true)} color={member.color} style={{ width:"100%", fontSize:13 }}>+ Navrhnúť</Btn>
              )}
            </div>
          </>
        )}
        {tab==="pending" && (
          pending.length===0
            ? <Card style={{textAlign:"center",padding:32}}><p style={{fontSize:40,margin:"0 0 12px"}}>📬</p><p style={{color:"#aaa",fontSize:14,margin:0}}>Zatiaľ žiadne žiadosti</p></Card>
            : <div style={{display:"flex",flexDirection:"column",gap:10}}>{pending.map((r,i)=>(<Card key={i} style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:26}}>{r.emoji}</span><div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px",wordBreak:"break-word"}}>{r.name}</p><p style={{fontSize:11,color:"#aaa",margin:0}}>{r.date}</p></div><span style={{background:"#FFF3CD",color:"#F57F17",borderRadius:10,padding:"4px 10px",fontSize:11,fontWeight:800}}>⏳</span></Card>))}</div>
        )}
      </div>
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:44, textAlign:"center", margin:"0 0 8px" }}>{confirm.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px", wordBreak:"break-word" }}>{confirm.name}</h3>
            <p style={{ textAlign:"center", color:member.color, fontSize:16, fontWeight:800, margin:"0 0 8px" }}>⭐ {confirm.points} bodov</p>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:13, margin:"0 0 20px" }}>Žiadosť pôjde rodičom na schválenie.</p>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={()=>setConfirm(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={()=>{ setPending(p=>[...p,{...confirm,status:"pending",date:new Date().toLocaleDateString("sk")}]); setConfirm(null); showToast("📨 Odoslaná rodičom!",member.color); }} color={member.color} style={{ flex:2 }}>Odoslať ✓</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Chat({ member, chat, setChat, privateChat, setPrivateChat, members, activeTasks, setActiveTasks, showToast }) {
  const [chatTab, setChatTab] = useState("family");
  const [msg, setMsg] = useState("");
  const [showMention, setShowMention] = useState(false);
  const [showTrade, setShowTrade] = useState(false);
  const [tradeForm, setTradeForm] = useState({ taskId:"custom", customTask:"", offer:"body", offerAmt:5, to:"" });
  const [counterOffer, setCounterOffer] = useState(null);
  const [counterText, setCounterText]   = useState("");
  const messagesEndRef = useRef(null);

  const isKid  = member.role !== "admin";
  const isPriv = member.id==="bart" || member.id==="lisa";
  const MENTIONS = ["@Homer","@Marge","@Bart","@Lisa","@Všetci"];

  const myTasks = activeTasks.filter(at => {
    if (Array.isArray(at.who)) return at.who.includes(member.id);
    return at.who===member.id||at.who==="all"||(at.who==="kids"&&(member.id==="bart"||member.id==="lisa"));
  });

  const recipients = members.filter(m => m.id !== member.id);
  const currentChat = chatTab==="private" ? (privateChat||[]) : chat;
  const famUnread  = chat.filter(m => m.unread && m.from !== member.id).length;
  const privUnread = (privateChat||[]).filter(m => m.unread && m.from !== member.id).length;

  useEffect(() => {
    if (chatTab === "family") {
      setChat(prev => prev.map(m => m.from !== member.id ? {...m, unread:false} : m));
    } else {
      setPrivateChat(prev => (prev||[]).map(m => m.from !== member.id ? {...m, unread:false} : m));
    }
  }, [chatTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [currentChat.length]);

  const sendMsg = () => {
    if (!msg.trim()) return;
    const newMsg = { id:Date.now(), from:member.id, name:member.name, text:msg.trim(), time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), color:member.color, unread:true };
    if (chatTab==="private") setPrivateChat(p=>[...(p||[]),newMsg]);
    else setChat(p=>[...p,newMsg]);
    setMsg(""); setShowMention(false);
  };

  const sendTrade = () => {
    if (!tradeForm.to) return;
    const toM = members.find(m => m.id === tradeForm.to);
    const taskName = tradeForm.taskId === "custom"
      ? tradeForm.customTask
      : myTasks.find(t => t.id === tradeForm.taskId)?.name || tradeForm.customTask;
    if (!taskName?.trim()) return;
    const offerText = tradeForm.offer==="body" ? `${tradeForm.offerAmt} bodov 💰` : tradeForm.offer==="item" ? `predmet z inventára 🎁` : "zadarmo 😊";
    setChat(p => [...p, { id:Date.now(), from:"trade", name:"🤝 Pomoc", text:`🤝 ${member.name} žiada ${toM?.name} o pomoc: "${taskName}". Ponúkam: ${offerText}`, time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), color:"#FF9800", unread:true, trade:{ from:member.id, to:tradeForm.to, task:taskName, offer:tradeForm.offer, offerAmt:tradeForm.offerAmt, status:"pending", id:`tr_${Date.now()}` } }]);
    setShowTrade(false);
    setTradeForm({ taskId:"custom", customTask:"", offer:"body", offerAmt:5, to:"" });
    showToast(`🤝 Žiadosť odoslaná ${toM?.name}!`, "#FF9800");
  };

  const respondTrade = (chatMsg, accept, counter = false) => {
    if (counter) {
      setChat(p => [...p, { id:Date.now(), from:member.id, name:member.name, text:`💬 ${member.name} navrhuje iné podmienky: "${counterText}"`, time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}), color:member.color, unread:true }]);
      setChat(p => p.map(m => m.id===chatMsg.id ? {...m,trade:{...m.trade,status:"counter"}} : m));
      setCounterOffer(null); setCounterText(""); return;
    }
    setChat(p => p.map(m => m.id===chatMsg.id ? {...m, trade:{...m.trade,status:accept?"accepted":"declined"}, responseText:accept?`✅ ${member.name} prijal!`:`❌ ${member.name} odmietol`} : m));
    if (accept && chatMsg.taskId) {
      setActiveTasks(prev => prev.map(at => at.id!==chatMsg.taskId ? at : {...at, who:member.id, tradedFrom:members.find(m=>m.id===at.trade?.fromId)?.name||"", trade:{...at.trade,status:"accepted"}}));
      showToast("✅ Ponuka prijatá!", "#66BB6A");
    } else if (!accept) {
      setActiveTasks(prev => prev.map(at => at.id===chatMsg.taskId ? {...at,trade:{...at.trade,status:"declined"}} : at));
      showToast("❌ Ponuka odmietnutá", "#FF5252");
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 82px)" }}>
      <div style={{ background:`linear-gradient(135deg,${DARK},${DARK2})`, padding:"14px 20px 0", borderBottomLeftRadius:24, borderBottomRightRadius:24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <h2 style={{ color:YELLOW, fontSize:18, margin:0, fontWeight:900 }}>💬 Chat</h2>
          {isKid && (
            <button onClick={()=>setShowTrade(p=>!p)} style={{ background:"rgba(255,152,0,0.2)", border:"1.5px solid rgba(255,152,0,0.4)", borderRadius:12, padding:"6px 12px", color:"#FFB74D", fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"inherit" }}>🤝 Požiadať o pomoc</button>
          )}
        </div>
        <div style={{ display:"flex", gap:6, paddingBottom:12 }}>
          {[{id:"family",l:"👨‍👩‍👧 Rodinný",u:famUnread},...(isPriv?[{id:"private",l:"🔒 Bart & Lisa",u:privUnread}]:[])].map(t=>(
            <button key={t.id} onClick={()=>setChatTab(t.id)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer", background:chatTab===t.id?"white":"rgba(255,255,255,0.1)", color:chatTab===t.id?DARK:"rgba(255,255,255,0.7)", position:"relative", transition:"all 0.2s" }}>
              {t.l}
              {t.u>0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#FF5252", color:"white", borderRadius:"50%", width:16, height:16, fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{t.u}</span>}
            </button>
          ))}
        </div>
      </div>

      {showTrade && (
        <div style={{ background:"#FFF8E1", borderBottom:"1.5px solid #FFE082", padding:"14px 16px", maxHeight:"60vh", overflowY:"auto" }}>
          <p style={{ fontWeight:900, fontSize:13, color:"#E65100", margin:"0 0 12px" }}>🤝 Požiadaj o pomoc</p>
          <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 6px" }}>KOMU</p>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            {recipients.map(m => { const MAv=AVTS[m.id]; return (
              <button key={m.id} onClick={() => setTradeForm(p=>({...p,to:m.id}))} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 12px", borderRadius:14, border:`2px solid ${tradeForm.to===m.id?m.color:"#eee"}`, background:tradeForm.to===m.id?`${m.color}15`:"white", cursor:"pointer", fontFamily:"inherit" }}>
                <MAv size={36}/>
                <span style={{ fontSize:11, fontWeight:800, color:tradeForm.to===m.id?m.color:"#888" }}>{m.name}</span>
              </button>
            ); })}
          </div>
          <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 6px" }}>ÚLOHA</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:10 }}>
            {myTasks.map(t => (
              <button key={t.id} onClick={() => setTradeForm(p=>({...p,taskId:t.id,customTask:""}))} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:12, textAlign:"left", border:`2px solid ${tradeForm.taskId===t.id?"#FF9800":"#eee"}`, background:tradeForm.taskId===t.id?"#FFF8E1":"white", cursor:"pointer", fontFamily:"inherit" }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color:tradeForm.taskId===t.id?"#E65100":"#1A1A2E", flex:1 }}>{t.name}</span>
                {tradeForm.taskId===t.id && <span style={{ fontSize:14 }}>✓</span>}
              </button>
            ))}
            <button onClick={() => setTradeForm(p=>({...p,taskId:"custom"}))} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:12, textAlign:"left", border:`2px solid ${tradeForm.taskId==="custom"?"#FF9800":"#eee"}`, background:tradeForm.taskId==="custom"?"#FFF8E1":"white", cursor:"pointer", fontFamily:"inherit" }}>
              <span style={{ fontSize:16 }}>✏️</span>
              <span style={{ fontSize:12, fontWeight:700, color:tradeForm.taskId==="custom"?"#E65100":"#888" }}>Iné (napíšem)</span>
            </button>
          </div>
          {tradeForm.taskId==="custom" && (
            <input value={tradeForm.customTask} onChange={e=>setTradeForm(p=>({...p,customTask:e.target.value}))} placeholder="Popíš čo potrebuješ..." style={{ ...iS, marginBottom:10 }}/>
          )}
          <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 6px" }}>ČO PONÚKAM</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, marginBottom:8 }}>
            {[{id:"body",l:"💰 Body"},{id:"item",l:"🎁 Predmet"},{id:"free",l:"😊 Zadarmo"}].map(o=>(
              <button key={o.id} onClick={()=>setTradeForm(p=>({...p,offer:o.id}))} style={{ padding:"8px 4px", borderRadius:10, border:`2px solid ${tradeForm.offer===o.id?"#FF9800":"#eee"}`, background:tradeForm.offer===o.id?"#FFF8E1":"white", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", color:tradeForm.offer===o.id?"#E65100":"#888" }}>{o.l}</button>
            ))}
          </div>
          {tradeForm.offer==="body" && (
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
              {[3,5,10,15].map(n=><button key={n} onClick={()=>setTradeForm(p=>({...p,offerAmt:n}))} style={{ padding:"6px 12px", borderRadius:20, border:`2px solid ${tradeForm.offerAmt===n?"#FF9800":"#eee"}`, background:tradeForm.offerAmt===n?"#FFF8E1":"white", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", color:tradeForm.offerAmt===n?"#E65100":"#888" }}>{n}b</button>)}
              <input type="number" min={1} value={tradeForm.offerAmt} onChange={e=>setTradeForm(p=>({...p,offerAmt:Number(e.target.value)}))} style={{...iS,width:70,margin:0,textAlign:"center"}}/>
            </div>
          )}
          <div style={{ display:"flex", gap:8, marginTop:4 }}>
            <Btn onClick={sendTrade} color="#FF9800" style={{ flex:1, padding:"10px 0", fontSize:13 }} disabled={!tradeForm.to||(tradeForm.taskId==="custom"&&!tradeForm.customTask.trim())}>Odoslať 🤝</Btn>
            <Btn onClick={()=>setShowTrade(false)} color="#eee" style={{ color:"#888", padding:"10px 14px" }}>Zrušiť</Btn>
          </div>
        </div>
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:10 }}>
        {chatTab==="private" && (privateChat||[]).length===0 && (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <p style={{ fontSize:36, margin:"0 0 10px" }}>🔒</p>
            <p style={{ color:"#aaa", fontSize:14, fontWeight:700, margin:"0 0 4px" }}>Súkromný chat</p>
            <p style={{ color:"#ccc", fontSize:12, margin:0 }}>Len Bart a Lisa vidia tieto správy</p>
          </div>
        )}
        {currentChat.map(m => (
          <div key={m.id}>
            {m.from==="system" ? (
              <div style={{ textAlign:"center" }}>
                <span style={{ background:m.isExcuse?"#FFF3E088":"#9C27B018", color:m.isExcuse?"#E65100":"#9C27B0", borderRadius:12, padding:"4px 14px", fontSize:12, fontWeight:700 }}>{m.text}</span>
              </div>
            ) : m.from==="trade" ? (
              <div style={{ background:"#FFF3E0", border:"1.5px solid #FFE0B2", borderRadius:18, padding:"12px 14px" }}>
                <p style={{ fontSize:13, color:"#E65100", fontWeight:700, margin:"0 0 8px", lineHeight:1.4, wordBreak:"break-word" }}>{m.text}</p>
                {m.trade?.status==="pending" && m.trade?.to===member.id && (
                  <>
                    <div style={{ display:"flex", gap:8, marginBottom:counterOffer?.id===m.id?8:0 }}>
                      <Btn onClick={()=>respondTrade(m,true)}  color="#66BB6A" style={{flex:1,padding:"8px 0",fontSize:12}}>✅ Prijať</Btn>
                      <Btn onClick={()=>respondTrade(m,false)} color="#FF5252" style={{flex:1,padding:"8px 0",fontSize:12}}>❌ Odmietnuť</Btn>
                      <Btn onClick={()=>setCounterOffer(counterOffer?.id===m.id?null:m)} color="#9C27B0" style={{flex:1,padding:"8px 0",fontSize:12}}>💬 Navrhnúť</Btn>
                    </div>
                    {counterOffer?.id===m.id && (
                      <div style={{display:"flex",gap:8,marginTop:8}}>
                        <input value={counterText} onChange={e=>setCounterText(e.target.value)} placeholder="Za akých podmienok prijmeš?" style={{...iS,flex:1,margin:0,fontSize:12}} autoFocus/>
                        <Btn onClick={()=>respondTrade(m,false,true)} color="#9C27B0" style={{padding:"8px 12px",fontSize:12}}>Odoslať</Btn>
                      </div>
                    )}
                  </>
                )}
                {m.trade?.status==="accepted" && <p style={{color:"#66BB6A",fontSize:12,fontWeight:800,margin:"6px 0 0"}}>✅ Prijatá!</p>}
                {m.trade?.status==="declined"  && <p style={{color:"#FF5252",fontSize:12,fontWeight:800,margin:"6px 0 0"}}>❌ Odmietnutá</p>}
                {m.trade?.status==="counter"   && <p style={{color:"#9C27B0",fontSize:12,fontWeight:800,margin:"6px 0 0"}}>💬 Protinávrh odoslaný</p>}
                {m.responseText && <p style={{color:"#888",fontSize:11,margin:"4px 0 0",fontStyle:"italic"}}>{m.responseText}</p>}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", alignItems:m.from===member.id?"flex-end":"flex-start" }}>
                {m.from!==member.id && <p style={{ color:"#aaa", fontSize:11, fontWeight:700, margin:"0 0 3px 10px" }}>{m.name}</p>}
                <div style={{ maxWidth:"78%", background:m.from===member.id?member.color:m.from==="maggie"?"#FFF3CD":"white", borderRadius:m.from===member.id?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)" }}>
                  <p style={{ fontSize:14, fontWeight:600, margin:"0 0 4px", lineHeight:1.4, color:m.from===member.id?"white":m.from==="maggie"?"#E65100":"#1A1A2E", wordBreak:"break-word" }}>{m.text}</p>
                  <p style={{ color:m.from===member.id?"rgba(255,255,255,0.6)":"#bbb", fontSize:10, margin:0, textAlign:"right" }}>{m.time}</p>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}/>
      </div>

      <div style={{ padding:"10px 16px", background:"white", borderTop:"1px solid #f0f0f0" }}>
        {showMention && (
          <div style={{ display:"flex", gap:6, marginBottom:8, flexWrap:"wrap" }}>
            {MENTIONS.map(mn => (
              <button key={mn} onClick={()=>{ setMsg(p=>p+mn+" "); setShowMention(false); }} style={{ background:"#f0f0f0", border:"none", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", color:"#555" }}>{mn}</button>
            ))}
          </div>
        )}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setShowMention(p=>!p)} style={{ width:36, height:36, borderRadius:12, border:"1px solid #eee", background:showMention?"#f0f0f0":"white", fontSize:18, cursor:"pointer", flexShrink:0 }}>@</button>
          <input value={msg} onChange={e=>{ setMsg(e.target.value); if(e.target.value.endsWith("@")) setShowMention(true); }} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder={chatTab==="private"?"Súkromná správa...":"Napíš správu..."} style={{ ...iS, flex:1, margin:0 }}/>
          <button onClick={sendMsg} style={{ width:44, height:44, borderRadius:14, border:"none", background:chatTab==="private"?"#9C27B0":member.color, color:"white", fontSize:20, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>➤</button>
        </div>
      </div>
    </div>
  );
}

export function Profile({ member, members, setMembers, showToast }) {
  const Av = AVTS[member.id];
  const [tab, setTab] = useState("pin");
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [pinError, setPinError] = useState("");
  const [nick, setNick] = useState(member.name);
  const [topColor, setTopColor] = useState(member.color);
  const lvl = getLvl(member.totalPts||0);

  const COLORS = [
    {c:"#E53935",l:"Červená"},{c:"#E91E63",l:"Ružová"},{c:"#9C27B0",l:"Fialová"},
    {c:"#3F51B5",l:"Modrá"},{c:"#4A90D9",l:"Svetlomodrá"},{c:"#00BCD4",l:"Tyrkys"},
    {c:"#8CC63F",l:"Zelená"},{c:"#FF9800",l:"Oranžová"},{c:"#795548",l:"Hnedá"},
    {c:"#607D8B",l:"Sivá"},{c:"#FFD90F",l:"Žltá"},{c:"#FF5722",l:"Tehlová"},
  ];

  const unlockedAch = ACHIEVEMENTS.filter(a => {
    try { return a.check(member, {}); } catch { return false; }
  });

  const weekDays = Array.from({length:7}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label:["Po","Ut","St","Št","Pi","So","Ne"][(d.getDay()+6)%7], date:d.toDateString() };
  });

  const savePin = () => {
    if (pin1.length>0&&pin1.length<4){setPinError("PIN musí mať 4 číslice!");return;}
    if (pin1!==pin2){setPinError("PINy sa nezhodujú!");return;}
    setMembers(prev=>prev.map(m=>m.id===member.id?{...m,pin:pin1}:m));
    setPinError(""); setPin1(""); setPin2("");
    showToast(pin1===""?"🔓 PIN odstránený!":"🔑 PIN uložený!",member.color);
  };

  const saveProfile = () => {
    setMembers(prev=>prev.map(m=>m.id===member.id?{...m,name:nick,color:topColor}:m));
    showToast("✅ Profil uložený!",topColor);
  };

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${DARK},${DARK2})`, padding:"20px 20px 24px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Av size={70}/>
          <div>
            <h2 style={{ color:YELLOW, fontSize:22, margin:"0 0 2px", fontWeight:900 }}>{member.name}</h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.role==="admin"?"⚙️ Admin":"🎮 Hráč"} · 🔥 {member.streak} dní</p>
            <p style={{ color:YELLOW, fontSize:13, fontWeight:800, margin:"4px 0 0" }}>⭐ {member.weekPts||0}b · {LEVELS[lvl]}</p>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, padding:"14px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
        {[{id:"pin",l:"🔑 PIN"},{id:"look",l:"🎨 Vzhľad"},{id:"stats",l:"📊 Štatistiky"},{id:"ach",l:"🏅 Odznaky"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flexShrink:0, padding:"8px 14px", borderRadius:20, border:"none", fontFamily:"inherit", fontSize:12, fontWeight:800, cursor:"pointer", background:tab===t.id?member.color:"white", color:tab===t.id?"white":"#888", boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)", transition:"all 0.2s", whiteSpace:"nowrap" }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding:"14px 16px" }}>
        {tab==="pin" && (
          <Card>
            <p style={{ fontWeight:900, fontSize:15, color:"#1A1A2E", margin:"0 0 6px" }}>🔑 Zmena PINu</p>
            <p style={{ color:"#aaa", fontSize:12, margin:"0 0 16px", lineHeight:1.5 }}>PIN je voliteľný. Ak ho nechceš, nechaj prázdne a ulož.</p>
            <div style={{ marginBottom:10 }}>
              <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 4px" }}>NOVÝ PIN (4 číslice)</p>
              <input type="password" inputMode="numeric" maxLength={4} value={pin1} onChange={e=>{setPin1(e.target.value.replace(/\D/,""));setPinError("");}} placeholder="4 číslice" style={iS}/>
            </div>
            <div style={{ marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 4px" }}>POTVRĎ PIN</p>
              <input type="password" inputMode="numeric" maxLength={4} value={pin2} onChange={e=>{setPin2(e.target.value.replace(/\D/,""));setPinError("");}} placeholder="Zopakuj PIN" style={iS}/>
            </div>
            {pinError && <p style={{ color:"#FF5252", fontSize:12, fontWeight:800, margin:"0 0 10px" }}>{pinError}</p>}
            <div style={{ display:"flex", gap:8 }}>
              <Btn onClick={savePin} color={member.color} style={{ flex:1 }}>Uložiť PIN ✓</Btn>
              {member.pin!==""&&<Btn onClick={()=>{setPin1("");setPin2("");setMembers(prev=>prev.map(m=>m.id===member.id?{...m,pin:""}:m));showToast("🔓 PIN odstránený",member.color);}} color="#FF9800" style={{padding:"12px 14px",fontSize:12}}>Odstrániť</Btn>}
            </div>
            <div style={{ marginTop:12, background:member.pin===""?"#E8F5E9":"#FFF3E0", borderRadius:12, padding:"10px 14px" }}>
              <p style={{ fontSize:12, fontWeight:800, margin:0, color:member.pin===""?"#2E7D32":"#E65100" }}>{member.pin===""?"🔓 Momentálne bez PINu — vstup je voľný":"🔑 PIN je nastavený"}</p>
            </div>
          </Card>
        )}

        {tab==="look" && (
          <>
            <Card style={{ marginBottom:12 }}>
              <p style={{ fontWeight:900, fontSize:15, color:"#1A1A2E", margin:"0 0 14px" }}>📛 Prezývka</p>
              <input value={nick} onChange={e=>setNick(e.target.value)} placeholder="Tvoja prezývka..." style={{...iS,marginBottom:8}} maxLength={20}/>
              <p style={{ color:"#aaa", fontSize:11, margin:0 }}>Meno sa zobrazí v chate a rebríčku</p>
            </Card>
            <Card>
              <p style={{ fontWeight:900, fontSize:15, color:"#1A1A2E", margin:"0 0 14px" }}>🎨 Farba postavičky</p>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
                {COLORS.map(({c,l})=>(
                  <button key={c} onClick={()=>setTopColor(c)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, background:"none", border:"none", cursor:"pointer", padding:4 }}>
                    <div style={{ width:44, height:44, borderRadius:14, background:c, border:`3px solid ${topColor===c?"#1A1A2E":"transparent"}`, boxShadow:topColor===c?"0 4px 12px rgba(0,0,0,0.2)":"none", transition:"all 0.15s" }}/>
                    <span style={{ fontSize:9, color:"#888", fontWeight:topColor===c?800:400 }}>{l}</span>
                  </button>
                ))}
              </div>
              <Btn onClick={saveProfile} color={member.color} style={{ width:"100%" }}>Uložiť zmeny ✓</Btn>
            </Card>
          </>
        )}

        {tab==="stats" && (
          <>
            <Card style={{ marginBottom:12 }}>
              <p style={{ fontWeight:900, fontSize:15, color:"#1A1A2E", margin:"0 0 14px" }}>📊 Moje štatistiky</p>
              {[
                {label:"Body tento týždeň", value:`⭐ ${member.weekPts||0}b`,  color:member.color},
                {label:"Body celkovo",       value:`⭐ ${member.totalPts||0}b`, color:member.color},
                {label:"Aktuálny streak",    value:`🔥 ${member.streak} dní`,   color:"#FF6B35"},
                {label:"Level",              value:LEVELS[lvl],                 color:"#9C27B0"},
                {label:"Inventár",           value:`🎒 ${(member.inventory||[]).length} predmetov`, color:"#4CAF50"},
                {label:"Odznaky",            value:`🏅 ${unlockedAch.length}/${ACHIEVEMENTS.length}`, color:"#FF9800"},
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<5?"1px solid #f5f5f5":"none" }}>
                  <span style={{ fontSize:13, color:"#888" }}>{s.label}</span>
                  <span style={{ fontSize:14, fontWeight:800, color:s.color }}>{s.value}</span>
                </div>
              ))}
            </Card>

            <Card>
              <p style={{ fontWeight:900, fontSize:15, color:"#1A1A2E", margin:"0 0 14px" }}>📈 Body tento týždeň</p>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
                {weekDays.map((d, i) => {
                  const isToday = d.date === new Date().toDateString();
                  const barH = isToday ? Math.min(80, Math.max(8, (member.weekPts||0) * 2)) : 8;
                  return (
                    <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                      <div style={{ width:"100%", background:isToday?member.color:`${member.color}33`, borderRadius:"6px 6px 0 0", height:`${barH}px`, transition:"height 0.5s", minHeight:8 }}/>
                      <span style={{ fontSize:9, fontWeight:isToday?900:600, color:isToday?member.color:"#bbb" }}>{d.label}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize:11, color:"#aaa", margin:"8px 0 0", textAlign:"center" }}>Celkovo tento týždeň: <b style={{color:member.color}}>{member.weekPts||0}b</b></p>
            </Card>
          </>
        )}

        {tab==="ach" && (
          <>
            <div style={{ background:`${member.color}12`, border:`1.5px solid ${member.color}33`, borderRadius:14, padding:"10px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:13, fontWeight:800, color:member.color }}>🏅 Odomknuté odznaky</span>
              <span style={{ fontSize:15, fontWeight:900, color:member.color }}>{unlockedAch.length} / {ACHIEVEMENTS.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {ACHIEVEMENTS.map(a => {
                const unlocked = !!unlockedAch.find(u => u.id === a.id);
                return (
                  <div key={a.id} style={{ background:"white", borderRadius:16, padding:"12px 14px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", opacity:unlocked?1:0.45, border:`2px solid ${unlocked?member.color:"#eee"}` }}>
                    <span style={{ fontSize:28, flexShrink:0, filter:unlocked?"none":"grayscale(1)" }}>{a.emoji}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:unlocked?"#1A1A2E":"#aaa", margin:"0 0 2px" }}>{a.name}</p>
                      <p style={{ fontSize:11, color:"#bbb", margin:0 }}>{a.desc}</p>
                    </div>
                    {unlocked
                      ? <span style={{ background:`${member.color}18`, color:member.color, borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:800, flexShrink:0 }}>✅</span>
                      : <span style={{ background:"#f0f0f0", color:"#bbb", borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:800, flexShrink:0 }}>🔒</span>
                    }
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}