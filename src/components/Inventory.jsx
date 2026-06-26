import { useState, useRef } from "react";
import { AVTS } from "./Avatars.jsx";
import { Card, Sect, Btn, iS, sS } from "./UI.jsx";
import { YELLOW, DARK, DARK2 } from "../data.js";

export const SHOP_ITEMS = [
  { id:"c01", name:"Čiapka",          emoji:"🧢", pts:30,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c02", name:"Tenisky",         emoji:"👟", pts:50,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c03", name:"Mikina",          emoji:"🧥", pts:80,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c04", name:"Šaty",            emoji:"👗", pts:100, cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c05", name:"Slnečné okuliare",emoji:"🕶️", pts:40,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c06", name:"Klobúk",          emoji:"🎩", pts:60,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c07", name:"Kabelka",         emoji:"👜", pts:70,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c08", name:"Rukavice",        emoji:"🧤", pts:25,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c09", name:"Šál",             emoji:"🧣", pts:25,  cat:"👗 Oblečenie",   type:"permanent" },
  { id:"c10", name:"Koruna",          emoji:"👑", pts:500, cat:"👗 Oblečenie",   type:"permanent" },
  { id:"k01", name:"Rúž",             emoji:"💄", pts:20,  cat:"💄 Kozmetika",   type:"consumable" },
  { id:"k02", name:"Lak na nechty",   emoji:"💅", pts:15,  cat:"💄 Kozmetika",   type:"consumable" },
  { id:"k03", name:"Parfum",          emoji:"🌸", pts:50,  cat:"💄 Kozmetika",   type:"consumable" },
  { id:"k04", name:"Krém",            emoji:"🧴", pts:30,  cat:"💄 Kozmetika",   type:"consumable" },
  { id:"k05", name:"Šampón",          emoji:"🧴", pts:25,  cat:"💄 Kozmetika",   type:"consumable" },
  { id:"t01", name:"Telefón",         emoji:"📱", pts:200, cat:"📱 Technika",    type:"permanent" },
  { id:"t02", name:"Laptop",          emoji:"💻", pts:400, cat:"📱 Technika",    type:"permanent" },
  { id:"t03", name:"Herná konzola",   emoji:"🎮", pts:350, cat:"📱 Technika",    type:"permanent" },
  { id:"t04", name:"Slúchadlá",       emoji:"🎧", pts:150, cat:"📱 Technika",    type:"permanent" },
  { id:"t05", name:"Fotoaparát",      emoji:"📷", pts:250, cat:"📱 Technika",    type:"permanent" },
  { id:"t06", name:"Tablet",          emoji:"📟", pts:300, cat:"📱 Technika",    type:"permanent" },
  { id:"h01", name:"Medvedík",        emoji:"🧸", pts:40,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"h02", name:"Lopta",           emoji:"⚽", pts:35,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"h03", name:"Lego",            emoji:"🧱", pts:60,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"h04", name:"Puzzle",          emoji:"🧩", pts:50,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"h05", name:"Spoloč. hra",     emoji:"🎲", pts:60,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"h06", name:"Bábika",          emoji:"🪆", pts:45,  cat:"🧸 Hračky",      type:"permanent" },
  { id:"a01", name:"Auto",            emoji:"🚗", pts:150, cat:"🚗 Autá",         type:"permanent" },
  { id:"a02", name:"Pretekárske auto",emoji:"🏎️", pts:300, cat:"🚗 Autá",         type:"permanent" },
  { id:"a03", name:"Kolobežka",       emoji:"🛴", pts:100, cat:"🚗 Autá",         type:"permanent" },
  { id:"a04", name:"Bicykel",         emoji:"🚲", pts:200, cat:"🚗 Autá",         type:"permanent" },
  { id:"a05", name:"Skateboard",      emoji:"🛹", pts:120, cat:"🚗 Autá",         type:"permanent" },
  { id:"a06", name:"Raketa",          emoji:"🚀", pts:800, cat:"🚗 Autá",         type:"permanent" },
  { id:"j01", name:"Pizza",           emoji:"🍕", pts:20,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j02", name:"Burger",          emoji:"🍔", pts:25,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j03", name:"Torta",           emoji:"🎂", pts:30,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j04", name:"Zmrzlina",        emoji:"🍦", pts:15,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j05", name:"Čokoláda",        emoji:"🍫", pts:10,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j06", name:"Sladkosti",       emoji:"🍬", pts:8,   cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j07", name:"Nápoj",           emoji:"🥤", pts:8,   cat:"🍕 Jedlo",        type:"consumable" },
  { id:"j08", name:"Donut",           emoji:"🍩", pts:12,  cat:"🍕 Jedlo",        type:"consumable" },
  { id:"kv01", name:"Ruža",           emoji:"🌹", pts:35,  cat:"🌸 Kvety",        type:"consumable" },
  { id:"kv02", name:"Tulipán",        emoji:"🌷", pts:25,  cat:"🌸 Kvety",        type:"consumable" },
  { id:"kv03", name:"Slnečnica",      emoji:"🌻", pts:30,  cat:"🌸 Kvety",        type:"consumable" },
  { id:"kv04", name:"Kaktus",         emoji:"🌵", pts:40,  cat:"🌸 Kvety",        type:"permanent"  },
  { id:"kv05", name:"Bonsai",         emoji:"🎋", pts:50,  cat:"🌸 Kvety",        type:"permanent"  },
  { id:"kv06", name:"Kytica",         emoji:"💐", pts:45,  cat:"🌸 Kvety",        type:"consumable" },
  { id:"kv07", name:"Stromček",       emoji:"🌳", pts:100, cat:"🌸 Kvety",        type:"permanent"  },
  { id:"z01", name:"Šteniatko",       emoji:"🐶", pts:150, cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z02", name:"Mačiatko",        emoji:"🐱", pts:120, cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z03", name:"Zajačik",         emoji:"🐰", pts:90,  cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z04", name:"Rybka",           emoji:"🐠", pts:40,  cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z05", name:"Papagáj",         emoji:"🦜", pts:110, cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z06", name:"Korytnačka",      emoji:"🐢", pts:70,  cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"z07", name:"Králik",          emoji:"🐇", pts:80,  cat:"🐶 Zvieratká",    type:"permanent"  },
  { id:"v01", name:"Trofej",          emoji:"🏆", pts:750, cat:"🌟 Vzácne",       type:"permanent"  },
  { id:"v02", name:"Diamant",         emoji:"💎", pts:1000,cat:"🌟 Vzácne",       type:"permanent"  },
  { id:"v03", name:"Zlatá hviezda",   emoji:"⭐", pts:400, cat:"🌟 Vzácne",       type:"permanent"  },
  { id:"v04", name:"Čarovná palička", emoji:"🪄", pts:300, cat:"🌟 Vzácne",       type:"permanent"  },
  { id:"v05", name:"Surprise Box",    emoji:"🎁", pts:150, cat:"🌟 Vzácne",       type:"consumable" },
];

export const SHOP_CATS = [...new Set(SHOP_ITEMS.map(i => i.cat))];

export function Shop({ member, members, setMembers, shopItems, setShopItems, showToast }) {
  const allCats = [...new Set(shopItems.map(i => i.cat))];
  const [catIdx, setCatIdx] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const scrollRef = useRef(null);

  const cat = allCats[catIdx] || allCats[0];
  const pts = member.totalPts || 0;
  const catItems = shopItems.filter(i => i.cat === cat);

  // Nové predmety — pridané za posledných 48h (custom_ s timestamp)
  const now = Date.now();
  const isNew = (item) => {
    if (!item.id.startsWith("custom_")) return false;
    const ts = Number(item.id.replace("custom_", ""));
    return now - ts < 48 * 60 * 60 * 1000;
  };
  const newItemsCount = shopItems.filter(isNew).length;

  const buy = (item) => {
    if (pts < item.pts) { showToast("❌ Málo bodov!", "#FF5252"); return; }
    setMembers(prev => prev.map(m => m.id === member.id
      ? { ...m,
          totalPts: (m.totalPts||0) - item.pts,
          weekPts:  Math.max(0,(m.weekPts||0) - item.pts),
          inventory: [...(m.inventory||[]), {
            id: `inv_${Date.now()}`,
            itemId: item.id,
            name: item.name,
            emoji: item.emoji,
            cat: item.cat,
            type: item.type,
            obtainedAt: new Date().toLocaleDateString("sk"),
            from: "shop"
          }]
        }
      : m
    ));
    setConfirm(null);
    showToast(`🎉 ${item.emoji} ${item.name} kúpené!`, member.color);
  };

  const prevCat = () => setCatIdx(i => Math.max(0, i - 1));
  const nextCat = () => setCatIdx(i => Math.min(allCats.length - 1, i + 1));

  return (
    <div>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${DARK},#2C1654)`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
          <h2 style={{ color:"#FFD90F", fontSize:20, margin:0, fontWeight:900 }}>🛍️ Obchod</h2>
          {newItemsCount > 0 && (
            <span style={{ background:"#FF5252", color:"white", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:900 }}>
              🆕 {newItemsCount} nových!
            </span>
          )}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.name}</p>
          <div style={{ background:`${member.color}22`, border:`1.5px solid ${member.color}66`, borderRadius:20, padding:"6px 16px", display:"flex", gap:6, alignItems:"center" }}>
            <span>⭐</span>
            <span style={{ color:"#FFD90F", fontSize:20, fontWeight:900 }}>{pts}</span>
            <span style={{ color:"rgba(255,255,255,0.4)", fontSize:12 }}>b</span>
          </div>
        </div>
      </div>

      {/* Kategórie so šípkami */}
      <div style={{ display:"flex", alignItems:"center", gap:6, padding:"12px 16px 0" }}>
        <button onClick={prevCat} disabled={catIdx===0} style={{
          width:32, height:32, borderRadius:50, border:"1px solid #eee",
          background:"white", fontSize:16, cursor:catIdx===0?"default":"pointer",
          opacity:catIdx===0?0.3:1, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center"
        }}>◀</button>

        <div ref={scrollRef} style={{ flex:1, display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
          {allCats.map((c, i) => {
            const hasNew = shopItems.filter(item => item.cat===c && isNew(item)).length > 0;
            return (
              <button key={c} onClick={() => setCatIdx(i)} style={{
                flexShrink:0, padding:"6px 12px", borderRadius:20, border:"none",
                fontFamily:"inherit", fontSize:11, fontWeight:800, cursor:"pointer",
                whiteSpace:"nowrap", position:"relative",
                background: catIdx===i ? member.color : "white",
                color: catIdx===i ? "white" : "#888",
                boxShadow: catIdx===i ? `0 4px 12px ${member.color}55` : "0 1px 4px rgba(0,0,0,0.08)",
                transition:"all 0.2s"
              }}>
                {c}
                {hasNew && <span style={{ position:"absolute", top:-3, right:-3, background:"#FF5252", borderRadius:"50%", width:8, height:8 }}/>}
              </button>
            );
          })}
        </div>

        <button onClick={nextCat} disabled={catIdx===allCats.length-1} style={{
          width:32, height:32, borderRadius:50, border:"1px solid #eee",
          background:"white", fontSize:16, cursor:catIdx===allCats.length-1?"default":"pointer",
          opacity:catIdx===allCats.length-1?0.3:1, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center"
        }}>▶</button>
      </div>

      {/* Predmety */}
      <div style={{ padding:"12px 16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {catItems.map(item => {
            const ok    = pts >= item.pts;
            const owned = (member.inventory||[]).filter(i => i.itemId === item.id).length;
            const newItem = isNew(item);
            return (
              <div key={item.id} style={{
                background:"white", borderRadius:18, padding:"14px 12px",
                textAlign:"center", boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
                opacity: ok ? 1 : 0.6,
                border: newItem ? `2px solid #FF5252` : owned > 0 ? `2px solid ${member.color}44` : "2px solid transparent",
                position:"relative"
              }}>
                {newItem && (
                  <span style={{ position:"absolute", top:8, left:8, background:"#FF5252", color:"white", borderRadius:8, padding:"2px 7px", fontSize:9, fontWeight:900 }}>NOVÉ</span>
                )}
                {owned > 0 && !newItem && (
                  <span style={{ position:"absolute", top:8, right:8, background:member.color, color:"white", borderRadius:"50%", width:20, height:20, fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{owned}</span>
                )}
                <p style={{ fontSize:36, margin:"0 0 6px" }}>{item.emoji}</p>
                <p style={{ fontSize:12, fontWeight:800, color:"#1A1A2E", margin:"0 0 4px", lineHeight:1.3 }}>{item.name}</p>
                <p style={{ fontSize:10, color:"#aaa", margin:"0 0 8px" }}>
                  {item.type==="consumable" ? "🔄 Spotrebovateľné" : "♾️ Trvalé"}
                </p>
                <Btn onClick={() => setConfirm(item)} color={ok ? member.color : "#eee"} disabled={!ok} style={{ width:"100%", padding:"8px 0", fontSize:12, color:ok?"white":"#bbb" }}>⭐ {item.pts}b</Btn>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:52, textAlign:"center", margin:"0 0 8px" }}>{confirm.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:18, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{confirm.name}</h3>
            <p style={{ textAlign:"center", color:member.color, fontSize:16, fontWeight:800, margin:"0 0 4px" }}>⭐ {confirm.pts} bodov</p>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:12, margin:"0 0 20px" }}>
              {confirm.type==="consumable" ? "🔄 Spotrebovateľný predmet — po použití zmizne" : "♾️ Trvalý predmet — zostane v inventári navždy"}
            </p>
            <p style={{ textAlign:"center", color:"#888", fontSize:13, margin:"0 0 20px" }}>
              Zostatok: <b style={{ color:member.color }}>⭐ {(member.totalPts||0) - confirm.pts}b</b>
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => setConfirm(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={() => buy(confirm)} color={member.color} style={{ flex:2 }}>Kúpiť ✓</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Inventory({ member, members, setMembers, showToast }) {
  const [sendItem, setSendItem] = useState(null);
  const [sendTo, setSendTo]     = useState("");
  const [useItem, setUseItem]   = useState(null);
  const [catFilter, setCatFilter] = useState("všetky");

  const inventory = member.inventory || [];
  const cats = ["všetky", ...new Set(inventory.map(i => i.cat))];
  const filtered = catFilter === "všetky" ? inventory : inventory.filter(i => i.cat === catFilter);

  const sendItemFn = () => {
    if (!sendTo) return;
    const item = sendItem;
    setMembers(prev => prev.map(m => {
      if (m.id === member.id) {
        const idx = (m.inventory||[]).findIndex(i => i.id === item.id);
        const newInv = [...(m.inventory||[])];
        newInv.splice(idx, 1);
        return { ...m, inventory: newInv };
      }
      if (m.id === sendTo) {
        return { ...m, inventory: [...(m.inventory||[]), { ...item, id:`inv_${Date.now()}`, from: member.name, obtainedAt: new Date().toLocaleDateString("sk") }] };
      }
      return m;
    }));
    const toM = members.find(m => m.id === sendTo);
    setSendItem(null); setSendTo("");
    showToast(`📤 ${item.emoji} ${item.name} poslané ${toM?.name}!`, member.color);
  };

  const useItemFn = (item) => {
    if (item.type !== "consumable") return;
    setMembers(prev => prev.map(m => {
      if (m.id !== member.id) return m;
      const idx = (m.inventory||[]).findIndex(i => i.id === item.id);
      const newInv = [...(m.inventory||[])];
      newInv.splice(idx, 1);
      return { ...m, inventory: newInv };
    }));
    setUseItem(null);
    showToast(`✨ ${item.emoji} ${item.name} použité!`, member.color);
  };

  return (
    <div>
      <div style={{ background:`linear-gradient(135deg,${DARK},${DARK2})`, padding:"20px 20px 18px", borderBottomLeftRadius:28, borderBottomRightRadius:28 }}>
        <h2 style={{ color:"#FFD90F", fontSize:20, margin:"0 0 4px", fontWeight:900 }}>🎒 Inventár</h2>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, margin:0 }}>{member.name}</p>
          <span style={{ background:`${member.color}22`, color:"#FFD90F", borderRadius:20, padding:"4px 14px", fontSize:13, fontWeight:800 }}>{inventory.length} predmetov</span>
        </div>
      </div>

      {inventory.length > 0 && (
        <div style={{ display:"flex", gap:6, padding:"12px 16px 0", overflowX:"auto", scrollbarWidth:"none" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{
              flexShrink:0, padding:"5px 12px", borderRadius:14, border:"none",
              fontFamily:"inherit", fontSize:11, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap",
              background: catFilter===c ? member.color : "white",
              color: catFilter===c ? "white" : "#888",
              boxShadow: catFilter===c ? `0 3px 10px ${member.color}55` : "0 1px 4px rgba(0,0,0,0.08)"
            }}>{c==="všetky" ? "🎒 Všetky" : c}</button>
          ))}
        </div>
      )}

      <div style={{ padding:"12px 16px" }}>
        {inventory.length === 0 ? (
          <div style={{ textAlign:"center", padding:40, background:"white", borderRadius:20 }}>
            <p style={{ fontSize:48, margin:"0 0 12px" }}>🎒</p>
            <p style={{ fontSize:16, fontWeight:800, color:"#1A1A2E", margin:"0 0 6px" }}>Inventár je prázdny</p>
            <p style={{ fontSize:13, color:"#aaa", margin:0 }}>Choď do Obchodu a nakúp si prvé predmety! 🛍️</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {filtered.map(item => (
              <div key={item.id} onClick={() => item.type==="consumable" ? setUseItem(item) : setSendItem(item)}
                style={{ background:"white", borderRadius:16, padding:"12px 8px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", cursor:"pointer", border:`2px solid ${item.type==="consumable"?"#FF980022":member.color+"22"}` }}>
                <p style={{ fontSize:30, margin:"0 0 4px" }}>{item.emoji}</p>
                <p style={{ fontSize:10, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px", lineHeight:1.3 }}>{item.name}</p>
                <p style={{ fontSize:9, color:"#bbb", margin:0 }}>{item.type==="consumable"?"🔄":"♾️"}</p>
                {item.from && item.from !== "shop" && <p style={{ fontSize:8, color:member.color, margin:"2px 0 0", fontWeight:700 }}>od {item.from}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {sendItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:48, textAlign:"center", margin:"0 0 6px" }}>{sendItem.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 4px" }}>{sendItem.name}</h3>
            <p style={{ textAlign:"center", color:"#aaa", fontSize:12, margin:"0 0 20px" }}>{sendItem.type==="consumable"?"🔄 Spotrebovateľné":"♾️ Trvalé"}</p>
            <p style={{ fontSize:11, fontWeight:800, color:"#888", margin:"0 0 8px" }}>KOMU POSIELAM</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginBottom:20 }}>
              {members.filter(m => m.id !== member.id).map(m => {
                const MAv = AVTS[m.id];
                return (
                  <button key={m.id} onClick={() => setSendTo(m.id)} style={{ padding:"12px 8px", borderRadius:16, border:`2px solid ${sendTo===m.id?m.color:"#eee"}`, background:sendTo===m.id?`${m.color}15`:"white", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <MAv size={40}/>
                    <span style={{ fontSize:12, fontWeight:800, color:sendTo===m.id?m.color:"#888" }}>{m.name}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => { setSendItem(null); setSendTo(""); }} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={sendItemFn} color={member.color} style={{ flex:2 }} disabled={!sendTo}>📤 Poslať</Btn>
            </div>
          </div>
        </div>
      )}

      {useItem && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100, backdropFilter:"blur(4px)" }}>
          <div style={{ background:"white", borderRadius:"28px 28px 0 0", padding:"28px 24px 36px", width:"100%", maxWidth:480 }}>
            <p style={{ fontSize:48, textAlign:"center", margin:"0 0 6px" }}>{useItem.emoji}</p>
            <h3 style={{ textAlign:"center", fontSize:16, fontWeight:900, color:"#1A1A2E", margin:"0 0 8px" }}>{useItem.name}</h3>
            <p style={{ textAlign:"center", color:"#FF9800", fontSize:13, margin:"0 0 20px" }}>🔄 Spotrebovateľný predmet — po použití zmizne z inventára</p>
            <div style={{ display:"flex", gap:10 }}>
              <Btn onClick={() => setUseItem(null)} color="#eee" style={{ flex:1, color:"#888" }}>Zrušiť</Btn>
              <Btn onClick={() => useItemFn(useItem)} color="#FF9800" style={{ flex:1 }}>✨ Použiť</Btn>
              <Btn onClick={() => { setUseItem(null); setSendItem(useItem); }} color={member.color} style={{ flex:1 }}>📤 Poslať</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export function AdminShop({ member, shopItems, setShopItems, showToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newCat, setNewCat] = useState("");
  const [showNewCat, setShowNewCat] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", emoji:"🎁", pts:50, cat:SHOP_CATS[0], type:"permanent" });

  const allCats = [...new Set(shopItems.map(i => i.cat))];
  const customItems = shopItems.filter(i => i.id.startsWith("custom_"));

  const addItem = () => {
    if (!newItem.name.trim()) return;
    setShopItems(prev => [...prev, { ...newItem, id:`custom_${Date.now()}` }]);
    setNewItem({ name:"", emoji:"🎁", pts:50, cat:allCats[0]||SHOP_CATS[0], type:"permanent" });
    setShowAdd(false);
    showToast("✅ Predmet pridaný do obchodu!", member.color);
  };

  const saveEdit = () => {
    if (!editItem) return;
    setShopItems(prev => prev.map(i => i.id===editItem.id ? editItem : i));
    setEditItem(null);
    showToast("💾 Predmet upravený!", member.color);
  };

  const addCategory = () => {
    if (!newCat.trim()) return;
    setNewItem(p => ({...p, cat: newCat.trim()}));
    setShowNewCat(false);
    showToast(`✅ Kategória "${newCat.trim()}" pridaná!`, member.color);
    setNewCat("");
  };

  return (
    <div style={{ padding:"0 0 16px" }}>
      <Sect>Vlastné predmety v obchode</Sect>
      {customItems.length === 0 && <p style={{ color:"#bbb", fontSize:13, textAlign:"center", padding:"16px 0" }}>Zatiaľ žiadne vlastné predmety</p>}
      {customItems.map(item => (
        editItem?.id === item.id ? (
          <Card key={item.id} style={{ marginBottom:8, border:`2px solid ${member.color}44` }}>
            <p style={{ fontWeight:900, fontSize:13, margin:"0 0 10px", color:member.color }}>✏️ Editovať predmet</p>
            <div style={{ display:"grid", gridTemplateColumns:"50px 1fr", gap:8, marginBottom:8 }}>
              <input style={{...iS,textAlign:"center",fontSize:22}} value={editItem.emoji} onChange={e=>setEditItem(p=>({...p,emoji:e.target.value}))}/>
              <input style={iS} value={editItem.name} onChange={e=>setEditItem(p=>({...p,name:e.target.value}))}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
              <div>
                <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 3px" }}>BODY</p>
                <input style={iS} type="number" min={1} value={editItem.pts} onChange={e=>setEditItem(p=>({...p,pts:Number(e.target.value)}))}/>
              </div>
              <div>
                <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 3px" }}>KATEGÓRIA</p>
                <select style={sS} value={editItem.cat} onChange={e=>setEditItem(p=>({...p,cat:e.target.value}))}>
                  {allCats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
              <button onClick={() => setEditItem(p=>({...p,type:"permanent"}))} style={{ padding:"9px", borderRadius:10, border:`2px solid ${editItem.type==="permanent"?member.color:"#eee"}`, background:editItem.type==="permanent"?`${member.color}15`:"white", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", color:editItem.type==="permanent"?member.color:"#888" }}>♾️ Trvalé</button>
              <button onClick={() => setEditItem(p=>({...p,type:"consumable"}))} style={{ padding:"9px", borderRadius:10, border:`2px solid ${editItem.type==="consumable"?"#FF9800":"#eee"}`, background:editItem.type==="consumable"?"#FFF8E1":"white", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", color:editItem.type==="consumable"?"#FF9800":"#888" }}>🔄 Spotrebovateľné</button>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn onClick={saveEdit} color={member.color} style={{ flex:1 }}>Uložiť ✓</Btn>
              <Btn onClick={() => setEditItem(null)} color="#eee" style={{ color:"#888" }}>Zrušiť</Btn>
            </div>
          </Card>
        ) : (
          <Card key={item.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
            <span style={{ fontSize:24 }}>{item.emoji}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#1A1A2E", margin:"0 0 2px", wordBreak:"break-word" }}>{item.name}</p>
              <p style={{ fontSize:11, color:"#aaa", margin:0 }}>{item.cat} · ⭐ {item.pts}b · {item.type==="consumable"?"🔄":"♾️"}</p>
            </div>
            <button onClick={() => setEditItem({...item})} style={{ width:32, height:32, borderRadius:8, border:"1px solid #eee", background:"white", fontSize:13, cursor:"pointer", flexShrink:0 }}>✏️</button>
            <button onClick={() => { setShopItems(prev => prev.filter(i => i.id !== item.id)); showToast("🗑️ Predmet odstránený","#888"); }} style={{ width:32, height:32, borderRadius:8, border:"1px solid #eee", background:"#FFF3F3", fontSize:13, cursor:"pointer", flexShrink:0 }}>🗑️</button>
          </Card>
        )
      ))}

      {/* Nová kategória */}
      {showNewCat ? (
        <Card style={{ marginBottom:8, border:`2px solid ${member.color}44` }}>
          <p style={{ fontWeight:900, fontSize:13, margin:"0 0 8px", color:member.color }}>🏷️ Nová kategória</p>
          <div style={{ display:"flex", gap:8 }}>
            <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Napr. 🎨 Umenie" style={{...iS,flex:1,margin:0}} autoFocus/>
            <Btn onClick={addCategory} color={member.color} style={{ padding:"10px 14px" }}>Pridať</Btn>
            <Btn onClick={()=>setShowNewCat(false)} color="#eee" style={{ color:"#888", padding:"10px 12px" }}>✕</Btn>
          </div>
        </Card>
      ) : (
        <button onClick={() => setShowNewCat(true)} style={{ width:"100%", padding:"10px", borderRadius:14, border:`1.5px dashed #9C27B066`, background:"transparent", color:"#9C27B0", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"inherit", marginBottom:8 }}>
          🏷️ Pridať novú kategóriu
        </button>
      )}

      <button onClick={() => setShowAdd(p => !p)} style={{ width:"100%", padding:"12px", borderRadius:16, border:`1.5px dashed ${member.color}66`, background:"transparent", color:member.color, fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
        + Pridať vlastný predmet
      </button>

      {showAdd && (
        <Card style={{ marginTop:12, border:`2px solid ${member.color}44` }}>
          <p style={{ fontWeight:900, fontSize:14, margin:"0 0 12px", color:member.color }}>➕ Nový predmet</p>
          <div style={{ display:"grid", gridTemplateColumns:"50px 1fr", gap:8, marginBottom:8 }}>
            <input style={{ ...iS, textAlign:"center", fontSize:22 }} value={newItem.emoji} onChange={e => setNewItem(p=>({...p,emoji:e.target.value}))} placeholder="🎁"/>
            <input style={iS} value={newItem.name} onChange={e => setNewItem(p=>({...p,name:e.target.value}))} placeholder="Názov predmetu..."/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
            <div>
              <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 3px" }}>BODY</p>
              <input style={iS} type="number" min={1} value={newItem.pts} onChange={e => setNewItem(p=>({...p,pts:Number(e.target.value)}))}/>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:800, color:"#888", margin:"0 0 3px" }}>KATEGÓRIA</p>
              <select style={sS} value={newItem.cat} onChange={e => setNewItem(p=>({...p,cat:e.target.value}))}>
                {allCats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
            <button onClick={() => setNewItem(p=>({...p,type:"permanent"}))} style={{ padding:"9px", borderRadius:10, border:`2px solid ${newItem.type==="permanent"?member.color:"#eee"}`, background:newItem.type==="permanent"?`${member.color}15`:"white", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", color:newItem.type==="permanent"?member.color:"#888" }}>♾️ Trvalé</button>
            <button onClick={() => setNewItem(p=>({...p,type:"consumable"}))} style={{ padding:"9px", borderRadius:10, border:`2px solid ${newItem.type==="consumable"?"#FF9800":"#eee"}`, background:newItem.type==="consumable"?"#FFF8E1":"white", fontWeight:800, fontSize:11, cursor:"pointer", fontFamily:"inherit", color:newItem.type==="consumable"?"#FF9800":"#888" }}>🔄 Spotrebovateľné</button>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={addItem} color={member.color} style={{ flex:1 }}>Pridať ✓</Btn>
            <Btn onClick={() => setShowAdd(false)} color="#eee" style={{ color:"#888" }}>Zrušiť</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
