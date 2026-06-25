// ═══════════════════════════════════════════════════════
//  RODINNÉ QUEST — DÁTA
// ═══════════════════════════════════════════════════════

export const YELLOW = "#FFD90F";
export const DARK   = "#1A1A2E";
export const DARK2  = "#16213E";
export const BG     = "#F0EEF8";

export const LEVELS  = ["🌱 Začiatočník","⚡ Pomocník","🌟 Šikovný","🔥 Expert","🏆 Majster","👑 Legenda"];
export const LPTS    = [0, 50, 150, 300, 500, 800];
export const DAYS_SK = ["Po","Ut","St","Št","Pi","So","Ne"];

// ── localStorage ──────────────────────────────────────
export const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
export const load = (k,d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };

// ── Databáza všetkých úloh ─────────────────────────────
export const TASK_LIBRARY = [
  // 🌅 Školské ráno
  { id:"sm01", name:"Umyť si zuby",              icon:"🪥", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm02", name:"Umyť si tvár",              icon:"💧", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm03", name:"Učesať sa",                 icon:"💇", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm04", name:"Obliecť sa",                icon:"👗", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm05", name:"Ustlať posteľ",             icon:"🛏️", pts:2, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm06", name:"Dať pyžamo na miesto",      icon:"🌙", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm07", name:"Skontrolovať školskú tašku",icon:"🎒", pts:2, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm08", name:"Zobrať desiatu",            icon:"🥪", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm09", name:"Zobrať fľašu s vodou",      icon:"💧", pts:1, cat:"🌅 Školské ráno",    season:"school"  },
  { id:"sm10", name:"Odísť načas do školy",      icon:"⏰", pts:2, cat:"🌅 Školské ráno",    season:"school"  },
  // 🎒 Po škole
  { id:"sr01", name:"Odložiť topánky na miesto", icon:"👟", pts:1, cat:"🎒 Po škole",        season:"school"  },
  { id:"sr02", name:"Zavesiť bundu alebo mikinu",icon:"🧥", pts:1, cat:"🎒 Po škole",        season:"school"  },
  { id:"sr03", name:"Odložiť školskú tašku",     icon:"🎒", pts:1, cat:"🎒 Po škole",        season:"school"  },
  { id:"sr04", name:"Vyložiť desiatový box",     icon:"🥡", pts:1, cat:"🎒 Po škole",        season:"school"  },
  { id:"sr05", name:"Prezliecť sa do domáceho",  icon:"👕", pts:1, cat:"🎒 Po škole",        season:"school"  },
  { id:"sr06", name:"Nenechať oblečenie pohodené",icon:"🚫",pts:2, cat:"🎒 Po škole",        season:"school"  },
  // 📚 Školské povinnosti
  { id:"sd01", name:"Skontrolovať EduPage",      icon:"📱", pts:2, cat:"📚 Škola",           season:"school"  },
  { id:"sd02", name:"Urobiť domáce úlohy",       icon:"📝", pts:5, cat:"📚 Škola",           season:"school"  },
  { id:"sd03", name:"Naučiť sa na písomku",      icon:"📖", pts:5, cat:"📚 Škola",           season:"school"  },
  { id:"sd04", name:"Nachystať učebnice",        icon:"📚", pts:3, cat:"📚 Škola",           season:"school"  },
  { id:"sd05", name:"Nachystať peračník",        icon:"✏️", pts:2, cat:"📚 Škola",           season:"school"  },
  { id:"sd06", name:"Pripraviť tašku na zajtra", icon:"🎒", pts:3, cat:"📚 Škola",           season:"school"  },
  // 🌙 Večer (vždy)
  { id:"se01", name:"Upratať si pracovný stôl",  icon:"🖥️", pts:3, cat:"🌙 Večer",           season:"always"  },
  { id:"se02", name:"Odložiť oblečenie",         icon:"👕", pts:2, cat:"🌙 Večer",           season:"always"  },
  { id:"se03", name:"Umyť si zuby večer",        icon:"🪥", pts:1, cat:"🌙 Večer",           season:"always"  },
  { id:"se04", name:"Osprchovať sa",             icon:"🚿", pts:2, cat:"🌙 Večer",           season:"always"  },
  { id:"se05", name:"Dať nabíjať zariadenia",    icon:"🔋", pts:1, cat:"🌙 Večer",           season:"always"  },
  { id:"se06", name:"Ísť spať v dohodnutom čase",icon:"😴", pts:2, cat:"🌙 Večer",           season:"always"  },
  // 🌞 Prázdniny ráno
  { id:"hm01", name:"Vstať do dohodnutého času", icon:"⏰", pts:2, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  { id:"hm02", name:"Ustlať posteľ",             icon:"🛏️", pts:2, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  { id:"hm03", name:"Nenechať oblečenie na zemi",icon:"🚫", pts:2, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  { id:"hm04", name:"Odniesť riad po raňajkách", icon:"🍽️", pts:1, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  { id:"hm05", name:"Dať riad do umývačky",      icon:"🧺", pts:2, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  { id:"hm06", name:"Utrieť po sebe stôl",       icon:"🧹", pts:2, cat:"🌞 Prázdniny ráno",  season:"holiday" },
  // 📋 Denné (vždy)
  { id:"d01",  name:"Odniesť riad po sebe",      icon:"🍽️", pts:1, cat:"📋 Denné",           season:"always"  },
  { id:"d02",  name:"Dať riad do umývačky",      icon:"🧺", pts:2, cat:"📋 Denné",           season:"always"  },
  { id:"d03",  name:"Vybrať čistý riad z umývačky",icon:"✨",pts:4, cat:"📋 Denné",           season:"always"  },
  { id:"d04",  name:"Dať oblečenie do koša/skrine",icon:"👕",pts:2, cat:"📋 Denné",           season:"always"  },
  { id:"d05",  name:"Odkladať veci na miesto",   icon:"📦", pts:2, cat:"📋 Denné",           season:"always"  },
  { id:"d06",  name:"Ustlať posteľ",             icon:"🛏️", pts:2, cat:"📋 Denné",           season:"always"  },
  { id:"d07",  name:"Zhasínať svetlo po odchode",icon:"💡", pts:1, cat:"📋 Denné",           season:"always"  },
  { id:"d08",  name:"Vypnúť TV keď ho nepozerám",icon:"📺", pts:1, cat:"📋 Denné",           season:"always"  },
  { id:"d09",  name:"Odložiť topánky na miesto", icon:"👟", pts:1, cat:"📋 Denné",           season:"always"  },
  { id:"d10",  name:"Vyniesť smeti",             icon:"🗑️", pts:3, cat:"📋 Denné",           season:"always"  },
  { id:"d11",  name:"Poliať kvety",              icon:"🌸", pts:3, cat:"📋 Denné",           season:"always"  },
  // 🐹 Maggie
  { id:"mg01", name:"Skontrolovať vodu Maggie",  icon:"💧", pts:1, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg02", name:"Doplniť vodu Maggie",       icon:"💧", pts:2, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg03", name:"Skontrolovať seno",         icon:"🌾", pts:1, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg04", name:"Doplniť seno",              icon:"🌾", pts:2, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg05", name:"Nakrájať zeleninu ráno",    icon:"🥕", pts:3, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg06", name:"Dať rannú zeleninu Maggie", icon:"🐹", pts:2, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg07", name:"Nakrájať zeleninu večer",   icon:"🥕", pts:3, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg08", name:"Dať večernú zeleninu Maggie",icon:"🐹",pts:2, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg09", name:"Vyhodiť staré zvyšky",      icon:"🗑️", pts:2, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg10", name:"Skontrolovať stav Maggie",  icon:"🐹", pts:1, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg11", name:"Povysávať seno okolo klietky",icon:"🧹",pts:3, cat:"🐹 Maggie",         season:"always"  },
  { id:"mg12", name:"Kompletne vyčistiť klietku",icon:"🐹", pts:10,cat:"🐹 Maggie",          season:"always"  },
  { id:"mg13", name:"Vymeniť podstielku",        icon:"🌾", pts:7, cat:"🐹 Maggie",          season:"always"  },
  { id:"mg14", name:"Umyť misku a napájačku",    icon:"🫙", pts:3, cat:"🐹 Maggie",          season:"always"  },
  // 🍳 Kuchyňa
  { id:"rk01", name:"Odniesť riad zo stola",     icon:"🍽️", pts:1, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk02", name:"Utrieť jedálenský stôl",    icon:"🧹", pts:2, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk03", name:"Utrieť kuchynskú linku",    icon:"🧽", pts:3, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk04", name:"Vyniesť kuchynský kôš",     icon:"🗑️", pts:3, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk05", name:"Roztriediť odpad",          icon:"♻️", pts:3, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk06", name:"Nenechať jedlo vonku",      icon:"🚫", pts:2, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk07", name:"Pomôcť s prípravou jedla",  icon:"🍳", pts:5, cat:"🍳 Kuchyňa",         season:"always"  },
  { id:"rk08", name:"Umyť drez",                 icon:"🚰", pts:4, cat:"🍳 Kuchyňa",         season:"always"  },
  // 🛋️ Obývačka
  { id:"rl01", name:"Odložiť deky a vankúše",    icon:"🛋️", pts:2, cat:"🛋️ Obývačka",        season:"always"  },
  { id:"rl02", name:"Odložiť ovládače na miesto",icon:"📺", pts:1, cat:"🛋️ Obývačka",        season:"always"  },
  { id:"rl03", name:"Odložiť knihy a hry",       icon:"📚", pts:2, cat:"🛋️ Obývačka",        season:"always"  },
  { id:"rl04", name:"Utrieť prach v obývačke",   icon:"🧹", pts:4, cat:"🛋️ Obývačka",        season:"always"  },
  { id:"rl05", name:"Povysávať obývačku",        icon:"🧹", pts:5, cat:"🛋️ Obývačka",        season:"always"  },
  // 🚿 Kúpeľňa
  { id:"rb01", name:"Utrieť umývadlo po umývaní",icon:"🚿", pts:2, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb02", name:"Zavesiť uterák",            icon:"🧺", pts:1, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb03", name:"Doplniť toaletný papier",   icon:"🧻", pts:2, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb04", name:"Opláchnuť vaňu alebo sprchu",icon:"🚿",pts:2, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb05", name:"Utrieť zrkadlo",            icon:"🪞", pts:3, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb06", name:"Vyniesť kúpeľňový kôš",    icon:"🗑️", pts:3, cat:"🚿 Kúpeľňa",         season:"always"  },
  { id:"rb07", name:"Povysávať kúpeľňu",         icon:"🧹", pts:4, cat:"🚿 Kúpeľňa",         season:"always"  },
  // 🛏️ Izba
  { id:"ri01", name:"Ustlať posteľ",             icon:"🛏️", pts:2, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri02", name:"Odložiť oblečenie do skrine",icon:"👕",pts:2, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri03", name:"Upratať pracovný stôl",     icon:"🖥️", pts:3, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri04", name:"Odložiť knihy a pomôcky",   icon:"📚", pts:2, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri05", name:"Upratať hračky a hry",      icon:"🧸", pts:3, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri06", name:"Utrieť prach",              icon:"🧹", pts:4, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri07", name:"Povysávať izbu",            icon:"🧹", pts:5, cat:"🛏️ Izba",            season:"always"  },
  { id:"ri08", name:"Vyvetrať izbu",             icon:"🌬️", pts:1, cat:"🛏️ Izba",            season:"always"  },
  // 🌿 Dvor & terasa
  { id:"rt01", name:"Pozametať terasu",          icon:"🧹", pts:4, cat:"🌿 Dvor",             season:"always"  },
  { id:"rt02", name:"Odložiť hračky a lopty",    icon:"⚽", pts:3, cat:"🌿 Dvor",             season:"always"  },
  { id:"rt03", name:"Poliať kvety vonku",        icon:"🌸", pts:3, cat:"🌿 Dvor",             season:"always"  },
  { id:"rt04", name:"Pozbierať odpadky",         icon:"🗑️", pts:3, cat:"🌿 Dvor",             season:"always"  },
  { id:"rt05", name:"Pomôcť s hrabaním lístia",  icon:"🍂", pts:6, cat:"🌿 Dvor",             season:"always"  },
  { id:"rt06", name:"Odložiť šľapky na terase",  icon:"🩴", pts:1, cat:"🌿 Dvor",             season:"always"  },
  // 👕 Prádlo
  { id:"l01",  name:"Dať špinavé oblečenie do koša",icon:"👕",pts:2,cat:"👕 Prádlo",          season:"always"  },
  { id:"l02",  name:"Roztriediť čisté oblečenie",icon:"👕", pts:3, cat:"👕 Prádlo",           season:"always"  },
  { id:"l03",  name:"Odložiť čisté oblečenie",   icon:"🗂️", pts:4, cat:"👕 Prádlo",           season:"always"  },
  { id:"l04",  name:"Pomôcť poskladať prádlo",   icon:"👕", pts:4, cat:"👕 Prádlo",           season:"always"  },
  { id:"l05",  name:"Pomôcť vyvesiť prádlo",     icon:"🧺", pts:4, cat:"👕 Prádlo",           season:"always"  },
  { id:"l06",  name:"Pozbierať suché prádlo",    icon:"☀️", pts:4, cat:"👕 Prádlo",           season:"always"  },
  { id:"l07",  name:"Zavesiť mokrý uterák vonku",icon:"🧺", pts:2, cat:"👕 Prádlo",           season:"always"  },
  // 🏊 Bazén
  { id:"p01",  name:"Odložiť bazénové hračky",   icon:"🏖️", pts:3, cat:"🏊 Bazén",            season:"always"  },
  { id:"p02",  name:"Odniesť mokré plavky na sušenie",icon:"👙",pts:2,cat:"🏊 Bazén",         season:"always"  },
  { id:"p03",  name:"Zavesiť uteráky vonku",     icon:"🧺", pts:2, cat:"🏊 Bazén",            season:"always"  },
  { id:"p04",  name:"Upratať okolie bazéna",     icon:"🧹", pts:3, cat:"🏊 Bazén",            season:"always"  },
  { id:"p05",  name:"Pomôcť pri odkrývaní bazéna",icon:"🏊",pts:4, cat:"🏊 Bazén",            season:"always"  },
  { id:"p06",  name:"Pomôcť pri zakrývaní bazéna",icon:"🏊",pts:4, cat:"🏊 Bazén",            season:"always"  },
  // ⚡ Bonusové
  { id:"b01",  name:"Umyť auto",                 icon:"🚗", pts:15,cat:"⚡ Bonusové",         season:"always"  },
  { id:"b02",  name:"Pomôcť s nákupom",          icon:"🛒", pts:6, cat:"⚡ Bonusové",         season:"always"  },
  { id:"b03",  name:"Väčšie upratovanie izby",   icon:"🧹", pts:8, cat:"⚡ Bonusové",         season:"always"  },
  { id:"b04",  name:"Väčšie upratovanie kúpeľne",icon:"🚿", pts:8, cat:"⚡ Bonusové",         season:"always"  },
  { id:"b05",  name:"Pomoc po návšteve",         icon:"🧹", pts:7, cat:"⚡ Bonusové",         season:"always"  },
  { id:"b06",  name:"Hrabanie lístia",           icon:"🍂", pts:8, cat:"⚡ Bonusové",         season:"always"  },
];

// ── Prednastavení členovia ─────────────────────────────
export const INIT_MEMBERS = [
  { id:"homer", name:"Homer", role:"admin",  color:"#4A90D9", label:"Admin 🍩",   pin:"1234", weekPts:0, totalPts:0, streak:0 },
  { id:"marge", name:"Marge", role:"admin",  color:"#8CC63F", label:"Admin 💙",   pin:"1234", weekPts:0, totalPts:0, streak:0 },
  { id:"bart",  name:"Bart",  role:"player", color:"#E53935", label:"14 rokov 🛹", pin:"",    weekPts:0, totalPts:0, streak:0 },
  { id:"lisa",  name:"Lisa",  role:"player", color:"#E91E63", label:"10 rokov 🎷", pin:"",    weekPts:0, totalPts:0, streak:0 },
];

// activeTasks = čo admin pridelil deťom
// { id, taskId, name, icon, pts, cat, who, days, type, season }
// who: "bart"|"lisa"|"kids"|"all"
// days: "every" | [0,1,2,3,4,5,6]  (0=Po)
// type: "mandatory"|"voluntary"|"bonus"
export const INIT_ACTIVE = [];

export const INIT_REWARDS = [
  { id:"r1", name:"Extra čas na mobile",    emoji:"📱", points:50,  who:"Bart, Lisa", active:true },
  { id:"r2", name:"Pizza večer",            emoji:"🍕", points:80,  who:"Všetci",     active:true },
  { id:"r3", name:"Neskoršia večierka",     emoji:"🌙", points:100, who:"Bart, Lisa", active:true },
  { id:"r4", name:"Výber sobotného filmu",  emoji:"🎬", points:120, who:"Všetci",     active:true },
  { id:"r5", name:"Nové vlasy / účes",      emoji:"💇", points:200, who:"Lisa",       active:true },
  { id:"r6", name:"Nová kabelka",           emoji:"👜", points:250, who:"Lisa",       active:true },
  { id:"r7", name:"Nové oblečenie",         emoji:"👗", points:300, who:"Bart, Lisa", active:true },
  { id:"r8", name:"Elektroauto fond",       emoji:"🚗⚡",points:500, who:"Homer",      active:true },
  { id:"r9", name:"Kino celá rodina",       emoji:"🎥", points:150, who:"Všetci",     active:true },
];

export const INIT_SEASONS = [
  { id:"school",  name:"Školský rok", emoji:"🎒", active:true  },
  { id:"holiday", name:"Prázdniny",   emoji:"🌞", active:false },
];

export const INIT_CHAT = [
  { id:1, from:"system", text:"🔥 Vitajte v Rodinné Quest! Simpsonovci, do toho! 🏠", time:"08:00" },
  { id:2, from:"maggie", name:"🐹 Maggie", text:"Nakŕmte ma prosím! Som hladná 😤", time:"09:00", color:"#FF8F00" },
];

export const INIT_PROPOSALS = [
  { id:1, from:"Bart", fromColor:"#E53935", emoji:"🎮", text:"Chcem odmenu: nová hra", type:"reward", status:"pending", date:"dnes" },
  { id:2, from:"Lisa", fromColor:"#E91E63", emoji:"🐾", text:"Chcem navštíviť útulok", type:"reward", status:"pending", date:"dnes" },
];

// ── Pomocné funkcie ────────────────────────────────────
export const getLvl = (pts) =>
  Math.max(0, LPTS.findIndex((p,i) => pts < (LPTS[i+1] || 9999)));

export const getLvlPct = (pts) => {
  const lvl = getLvl(pts);
  return Math.min((pts - LPTS[lvl]) / (LPTS[Math.min(lvl+1,5)] - LPTS[lvl]) * 100, 100);
};

export const getTodayIdx = () => (new Date().getDay() + 6) % 7; // 0=Po

export const taskForMember = (at, memberId, seasonId) => {
  if (at.season !== "always" && at.season !== seasonId) return false;
  return at.who === memberId ||
         at.who === "all" ||
         (at.who === "kids" && (memberId === "bart" || memberId === "lisa"));
};

export const taskForToday = (at) => {
  const todayIdx = getTodayIdx();
  return at.days === "every" || (Array.isArray(at.days) && at.days.includes(todayIdx));
};
