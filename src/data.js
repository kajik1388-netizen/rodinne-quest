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

// ── Sezóny (multi-select pre úlohy) ────────────────────
// "school" | "holiday" | "other" | vlastné ID z INIT_CUSTOM_SEASONS
export const BASE_SEASONS = [
  { id:"school",  name:"Školský rok", emoji:"🎒" },
  { id:"holiday", name:"Prázdniny",   emoji:"🌞" },
  { id:"other",   name:"Iné",         emoji:"⚡" },
];

// ── Kategórie (miestnosť/typ) — zjednotené ─────────────
export const BASE_CATEGORIES = [
  { id:"morning",  l:"🌅 Ranná rutina"  },
  { id:"evening",  l:"🌙 Večerná rutina"},
  { id:"school",   l:"🎒 Škola"         },
  { id:"bathroom", l:"🛁 Kúpeľňa"       },
  { id:"kitchen",  l:"🍳 Kuchyňa"       },
  { id:"living",   l:"🛋️ Obývačka"      },
  { id:"room",     l:"🛏️ Izba"          },
  { id:"yard",     l:"🌿 Dvor"          },
  { id:"maggie",   l:"🐹 Maggie"        },
  { id:"laundry",  l:"👕 Prádlo"        },
  { id:"pool",     l:"🏊 Bazén"         },
  { id:"other",    l:"⚡ Iné"           },
];

// ── Databáza všetkých úloh ─────────────────────────────
// season: pole ["school","holiday","other"] — môže byť vo viacerých naraz
// cat: kategória (miestnosť/typ) — id z BASE_CATEGORIES alebo vlastná
export const TASK_LIBRARY = [
  // 🌅 Ranná rutina
  { id:"sm01", name:"Umyť si zuby",               icon:"🪥", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm02", name:"Umyť si tvár",                icon:"💧", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm03", name:"Učesať sa",                   icon:"💇", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm04", name:"Obliecť sa",                  icon:"👗", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm05", name:"Ustlať posteľ",               icon:"🛏️", pts:2, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm06", name:"Dať pyžamo na miesto",        icon:"🌙", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm07", name:"Skontrolovať školskú tašku",  icon:"🎒", pts:2, cat:"school",   season:["school"] },
  { id:"sm08", name:"Zobrať desiatu",              icon:"🥪", pts:1, cat:"school",   season:["school"] },
  { id:"sm09", name:"Zobrať fľašu s vodou",        icon:"💧", pts:1, cat:"morning",  season:["school","holiday","other"] },
  { id:"sm10", name:"Odísť načas do školy",        icon:"⏰", pts:2, cat:"school",   season:["school"] },
  { id:"hm01", name:"Vstať do dohodnutého času",   icon:"⏰", pts:2, cat:"morning",  season:["holiday","other"] },

  // 🎒 Po škole / Škola
  { id:"sr01", name:"Odložiť topánky na miesto",   icon:"👟", pts:1, cat:"school",   season:["school"] },
  { id:"sr02", name:"Zavesiť bundu alebo mikinu",  icon:"🧥", pts:1, cat:"school",   season:["school"] },
  { id:"sr03", name:"Odložiť školskú tašku",       icon:"🎒", pts:1, cat:"school",   season:["school"] },
  { id:"sr04", name:"Vyložiť desiatový box",       icon:"🥡", pts:1, cat:"school",   season:["school"] },
  { id:"sr05", name:"Prezliecť sa do domáceho",    icon:"👕", pts:1, cat:"school",   season:["school","holiday","other"] },
  { id:"sr06", name:"Nenechať oblečenie pohodené", icon:"🚫", pts:2, cat:"school",   season:["school","holiday","other"] },
  { id:"sd01", name:"Skontrolovať EduPage",        icon:"📱", pts:2, cat:"school",   season:["school"] },
  { id:"sd02", name:"Urobiť domáce úlohy",         icon:"📝", pts:5, cat:"school",   season:["school"] },
  { id:"sd03", name:"Naučiť sa na písomku",        icon:"📖", pts:5, cat:"school",   season:["school"] },
  { id:"sd04", name:"Nachystať učebnice",          icon:"📚", pts:3, cat:"school",   season:["school"] },
  { id:"sd05", name:"Nachystať peračník",          icon:"✏️", pts:2, cat:"school",   season:["school"] },
  { id:"sd06", name:"Pripraviť tašku na zajtra",   icon:"🎒", pts:3, cat:"school",   season:["school"] },

  // 🌙 Večerná rutina
  { id:"se01", name:"Upratať si pracovný stôl",    icon:"🖥️", pts:3, cat:"evening",  season:["school","holiday","other"] },
  { id:"se02", name:"Odložiť oblečenie",           icon:"👕", pts:2, cat:"evening",  season:["school","holiday","other"] },
  { id:"se03", name:"Umyť si zuby večer",          icon:"🪥", pts:1, cat:"evening",  season:["school","holiday","other"] },
  { id:"se04", name:"Osprchovať sa",               icon:"🚿", pts:2, cat:"evening",  season:["school","holiday","other"] },
  { id:"se05", name:"Dať nabíjať zariadenia",      icon:"🔋", pts:1, cat:"evening",  season:["school","holiday","other"] },
  { id:"se06", name:"Ísť spať v dohodnutom čase",  icon:"😴", pts:2, cat:"evening",  season:["school","holiday","other"] },

  // 🌞 Prázdniny ráno
  { id:"hm02", name:"Ustlať posteľ",               icon:"🛏️", pts:2, cat:"morning",  season:["holiday","other"] },
  { id:"hm03", name:"Nenechať oblečenie na zemi",  icon:"🚫", pts:2, cat:"morning",  season:["holiday","other"] },
  { id:"hm04", name:"Odniesť riad po raňajkách",   icon:"🍽️", pts:1, cat:"kitchen",  season:["holiday","other"] },
  { id:"hm05", name:"Dať riad do umývačky",        icon:"🧺", pts:2, cat:"kitchen",  season:["holiday","other"] },
  { id:"hm06", name:"Utrieť po sebe stôl",         icon:"🧹", pts:2, cat:"kitchen",  season:["holiday","other"] },

  // 📋 Denné (vždy)
  { id:"d01",  name:"Odniesť riad po sebe",        icon:"🍽️", pts:1, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"d02",  name:"Dať riad do umývačky",        icon:"🧺", pts:2, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"d03",  name:"Vybrať čistý riad z umývačky",icon:"✨", pts:4, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"d04",  name:"Dať oblečenie do koša/skrine",icon:"👕", pts:2, cat:"room",     season:["school","holiday","other"] },
  { id:"d05",  name:"Odkladať veci na miesto",     icon:"📦", pts:2, cat:"living",   season:["school","holiday","other"] },
  { id:"d06",  name:"Ustlať posteľ",               icon:"🛏️", pts:2, cat:"room",     season:["school","holiday","other"] },
  { id:"d07",  name:"Zhasínať svetlo po odchode",  icon:"💡", pts:1, cat:"living",   season:["school","holiday","other"] },
  { id:"d08",  name:"Vypnúť TV keď ho nepozerám",  icon:"📺", pts:1, cat:"living",   season:["school","holiday","other"] },
  { id:"d09",  name:"Odložiť topánky na miesto",   icon:"👟", pts:1, cat:"living",   season:["school","holiday","other"] },
  { id:"d10",  name:"Vyniesť smeti",               icon:"🗑️", pts:3, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"d11",  name:"Poliať kvety",                icon:"🌸", pts:3, cat:"living",   season:["school","holiday","other"] },

  // 🐹 Maggie
  { id:"mg01", name:"Skontrolovať vodu Maggie",       icon:"💧", pts:1, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg02", name:"Doplniť vodu Maggie",            icon:"💧", pts:2, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg03", name:"Skontrolovať seno",              icon:"🌾", pts:1, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg04", name:"Doplniť seno",                   icon:"🌾", pts:2, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg05", name:"Nakrájať zeleninu ráno",         icon:"🥕", pts:3, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg06", name:"Dať rannú zeleninu Maggie",      icon:"🐹", pts:2, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg07", name:"Nakrájať zeleninu večer",        icon:"🥕", pts:3, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg08", name:"Dať večernú zeleninu Maggie",    icon:"🐹", pts:2, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg09", name:"Vyhodiť staré zvyšky",           icon:"🗑️", pts:2, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg10", name:"Skontrolovať stav Maggie",       icon:"🐹", pts:1, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg11", name:"Povysávať seno okolo klietky",   icon:"🧹", pts:3, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg12", name:"Kompletne vyčistiť klietku",     icon:"🐹", pts:10,cat:"maggie", season:["school","holiday","other"] },
  { id:"mg13", name:"Vymeniť podstielku",             icon:"🌾", pts:7, cat:"maggie", season:["school","holiday","other"] },
  { id:"mg14", name:"Umyť misku a napájačku",         icon:"🫙", pts:3, cat:"maggie", season:["school","holiday","other"] },

  // 🍳 Kuchyňa
  { id:"rk01", name:"Odniesť riad zo stola",       icon:"🍽️", pts:1, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk02", name:"Utrieť jedálenský stôl",      icon:"🧹", pts:2, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk03", name:"Utrieť kuchynskú linku",      icon:"🧽", pts:3, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk04", name:"Vyniesť kuchynský kôš",       icon:"🗑️", pts:3, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk05", name:"Roztriediť odpad",            icon:"♻️", pts:3, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk06", name:"Nenechať jedlo vonku",        icon:"🚫", pts:2, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk07", name:"Pomôcť s prípravou jedla",    icon:"🍳", pts:5, cat:"kitchen",  season:["school","holiday","other"] },
  { id:"rk08", name:"Umyť drez",                   icon:"🚰", pts:4, cat:"kitchen",  season:["school","holiday","other"] },

  // 🛋️ Obývačka
  { id:"rl01", name:"Odložiť deky a vankúše",      icon:"🛋️", pts:2, cat:"living",   season:["school","holiday","other"] },
  { id:"rl02", name:"Odložiť ovládače na miesto",  icon:"📺", pts:1, cat:"living",   season:["school","holiday","other"] },
  { id:"rl03", name:"Odložiť knihy a hry",         icon:"📚", pts:2, cat:"living",   season:["school","holiday","other"] },
  { id:"rl04", name:"Utrieť prach v obývačke",     icon:"🧹", pts:4, cat:"living",   season:["school","holiday","other"] },
  { id:"rl05", name:"Povysávať obývačku",          icon:"🧹", pts:5, cat:"living",   season:["school","holiday","other"] },

  // 🚿 Kúpeľňa
  { id:"rb01", name:"Utrieť umývadlo po umývaní",  icon:"🚿", pts:2, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb02", name:"Zavesiť uterák",              icon:"🧺", pts:1, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb03", name:"Doplniť toaletný papier",     icon:"🧻", pts:2, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb04", name:"Opláchnuť vaňu alebo sprchu", icon:"🚿", pts:2, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb05", name:"Utrieť zrkadlo",              icon:"🪞", pts:3, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb06", name:"Vyniesť kúpeľňový kôš",      icon:"🗑️", pts:3, cat:"bathroom", season:["school","holiday","other"] },
  { id:"rb07", name:"Povysávať kúpeľňu",           icon:"🧹", pts:4, cat:"bathroom", season:["school","holiday","other"] },

  // 🛏️ Izba
  { id:"ri01", name:"Ustlať posteľ",               icon:"🛏️", pts:2, cat:"room",     season:["school","holiday","other"] },
  { id:"ri02", name:"Odložiť oblečenie do skrine", icon:"👕", pts:2, cat:"room",     season:["school","holiday","other"] },
  { id:"ri03", name:"Upratať pracovný stôl",       icon:"🖥️", pts:3, cat:"room",     season:["school","holiday","other"] },
  { id:"ri04", name:"Odložiť knihy a pomôcky",     icon:"📚", pts:2, cat:"room",     season:["school","holiday","other"] },
  { id:"ri05", name:"Upratať hračky a hry",        icon:"🧸", pts:3, cat:"room",     season:["school","holiday","other"] },
  { id:"ri06", name:"Utrieť prach",                icon:"🧹", pts:4, cat:"room",     season:["school","holiday","other"] },
  { id:"ri07", name:"Povysávať izbu",              icon:"🧹", pts:5, cat:"room",     season:["school","holiday","other"] },
  { id:"ri08", name:"Vyvetrať izbu",               icon:"🌬️", pts:1, cat:"room",     season:["school","holiday","other"] },

  // 🌿 Dvor & terasa
  { id:"rt01", name:"Pozametať terasu",            icon:"🧹", pts:4, cat:"yard",     season:["school","holiday","other"] },
  { id:"rt02", name:"Odložiť hračky a lopty",      icon:"⚽", pts:3, cat:"yard",     season:["school","holiday","other"] },
  { id:"rt03", name:"Poliať kvety vonku",          icon:"🌸", pts:3, cat:"yard",     season:["school","holiday","other"] },
  { id:"rt04", name:"Pozbierať odpadky",           icon:"🗑️", pts:3, cat:"yard",     season:["school","holiday","other"] },
  { id:"rt05", name:"Pomôcť s hrabaním lístia",    icon:"🍂", pts:6, cat:"yard",     season:["school","holiday","other"] },
  { id:"rt06", name:"Odložiť šľapky na terase",    icon:"🩴", pts:1, cat:"yard",     season:["school","holiday","other"] },

  // 👕 Prádlo
  { id:"l01",  name:"Dať špinavé oblečenie do koša",icon:"👕",pts:2, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l02",  name:"Roztriediť čisté oblečenie",  icon:"👕", pts:3, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l03",  name:"Odložiť čisté oblečenie",     icon:"🗂️", pts:4, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l04",  name:"Pomôcť poskladať prádlo",     icon:"👕", pts:4, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l05",  name:"Pomôcť vyvesiť prádlo",       icon:"🧺", pts:4, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l06",  name:"Pozbierať suché prádlo",      icon:"☀️", pts:4, cat:"laundry",  season:["school","holiday","other"] },
  { id:"l07",  name:"Zavesiť mokrý uterák vonku",  icon:"🧺", pts:2, cat:"laundry",  season:["school","holiday","other"] },

  // 🏊 Bazén
  { id:"p01",  name:"Odložiť bazénové hračky",     icon:"🏖️", pts:3, cat:"pool",     season:["holiday","other"] },
  { id:"p02",  name:"Odniesť mokré plavky na sušenie",icon:"👙",pts:2,cat:"pool",     season:["holiday","other"] },
  { id:"p03",  name:"Zavesiť uteráky vonku",       icon:"🧺", pts:2, cat:"pool",     season:["holiday","other"] },
  { id:"p04",  name:"Upratať okolie bazéna",       icon:"🧹", pts:3, cat:"pool",     season:["holiday","other"] },
  { id:"p05",  name:"Pomôcť pri odkrývaní bazéna", icon:"🏊", pts:4, cat:"pool",     season:["holiday","other"] },
  { id:"p06",  name:"Pomôcť pri zakrývaní bazéna", icon:"🏊", pts:4, cat:"pool",     season:["holiday","other"] },

  // ⚡ Bonusové
  { id:"b01",  name:"Umyť auto",                   icon:"🚗", pts:15,cat:"other",    season:["school","holiday","other"] },
  { id:"b02",  name:"Pomôcť s nákupom",            icon:"🛒", pts:6, cat:"other",    season:["school","holiday","other"] },
  { id:"b03",  name:"Väčšie upratovanie izby",     icon:"🧹", pts:8, cat:"room",     season:["school","holiday","other"] },
  { id:"b04",  name:"Väčšie upratovanie kúpeľne",  icon:"🚿", pts:8, cat:"bathroom", season:["school","holiday","other"] },
  { id:"b05",  name:"Pomoc po návšteve",           icon:"🧹", pts:7, cat:"other",    season:["school","holiday","other"] },
  { id:"b06",  name:"Hrabanie lístia",             icon:"🍂", pts:8, cat:"yard",     season:["school","holiday","other"] },
];

// ── Prednastavení členovia ─────────────────────────────
export const INIT_MEMBERS = [
  { id:"homer", name:"Homer", role:"admin",  color:"#4A90D9", label:"Admin 🍩",   pin:"1234", weekPts:0, totalPts:0, streak:0 },
  { id:"marge", name:"Marge", role:"admin",  color:"#8CC63F", label:"Admin 💙",   pin:"1234", weekPts:0, totalPts:0, streak:0 },
  { id:"bart",  name:"Bart",  role:"player", color:"#E53935", label:"14 rokov 🛹", pin:"",    weekPts:0, totalPts:0, streak:0 },
  { id:"lisa",  name:"Lisa",  role:"player", color:"#E91E63", label:"10 rokov 🎷", pin:"",    weekPts:0, totalPts:0, streak:0 },
];

// activeTasks = čo admin pridelil deťom
// { id, taskId, name, icon, pts, cat, who, days, type, season, note }
// who: "bart"|"lisa"|"homer"|"marge"|["bart","lisa",...]|"kids"|"all"
// days: "every" | [0,1,2,3,4,5,6]  (0=Po)
// type: "mandatory"|"voluntary"|"bonus"
// season: pole sezón ["school","holiday","other"] alebo vlastných ID
export const INIT_ACTIVE = [];

// Vlastné sezóny ktoré si admin vytvoril navyše k base (school/holiday/other)
export const INIT_CUSTOM_SEASONS = [];
// { id, name, emoji }

// Vlastné kategórie ktoré si admin vytvoril navyše k BASE_CATEGORIES
export const INIT_CUSTOM_CATEGORIES = [];
// { id, l }

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

// at.season môže byť pole (nové) alebo string (staré dáta — spätná kompatibilita)
export const taskSeasonMatch = (at, seasonId) => {
  if (!at.season) return true;
  if (Array.isArray(at.season)) return at.season.includes(seasonId) || at.season.includes("always");
  return at.season === seasonId || at.season === "always";
};

export const taskForMember = (at, memberId, seasonId) => {
  if (!taskSeasonMatch(at, seasonId)) return false;
  if (Array.isArray(at.who)) return at.who.includes(memberId);
  return at.who === memberId ||
         at.who === "all" ||
         (at.who === "kids" && (memberId === "bart" || memberId === "lisa"));
};

export const taskForToday = (at) => {
  const todayIdx = getTodayIdx();
  return at.days === "every" || (Array.isArray(at.days) && at.days.includes(todayIdx));
};

// ── Achievementy ───────────────────────────────────────
export const ACHIEVEMENTS = [
  { id:"first_task",  name:"Prvá úloha!",    emoji:"🌱", desc:"Splnil/a prvú úlohu",       check:(m,d) => (m.totalPts||0) >= 1 },
  { id:"streak3",     name:"3 dni v rade!",  emoji:"🔥", desc:"3 dni streak",              check:(m,d) => (m.streak||0) >= 3 },
  { id:"streak7",     name:"Týždeň v rade!", emoji:"💪", desc:"7 dní streak",              check:(m,d) => (m.streak||0) >= 7 },
  { id:"streak30",    name:"Mesiac v rade!", emoji:"🏆", desc:"30 dní streak",             check:(m,d) => (m.streak||0) >= 30 },
  { id:"pts50",       name:"50 bodov!",      emoji:"⭐", desc:"Získal/a 50 bodov",        check:(m,d) => (m.totalPts||0) >= 50 },
  { id:"pts100",      name:"100 bodov!",     emoji:"💯", desc:"Získal/a 100 bodov",       check:(m,d) => (m.totalPts||0) >= 100 },
  { id:"pts300",      name:"300 bodov!",     emoji:"🌟", desc:"Získal/a 300 bodov",       check:(m,d) => (m.totalPts||0) >= 300 },
  { id:"pts500",      name:"500 bodov!",     emoji:"👑", desc:"Získal/a 500 bodov",       check:(m,d) => (m.totalPts||0) >= 500 },
  { id:"maggie_hero", name:"Maggie Hero!",   emoji:"🐹", desc:"Splnil/a 10 Maggie úloh",  check:(m,d) => Object.values(d||{}).reduce((t,day) => t + Object.entries(day||{}).filter(([k,v]) => v==="done" && k.includes("mg")).length, 0) >= 10 },
  { id:"early_bird",  name:"Ranné vtáča!",   emoji:"🌅", desc:"Splnil/a 5 ranných úloh",  check:(m,d) => Object.values(d||{}).reduce((t,day) => t + Object.entries(day||{}).filter(([k,v]) => v==="done" && k.includes("morning")).length, 0) >= 5 },
  { id:"shop_first",  name:"Prvý nákup!",    emoji:"🛍️", desc:"Kúpil/a prvý predmet",     check:(m,d) => (m.inventory||[]).length >= 1 },
  { id:"shop5",       name:"Shopaholic!",    emoji:"🛒", desc:"Kúpil/a 5 predmetov",      check:(m,d) => (m.inventory||[]).length >= 5 },
];