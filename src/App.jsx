import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════
//  KONŠTANTY & TÉMA
// ═══════════════════════════════════════════════════════
const YELLOW = "#FFD90F";
const DARK   = "#1A1A2E";
const DARK2  = "#16213E";
const BG     = "#F0EEF8";

const MEMBER_COLORS = { homer:"#4A90D9", marge:"#8CC63F", bart:"#E53935", lisa:"#E91E63" };
const LEVELS = ["🌱 Začiatočník","⚡ Pomocník","🌟 Šikovný","🔥 Expert","🏆 Majster","👑 Legenda"];
const LEVEL_PTS = [0,50,150,300,500,800];

// ═══════════════════════════════════════════════════════
//  DATABÁZA ÚLOH (z rodinného dokumentu)
// ═══════════════════════════════════════════════════════
const F = { DAILY:"Denne", WEEKLY:"Týždeň", BIWEEKLY:"Raz za 2 týž.", ASNEEDED:"Podľa potreby", ONCE:"Jednorazová" };

const INIT_TASKS_DB = {
  "🌅 Školské ráno": [
    { id:"sm01", name:"Umyť si zuby",                    points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🪥", season:"school" },
    { id:"sm02", name:"Umyť si tvár",                    points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"💧", season:"school" },
    { id:"sm03", name:"Učesať sa",                       points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"💇", season:"school" },
    { id:"sm04", name:"Obliecť sa",                      points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👗", season:"school" },
    { id:"sm05", name:"Ustlať posteľ",                   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🛏️", season:"school" },
    { id:"sm06", name:"Dať pyžamo na miesto",            points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🌙", season:"school" },
    { id:"sm07", name:"Skontrolovať školskú tašku",      points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🎒", season:"school" },
    { id:"sm08", name:"Zobrať desiatu",                  points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🥪", season:"school" },
    { id:"sm09", name:"Zobrať fľašu s vodou",            points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"💧", season:"school" },
    { id:"sm10", name:"Odísť načas do školy",            points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"⏰", season:"school" },
  ],
  "🎒 Po príchode zo školy": [
    { id:"sr01", name:"Odložiť topánky na miesto",       points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👟", season:"school" },
    { id:"sr02", name:"Zavesiť bundu alebo mikinu",      points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧥", season:"school" },
    { id:"sr03", name:"Odložiť školskú tašku na miesto", points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🎒", season:"school" },
    { id:"sr04", name:"Vyložiť desiatový box",           points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🥡", season:"school" },
    { id:"sr05", name:"Prezliecť sa do domáceho",        points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👕", season:"school" },
    { id:"sr06", name:"Nenechať oblečenie pohodené",     points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🚫", season:"school" },
  ],
  "📚 Školské povinnosti": [
    { id:"sd01", name:"Skontrolovať EduPage",            points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"📱", season:"school" },
    { id:"sd02", name:"Urobiť domáce úlohy",             points:5, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"📝", season:"school" },
    { id:"sd03", name:"Naučiť sa na písomku",            points:5, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"📖", season:"school" },
    { id:"sd04", name:"Nachystať učebnice podľa rozvrhu",points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"📚", season:"school" },
    { id:"sd05", name:"Nachystať peračník",              points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"✏️", season:"school" },
    { id:"sd06", name:"Ukázať rodičovi dôležité oznamy", points:2, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:true,  icon:"📣", season:"school" },
    { id:"sd07", name:"Pripraviť tašku na ďalší deň",   points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🎒", season:"school" },
  ],
  "🌙 Školský večer": [
    { id:"se01", name:"Upratať si pracovný stôl",        points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🖥️", season:"school" },
    { id:"se02", name:"Odložiť oblečenie na miesto",     points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👕", season:"school" },
    { id:"se03", name:"Nachystať oblečenie na zajtra",   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"👔", season:"school" },
    { id:"se04", name:"Umyť si zuby",                    points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🪥", season:"school" },
    { id:"se05", name:"Osprchovať sa",                   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"🚿", season:"school" },
    { id:"se06", name:"Dať nabíjať zariadenia",          points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🔋", season:"school" },
    { id:"se07", name:"Ísť spať v dohodnutom čase",      points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"😴", season:"school" },
  ],
  "🌞 Prázdninové ráno": [
    { id:"hm01", name:"Vstať do dohodnutého času",       points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"⏰", season:"holiday" },
    { id:"hm02", name:"Umyť si zuby",                    points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🪥", season:"holiday" },
    { id:"hm03", name:"Ustlať posteľ",                   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🛏️", season:"holiday" },
    { id:"hm04", name:"Nenechať oblečenie na zemi",      points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🚫", season:"holiday" },
    { id:"hm05", name:"Odniesť riad po raňajkách",       points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🍽️", season:"holiday" },
    { id:"hm06", name:"Dať riad do umývačky",            points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧺", season:"holiday" },
    { id:"hm07", name:"Utrieť po sebe stôl",             points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧹", season:"holiday" },
    { id:"hm08", name:"Dať Maggie rannú zeleninu",       points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"holiday" },
    { id:"hm09", name:"Skontrolovať seno a vodu Maggie", points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"holiday" },
    { id:"hm10", name:"Zhasnúť svetlá, ktoré netreba",   points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"💡", season:"holiday" },
  ],
  "☀️ Prázdniny — dopoludnie": [
    { id:"hf01", name:"Upratať po raňajkách",            points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🍽️", season:"holiday" },
    { id:"hf02", name:"Upratať svoju izbu základne",     points:4, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🛏️", season:"holiday" },
    { id:"hf03", name:"Vybrať čistý riad z umývačky",    points:4, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"✨", season:"holiday" },
    { id:"hf04", name:"Nechať kuchyňu čistú",            points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🍳", season:"holiday" },
    { id:"hf05", name:"Vyniesť smeti, ak je plný kôš",   points:3, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🗑️", season:"holiday" },
    { id:"hf06", name:"Poliať kvety podľa potreby",      points:3, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🌸", season:"holiday" },
    { id:"hf07", name:"Odložiť hry, lopty a veci z dvora",points:3,freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"⚽", season:"holiday" },
  ],
  "📋 Denné (vždy)": [
    { id:"d01", name:"Odniesť riad po sebe",             points:1, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🍽️", season:"always" },
    { id:"d02", name:"Dať riad do umývačky",             points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🧺", season:"always" },
    { id:"d03", name:"Vybrať čistý riad z umývačky",     points:4, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"✨", season:"always" },
    { id:"d04", name:"Dať oblečenie do koša alebo skrine",points:2,freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"👕", season:"always" },
    { id:"d05", name:"Odkladať veci na miesto",          points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"📦", season:"always" },
    { id:"d06", name:"Ustlať posteľ",                    points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🛏️", season:"always" },
    { id:"d07", name:"Základne upratať izbu",            points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧹", season:"always" },
    { id:"d08", name:"Zhasínať svetlo po odchode",       points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"💡", season:"always" },
    { id:"d09", name:"Vypnúť TV, keď ho nepozerám",      points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"📺", season:"always" },
    { id:"d10", name:"Odložiť topánky na miesto",        points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"👟", season:"always" },
    { id:"d11", name:"Upratať veci na dvore",            points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"⚽", season:"always" },
    { id:"d12", name:"Vyniesť smeti podľa rozpisu",      points:3, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"🗑️", season:"always" },
    { id:"d13", name:"Poliať kvety podľa rozpisu",       points:3, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🌸", season:"always" },
  ],
  "🐹 Maggie — ráno": [
    { id:"mm01", name:"Skontrolovať vodu",               points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"💧", season:"always" },
    { id:"mm02", name:"Doplniť vodu",                    points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"💧", season:"always" },
    { id:"mm03", name:"Skontrolovať seno",               points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🌾", season:"always" },
    { id:"mm04", name:"Doplniť seno",                    points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"🌾", season:"always" },
    { id:"mm05", name:"Nakrájať čerstvú zeleninu",       points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🥕", season:"always" },
    { id:"mm06", name:"Dať rannú zeleninu Maggie",       points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"always" },
    { id:"mm07", name:"Vyhodiť staré zvyšky zeleniny",   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🗑️", season:"always" },
    { id:"mm08", name:"Skontrolovať stav Maggie",        points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"always" },
  ],
  "🐹 Maggie — večer": [
    { id:"me01", name:"Skontrolovať vodu",               points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"💧", season:"always" },
    { id:"me02", name:"Doplniť vodu",                    points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"💧", season:"always" },
    { id:"me03", name:"Nakrájať zeleninu",               points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🥕", season:"always" },
    { id:"me04", name:"Dať večernú zeleninu Maggie",     points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"always" },
    { id:"me05", name:"Vyhodiť staré zvyšky",            points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🗑️", season:"always" },
    { id:"me06", name:"Povysávať seno okolo klietky",    points:3, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🧹", season:"always" },
  ],
  "🐹 Maggie — raz za 2 týž.": [
    { id:"mb01", name:"Kompletne vyčistiť klietku",      points:10,freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🐹", season:"always" },
    { id:"mb02", name:"Vymeniť podstielku",              points:7, freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🌾", season:"always" },
    { id:"mb03", name:"Umyť spodok klietky",             points:7, freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🧹", season:"always" },
    { id:"mb04", name:"Umyť misku a napájačku",          points:3, freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🫙", season:"always" },
    { id:"mb05", name:"Utrieť priestor okolo klietky",   points:4, freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🧽", season:"always" },
    { id:"mb06", name:"Vyniesť použitú podstielku",      points:4, freq:F.BIWEEKLY, who:"Bart, Lisa", mandatory:true,  icon:"🗑️", season:"always" },
  ],
  "🏊 Bazén": [
    { id:"pd01", name:"Odkryť bazén",                    points:5, freq:F.DAILY,    who:"Homer, Marge",mandatory:true, icon:"🏊", season:"pool" },
    { id:"pd02", name:"Zapnúť ohrev bazéna",             points:3, freq:F.DAILY,    who:"Homer, Marge",mandatory:true, icon:"🌡️", season:"pool" },
    { id:"pd03", name:"Pomôcť pri odkrývaní bazéna",     points:4, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"🏊", season:"pool" },
    { id:"pa01", name:"Odložiť bazénové hračky",         points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🏖️", season:"pool" },
    { id:"pa02", name:"Odniesť mokré plavky na sušenie", points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👙", season:"pool" },
    { id:"pa03", name:"Zavesiť uteráky vonku",           points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧺", season:"pool" },
    { id:"pa04", name:"Upratať okolie bazéna",           points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧹", season:"pool" },
    { id:"pe01", name:"Zakryť bazén",                    points:5, freq:F.DAILY,    who:"Homer, Marge",mandatory:true, icon:"🏊", season:"pool" },
    { id:"pe02", name:"Vypnúť ohrev bazéna",             points:3, freq:F.DAILY,    who:"Homer, Marge",mandatory:true, icon:"🌡️", season:"pool" },
    { id:"pe03", name:"Pomôcť pri zakrývaní bazéna",     points:4, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"🏊", season:"pool" },
  ],
  "🍳 Kuchyňa": [
    { id:"rk01", name:"Odniesť riad zo stola",           points:1, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🍽️", season:"always" },
    { id:"rk02", name:"Dať riad do umývačky",            points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🧺", season:"always" },
    { id:"rk03", name:"Vybrať čistý riad z umývačky",    points:4, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"✨", season:"always" },
    { id:"rk04", name:"Utrieť jedálenský stôl",          points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🧹", season:"always" },
    { id:"rk05", name:"Utrieť kuchynskú linku",          points:3, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"🧽", season:"always" },
    { id:"rk06", name:"Vyniesť kuchynský kôš",           points:3, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🗑️", season:"always" },
    { id:"rk07", name:"Roztriediť odpad",                points:3, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"♻️", season:"always" },
    { id:"rk08", name:"Nenechať jedlo vonku",            points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🚫", season:"always" },
    { id:"rk09", name:"Pomôcť s prípravou jedla",        points:5, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🍳", season:"always" },
    { id:"rk10", name:"Umyť drez",                       points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🚰", season:"always" },
  ],
  "🛋️ Obývačka": [
    { id:"rl01", name:"Odniesť poháre a taniere",        points:1, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🍽️", season:"always" },
    { id:"rl02", name:"Odložiť deky a vankúše",          points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🛋️", season:"always" },
    { id:"rl03", name:"Odložiť ovládače na miesto",      points:1, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"📺", season:"always" },
    { id:"rl04", name:"Odložiť knihy, hry, nabíjačky",   points:2, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"📚", season:"always" },
    { id:"rl05", name:"Utrieť prach v obývačke",         points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"rl06", name:"Povysávať obývačku",              points:5, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
  ],
  "💼 Pracovňa": [
    { id:"ro01", name:"Upratať pracovný stôl",           points:3, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🖥️", season:"always" },
    { id:"ro02", name:"Odložiť papiere a zošity",        points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"📄", season:"always" },
    { id:"ro03", name:"Utrieť pracovný stôl",            points:3, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧽", season:"always" },
    { id:"ro04", name:"Povysávať pracovňu",              points:5, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"ro05", name:"Skontrolovať vypnuté svetlá",     points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"💡", season:"always" },
  ],
  "🚿 Kúpeľňa": [
    { id:"rb01", name:"Po umývaní utrieť umývadlo",      points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🚿", season:"always" },
    { id:"rb02", name:"Odložiť kefku, pastu a hrebeň",   points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🪥", season:"always" },
    { id:"rb03", name:"Zavesiť uterák",                  points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🧺", season:"always" },
    { id:"rb04", name:"Dať špinavé oblečenie do koša",   points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"👕", season:"always" },
    { id:"rb05", name:"Doplniť toaletný papier",         points:2, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🧻", season:"always" },
    { id:"rb06", name:"Vyniesť kúpeľňový kôš",          points:3, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🗑️", season:"always" },
    { id:"rb07", name:"Opláchnuť vaňu alebo sprchu",     points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🚿", season:"always" },
    { id:"rb08", name:"Utrieť zrkadlo",                  points:3, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🪞", season:"always" },
    { id:"rb09", name:"Povysávať kúpeľňu",               points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"rb10", name:"Umyť podlahu v kúpeľni",         points:5, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
  ],
  "🛏️ Detská izba": [
    { id:"rkid01", name:"Ustlať posteľ",                 points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🛏️", season:"always" },
    { id:"rkid02", name:"Odložiť oblečenie do skrine",   points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"👕", season:"always" },
    { id:"rkid03", name:"Upratať pracovný stôl",         points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🖥️", season:"always" },
    { id:"rkid04", name:"Odložiť knihy a pomôcky",       points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"📚", season:"always" },
    { id:"rkid05", name:"Upratať hračky a hry",          points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🧸", season:"always" },
    { id:"rkid06", name:"Utrieť prach",                  points:4, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"🧹", season:"always" },
    { id:"rkid07", name:"Povysávať izbu",                points:5, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"🧹", season:"always" },
    { id:"rkid08", name:"Nenechávať jedlo v izbe",       points:2, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"🚫", season:"always" },
    { id:"rkid09", name:"Vyvetrať izbu",                 points:1, freq:F.DAILY,    who:"Bart, Lisa", mandatory:false, icon:"🌬️", season:"always" },
    { id:"rkid10", name:"Vymeniť posteľnú bielizeň",    points:6, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"🛏️", season:"always" },
  ],
  "🌿 Terasa a dvor": [
    { id:"rt01", name:"Pozametať terasu",                points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"rt02", name:"Odložiť hračky a lopty",          points:3, freq:F.DAILY,    who:"Bart, Lisa", mandatory:true,  icon:"⚽", season:"always" },
    { id:"rt03", name:"Poliať kvety",                    points:3, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🌸", season:"always" },
    { id:"rt04", name:"Pozbierať odpadky",               points:3, freq:F.DAILY,    who:"Ktokoľvek", mandatory:false, icon:"🗑️", season:"always" },
    { id:"rt05", name:"Utrieť vonkajší stôl",            points:2, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧽", season:"always" },
    { id:"rt06", name:"Pomôcť s hrabaním lístia",        points:6, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🍂", season:"always" },
    { id:"rt07", name:"Skontrolovať zatvorené bránky",   points:1, freq:F.DAILY,    who:"Ktokoľvek", mandatory:true,  icon:"🚪", season:"always" },
    { id:"rt08", name:"Odložiť šľapky na terase",       points:1, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🩴", season:"always" },
  ],
  "👕 Prádlo": [
    { id:"l01", name:"Dať špinavé oblečenie do koša",    points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"👕", season:"always" },
    { id:"l02", name:"Roztriediť čisté oblečenie",       points:3, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:true,  icon:"👕", season:"always" },
    { id:"l03", name:"Odložiť čisté oblečenie do skrine",points:4,freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:true,  icon:"🗂️", season:"always" },
    { id:"l04", name:"Pomôcť poskladať prádlo",          points:4, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"👕", season:"always" },
    { id:"l05", name:"Pomôcť vyvesiť prádlo",            points:4, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"🧺", season:"always" },
    { id:"l06", name:"Pozbierať suché prádlo",           points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"☀️", season:"always" },
    { id:"l07", name:"Dať mokré plavky sušiť von",       points:2, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:true,  icon:"👙", season:"always" },
    { id:"l08", name:"Zavesiť mokrý uterák vonku",       points:2, freq:F.DAILY,    who:"Všetci",    mandatory:true,  icon:"🧺", season:"always" },
  ],
  "📅 Týždenné úlohy": [
    { id:"w01", name:"Povysávať detskú izbu",            points:5, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:true,  icon:"🧹", season:"always" },
    { id:"w02", name:"Upratať školskú tašku",            points:4, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:true,  icon:"🎒", season:"always" },
    { id:"w03", name:"Skontrolovať peračník",            points:2, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:true,  icon:"✏️", season:"always" },
    { id:"w04", name:"Pomôcť s kúpeľňou",               points:5, freq:F.WEEKLY,   who:"Bart, Lisa", mandatory:false, icon:"🚿", season:"always" },
    { id:"w05", name:"Povysávať obývačku",               points:5, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"w06", name:"Utrieť prach v obývačke",          points:4, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
    { id:"w07", name:"Upratať terasu",                   points:5, freq:F.WEEKLY,   who:"Ktokoľvek", mandatory:false, icon:"🌿", season:"always" },
  ],
  "🏠 Veľké rodinné úlohy": [
    { id:"b01", name:"Väčšie upratovanie kuchyne",       points:8, freq:F.ONCE,     who:"Ktokoľvek", mandatory:false, icon:"🍳", season:"always" },
    { id:"b02", name:"Väčšie upratovanie obývačky",      points:7, freq:F.ONCE,     who:"Ktokoľvek", mandatory:false, icon:"🛋️", season:"always" },
    { id:"b03", name:"Väčšie upratovanie detskej izby",  points:8, freq:F.ONCE,     who:"Bart, Lisa", mandatory:false, icon:"🛏️", season:"always" },
    { id:"b04", name:"Väčšie upratovanie kúpeľne",       points:8, freq:F.ONCE,     who:"Ktokoľvek", mandatory:false, icon:"🚿", season:"always" },
    { id:"b05", name:"Väčšie upratovanie dvora",         points:10,freq:F.ONCE,     who:"Ktokoľvek", mandatory:false, icon:"🏡", season:"always" },
    { id:"b06", name:"Triedenie oblečenia",              points:8, freq:F.ONCE,     who:"Ktokoľvek", mandatory:false, icon:"👕", season:"always" },
    { id:"b07", name:"Triedenie hračiek a hier",         points:8, freq:F.ONCE,     who:"Bart, Lisa", mandatory:false, icon:"🧸", season:"always" },
    { id:"b08", name:"Pomoc s nákupom a vykladaním",     points:6, freq:F.ASNEEDED, who:"Bart, Lisa", mandatory:false, icon:"🛒", season:"always" },
    { id:"b09", name:"Pomoc s prípravou jedla",          points:6, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🍳", season:"always" },
    { id:"b10", name:"Pomoc s upratovaním po návšteve",  points:7, freq:F.ASNEEDED, who:"Ktokoľvek", mandatory:false, icon:"🧹", season:"always" },
  ],
};

// ═══════════════════════════════════════════════════════
//  ČLENOVIA & ODMENY
// ═══════════════════════════════════════════════════════
const INIT_MEMBERS = [
  { id:"homer", name:"Homer", role:"admin",  color:"#4A90D9", label:"Admin 🍩", pin:"1234", weekPts:22, totalPts:180, streak:2 },
  { id:"marge", name:"Marge", role:"admin",  color:"#8CC63F", label:"Admin 💙", pin:"1234", weekPts:31, totalPts:240, streak:7 },
  { id:"bart",  name:"Bart",  role:"player", color:"#E53935", label:"14 rokov 🛹", pin:"", weekPts:38, totalPts:247, streak:3 },
  { id:"lisa",  name:"Lisa",  role:"player", color:"#E91E63", label:"10 rokov 🎷", pin:"", weekPts:47, totalPts:310, streak:5 },
];

const INIT_REWARDS = [
  { id:"r1", name:"Extra čas na mobile",   emoji:"📱", points:50,  who:"Bart, Lisa", active:true },
  { id:"r2", name:"Pizza večer",           emoji:"🍕", points:80,  who:"Všetci",    active:true },
  { id:"r3", name:"Neskoršia večierka",    emoji:"🌙", points:100, who:"Bart, Lisa", active:true },
  { id:"r4", name:"Výber sobotného filmu", emoji:"🎬", points:120, who:"Všetci",    active:true },
  { id:"r5", name:"Nové vlasy / účes",     emoji:"💇", points:200, who:"Lisa",      active:true },
  { id:"r6", name:"Nová kabelka",          emoji:"👜", points:250, who:"Lisa",      active:true },
  { id:"r7", name:"Nové oblečenie",        emoji:"👗", points:300, who:"Bart, Lisa", active:true },
  { id:"r8", name:"Niečo nové do izby",    emoji:"🛏️", points:400, who:"Bart, Lisa", active:true },
  { id:"r9", name:"Elektroauto fond",      emoji:"🚗⚡",points:500, who:"Homer",    active:true },
  { id:"r10",name:"Kino celá rodina",      emoji:"🎥", points:150, who:"Všetci",    active:true },
  { id:"r11",name:"Rodinný výlet",         emoji:"🏔️", points:200, who:"Všetci",    active:true },
];

const SEASONS = [
  { id:"school",  name:"Školský rok", emoji:"🎒", active:true  },
  { id:"holiday", name:"Prázdniny",   emoji:"🌞", active:false },
];

// ═══════════════════════════════════════════════════════
//  LOKÁLNA PAMÄŤ
// ═══════════════════════════════════════════════════════
const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const load = (k,d) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):d; } catch { return d; } };

// ═══════════════════════════════════════════════════════
//  AVATARY
// ═══════════════════════════════════════════════════════
function HomerSVG({size=80}){return(<svg width={size} height={size*1.25} viewBox="0 0 100 125" fill="none"><ellipse cx="50" cy="105" rx="28" ry="18" fill="#E8E8E8" stroke="#1a1a1a" strokeWidth="2.5"/><rect x="24" y="108" width="52" height="14" rx="4" fill="#5B7FA6" stroke="#1a1a1a" strokeWidth="2"/><rect x="42" y="76" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="50" cy="58" rx="32" ry="30" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><path d="M30 36 Q32 26 38 28" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/><path d="M38 28 Q44 22 50 26" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/><ellipse cx="18" cy="56" rx="7" ry="9" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="82" cy="56" rx="7" ry="9" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><path d="M26 42 Q34 38 40 42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/><path d="M60 42 Q66 38 74 42" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none"/><ellipse cx="34" cy="50" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="66" cy="50" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/><circle cx="35" cy="51" r="5" fill="#1a1a1a"/><circle cx="67" cy="51" r="5" fill="#1a1a1a"/><circle cx="37" cy="49" r="2" fill="white"/><circle cx="69" cy="49" r="2" fill="white"/><path d="M50 58 Q58 60 62 66 Q56 70 50 68 Q44 68 38 66 Q42 60 50 58Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M34 72 Q50 82 66 72" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M36 90 L50 102 L64 90 L64 88 L36 88Z" fill="#E8E8E8" stroke="#1a1a1a" strokeWidth="2"/></svg>);}
function MargeSVG({size=80}){return(<svg width={size} height={size*1.6} viewBox="0 0 100 160" fill="none"><ellipse cx="50" cy="140" rx="26" ry="20" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/><rect x="26" y="112" width="48" height="30" rx="6" fill="#8CC63F" stroke="#1a1a1a" strokeWidth="2.5"/><path d="M34 106 Q50 114 66 106" stroke="#CC2222" strokeWidth="5" strokeLinecap="round"/>{[38,44,50,56,62].map((x,i)=><circle key={i} cx={x} cy={108+Math.sin(i)*1.5} r="3" fill="#CC2222" stroke="#1a1a1a" strokeWidth="1"/>)}<rect x="42" y="94" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="50" cy="82" rx="28" ry="26" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="22" cy="82" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="78" cy="82" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><path d="M22 72 Q20 50 28 30 Q34 10 50 8 Q66 6 72 28 Q78 48 78 72" fill="#42A5F5" stroke="#1a1a1a" strokeWidth="2.5"/><path d="M36 14 Q38 32 36 52" stroke="#1565C0" strokeWidth="2" opacity="0.4"/><path d="M50 10 Q52 30 50 54" stroke="#1565C0" strokeWidth="2" opacity="0.4"/><path d="M64 14 Q66 32 64 52" stroke="#1565C0" strokeWidth="2" opacity="0.4"/><path d="M28 76 Q36 72 42 76" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M58 76 Q64 72 72 76" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="24" y1="72" x2="22" y2="68" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/><line x1="28" y1="70" x2="27" y2="66" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/><line x1="68" y1="70" x2="70" y2="66" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/><line x1="72" y1="72" x2="74" y2="68" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="34" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="66" cy="80" rx="7" ry="8" fill="white" stroke="#1a1a1a" strokeWidth="2"/><circle cx="35" cy="81" r="4" fill="#1a1a1a"/><circle cx="67" cy="81" r="4" fill="#1a1a1a"/><circle cx="36" cy="79" r="1.5" fill="white"/><circle cx="68" cy="79" r="1.5" fill="white"/><path d="M50 86 Q56 88 58 93 Q52 96 50 95 Q48 96 42 93 Q44 88 50 86Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M36 96 Q50 104 64 96" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>);}
function BartSVG({size=80}){return(<svg width={size} height={size*1.3} viewBox="0 0 100 130" fill="none"><rect x="28" y="96" width="44" height="28" rx="6" fill="#1565C0" stroke="#1a1a1a" strokeWidth="2.5"/><rect x="26" y="82" width="48" height="22" rx="6" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/><rect x="42" y="70" width="16" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="50" cy="52" rx="30" ry="28" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="20" cy="52" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="80" cy="52" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><path d="M20 40 L16 24 L28 36 L26 18 L36 32 L38 12 L44 28 L50 8 L56 28 L62 12 L64 32 L74 18 L72 36 L84 24 L80 40" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/><path d="M24 38 Q32 34 40 38" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none"/><path d="M60 38 Q68 34 76 38" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none"/><ellipse cx="33" cy="48" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="67" cy="48" rx="8" ry="9" fill="white" stroke="#1a1a1a" strokeWidth="2"/><circle cx="34" cy="49" r="5" fill="#1a1a1a"/><circle cx="68" cy="49" r="5" fill="#1a1a1a"/><circle cx="36" cy="47" r="2" fill="white"/><circle cx="70" cy="47" r="2" fill="white"/><path d="M50 54 Q58 56 60 62 Q54 66 50 64 Q46 66 40 62 Q42 56 50 54Z" fill="#FFB800" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M34 68 Q42 76 50 74 Q58 76 66 68" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/></svg>);}
function LisaSVG({size=80}){return(<svg width={size} height={size*1.35} viewBox="0 0 100 135" fill="none"><path d="M24 98 Q20 130 50 132 Q80 130 76 98Z" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/><rect x="28" y="86" width="44" height="18" rx="8" fill="#E53935" stroke="#1a1a1a" strokeWidth="2.5"/><path d="M30 88 Q40 96 50 94 Q60 96 70 88 Q60 84 50 86 Q40 84 30 88Z" fill="white" stroke="#1a1a1a" strokeWidth="1.5"/><rect x="43" y="74" width="14" height="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="50" cy="54" rx="30" ry="28" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="20" cy="54" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="80" cy="54" rx="7" ry="8" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2"/><path d="M20 44 L15 26 L26 40 L24 20 L34 36 L36 14 L43 32 L50 10 L57 32 L64 14 L66 36 L76 20 L74 40 L85 26 L80 44" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"/><path d="M30 20 Q36 12 44 18 Q40 24 30 20Z" fill="#FF80AB" stroke="#1a1a1a" strokeWidth="2"/><path d="M50 18 Q58 12 66 20 Q58 24 50 18Z" fill="#FF80AB" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="48" cy="18" rx="5" ry="4" fill="#FF4081" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M44 22 Q40 30 38 34" stroke="#FF80AB" strokeWidth="2" strokeLinecap="round"/><path d="M52 22 Q56 30 58 34" stroke="#FF80AB" strokeWidth="2" strokeLinecap="round"/><path d="M26 42 Q34 37 40 41" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M60 41 Q66 37 74 42" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="33" cy="51" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="67" cy="51" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="33" cy="52" rx="6" ry="7" fill="#42A5F5"/><ellipse cx="67" cy="52" rx="6" ry="7" fill="#42A5F5"/><ellipse cx="33" cy="53" rx="4" ry="5" fill="#1a1a1a"/><ellipse cx="67" cy="53" rx="4" ry="5" fill="#1a1a1a"/><circle cx="36" cy="49" r="2.2" fill="white"/><circle cx="70" cy="49" r="2.2" fill="white"/>{[24,27,30,33,36].map((x,i)=><line key={i} x1={x} y1="42" x2={x-1+i*0.5} y2="37" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}{[58,61,64,67,70].map((x,i)=><line key={i} x1={x} y1="42" x2={x+i*0.5} y2="37" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>)}<ellipse cx="20" cy="60" rx="7" ry="4" fill="#FFB7C5" opacity="0.6"/><ellipse cx="80" cy="60" rx="7" ry="4" fill="#FFB7C5" opacity="0.6"/><path d="M50 60 Q54 62 55 66 Q52 68 50 68 Q48 68 45 66 Q46 62 50 60Z" fill="#F5B800" stroke="#1a1a1a" strokeWidth="1.2"/><path d="M36 72 Q43 80 50 78 Q57 80 64 72" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>{[34,38,42,46,50,54,58,62,66].map((x,i)=><circle key={i} cx={x} cy={86+Math.sin(i*0.7)*1.5} r="2.2" fill="white" stroke="#ddd" strokeWidth="0.8"/>)}</svg>);}
function MaggieSVG({size=80}){return(<svg width={size} height={size*1.1} viewBox="0 0 100 110" fill="none"><ellipse cx="50" cy="85" rx="34" ry="26" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="36" cy="80" rx="10" ry="8" fill="#C8860A" opacity="0.45"/><ellipse cx="64" cy="88" rx="9" ry="7" fill="#C8860A" opacity="0.35"/><ellipse cx="28" cy="104" rx="8" ry="5" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="72" cy="104" rx="8" ry="5" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="38" cy="108" rx="7" ry="4" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="62" cy="108" rx="7" ry="4" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2"/>{[24,28,32].map((x,i)=><line key={i} x1={x} y1="107" x2={x} y2="111" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>)}{[58,62,66].map((x,i)=><line key={i} x1={x} y1="107" x2={x} y2="111" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>)}<ellipse cx="50" cy="50" rx="32" ry="30" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="50" cy="58" rx="17" ry="13" fill="white" opacity="0.55"/><ellipse cx="20" cy="32" rx="13" ry="14" fill="#F5C842" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="20" cy="32" rx="7" ry="8" fill="#FFB7C5"/><ellipse cx="80" cy="32" rx="13" ry="14" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="2.5"/><ellipse cx="80" cy="32" rx="7" ry="8" fill="#FFB7C5"/><path d="M34 22 Q32 12 37 10 Q38 18 34 22Z" fill="#C8860A" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M43 18 Q43 7 48 7 Q47 16 43 18Z" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M50 16 Q53 5 57 7 Q55 15 50 16Z" fill="#C8860A" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M58 20 Q63 11 67 13 Q63 20 58 20Z" fill="#FFD90F" stroke="#1a1a1a" strokeWidth="1.5"/><path d="M26 38 Q32 33 38 37" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M62 37 Q68 33 74 38" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none"/><ellipse cx="33" cy="47" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="67" cy="47" rx="9" ry="10" fill="white" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="33" cy="48" rx="6" ry="7" fill="#8B4513"/><ellipse cx="67" cy="48" rx="6" ry="7" fill="#8B4513"/><ellipse cx="33" cy="49" rx="4" ry="5" fill="#1a1a1a"/><ellipse cx="67" cy="49" rx="4" ry="5" fill="#1a1a1a"/><circle cx="36" cy="45" r="2.5" fill="white"/><circle cx="70" cy="45" r="2.5" fill="white"/><ellipse cx="19" cy="56" rx="8" ry="5" fill="#FFB7C5" opacity="0.65"/><ellipse cx="81" cy="56" rx="8" ry="5" fill="#FFB7C5" opacity="0.65"/><ellipse cx="50" cy="58" rx="8" ry="6" fill="#FFB7C5" stroke="#1a1a1a" strokeWidth="1.5"/><circle cx="47" cy="58" r="2.2" fill="#1a1a1a"/><circle cx="53" cy="58" r="2.2" fill="#1a1a1a"/><line x1="18" y1="58" x2="38" y2="57" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/><line x1="16" y1="63" x2="38" y2="61" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/><line x1="62" y1="57" x2="82" y2="58" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/><line x1="62" y1="61" x2="84" y2="63" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/><ellipse cx="50" cy="70" rx="9" ry="7" fill="#FF8F00" stroke="#1a1a1a" strokeWidth="2"/><ellipse cx="50" cy="70" rx="5.5" ry="4" fill="#FFB300"/><ellipse cx="50" cy="72" rx="3" ry="2" fill="#FF8F00" stroke="#1a1a1a" strokeWidth="1"/></svg>);}

const AVTS = { homer:HomerSVG, marge:MargeSVG, bart:BartSVG, lisa:LisaSVG };

// ═══════════════════════════════════════════════════════
//  UI POMOCNÍCI
// ═══════════════════════════════════════════════════════
const iS = { width:"100%", padding:"10px 14px", borderRadius:12, border:"1.5px solid #e0e0e0", fontFamily:"inherit", fontSize:13, outline:"none", boxSizing:"border-box" };
const sS = { ...iS, background:"white", cursor:"pointer" };

function Toast({t}){ if(!t) return null; return <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:t.c||DARK,color:"white",padding:"12px 24px",borderRadius:30,fontSize:14,fontWeight:800,zIndex:999,boxShadow:"0 6px 24px rgba(0,0,0,0.25)",whiteSpace:"nowrap",animation:"fu 0.3s ease",pointerEvents:"none"}}>{t.m}</div>; }
function Card({children,style={}}){ return <div style={{background:"white",borderRadius:20,padding:"14px 16px",boxShadow:"0 2px 12px rgba(0,0,0,0.07)",...style}}>{children}</div>; }
function Sect({children}){ return <p style={{color:"#777",fontSize:11,fontWeight:800,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:0.8}}>{children}</p>; }
function Btn({children,onClick,color,style={},disabled=false}){
  return <button onClick={onClick} disabled={disabled} style={{padding:"12px 20px",borderRadius:14,border:"none",background:disabled?"#eee":color||DARK,color:disabled?"#bbb":"white",fontWeight:800,fontSize:14,cursor:disabled?"default":"pointer",fontFamily:"inherit",transition:"all 0.15s",...style}}
    onMouseDown={e=>{if(!disabled){e.currentTarget.style.transform="scale(0.95)";e.currentTarget.style.opacity="0.85";}}}
    onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.opacity="1";}}
    onTouchStart={e=>{if(!disabled) e.currentTarget.style.transform="scale(0.95)";}}
    onTouchEnd={e=>{e.currentTarget.style.transform="scale(1)";}}
  >{children}</button>;
}

// ═══════════════════════════════════════════════════════
//  HLAVNÁ APPKA
// ═══════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]   = useState("select");
  const [selected, setSelected] = useState(null);
  const [member,  setMember]  = useState(null);
  const [navTab,  setNavTab]  = useState(0);

  // Globálny stav
  const [members,  setMembers]  = useState(()=>load("rq_members",  INIT_MEMBERS));
  const [tasksDB,  setTasksDB]  = useState(()=>load("rq_tasksdb",  INIT_TASKS_DB));
  const [rewards,  setRewards]  = useState(()=>load("rq_rewards",  INIT_REWARDS));
  const [seasons,  setSeasons]  = useState(()=>load("rq_seasons",  SEASONS));
  const [doneTasks,setDoneTasks]= useState(()=>load("rq_done",     {})); // {memberId: {taskId: true}}
  const [chat,     setChat]     = useState(()=>load("rq_chat",     [
    {id:1,from:"system",text:"🔥 Vitajte v Rodinné Quest! Simpsonovci, do toho! 🏠",time:"08:00"},
    {id:2,from:"marge", name:"Marge",text:"Dnes čistíme celý dom! 💪",time:"08:15",color:"#8CC63F"},
    {id:3,from:"maggie",name:"🐹 Maggie",text:"Nakŕmte ma prosím! 😤",time:"09:00",color:"#FF8F00"},
  ]));
  const [proposals,setProposals]= useState(()=>load("rq_proposals",[
    {id:1,from:"Bart",fromColor:"#E53935",emoji:"🎮",text:"Chcem odmenu: nová hra",type:"reward",status:"pending",date:"dnes"},
    {id:2,from:"Lisa",fromColor:"#E91E63",emoji:"🐾",text:"Chcem navštíviť útulok",type:"reward",status:"pending",date:"dnes"},
  ]));
  const [toast,    setToast]    = useState(null);

  const showToast = useCallback((m,c="#1A1A2E")=>{ setToast({m,c}); setTimeout(()=>setToast(null),2600); },[]);

  // Ukladanie
  useEffect(()=>save("rq_members",  members),  [members]);
  useEffect(()=>save("rq_tasksdb",  tasksDB),  [tasksDB]);
  useEffect(()=>save("rq_rewards",  rewards),  [rewards]);
  useEffect(()=>save("rq_seasons",  seasons),  [seasons]);
  useEffect(()=>save("rq_done",     doneTasks),[doneTasks]);
  useEffect(()=>save("rq_chat",     chat),     [chat]);
  useEffect(()=>save("rq_proposals",proposals),[proposals]);

  const logout = () => { setMember(null); setSelected(null); setScreen("select"); setNavTab(0); };
  const activeMember = member ? members.find(m=>m.id===member.id)||member : null;
  const activeSeasons = seasons.filter(s=>s.active).map(s=>s.id);
  const isSchool = activeSeasons.includes("school");
  const isHoliday = activeSeasons.includes("holiday");

  // ──── SELECT PLAYER ────
  if (screen==="select") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}body{margin:0;font-family:'Nunito',sans-serif;}::-webkit-scrollbar{display:none;}@keyframes fu{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@media(min-width:480px){.shell{max-width:480px;margin:0 auto;box-shadow:0 0 60px rgba(0,0,0,0.15);}}`}</style>
      <SelectPlayer members={members} onSelect={m=>{setSelected(m);setScreen("pin");}}/>
    </>
  );

  // ──── PIN ────
  if (screen==="pin") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}body{margin:0;font-family:'Nunito',sans-serif;}::-webkit-scrollbar{display:none;}@keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-12px)}30%{transform:translateX(12px)}45%{transform:translateX(-9px)}60%{transform:translateX(9px)}75%{transform:translateX(-5px)}}@keyframes fu{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      <PinLogin member={selected} onSuccess={m=>{setMember(m);setScreen("app");}} onBack={()=>setScreen("select")}/>
    </>
  );

  // ──── APP ────
  if (screen==="app" && activeMember) {
    const color = activeMember.color;
    const isAdmin = activeMember.role==="admin";
    const NAV = [
      {icon:"🏠",label:"Domov"},
      {icon:"🏆",label:"Rebríček"},
      {icon:"🛍️",label:"Odmeny"},
      {icon:"💬",label:"Chat"},
      {icon:"👤",label:"Profil"},
      ...(isAdmin?[{icon:"⚙️",label:"Admin"}]:[]),
      {icon:"🚪",label:"Odísť",action:logout},
    ];

    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap" rel="stylesheet"/>
        <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}body{margin:0;background:${BG};font-family:'Nunito',sans-serif;}::-webkit-scrollbar{display:none;}@keyframes fu{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes pop{0%{transform:scale(0.8);opacity:0}80%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}@media(min-width:480px){.shell{max-width:480px;margin:0 auto;box-shadow:0 0 60px rgba(0,0,0,0.15);}}`}</style>
        <div className="shell" style={{background:BG,fontFamily:"'Nunito',sans-serif",paddingBottom:82,minHeight:"100vh"}}>
          <div style={{overflowY:"auto"}}>
            {navTab===0 && <Dashboard member={activeMember} members={members} tasksDB={tasksDB} doneTasks={doneTasks} setDoneTasks={setDoneTasks} setMembers={setMembers} activeSeasons={activeSeasons} showToast={showToast}/>}
            {navTab===1 && <Leaderboard member={activeMember} members={members}/>}
            {navTab===2 && <Rewards member={activeMember} members={members} rewards={rewards} setRewards={setRewards} proposals={proposals} setProposals={setProposals} showToast={showToast}/>}
            {navTab===3 && <Chat member={activeMember} chat={chat} setChat={setChat}/>}
            {navTab===4 && <Profile member={activeMember} members={members} setMembers={setMembers} showToast={showToast}/>}
            {navTab===5 && isAdmin && <AdminPanel member={activeMember} members={members} setMembers={setMembers} tasksDB={tasksDB} setTasksDB={setTasksDB} rewards={rewards} setRewards={setRewards} proposals={proposals} setProposals={setProposals} seasons={seasons} setSeasons={setSeasons} doneTasks={doneTasks} setDoneTasks={setDoneTasks} showToast={showToast}/>}
          </div>
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"white",borderTop:"1px solid #eee",display:"flex",padding:"8px 0",paddingBottom:"max(10px,env(safe-area-inset-bottom))",boxShadow:"0 -4px 24px rgba(0,0,0,0.08)",zIndex:50}}>
            {NAV.map((t,i)=>(
              <button key={i} onClick={()=>t.action?t.action():setNavTab(i)} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 0",minHeight:44}}>
                <span style={{fontSize:20}}>{t.icon}</span>
                <span style={{fontSize:9,color:!t.action&&navTab===i?color:"#bbb",fontWeight:!t.action&&navTab===i?900:400,fontFamily:"inherit"}}>{t.label}</span>
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

// ═══════════════════════════════════════════════════════
//  SELECT PLAYER
// ═══════════════════════════════════════════════════════
function SelectPlayer({members, onSelect}){
  const [hover,setHover]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#87CEEB 0%,#5BB8F5 40%,#2196F3 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"space-between",padding:"36px 20px 28px",position:"relative",overflow:"hidden"}}>
      {[{l:2,t:6,s:1.1},{l:52,t:2,s:0.9},{l:72,t:10,s:1},{l:28,t:18,s:0.8}].map((c,i)=>(
        <div key={i} style={{position:"absolute",left:`${c.l}%`,top:`${c.t}%`,transform:`scale(${c.s})`,opacity:0.75,fontSize:44,pointerEvents:"none"}}>☁️</div>
      ))}
      <div style={{textAlign:"center",zIndex:1}}>
        <h1 style={{color:YELLOW,fontSize:32,margin:"0 0 4px",fontWeight:900,textShadow:"3px 3px 0 #B8860B, 0 4px 20px rgba(0,0,0,0.25)",letterSpacing:1}}>🏠 Rodinné Quest</h1>
        <p style={{color:"white",fontSize:15,margin:0,fontWeight:700,textShadow:"0 1px 6px rgba(0,0,0,0.3)"}}>Kto hrá dnes?</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,width:"100%",maxWidth:390,zIndex:1}}>
        {members.map(m=>{
          const Av=AVTS[m.id]; const isH=hover===m.id;
          return(
            <button key={m.id} onClick={()=>onSelect(m)} onMouseEnter={()=>setHover(m.id)} onMouseLeave={()=>setHover(null)} onTouchStart={()=>setHover(m.id)} onTouchEnd={()=>setTimeout(()=>setHover(null),300)}
              style={{background:isH?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.88)",border:`3px solid ${isH?m.color:"rgba(255,255,255,0.5)"}`,borderRadius:28,padding:"20px 12px 14px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transform:isH?"scale(1.06) translateY(-5px)":"scale(1)",transition:"all 0.18s ease",boxShadow:isH?`0 14px 36px rgba(0,0,0,0.18),0 4px 12px ${m.color}55`:"0 4px 16px rgba(0,0,0,0.1)"}}>
              <Av size={74}/>
              <p style={{color:"#1A1A2E",fontSize:18,fontWeight:900,margin:"4px 0 0"}}>{m.name}</p>
              <span style={{background:m.role==="admin"?YELLOW:`${m.color}18`,color:m.role==="admin"?"#1A1A2E":m.color,borderRadius:20,padding:"2px 12px",fontSize:11,fontWeight:800}}>{m.label}</span>
              {m.streak>=3&&<span style={{background:"#FF6B3518",color:"#FF6B35",borderRadius:12,padding:"1px 8px",fontSize:11,fontWeight:800}}>🔥 {m.streak}</span>}
            </button>
          );
        })}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14,background:"rgba(255,255,255,0.88)",borderRadius:24,padding:"12px 20px",width:"100%",maxWidth:390,boxSizing:"border-box",boxShadow:"0 4px 16px rgba(0,0,0,0.1)",zIndex:1}}>
        <MaggieSVG size={54}/>
        <div>
          <p style={{color:"#E91E63",fontSize:13,fontWeight:900,margin:0}}>🐹 Maggie hovorí:</p>
          <p style={{color:"#555",fontSize:13,margin:"2px 0 0",fontWeight:700}}>"Nakŕmte ma dnes! Som hladná 😤"</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PIN LOGIN
// ═══════════════════════════════════════════════════════
function PinLogin({member,onSuccess,onBack}){
  const [pin,setPin]=useState(""); const [shake,setShake]=useState(false); const [error,setError]=useState(false);
  const Av=AVTS[member.id];
  const press=(n)=>{
    if(pin.length>=4) return; const next=pin+n; setPin(next); setError(false);
    if(next.length===4){ setTimeout(()=>{ if(next===member.pin){onSuccess(member);}else{setShake(true);setError(true);setTimeout(()=>{setShake(false);setPin("");},700);} },200); }
  };
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(160deg,${DARK},${DARK2},#0F3460)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <button onClick={onBack} style={{position:"absolute",top:20,left:20,background:"rgba(255,255,255,0.1)",border:"none",borderRadius:12,color:"white",padding:"8px 16px",fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>← Späť</button>
      <div style={{marginBottom:8}}><Av size={96}/></div>
      <h2 style={{color:YELLOW,fontSize:28,margin:"0 0 4px",fontWeight:900}}>Ahoj, {member.name}!</h2>
      {member.pin!==""?(
        <>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:14,margin:"0 0 24px"}}>Zadaj svoj PIN</p>
          <div style={{display:"flex",gap:18,marginBottom:8,animation:shake?"shake 0.6s":"none"}}>
            {[0,1,2,3].map(i=><div key={i} style={{width:22,height:22,borderRadius:"50%",background:error?"#FF5252":i<pin.length?YELLOW:"rgba(255,255,255,0.15)",border:`2px solid ${error?"#FF5252":i<pin.length?YELLOW:"rgba(255,255,255,0.25)"}`,transition:"all 0.15s",transform:i<pin.length?"scale(1.3)":"scale(1)"}}/>)}
          </div>
          {error?<p style={{color:"#FF5252",fontSize:13,fontWeight:800,margin:"8px 0 12px"}}>Nesprávny PIN!</p>:<div style={{height:36}}/>}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:234}}>
            {[1,2,3,4,5,6,7,8,9].map(n=>(
              <button key={n} onClick={()=>press(String(n))} style={{height:70,borderRadius:18,border:"2px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.06)",color:"white",fontSize:30,fontWeight:800,cursor:"pointer",fontFamily:"inherit",transition:"all 0.1s"}}
                onMouseDown={e=>{e.currentTarget.style.transform="scale(0.9)";e.currentTarget.style.background=`${member.color}44`;}}
                onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
              >{n}</button>
            ))}
            <div/>
            <button onClick={()=>press("0")} style={{height:70,borderRadius:18,border:"2px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.06)",color:"white",fontSize:30,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>0</button>
            <button onClick={()=>setPin(p=>p.slice(0,-1))} style={{height:70,borderRadius:18,border:"2px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.6)",fontSize:26,cursor:"pointer"}}>⌫</button>
          </div>
          <p style={{color:"rgba(255,255,255,0.2)",fontSize:12,marginTop:24}}>Demo PIN: 1234</p>
        </>
      ):(
        <>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:14,margin:"0 0 32px"}}>Žiadny PIN — môžeš rovno vstúpiť!</p>
          <Btn onClick={()=>onSuccess(member)} color={member.color} style={{fontSize:18,padding:"18px 48px",boxShadow:`0 8px 24px ${member.color}66`}}>Vstúpiť →</Btn>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════════════════════
function Dashboard({member,members,tasksDB,doneTasks,setDoneTasks,setMembers,activeSeasons,showToast}){
  const Av=AVTS[member.id];
  const [selCat,setSelCat]=useState(Object.keys(tasksDB)[0]);
  const [showAll,setShowAll]=useState(false);

  const myDone = doneTasks[member.id]||{};
  const todayKey = new Date().toDateString();
  const todayDone = myDone[todayKey]||{};

  const [showWeek,setShowWeek]=useState(false);

  const toggleTask = (taskId, points) => {
    const status = todayDone[taskId];
    if(status==="done") return;
    const newStatus = status==="pending" ? undefined : "pending";
    setDoneTasks(prev=>{
      const nd = {...prev};
      if(!nd[member.id]) nd[member.id]={};
      if(!nd[member.id][todayKey]) nd[member.id][todayKey]={};
      if(newStatus===undefined){ delete nd[member.id][todayKey][taskId]; }
      else { nd[member.id][todayKey][taskId]="pending"; }
      return nd;
    });
    if(newStatus==="pending") showToast("🕐 Odoslané na overenie!",member.color);
    else showToast("↩️ Zrušené",member.color);
  };

  // Aktuálne úlohy podľa sezóny
  const getSeasonOk = (season) => {
    if(season==="always") return true;
    if(season==="school") return activeSeasons.includes("school");
    if(season==="holiday") return activeSeasons.includes("holiday");
    if(season==="pool") return true; // bazén vždy dostupný ak je kategória aktívna
    return true;
  };
  const allCats = Object.keys(tasksDB);
  const todayTotal = allCats.reduce((a,cat)=>a+(tasksDB[cat]||[]).filter(t=>getSeasonOk(t.season)).length,0);
  const todayDoneCount = allCats.reduce((a,cat)=>a+(tasksDB[cat]||[]).filter(t=>getSeasonOk(t.season)&&todayDone[t.id]==="done").length,0);
  const todayPendingCount = allCats.reduce((a,cat)=>a+(tasksDB[cat]||[]).filter(t=>getSeasonOk(t.season)&&todayDone[t.id]==="pending").length,0);

  const lvl = Math.max(0,LEVEL_PTS.findIndex((p,i)=>(member.totalPts||0)<(LEVEL_PTS[i+1]||9999)));
  const lvlPct = Math.min(((member.totalPts||0)-LEVEL_PTS[lvl])/((LEVEL_PTS[Math.min(lvl+1,5)])-LEVEL_PTS[lvl])*100,100);

  return(
    <div>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${DARK},${DARK2})`,padding:"20px 20px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:11,margin:0}}>Prihlásený ako</p>
            <h2 style={{color:YELLOW,fontSize:22,margin:"2px 0 0",fontWeight:900}}>{member.name}</h2>
          </div>
          <div style={{textAlign:"center"}}>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:10,margin:0}}>Streak</p>
            <p style={{color:"#FF6B35",fontSize:22,margin:0,fontWeight:900}}>🔥 {member.streak}</p>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:20,padding:"12px 14px",display:"flex",alignItems:"center",gap:12}}>
          <Av size={56}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>{LEVELS[lvl]}</span>
              <span style={{color:YELLOW,fontSize:15,fontWeight:900}}>⭐ {member.weekPts||0}b</span>
            </div>
            <div style={{height:8,background:"rgba(255,255,255,0.1)",borderRadius:99}}>
              <div style={{height:"100%",width:`${lvlPct}%`,background:`linear-gradient(90deg,${YELLOW},${member.color})`,borderRadius:99,transition:"width 0.4s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>{LEVEL_PTS[Math.min(lvl+1,5)]-(member.totalPts||0)}b do ďalšieho levelu</span>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:10}}>{todayDoneCount}/{todayTotal} dnes ✅</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{padding:"14px 16px"}}>

        {/* Denný progress */}
        {todayTotal>0&&(
          <Card style={{marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:0}}>Dnešný postup</p>
                <button onClick={()=>setShowWeek(p=>!p)} style={{background:`${member.color}18`,border:"none",borderRadius:10,padding:"3px 10px",color:member.color,fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
                  {showWeek?"✕ Zavrieť":"📅 Týždeň"}
                </button>
              </div>
              <div style={{height:8,background:"#f0f0f0",borderRadius:99}}>
                <div style={{height:"100%",width:`${todayTotal>0?todayDoneCount/todayTotal*100:0}%`,background:`linear-gradient(90deg,${member.color}88,${member.color})`,borderRadius:99,transition:"width 0.4s"}}/>
              </div>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <p style={{fontSize:20,fontWeight:900,color:member.color,margin:0}}>{todayTotal>0?Math.round(todayDoneCount/todayTotal*100):0}%</p>
              <p style={{fontSize:10,color:"#aaa",margin:0}}>{todayDoneCount}/{todayTotal}</p>
            </div>
          </Card>
        )}

        {/* POHĽAD NA TÝŽDEŇ */}
        {showWeek&&(
          <Card style={{marginBottom:14,border:`1.5px solid ${member.color}44`}}>
            <p style={{fontWeight:900,fontSize:14,color:"#1A1A2E",margin:"0 0 12px"}}>📅 Tento týždeň</p>
            {["Po","Ut","St","Št","Pi","So","Ne"].map((d,di)=>{
              const dayTasks = Object.values(tasksDB).flat().filter(t=>
                getSeasonOk(t.season) &&
                (t.who==="Všetci"||t.who?.includes(member.name)||(t.who?.includes("Lisa")&&member.id==="lisa")||(t.who?.includes("Bart")&&member.id==="bart")) &&
                (t.days===undefined||t.days==="every"||t.days?.includes(di))
              );
              const isToday = new Date().getDay()===((di+1)%7);
              return(
                <div key={d} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:di<6?"1px solid #f5f5f5":"none",background:isToday?`${member.color}08`:"transparent",borderRadius:isToday?8:0,padding:isToday?"8px":"8px 0"}}>
                  <span style={{fontSize:12,fontWeight:900,color:isToday?member.color:"#aaa",minWidth:24}}>{d}</span>
                  <div style={{flex:1,display:"flex",gap:4,flexWrap:"wrap"}}>
                    {dayTasks.slice(0,4).map(t=>(
                      <span key={t.id} style={{background:`${member.color}12`,color:member.color,borderRadius:8,padding:"2px 7px",fontSize:10,fontWeight:700}}>{t.icon} {t.name}</span>
                    ))}
                    {dayTasks.length>4&&<span style={{color:"#bbb",fontSize:10}}>+{dayTasks.length-4}</span>}
                    {dayTasks.length===0&&<span style={{color:"#ddd",fontSize:10}}>Voľný deň 🎉</span>}
                  </div>
                  <span style={{fontSize:11,color:"#aaa",flexShrink:0}}>+{dayTasks.reduce((a,t)=>a+t.points,0)}b</span>
                </div>
              );
            })}
          </Card>
        )}

        {/* RANNÁ RUTINA — rýchle chipy */}
        {member.role!=="admin"&&(()=>{
          const morningTasks = (tasksDB["🌅 Školské ráno"]||[]).filter(t=>getSeasonOk(t.season));
          const holidayMorning = (tasksDB["🌞 Prázdninové ráno"]||[]).filter(t=>getSeasonOk(t.season));
          const allMorning = [...morningTasks,...holidayMorning];
          if(!allMorning.length) return null;
          const doneCount = allMorning.filter(t=>todayDone[t.id]&&todayDone[t.id]!=="pending").length;
          return(
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <Sect>🌅 Ranná rutina</Sect>
                <span style={{background:"#f0f0f0",borderRadius:10,padding:"1px 8px",fontSize:10,fontWeight:800,color:"#888",marginBottom:8}}>{doneCount}/{allMorning.length}</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {allMorning.map(task=>{
                  const done=todayDone[task.id]==="done";
                  const pending=todayDone[task.id]==="pending";
                  return(
                    <button key={task.id} onClick={()=>toggleTask(task.id,task.points)} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 12px",borderRadius:20,border:`1.5px solid ${done?"#66BB6A":pending?"#FF9800":member.color+"44"}`,background:done?"#E8F5E9":pending?"#FFF3E0":"white",cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
                      <span style={{fontSize:14}}>{task.icon}</span>
                      <span style={{fontSize:12,fontWeight:700,color:done?"#2E7D32":pending?"#E65100":"#1A1A2E"}}>{task.name}</span>
                      {done&&<span style={{fontSize:12}}>✓</span>}
                      {pending&&<span style={{fontSize:12}}>🕐</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ÚLOHY DŇA — pridelené adminmi */}
        {member.role!=="admin"&&(()=>{
          const todayIdx = (new Date().getDay()+6)%7;
          const dayTasks = Object.values(tasksDB).flat().filter(t=>{
            if(!getSeasonOk(t.season)) return false;
            const isForMe = t.who==="Všetci"||(t.who?.includes("Lisa")&&member.id==="lisa")||(t.who?.includes("Bart")&&member.id==="bart");
            if(!isForMe) return false;
            const isToday = t.days===undefined||t.days==="every"||t.days?.includes(todayIdx);
            if(!isToday) return false;
            // Vynechaj rannú/večernú rutinu
            const rutinaCats = ["🌅 Školské ráno","🌞 Prázdninové ráno","🌙 Školský večer","🌙 Prázdninový večer"];
            return !rutinaCats.some(c=>(tasksDB[c]||[]).find(x=>x.id===t.id));
          });
          const mandatory = dayTasks.filter(t=>t.mandatory!==false&&t.category!=="bonus");
          const bonus = dayTasks.filter(t=>t.mandatory===false||t.category==="bonus");
          if(!dayTasks.length) return <Card style={{textAlign:"center",padding:24,marginBottom:14}}><p style={{fontSize:28,margin:"0 0 8px"}}>🎉</p><p style={{color:"#aaa",fontSize:13,margin:0}}>Dnes žiadne špeciálne úlohy!</p></Card>;
          return(
            <>
              {mandatory.length>0&&(
                <div style={{marginBottom:14}}>
                  <Sect>📋 Úlohy dňa</Sect>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {mandatory.map(task=>{
                      const status=todayDone[task.id]; // undefined/pending/done
                      return(
                        <button key={task.id} onClick={()=>{ if(status!=="done") toggleTask(task.id,task.points); }} style={{display:"flex",alignItems:"center",gap:12,background:"white",border:`2px solid ${status==="done"?"#66BB6A":status==="pending"?"#FF9800":member.color+"33"}`,borderRadius:16,padding:"12px 14px",cursor:status==="done"?"default":"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.05)",textAlign:"left",fontFamily:"inherit",width:"100%",transition:"all 0.2s"}}>
                          <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:status==="done"?"#66BB6A":status==="pending"?"#FF9800":"transparent",border:`2.5px solid ${status==="done"?"#66BB6A":status==="pending"?"#FF9800":"#ddd"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:14}}>
                            {status==="done"?"✓":status==="pending"?"🕐":""}
                          </div>
                          <span style={{fontSize:16,flexShrink:0}}>{task.icon}</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:13,fontWeight:700,color:status==="done"?"#aaa":"#1A1A2E",textDecoration:status==="done"?"line-through":"none",margin:"0 0 2px"}}>{task.name}</p>
                            <div style={{display:"flex",gap:6,alignItems:"center"}}>
                              {task.type==="mandatory"&&<span style={{fontSize:10,color:"#FF5252",fontWeight:700}}>⚠️ Povinná</span>}
                              {status==="pending"&&<span style={{fontSize:10,color:"#FF9800",fontWeight:700}}>🕐 Čaká na overenie</span>}
                              {status==="done"&&<span style={{fontSize:10,color:"#66BB6A",fontWeight:700}}>✅ Overené</span>}
                            </div>
                          </div>
                          <span style={{background:status==="done"?"#E8F5E9":status==="pending"?"#FFF3E0":`${member.color}18`,color:status==="done"?"#66BB6A":status==="pending"?"#FF9800":member.color,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:800,flexShrink:0}}>+{task.points}b</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {bonus.length>0&&(
                <div style={{marginBottom:14}}>
                  <Sect>⚡ Dobrovoľné & Bonusové</Sect>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {bonus.map(task=>{
                      const status=todayDone[task.id];
                      return(
                        <button key={task.id} onClick={()=>{ if(status!=="done") toggleTask(task.id,task.points); }} style={{display:"flex",alignItems:"center",gap:12,background:"linear-gradient(135deg,#1A1A2E,#2C2C54)",border:`2px solid ${status==="done"?"#66BB6A":status==="pending"?"#FF9800":"rgba(255,217,15,0.3)"}`,borderRadius:16,padding:"12px 14px",cursor:status==="done"?"default":"pointer",textAlign:"left",fontFamily:"inherit",width:"100%",transition:"all 0.2s"}}>
                          <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:status==="done"?"#66BB6A":status==="pending"?"#FF9800":"rgba(255,217,15,0.15)",border:`2.5px solid ${status==="done"?"#66BB6A":status==="pending"?"#FF9800":"rgba(255,217,15,0.4)"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:900,fontSize:14}}>
                            {status==="done"?"✓":status==="pending"?"🕐":""}
                          </div>
                          <span style={{fontSize:16,flexShrink:0}}>{task.icon}</span>
                          <div style={{flex:1}}>
                            <p style={{fontSize:13,fontWeight:700,color:"white",textDecoration:status==="done"?"line-through":"none",margin:"0 0 2px"}}>{task.name}</p>
                            {status==="pending"&&<span style={{fontSize:10,color:"#FF9800",fontWeight:700}}>🕐 Čaká na overenie</span>}
                            {status==="done"&&<span style={{fontSize:10,color:"#66BB6A",fontWeight:700}}>✅ Overené</span>}
                          </div>
                          <span style={{background:"rgba(255,217,15,0.15)",color:YELLOW,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:800,flexShrink:0}}>+{task.points}b</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          );
        })()}

        {/* ADMIN dashboard — skrátený pohľad */}
        {member.role==="admin"&&(
          <Card style={{marginBottom:14}}>
            <p style={{fontWeight:900,fontSize:14,color:"#1A1A2E",margin:"0 0 12px"}}>👨‍👩‍👧 Prehľad rodiny dnes</p>
            {["bart","lisa"].map(kid=>{
              const m = {bart:{name:"Bart",color:"#E53935"},lisa:{name:"Lisa",color:"#E91E63"}}[kid];
              const kidTasks = Object.values(tasksDB).flat().filter(t=>getSeasonOk(t.season)&&t.who?.includes(m.name));
              const kidDone = kidTasks.filter(t=>doneTasks[kid]?.[new Date().toDateString()]?.[t.id]==="done").length;
              const kidPending = kidTasks.filter(t=>doneTasks[kid]?.[new Date().toDateString()]?.[t.id]==="pending").length;
              return(
                <div key={kid} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:kid==="bart"?"1px solid #f5f5f5":"none"}}>
                  <span style={{fontSize:24}}>{kid==="bart"?"🟡":"🟡"}</span>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 3px"}}>{m.name}</p>
                    <p style={{fontSize:11,color:"#aaa",margin:0}}>{kidDone}/{kidTasks.length} splnených{kidPending>0?` · 🕐 ${kidPending} čaká na overenie`:""}</p>
                  </div>
                  {kidPending>0&&<span style={{background:"#FFF3E0",color:"#FF9800",borderRadius:10,padding:"4px 10px",fontSize:11,fontWeight:800}}>🕐 {kidPending}</span>}
                </div>
              );
            })}
          </Card>
        )}

        {/* Maggie */}
        <div style={{background:"linear-gradient(135deg,#FFF8E1,#FFF3CD)",border:"1.5px solid #FFE082",borderRadius:20,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
          <MaggieSVG size={50}/>
          <div>
            <p style={{color:"#F57F17",fontSize:13,fontWeight:900,margin:0}}>🐹 Maggie čaká!</p>
            <p style={{color:"#8D6E63",fontSize:12,margin:"2px 0 0"}}>Nakŕmte ju a doplňte vodu 💧</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  REBRÍČEK
// ═══════════════════════════════════════════════════════
function Leaderboard({member,members}){
  const [view,setView]=useState("week");
  const sorted=[...members].sort((a,b)=>view==="week"?(b.weekPts||0)-(a.weekPts||0):(b.totalPts||0)-(a.totalPts||0));
  const motivations={homer:"D'oh! Homer, ešte nie si porazený 🍩",marge:"Marge drží krok! 💙",bart:"Bart, daj do toho! 💪",lisa:"Lisa je na vrchole! 👑"};
  const medals=["🥇","🥈","🥉"];
  return(
    <div style={{padding:"16px 16px 0"}}>
      <div style={{display:"flex",background:"rgba(0,0,0,0.06)",borderRadius:14,padding:3,marginBottom:16}}>
        {[{v:"week",l:"📅 Tento týždeň"},{v:"total",l:"🏆 Celkovo"}].map(({v,l})=>(
          <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"8px 0",borderRadius:11,border:"none",fontFamily:"inherit",fontSize:13,fontWeight:800,cursor:"pointer",background:view===v?"white":"transparent",color:view===v?"#1A1A2E":"#999",boxShadow:view===v?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.2s"}}>{l}</button>
        ))}
      </div>
      <div style={{background:`linear-gradient(135deg,${DARK},#2C2C54)`,borderRadius:24,padding:"20px 12px 16px",marginBottom:12}}>
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,textAlign:"center",margin:"0 0 16px",letterSpacing:1}}>{view==="week"?"TENTO TÝŽDEŇ":"CELKOVO"}</p>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:8}}>
          {[1,0,2].map(pos=>{
            const m=sorted[pos]; if(!m) return null;
            const Av=AVTS[m.id]; const isF=pos===0;
            return(
              <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:"center",flex:isF?1.2:1}}>
                <div style={{position:"relative"}}>
                  {isF&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",fontSize:22}}>👑</div>}
                  <Av size={isF?70:54}/>
                </div>
                <div style={{background:isF?`${m.color}33`:"rgba(255,255,255,0.08)",border:`2px solid ${isF?m.color+"66":"rgba(255,255,255,0.1)"}`,borderRadius:14,padding:"8px 6px",marginTop:6,width:"100%",textAlign:"center"}}>
                  <p style={{color:["#FFD700","#C0C0C0","#CD7F32"][pos],fontSize:isF?20:16,margin:"0 0 2px"}}>{medals[pos]}</p>
                  <p style={{color:"white",fontSize:isF?14:12,fontWeight:900,margin:"0 0 2px"}}>{m.name}</p>
                  <p style={{color:YELLOW,fontSize:isF?17:13,fontWeight:900,margin:0}}>{view==="week"?(m.weekPts||0):(m.totalPts||0)}b</p>
                  <p style={{color:"rgba(255,255,255,0.4)",fontSize:9,margin:"2px 0 0"}}>🔥 {m.streak}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {sorted[3]&&(()=>{const m=sorted[3];const Av=AVTS[m.id];return(
        <Card style={{display:"flex",alignItems:"center",gap:12,marginBottom:12,border:m.id===member.id?`2px solid ${m.color}`:"2px solid transparent"}}>
          <span style={{fontSize:18,color:"#aaa",fontWeight:900,minWidth:20}}>4.</span>
          <Av size={46}/>
          <div style={{flex:1}}><p style={{fontSize:14,fontWeight:900,color:"#1A1A2E",margin:0}}>{m.name}</p><p style={{fontSize:11,color:"#aaa",margin:"2px 0 0"}}>🔥 {m.streak} dní</p></div>
          <span style={{color:m.color,fontSize:15,fontWeight:900}}>{view==="week"?(m.weekPts||0):(m.totalPts||0)}b</span>
        </Card>
      );})()}
      <div style={{background:`${member.color}12`,border:`1.5px solid ${member.color}44`,borderRadius:16,padding:"12px 16px",textAlign:"center"}}>
        <p style={{color:member.color,fontSize:14,fontWeight:800,margin:0}}>{motivations[member.id]||"Skvelá práca! 💪"}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ODMENY
// ═══════════════════════════════════════════════════════
function Rewards({member,members,rewards,setRewards,proposals,setProposals,showToast}){
  const [tab,setTab]=useState("real");
  const [confirm,setConfirm]=useState(null);
  const [pending,setPending]=useState([]);
  const [propText,setPropText]=useState("");
  const [showProp,setShowProp]=useState(false);
  const pts=member.totalPts||0;

  const myRewards=rewards.filter(r=>r.active&&(r.who==="Všetci"||r.who.includes(member.name)));

  const request=(r)=>{
    if(pts<r.points){showToast("❌ Málo bodov!","#FF5252");return;}
    setConfirm(r);
  };
  const confirmReq=()=>{
    setPending(p=>[...p,{...confirm,status:"pending",date:new Date().toLocaleDateString("sk")}]);
    setConfirm(null); showToast("📨 Odoslaná rodičom!",member.color);
  };
  const sendProp=()=>{
    if(!propText.trim()) return;
    setProposals(p=>[...p,{id:Date.now(),from:member.name,fromColor:member.color,emoji:"💡",text:propText,type:"reward",status:"pending",date:new Date().toLocaleDateString("sk")}]);
    setPropText(""); setShowProp(false); showToast("💡 Návrh odoslaný!",member.color);
  };
  const tabs=[{id:"real",l:"🎁 Odmeny"},{id:"pending",l:`📬 Čaká${pending.length>0?` (${pending.length})`:""}`}];
  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${DARK},#2C1654)`,padding:"20px 20px 18px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <h2 style={{color:YELLOW,fontSize:20,margin:"0 0 4px",fontWeight:900}}>🛍️ Obchod s odmenami</h2>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:0}}>{member.name}</p>
          <div style={{background:`${member.color}22`,border:`1.5px solid ${member.color}66`,borderRadius:20,padding:"6px 16px",display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:16}}>⭐</span>
            <span style={{color:YELLOW,fontSize:20,fontWeight:900}}>{pts}</span>
            <span style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>b</span>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,padding:"14px 16px 0"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"8px 14px",borderRadius:20,border:"none",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer",background:tab===t.id?member.color:"white",color:tab===t.id?"white":"#888",boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{t.l}</button>)}
      </div>
      <div style={{padding:"14px 16px"}}>
        {tab==="real"&&(
          <>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
              {myRewards.map(r=>{
                const ok=pts>=r.points;
                return(
                  <div key={r.id} style={{background:"white",borderRadius:18,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.05)",opacity:ok?1:0.6}}>
                    <span style={{fontSize:28,flexShrink:0}}>{r.emoji}</span>
                    <div style={{flex:1}}><p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px"}}>{r.name}</p><p style={{fontSize:12,color:ok?member.color:"#bbb",fontWeight:700,margin:0}}>⭐ {r.points}b</p></div>
                    <Btn onClick={()=>request(r)} color={ok?member.color:"#eee"} style={{padding:"8px 14px",fontSize:12,color:ok?"white":"#ccc"}} disabled={!ok}>{ok?"Chcem!":"🔒"}</Btn>
                  </div>
                );
              })}
            </div>
            <div style={{background:`${member.color}12`,border:`1.5px dashed ${member.color}66`,borderRadius:18,padding:"14px 16px"}}>
              <p style={{color:member.color,fontSize:13,fontWeight:900,margin:"0 0 8px"}}>💡 Nenašiel si čo hľadáš?</p>
              {showProp?(
                <div style={{display:"flex",gap:8}}>
                  <input value={propText} onChange={e=>setPropText(e.target.value)} placeholder="Napr. Nové slúchadlá..." style={{...iS,flex:1,margin:0}} onKeyDown={e=>e.key==="Enter"&&sendProp()} autoFocus/>
                  <Btn onClick={sendProp} color={member.color} style={{padding:"10px 14px",fontSize:12}}>Odoslať</Btn>
                  <Btn onClick={()=>setShowProp(false)} color="#eee" style={{padding:"10px 12px",fontSize:12,color:"#888"}}>✕</Btn>
                </div>
              ):(
                <Btn onClick={()=>setShowProp(true)} color={member.color} style={{width:"100%",fontSize:13}}>+ Navrhnúť vlastnú odmenu</Btn>
              )}
            </div>
          </>
        )}
        {tab==="pending"&&(
          pending.length===0
            ?<Card style={{textAlign:"center",padding:32}}><p style={{fontSize:40,margin:"0 0 12px"}}>📬</p><p style={{color:"#aaa",fontSize:14,margin:0}}>Zatiaľ žiadne žiadosti</p></Card>
            :<div style={{display:"flex",flexDirection:"column",gap:10}}>
              {pending.map((r,i)=>(
                <Card key={i} style={{display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:26}}>{r.emoji}</span>
                  <div style={{flex:1}}><p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px"}}>{r.name}</p><p style={{fontSize:11,color:"#aaa",margin:0}}>{r.date}</p></div>
                  <span style={{background:"#FFF3CD",color:"#F57F17",borderRadius:10,padding:"4px 10px",fontSize:11,fontWeight:800}}>⏳ Čaká</span>
                </Card>
              ))}
            </div>
        )}
      </div>
      {confirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <p style={{fontSize:44,textAlign:"center",margin:"0 0 8px"}}>{confirm.emoji}</p>
            <h3 style={{textAlign:"center",fontSize:18,fontWeight:900,color:"#1A1A2E",margin:"0 0 4px"}}>{confirm.name}</h3>
            <p style={{textAlign:"center",color:member.color,fontSize:16,fontWeight:800,margin:"0 0 8px"}}>⭐ {confirm.points} bodov</p>
            <p style={{textAlign:"center",color:"#aaa",fontSize:13,margin:"0 0 20px"}}>Žiadosť pôjde rodičom na schválenie.</p>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setConfirm(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={confirmReq} color={member.color} style={{flex:2}}>Odoslať ✓</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════════════
function Chat({member,chat,setChat}){
  const [msg,setMsg]=useState("");
  const send=()=>{
    if(!msg.trim()) return;
    setChat(p=>[...p,{id:Date.now(),from:member.id,name:member.name,text:msg.trim(),time:new Date().toLocaleTimeString("sk",{hour:"2-digit",minute:"2-digit"}),color:member.color}]);
    setMsg("");
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 82px)"}}>
      <div style={{background:`linear-gradient(135deg,${DARK},${DARK2})`,padding:"16px 20px",borderBottomLeftRadius:24,borderBottomRightRadius:24}}>
        <h2 style={{color:YELLOW,fontSize:20,margin:0,fontWeight:900}}>💬 Rodinný chat</h2>
        <p style={{color:"rgba(255,255,255,0.45)",fontSize:12,margin:"2px 0 0"}}>Všetci vidia všetko · 07:00–22:00</p>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {chat.map(m=>(
          <div key={m.id}>
            {m.from==="system"
              ?<div style={{textAlign:"center"}}><span style={{background:"#9C27B018",color:"#9C27B0",borderRadius:12,padding:"4px 14px",fontSize:12,fontWeight:700}}>{m.text}</span></div>
              :<div style={{display:"flex",flexDirection:"column",alignItems:m.from===member.id?"flex-end":"flex-start"}}>
                {m.from!==member.id&&<p style={{color:"#aaa",fontSize:11,fontWeight:700,margin:"0 0 3px 10px"}}>{m.name}</p>}
                <div style={{maxWidth:"78%",background:m.from===member.id?member.color:m.from==="maggie"?"#FFF3CD":"white",borderRadius:m.from===member.id?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
                  <p style={{color:m.from===member.id?"white":m.from==="maggie"?"#E65100":"#1A1A2E",fontSize:14,fontWeight:600,margin:"0 0 4px",lineHeight:1.4}}>{m.text}</p>
                  <p style={{color:m.from===member.id?"rgba(255,255,255,0.6)":"#bbb",fontSize:10,margin:0,textAlign:"right"}}>{m.time}</p>
                </div>
              </div>
            }
          </div>
        ))}
      </div>
      <div style={{padding:"12px 16px",background:"white",borderTop:"1px solid #f0f0f0",display:"flex",gap:10,alignItems:"center"}}>
        <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Napíš správu..." style={{...iS,flex:1,margin:0}}/>
        <button onClick={send} style={{width:44,height:44,borderRadius:14,border:"none",background:member.color,color:"white",fontSize:20,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>➤</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  PROFIL
// ═══════════════════════════════════════════════════════
function Profile({member,members,setMembers,showToast}){
  const Av=AVTS[member.id];
  const [tab,setTab]=useState("pin");
  const [pin1,setPin1]=useState("");
  const [pin2,setPin2]=useState("");
  const [nick,setNick]=useState(member.name);
  const [topColor,setTopColor]=useState(member.color);
  const [pinError,setPinError]=useState("");

  const savePin=()=>{
    if(pin1.length>0 && pin1.length<4){ setPinError("PIN musí mať 4 číslice!"); return; }
    if(pin1!==pin2){ setPinError("PINy sa nezhodujú!"); return; }
    setMembers(prev=>prev.map(m=>m.id===member.id?{...m,pin:pin1}:m));
    setPinError("");
    setPin1(""); setPin2("");
    showToast(pin1===""?"🔓 PIN odstránený!":"🔑 PIN uložený!",member.color);
  };

  const saveProfile=()=>{
    setMembers(prev=>prev.map(m=>m.id===member.id?{...m,name:nick,color:topColor}:m));
    showToast("✅ Profil uložený!",topColor);
  };

  const COLORS=[
    {c:"#E53935",l:"Červená"},{c:"#E91E63",l:"Ružová"},{c:"#9C27B0",l:"Fialová"},
    {c:"#3F51B5",l:"Modrá"},{c:"#4A90D9",l:"Svetlomodrá"},{c:"#00BCD4",l:"Tyrkysová"},
    {c:"#8CC63F",l:"Zelená"},{c:"#FF9800",l:"Oranžová"},{c:"#795548",l:"Hnedá"},
    {c:"#607D8B",l:"Sivá"},{c:"#FFD90F",l:"Žltá"},{c:"#FF5722",l:"Tehlová"},
  ];

  return(
    <div>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${DARK},${DARK2})`,padding:"20px 20px 24px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{position:"relative"}}>
            <Av size={70}/>
          </div>
          <div>
            <h2 style={{color:YELLOW,fontSize:22,margin:"0 0 2px",fontWeight:900}}>{member.name}</h2>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,margin:0}}>
              {member.role==="admin"?"⚙️ Admin":"🎮 Hráč"} · 🔥 {member.streak} dní
            </p>
            <p style={{color:YELLOW,fontSize:13,fontWeight:800,margin:"4px 0 0"}}>⭐ {member.weekPts||0}b tento týždeň</p>
          </div>
        </div>
      </div>

      {/* Taby */}
      <div style={{display:"flex",gap:6,padding:"14px 16px 0"}}>
        {[{id:"pin",l:"🔑 PIN"},{id:"vzhľad",l:"🎨 Vzhľad"},{id:"info",l:"📊 Štatistiky"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"8px 14px",borderRadius:20,border:"none",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer",background:tab===t.id?member.color:"white",color:tab===t.id?"white":"#888",boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{t.l}</button>
        ))}
      </div>

      <div style={{padding:"14px 16px"}}>

        {/* PIN */}
        {tab==="pin"&&(
          <>
            <Card style={{marginBottom:12}}>
              <p style={{fontWeight:900,fontSize:15,color:"#1A1A2E",margin:"0 0 6px"}}>🔑 Zmena PINu</p>
              <p style={{color:"#aaa",fontSize:12,margin:"0 0 16px",lineHeight:1.5}}>
                PIN je voliteľný. Ak ho nechceš, nechaj prázdne a ulož — vstúpiš bez PINu.
              </p>
              <div style={{marginBottom:12}}>
                <p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 5px"}}>NOVÝ PIN (4 číslice)</p>
                <input
                  type="password" inputMode="numeric" maxLength={4}
                  value={pin1} onChange={e=>{ setPin1(e.target.value.replace(/\D/,"")); setPinError(""); }}
                  placeholder="Zadaj nový PIN..."
                  style={{...iS}}
                />
              </div>
              <div style={{marginBottom:12}}>
                <p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 5px"}}>POTVRĎ PIN</p>
                <input
                  type="password" inputMode="numeric" maxLength={4}
                  value={pin2} onChange={e=>{ setPin2(e.target.value.replace(/\D/,"")); setPinError(""); }}
                  placeholder="Zopakuj PIN..."
                  style={{...iS}}
                />
              </div>
              {pinError&&<p style={{color:"#FF5252",fontSize:12,fontWeight:800,margin:"0 0 10px"}}>{pinError}</p>}
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={savePin} color={member.color} style={{flex:1}}>Uložiť PIN ✓</Btn>
                {member.pin!==""&&(
                  <Btn onClick={()=>{ setPin1(""); setPin2(""); setMembers(prev=>prev.map(m=>m.id===member.id?{...m,pin:""}:m)); showToast("🔓 PIN odstránený",member.color); }} color="#FF9800" style={{padding:"12px 14px",fontSize:12}}>Odstrániť</Btn>
                )}
              </div>
              <div style={{marginTop:12,background:member.pin===""?"#E8F5E9":"#FFF3E0",borderRadius:12,padding:"10px 14px"}}>
                <p style={{fontSize:12,fontWeight:800,margin:0,color:member.pin===""?"#2E7D32":"#E65100"}}>
                  {member.pin===""?"🔓 Momentálne bez PINu — vstup je voľný":"🔑 PIN je nastavený"}
                </p>
              </div>
            </Card>
          </>
        )}

        {/* VZHĽAD */}
        {tab==="vzhľad"&&(
          <>
            <Card style={{marginBottom:12}}>
              <p style={{fontWeight:900,fontSize:15,color:"#1A1A2E",margin:"0 0 14px"}}>📛 Prezývka</p>
              <input
                value={nick} onChange={e=>setNick(e.target.value)}
                placeholder="Tvoja prezývka..."
                style={{...iS,marginBottom:12}}
                maxLength={20}
              />
              <p style={{color:"#aaa",fontSize:11,margin:0}}>Meno sa zobrazí v chate a rebríčku</p>
            </Card>

            <Card style={{marginBottom:12}}>
              <p style={{fontWeight:900,fontSize:15,color:"#1A1A2E",margin:"0 0 14px"}}>🎨 Farba tvojej postavičky</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {COLORS.map(({c,l})=>(
                  <button key={c} onClick={()=>setTopColor(c)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:4}}>
                    <div style={{width:44,height:44,borderRadius:14,background:c,border:`3px solid ${topColor===c?"#1A1A2E":"transparent"}`,boxShadow:topColor===c?"0 4px 12px rgba(0,0,0,0.2)":"none",transition:"all 0.15s"}}/>
                    <span style={{fontSize:9,color:"#888",fontWeight:topColor===c?800:400}}>{l}</span>
                  </button>
                ))}
              </div>
              <div style={{background:`${topColor}18`,borderRadius:16,padding:"14px",textAlign:"center",marginBottom:12}}>
                <p style={{color:topColor,fontSize:13,fontWeight:800,margin:"0 0 8px"}}>Náhľad farby</p>
                <div style={{width:60,height:60,borderRadius:20,background:topColor,margin:"0 auto",boxShadow:`0 4px 16px ${topColor}66`}}/>
              </div>
              <Btn onClick={saveProfile} color={member.color} style={{width:"100%"}}>Uložiť zmeny ✓</Btn>
            </Card>
          </>
        )}

        {/* ŠTATISTIKY */}
        {tab==="info"&&(
          <>
            <Card style={{marginBottom:12}}>
              <p style={{fontWeight:900,fontSize:15,color:"#1A1A2E",margin:"0 0 14px"}}>📊 Moje štatistiky</p>
              {[
                {label:"Body tento týždeň",value:`⭐ ${member.weekPts||0}b`,color:member.color},
                {label:"Body celkovo",value:`⭐ ${member.totalPts||0}b`,color:member.color},
                {label:"Aktuálny streak",value:`🔥 ${member.streak} dní`,color:"#FF6B35"},
                {label:"Level",value:LEVELS[Math.max(0,LEVEL_PTS.findIndex((p,i)=>(member.totalPts||0)<(LEVEL_PTS[i+1]||9999)))],color:"#9C27B0"},
                {label:"Rola",value:member.role==="admin"?"⚙️ Admin":"🎮 Hráč",color:"#888"},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<4?"1px solid #f5f5f5":"none"}}>
                  <span style={{fontSize:13,color:"#888"}}>{s.label}</span>
                  <span style={{fontSize:14,fontWeight:800,color:s.color}}>{s.value}</span>
                </div>
              ))}
            </Card>

            {/* Rebríček pozícia */}
            <Card>
              <p style={{fontWeight:900,fontSize:14,color:"#1A1A2E",margin:"0 0 10px"}}>🏆 Moja pozícia v rebríčku</p>
              {members.sort((a,b)=>(b.weekPts||0)-(a.weekPts||0)).map((m,i)=>(
                <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<3?"1px solid #f5f5f5":"none",opacity:m.id===member.id?1:0.5}}>
                  <span style={{fontSize:16,minWidth:24}}>{"🥇🥈🥉4"[i]||`${i+1}.`}</span>
                  <span style={{flex:1,fontSize:13,fontWeight:m.id===member.id?900:400,color:m.id===member.id?member.color:"#888"}}>{m.name}{m.id===member.id?" (ja)":""}</span>
                  <span style={{fontSize:13,fontWeight:800,color:YELLOW}}>{m.weekPts||0}b</span>
                </div>
              ))}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN PANEL
// ═══════════════════════════════════════════════════════
function AdminPanel({member,members,setMembers,tasksDB,setTasksDB,rewards,setRewards,proposals,setProposals,seasons,setSeasons,doneTasks,setDoneTasks,showToast}){
  const [tab,setTab]=useState("proposals");
  const [rejectId,setRejectId]=useState(null);
  const [rejectNote,setRejectNote]=useState("");
  const [approveItem,setApproveItem]=useState(null);
  const [approvePts,setApprovePts]=useState("");
  const [showPunish,setShowPunish]=useState(false);
  const [punishForm,setPunishForm]=useState({target:"Bart",type:"points",value:"",reason:""});
  const [confirmReset,setConfirmReset]=useState(null);
  const [adjustPts,setAdjustPts]=useState({homer:"",marge:"",bart:"",lisa:""});
  const [editTask,setEditTask]=useState(null);
  const [showAddTask,setShowAddTask]=useState(false);
  const [newTask,setNewTask]=useState({name:"",room:Object.keys(tasksDB)[0],who:"Bart, Lisa",freq:F.DAILY,points:3,mandatory:true,icon:"✅",season:"always"});
  const [editReward,setEditReward]=useState(null);
  const [showAddReward,setShowAddReward]=useState(false);
  const [newReward,setNewReward]=useState({name:"",emoji:"🎁",points:100,who:"Všetci",active:true});
  const [selCat,setSelCat]=useState(Object.keys(tasksDB)[0]);
  const [seasonFilter,setSeasonFilter]=useState("school");

  // Počet úloh čakajúcich na overenie
  const todayKey2 = new Date().toDateString();
  const pendingVerify = members.filter(m=>m.role!=="admin").reduce((total,m)=>{
    const mDone = doneTasks[m.id]?.[todayKey2]||{};
    return total + Object.values(mDone).filter(v=>v==="pending").length;
  },0);
  const tabs=[
    {id:"verify",l:`⏳ Overenie${pendingVerify>0?` (${pendingVerify})`:""}`},
    {id:"proposals",l:`💡 Návrhy${pending>0?` (${pending})`:""}`},
    {id:"tasks",l:"📋 Úlohy"},
    {id:"rewards",l:"🛍️ Odmeny"},
    {id:"points",l:"👥 Body"},
    {id:"punish",l:"⚖️ Tresty"},
    {id:"seasons",l:"🗓️ Sezóny"},
  ];

  const approveProposal=()=>{
    setProposals(p=>p.map(x=>x.id===approveItem.id?{...x,status:"approved",points:approvePts?Number(approvePts):x.points}:x));
    setApproveItem(null); showToast("✅ Schválené!","#66BB6A");
  };
  const rejectProposal=()=>{
    setProposals(p=>p.map(x=>x.id===rejectId?{...x,status:"rejected",adminNote:rejectNote}:x));
    setRejectId(null); showToast("❌ Zamietnuté","#FF5252");
  };
  const addTask=()=>{
    if(!newTask.name.trim()) return;
    setTasksDB(p=>({...p,[selCat]:[...(p[selCat]||[]),{...newTask,id:`c_${Date.now()}`,season:"always"}]}));
    setShowAddTask(false); setNewTask({name:"",room:selCat,who:"Bart, Lisa",freq:F.DAILY,points:3,mandatory:true,icon:"✅",season:"always"});
    showToast("💾 Úloha pridaná!",member.color);
  };
  const saveEditTask=()=>{
    setTasksDB(p=>{const nd={...p}; nd[selCat]=nd[selCat].map(t=>t.id===editTask.id?editTask:t); return nd;});
    setEditTask(null); showToast("💾 Uložené!",member.color);
  };
  const deleteTask=(cat,id)=>{setTasksDB(p=>({...p,[cat]:p[cat].filter(t=>t.id!==id)})); showToast("🗑️ Zmazané");};
  const copyTask=(cat,task)=>{
    setTasksDB(p=>({...p,[cat]:[...p[cat],{...task,id:`c_${Date.now()}`,name:task.name+" (kópia)"}]}));
    showToast("📋 Skopírované!",member.color);
  };
  const addReward=()=>{
    if(!newReward.name.trim()) return;
    setRewards(p=>[...p,{...newReward,id:`r_${Date.now()}`}]);
    setShowAddReward(false); showToast("💾 Odmena pridaná!",member.color);
  };
  const saveEditReward=()=>{setRewards(p=>p.map(r=>r.id===editReward.id?editReward:r)); setEditReward(null); showToast("💾 Uložené!",member.color);};
  const deleteReward=(id)=>{setRewards(p=>p.filter(r=>r.id!==id)); showToast("🗑️ Zmazané");};
  const sendPunish=()=>{showToast(punishForm.type==="bonus"?`🎉 Bonus pre ${punishForm.target}!`:`⚠️ Trest pre ${punishForm.target}!`,punishForm.type==="bonus"?"#66BB6A":"#FF5252"); setShowPunish(false);};
  const toggleSeason=(id)=>setSeasons(p=>p.map(s=>s.id===id?{...s,active:!s.active}:s));

  const catTasks=(tasksDB[selCat]||[]).filter(t=>{
    if(seasonFilter==="always") return t.season==="always"||!t.season;
    return t.season===seasonFilter||t.season==="always"||!t.season;
  });
  const MEMBERS_LIST=["Homer","Marge","Bart","Lisa","Bart, Lisa","Homer, Marge","Ktokoľvek","Všetci"];

  return(
    <div>
      <div style={{background:`linear-gradient(135deg,${DARK},#0F3460)`,padding:"20px 20px 18px",borderBottomLeftRadius:28,borderBottomRightRadius:28}}>
        <h2 style={{color:YELLOW,fontSize:22,margin:0,fontWeight:900}}>⚙️ Admin — {member.name}</h2>
        {pending>0&&<p style={{color:"#FF8080",fontSize:13,margin:"4px 0 0",fontWeight:700}}>{pending} návrhov čaká</p>}
      </div>
      <div style={{display:"flex",gap:6,padding:"14px 16px 0",overflowX:"auto",scrollbarWidth:"none"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flexShrink:0,padding:"8px 14px",borderRadius:20,border:"none",fontFamily:"inherit",fontSize:12,fontWeight:800,cursor:"pointer",background:tab===t.id?member.color:"white",color:tab===t.id?"white":"#888",boxShadow:tab===t.id?`0 4px 12px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)",transition:"all 0.2s"}}>{t.l}</button>)}
      </div>
      <div style={{padding:"14px 16px"}}>

        {/* OVERENIE ÚLOH */}
        {tab==="verify"&&(
          <>
            {pendingVerify===0?(
              <Card style={{textAlign:"center",padding:32}}>
                <p style={{fontSize:40,margin:"0 0 10px"}}>✅</p>
                <p style={{color:"#1A1A2E",fontWeight:800,fontSize:16,margin:"0 0 6px"}}>Všetko overené!</p>
                <p style={{color:"#aaa",fontSize:13,margin:0}}>Žiadne úlohy nečakajú na overenie</p>
              </Card>
            ):(
              members.filter(m=>m.role!=="admin").map(m=>{
                const mDone = doneTasks[m.id]?.[todayKey2]||{};
                const pendingTasks = Object.entries(mDone)
                  .filter(([,v])=>v==="pending")
                  .map(([taskId])=>{
                    const task = Object.values(tasksDB).flat().find(t=>t.id===taskId);
                    return task ? {...task, memberId:m.id, memberName:m.name, memberColor:m.color} : null;
                  }).filter(Boolean);
                if(!pendingTasks.length) return null;
                return(
                  <div key={m.id} style={{marginBottom:16}}>
                    <Sect>{m.name} — {pendingTasks.length} čaká</Sect>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {pendingTasks.map(task=>(
                        <Card key={task.id} style={{borderLeft:`4px solid ${m.color}`}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                            <span style={{fontSize:22}}>{task.icon}</span>
                            <div style={{flex:1}}>
                              <p style={{fontSize:14,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px"}}>{task.name}</p>
                              <div style={{display:"flex",gap:6}}>
                                <span style={{background:`${m.color}18`,color:m.color,borderRadius:8,padding:"1px 8px",fontSize:11,fontWeight:800}}>{m.name}</span>
                                <span style={{background:`${member.color}18`,color:member.color,borderRadius:8,padding:"1px 8px",fontSize:11,fontWeight:800}}>+{task.points}b</span>
                              </div>
                            </div>
                          </div>
                          <div style={{display:"flex",gap:8}}>
                            <Btn onClick={()=>{
                              // Potvrdiť — zmeniť pending na done + pridať body
                              setDoneTasks(prev=>{
                                const nd={...prev};
                                if(!nd[task.memberId]) nd[task.memberId]={};
                                if(!nd[task.memberId][todayKey2]) nd[task.memberId][todayKey2]={};
                                nd[task.memberId][todayKey2][task.id]="done";
                                return nd;
                              });
                              setMembers(prev=>prev.map(x=>x.id===task.memberId?{...x,weekPts:(x.weekPts||0)+task.points,totalPts:(x.totalPts||0)+task.points}:x));
                              showToast(`✅ +${task.points}b pre ${task.memberName}!`,"#66BB6A");
                            }} color="#66BB6A" style={{flex:1,padding:"10px 0",fontSize:13}}>✅ Potvrdiť</Btn>
                            <Btn onClick={()=>{
                              // Zamietnuť — odstrániť pending
                              setDoneTasks(prev=>{
                                const nd={...prev};
                                if(nd[task.memberId]?.[todayKey2]?.[task.id]){
                                  delete nd[task.memberId][todayKey2][task.id];
                                }
                                return nd;
                              });
                              showToast(`❌ Zamietnuté pre ${task.memberName}`,"#FF5252");
                            }} color="#FF5252" style={{flex:1,padding:"10px 0",fontSize:13}}>❌ Zamietnuť</Btn>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* NÁVRHY */}
        {tab==="proposals"&&(
          <>
            {["pending","approved","rejected"].map(status=>{
              const items=proposals.filter(p=>p.status===status); if(!items.length) return null;
              const labels={pending:"⏳ Čakajú",approved:"✅ Schválené",rejected:"❌ Zamietnuté"};
              return(
                <div key={status} style={{marginBottom:16}}>
                  <Sect>{labels[status]}</Sect>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {items.map(p=>(
                      <Card key={p.id} style={{borderLeft:`4px solid ${p.fromColor}`}}>
                        <div style={{display:"flex",gap:10,marginBottom:status==="pending"?12:0}}>
                          <span style={{fontSize:22}}>{p.emoji}</span>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                              <span style={{background:`${p.fromColor}18`,color:p.fromColor,borderRadius:8,padding:"2px 8px",fontSize:11,fontWeight:800}}>{p.from}</span>
                              <span style={{background:"#f0f0f0",color:"#888",borderRadius:8,padding:"2px 8px",fontSize:11}}>{p.type==="reward"?"🎁":"📋"} {p.type}</span>
                            </div>
                            <p style={{fontSize:13,color:"#1A1A2E",fontWeight:700,margin:0,lineHeight:1.4}}>{p.text}</p>
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

        {/* ÚLOHY */}
        {tab==="tasks"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <Sect>Správa úloh</Sect>
              <Btn onClick={()=>setShowAddTask(p=>!p)} color={member.color} style={{padding:"7px 14px",fontSize:12}}>+ Pridať</Btn>
            </div>

            {/* Režim filter */}
            <div style={{display:"flex",background:"rgba(0,0,0,0.05)",borderRadius:14,padding:3,marginBottom:12}}>
              {[{id:"school",l:"🎒 Školský",c:"#1A237E"},{id:"holiday",l:"🌞 Prázdniny",c:"#E65100"},{id:"always",l:"📋 Vždy",c:"#555"}].map(({id,l,c})=>(
                <button key={id} onClick={()=>setSeasonFilter(id)} style={{flex:1,padding:"8px 0",borderRadius:11,border:"none",fontFamily:"inherit",fontSize:11,fontWeight:800,cursor:"pointer",background:seasonFilter===id?"white":"transparent",color:seasonFilter===id?c:"#aaa",boxShadow:seasonFilter===id?"0 2px 8px rgba(0,0,0,0.1)":"none",transition:"all 0.2s"}}>{l}</button>
              ))}
            </div>

            {/* Kategória */}
            <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:12,paddingBottom:4,scrollbarWidth:"none"}}>
              {Object.keys(tasksDB).filter(cat=>{
                const tasks = tasksDB[cat]||[];
                if(seasonFilter==="always") return tasks.some(t=>t.season==="always"||!t.season);
                return tasks.some(t=>t.season===seasonFilter||t.season==="always"||!t.season);
              }).map(cat=>(
                <button key={cat} onClick={()=>setSelCat(cat)} style={{flexShrink:0,padding:"6px 12px",borderRadius:14,border:"none",fontFamily:"inherit",fontSize:11,fontWeight:800,cursor:"pointer",background:selCat===cat?member.color:"white",color:selCat===cat?"white":"#888",whiteSpace:"nowrap",boxShadow:selCat===cat?`0 3px 10px ${member.color}55`:"0 1px 4px rgba(0,0,0,0.08)"}}>
                  {cat.split(" ").slice(0,2).join(" ")} ({(tasksDB[cat]||[]).filter(t=>seasonFilter==="always"?(t.season==="always"||!t.season):(t.season===seasonFilter||t.season==="always"||!t.season)).length})
                </button>
              ))}
            </div>
            {showAddTask&&(
              <Card style={{marginBottom:12,border:`2px solid ${member.color}44`}}>
                <p style={{fontWeight:900,fontSize:14,margin:"0 0 12px"}}>➕ Nová úloha — {selCat}</p>
                <div style={{marginBottom:8}}><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>NÁZOV</p><input style={iS} value={newTask.name} onChange={e=>setNewTask(p=>({...p,name:e.target.value}))} placeholder="Napr. Umyť okná..."/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
                  <div><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>KTO</p><select style={sS} value={newTask.who} onChange={e=>setNewTask(p=>({...p,who:e.target.value}))}>{MEMBERS_LIST.map(m=><option key={m}>{m}</option>)}</select></div>
                  <div><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>FREQ</p><select style={sS} value={newTask.freq} onChange={e=>setNewTask(p=>({...p,freq:e.target.value}))}>{Object.values(F).map(f=><option key={f}>{f}</option>)}</select></div>
                  <div><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>BODY</p><input style={iS} type="number" min={1} max={30} value={newTask.points} onChange={e=>setNewTask(p=>({...p,points:Number(e.target.value)}))}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
                  {[{v:true,l:"⚠️ Povinná",c:"#FF5252"},{v:false,l:"🙋 Dobrovoľná",c:"#9C27B0"},{v:"bonus",l:"⚡ Bonusová",c:"#FF9800"}].map(({v,l,c})=>(
                    <button key={String(v)} onClick={()=>setNewTask(p=>({...p,mandatory:v}))} style={{padding:"9px 4px",borderRadius:10,border:`2px solid ${newTask.mandatory===v?c:"#eee"}`,background:newTask.mandatory===v?`${c}15`:"white",fontWeight:800,fontSize:10,cursor:"pointer",fontFamily:"inherit",color:newTask.mandatory===v?c:"#aaa"}}>{l}</button>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={addTask} color={member.color} style={{flex:1}}>Uložiť ✓</Btn>
                  <Btn onClick={()=>setShowAddTask(false)} color="#eee" style={{color:"#888"}}>Zrušiť</Btn>
                </div>
              </Card>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {catTasks.length===0&&(
                <Card style={{textAlign:"center",padding:28}}>
                  <p style={{fontSize:32,margin:"0 0 8px"}}>📋</p>
                  <p style={{color:"#aaa",fontSize:13,margin:0}}>Žiadne úlohy — klikni "+ Pridať"</p>
                </Card>
              )}
              {catTasks.map((task,idx)=>(
                <div key={task.id}>
                  {editTask?.id===task.id?(
                    <Card style={{border:`2px solid ${member.color}44`}}>
                      <p style={{fontWeight:900,fontSize:13,color:member.color,margin:"0 0 10px"}}>✏️ Editovať</p>
                      <input style={{...iS,marginBottom:8}} value={editTask.name} onChange={e=>setEditTask(p=>({...p,name:e.target.value}))} placeholder="Názov úlohy"/>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <div>
                          <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 3px"}}>KTO</p>
                          <select style={sS} value={editTask.who} onChange={e=>setEditTask(p=>({...p,who:e.target.value}))}>{MEMBERS_LIST.map(m=><option key={m}>{m}</option>)}</select>
                        </div>
                        <div>
                          <p style={{fontSize:10,fontWeight:800,color:"#888",margin:"0 0 3px"}}>BODY</p>
                          <input style={iS} type="number" min={1} max={30} value={editTask.points} onChange={e=>setEditTask(p=>({...p,points:Number(e.target.value)}))}/>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
                        {[{v:true,l:"⚠️ Povinná",c:"#FF5252"},{v:false,l:"🙋 Dobrovoľná",c:"#9C27B0"},{v:"bonus",l:"⚡ Bonusová",c:"#FF9800"}].map(({v,l,c})=>(
                          <button key={String(v)} onClick={()=>setEditTask(p=>({...p,mandatory:v}))} style={{padding:"7px 4px",borderRadius:8,border:`2px solid ${editTask.mandatory===v?c:"#eee"}`,background:editTask.mandatory===v?`${c}15`:"white",fontWeight:800,fontSize:10,cursor:"pointer",fontFamily:"inherit",color:editTask.mandatory===v?c:"#aaa"}}>{l}</button>
                        ))}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn onClick={saveEditTask} color={member.color} style={{flex:1,padding:"10px 0",fontSize:13}}>Uložiť ✓</Btn>
                        <Btn onClick={()=>setEditTask(null)} color="#eee" style={{padding:"10px 14px",fontSize:13,color:"#888"}}>Zrušiť</Btn>
                      </div>
                    </Card>
                  ):(
                    <Card style={{borderLeft:`4px solid ${MEMBER_COLORS[task.who?.split(",")[0]?.trim()]||"#ddd"}`,padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                        <span style={{fontSize:20,flexShrink:0}}>{task.icon||"📋"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:"0 0 3px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{task.name}</p>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                            <span style={{background:"#f0f0f0",color:"#666",borderRadius:7,padding:"1px 7px",fontSize:10,fontWeight:700}}>{task.who}</span>
                            <span style={{background:`${member.color}22`,color:member.color,borderRadius:7,padding:"1px 7px",fontSize:11,fontWeight:900}}>+{task.points}b</span>
                            {task.mandatory===true&&<span style={{background:"#FFF3F3",color:"#FF5252",borderRadius:7,padding:"1px 6px",fontSize:10,fontWeight:800}}>⚠️ Povinná</span>}
                            {task.mandatory===false&&<span style={{background:"#F3E5F5",color:"#9C27B0",borderRadius:7,padding:"1px 6px",fontSize:10,fontWeight:800}}>🙋 Dobrovoľná</span>}
                            {task.mandatory==="bonus"&&<span style={{background:"#FFF8E1",color:"#FF9800",borderRadius:7,padding:"1px 6px",fontSize:10,fontWeight:800}}>⚡ Bonusová</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{display:"flex",gap:5}}>
                        <button onClick={()=>{setEditTask({...task});setShowAddTask(false);}} style={{flex:1,height:34,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:12,cursor:"pointer",fontWeight:700,color:"#555"}}>✏️ Edit</button>
                        <button onClick={()=>copyTask(selCat,task)} style={{flex:1,height:34,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:12,cursor:"pointer",fontWeight:700,color:"#555"}}>📋</button>
                        <button
                          onClick={()=>{if(idx>0){const arr=[...catTasks];[arr[idx],arr[idx-1]]=[arr[idx-1],arr[idx]];setTasksDB(p=>({...p,[selCat]:arr}));}}}
                          disabled={idx===0}
                          style={{width:34,height:34,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:15,cursor:idx===0?"default":"pointer",opacity:idx===0?0.3:1}}>⬆️</button>
                        <button
                          onClick={()=>{if(idx<catTasks.length-1){const arr=[...catTasks];[arr[idx],arr[idx+1]]=[arr[idx+1],arr[idx]];setTasksDB(p=>({...p,[selCat]:arr}));}}}
                          disabled={idx===catTasks.length-1}
                          style={{width:34,height:34,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:15,cursor:idx===catTasks.length-1?"default":"pointer",opacity:idx===catTasks.length-1?0.3:1}}>⬇️</button>
                        <button onClick={()=>deleteTask(selCat,task.id)} style={{width:34,height:34,borderRadius:8,border:"1px solid #eee",background:"#FFF3F3",fontSize:14,cursor:"pointer"}}>🗑️</button>
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ODMENY */}
        {tab==="rewards"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <Sect>Správa odmien ({rewards.length})</Sect>
              <Btn onClick={()=>setShowAddReward(p=>!p)} color={member.color} style={{padding:"7px 14px",fontSize:12}}>+ Pridať</Btn>
            </div>
            {showAddReward&&(
              <Card style={{marginBottom:12,border:`2px solid ${member.color}44`}}>
                <p style={{fontWeight:900,fontSize:14,margin:"0 0 12px"}}>➕ Nová odmena</p>
                <div style={{display:"grid",gridTemplateColumns:"60px 1fr",gap:8,marginBottom:8}}>
                  <input style={{...iS,textAlign:"center",fontSize:22}} value={newReward.emoji} onChange={e=>setNewReward(p=>({...p,emoji:e.target.value}))}/>
                  <input style={iS} placeholder="Názov odmeny..." value={newReward.name} onChange={e=>setNewReward(p=>({...p,name:e.target.value}))}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  <input style={iS} type="number" value={newReward.points} onChange={e=>setNewReward(p=>({...p,points:Number(e.target.value)}))} placeholder="Body"/>
                  <select style={sS} value={newReward.who} onChange={e=>setNewReward(p=>({...p,who:e.target.value}))}>{["Všetci","Homer","Marge","Bart","Lisa","Bart, Lisa","Homer, Marge"].map(m=><option key={m}>{m}</option>)}</select>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={addReward} color={member.color} style={{flex:1}}>Uložiť ✓</Btn>
                  <Btn onClick={()=>setShowAddReward(false)} color="#eee" style={{color:"#888"}}>Zrušiť</Btn>
                </div>
              </Card>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {rewards.map(r=>(
                <div key={r.id}>
                  {editReward?.id===r.id?(
                    <Card style={{border:`2px solid ${member.color}44`}}>
                      <div style={{display:"grid",gridTemplateColumns:"56px 1fr",gap:8,marginBottom:8}}>
                        <input style={{...iS,textAlign:"center",fontSize:22}} value={editReward.emoji} onChange={e=>setEditReward(p=>({...p,emoji:e.target.value}))}/>
                        <input style={iS} value={editReward.name} onChange={e=>setEditReward(p=>({...p,name:e.target.value}))}/>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                        <input style={iS} type="number" value={editReward.points} onChange={e=>setEditReward(p=>({...p,points:Number(e.target.value)}))}/>
                        <select style={sS} value={editReward.who} onChange={e=>setEditReward(p=>({...p,who:e.target.value}))}>{["Všetci","Homer","Marge","Bart","Lisa","Bart, Lisa"].map(m=><option key={m}>{m}</option>)}</select>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn onClick={saveEditReward} color={member.color} style={{flex:1,padding:"10px 0",fontSize:13}}>Uložiť</Btn>
                        <Btn onClick={()=>setEditReward(null)} color="#eee" style={{padding:"10px 14px",fontSize:13,color:"#888"}}>Zrušiť</Btn>
                      </div>
                    </Card>
                  ):(
                    <Card style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:26,flexShrink:0}}>{r.emoji}</span>
                      <div style={{flex:1}}><p style={{fontSize:13,fontWeight:800,color:"#1A1A2E",margin:"0 0 2px"}}>{r.name}</p><p style={{fontSize:11,color:"#aaa",margin:0}}>Pre: {r.who}</p></div>
                      <span style={{background:`${member.color}18`,color:member.color,borderRadius:8,padding:"3px 10px",fontSize:12,fontWeight:800}}>⭐{r.points}b</span>
                      <button onClick={()=>setEditReward({...r})} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:13,cursor:"pointer"}}>✏️</button>
                      <button onClick={()=>{ const copy={...r,id:`r_${Date.now()}`,name:r.name+" (kópia)"}; setRewards(p=>[...p,copy]); showToast("📋 Skopírované!",member.color); }} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"white",fontSize:13,cursor:"pointer"}}>📋</button>
                      <button onClick={()=>deleteReward(r.id)} style={{width:32,height:32,borderRadius:8,border:"1px solid #eee",background:"#FFF3F3",fontSize:13,cursor:"pointer"}}>🗑️</button>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* BODY */}
        {tab==="points"&&(
          <>
            {/* Reset bodov */}
            <Card style={{marginBottom:14,border:"2px solid #FF525444"}}>
              <p style={{fontWeight:900,fontSize:14,color:"#1A1A2E",margin:"0 0 6px"}}>🔄 Reset bodov</p>
              <p style={{color:"#aaa",fontSize:12,margin:"0 0 12px"}}>Vynuluje body hráčov. Nedá sa vrátiť späť!</p>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>setConfirmReset("week")} color="#FF9800" style={{flex:1,fontSize:12}}>🔄 Reset týždenných</Btn>
                <Btn onClick={()=>setConfirmReset("all")} color="#FF5252" style={{flex:1,fontSize:12}}>⚠️ Reset všetkých</Btn>
              </div>
            </Card>

            {/* Manuálna úprava */}
            <Sect>Upraviť body jednotlivo</Sect>
            {members.map(m=>{
              const Av=AVTS[m.id];
              return(
                <Card key={m.id} style={{marginBottom:10,borderLeft:`3px solid ${m.color}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                    <Av size={42}/>
                    <div style={{flex:1}}>
                      <p style={{fontSize:14,fontWeight:900,color:"#1A1A2E",margin:0}}>{m.name}</p>
                      <p style={{fontSize:12,color:"#888",margin:"2px 0 0"}}>
                        Týždeň: <b style={{color:m.color}}>{m.weekPts||0}b</b>
                        {" · "}Celkovo: <b style={{color:m.color}}>{m.totalPts||0}b</b>
                      </p>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input
                      type="number" min={1} placeholder="Body..."
                      value={adjustPts[m.id]||""}
                      onChange={e=>setAdjustPts(p=>({...p,[m.id]:e.target.value}))}
                      style={{...iS,flex:1,margin:0}}
                    />
                    <Btn onClick={()=>{
                      const val=Number(adjustPts[m.id]);
                      if(!val||val<=0) return;
                      setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:(x.weekPts||0)+val,totalPts:(x.totalPts||0)+val}:x));
                      setAdjustPts(p=>({...p,[m.id]:""}));
                      showToast(`+${val}b pre ${m.name}! 🎉`,"#66BB6A");
                    }} color="#66BB6A" style={{padding:"10px 14px",fontSize:13}}>➕</Btn>
                    <Btn onClick={()=>{
                      const val=Number(adjustPts[m.id]);
                      if(!val||val<=0) return;
                      setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:Math.max(0,(x.weekPts||0)-val),totalPts:Math.max(0,(x.totalPts||0)-val)}:x));
                      setAdjustPts(p=>({...p,[m.id]:""}));
                      showToast(`-${val}b pre ${m.name}`,"#FF5252");
                    }} color="#FF5252" style={{padding:"10px 14px",fontSize:13}}>➖</Btn>
                    <Btn onClick={()=>{
                      setMembers(prev=>prev.map(x=>x.id===m.id?{...x,weekPts:0,totalPts:0}:x));
                      showToast(`Reset bodov pre ${m.name}`,"#FF9800");
                    }} color="#FF9800" style={{padding:"10px 12px",fontSize:12}}>0</Btn>
                  </div>
                </Card>
              );
            })}

            {/* Confirm Reset Dialog */}
            {confirmReset&&(
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(4px)"}}>
                <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
                  <p style={{fontSize:44,textAlign:"center",margin:"0 0 8px"}}>⚠️</p>
                  <h3 style={{textAlign:"center",fontSize:18,fontWeight:900,color:"#1A1A2E",margin:"0 0 8px"}}>
                    {confirmReset==="week"?"Reset týždenných bodov?":"Reset VŠETKÝCH bodov?"}
                  </h3>
                  <p style={{textAlign:"center",color:"#aaa",fontSize:13,margin:"0 0 20px"}}>
                    {confirmReset==="week"
                      ?"Týždenné body všetkých hráčov sa vynulujú. Celkové body zostanú."
                      :"Všetky body (týždenné aj celkové) sa vynulujú pre celú rodinu!"}
                  </p>
                  <div style={{display:"flex",gap:10}}>
                    <Btn onClick={()=>setConfirmReset(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
                    <Btn onClick={()=>{
                      if(confirmReset==="week"){
                        setMembers(prev=>prev.map(m=>({...m,weekPts:0})));
                        showToast("🔄 Týždenné body resetované!","#FF9800");
                      } else {
                        setMembers(prev=>prev.map(m=>({...m,weekPts:0,totalPts:0})));
                        showToast("🔄 Všetky body resetované!","#FF5252");
                      }
                      setConfirmReset(null);
                    }} color={confirmReset==="week"?"#FF9800":"#FF5252"} style={{flex:2}}>✓ Potvrdiť reset</Btn>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TRESTY */}
        {tab==="punish"&&(
          <>
            <Btn onClick={()=>setShowPunish(p=>!p)} color="#FF5252" style={{width:"100%",marginBottom:14,fontSize:15,boxShadow:"0 4px 16px rgba(255,82,82,0.35)"}}>⚖️ Udeliť trest alebo bonus</Btn>
            {showPunish&&(
              <Card style={{marginBottom:14,border:"2px solid #FF525244"}}>
                <p style={{fontWeight:900,fontSize:14,margin:"0 0 12px"}}>⚖️ Trest / Bonus</p>
                <div style={{marginBottom:10}}><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>KOMU</p><select style={sS} value={punishForm.target} onChange={e=>setPunishForm(p=>({...p,target:e.target.value}))}>{["Homer","Marge","Bart","Lisa"].map(m=><option key={m}>{m}</option>)}</select></div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:10}}>
                  {[{id:"points",l:"💸 Odpočítať body"},{id:"bonus",l:"🎉 Pridať body"},{id:"notv",l:"📺 Zákaz TV"},{id:"nomobile",l:"📱 Zákaz mobilu"}].map(t=>(
                    <button key={t.id} onClick={()=>setPunishForm(p=>({...p,type:t.id}))} style={{padding:"10px 8px",borderRadius:10,border:`2px solid ${punishForm.type===t.id?(t.id==="bonus"?"#66BB6A":"#FF5252"):"#eee"}`,background:punishForm.type===t.id?(t.id==="bonus"?"#E8F5E9":"#FFF3F3"):"white",fontWeight:800,fontSize:12,cursor:"pointer",fontFamily:"inherit",color:punishForm.type===t.id?(t.id==="bonus"?"#2E7D32":"#FF5252"):"#888"}}>{t.l}</button>
                  ))}
                </div>
                <div style={{marginBottom:10}}><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>HODNOTA</p><input style={iS} value={punishForm.value} onChange={e=>setPunishForm(p=>({...p,value:e.target.value}))} placeholder="napr. 10"/></div>
                <div style={{marginBottom:12}}><p style={{fontSize:11,fontWeight:800,color:"#888",margin:"0 0 4px"}}>DÔVOD</p><input style={iS} value={punishForm.reason} onChange={e=>setPunishForm(p=>({...p,reason:e.target.value}))} placeholder="Výborné správanie..."/></div>
                <div style={{display:"flex",gap:8}}>
                  <Btn onClick={sendPunish} color={punishForm.type==="bonus"?"#66BB6A":"#FF5252"} style={{flex:1}}>{punishForm.type==="bonus"?"🎉 Bonus":"⚠️ Trest"}</Btn>
                  <Btn onClick={()=>setShowPunish(false)} color="#eee" style={{color:"#888"}}>Zrušiť</Btn>
                </div>
              </Card>
            )}
          </>
        )}

        {/* SEZÓNY */}
        {tab==="seasons"&&(
          <>
            <Sect>Prepni režim pre celú rodinu</Sect>

            {/* Veľký prepínač */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {seasons.map(s=>{
                const isActive = s.active;
                const colors = s.id==="school"
                  ? {bg:"#1A237E",accent:"#5C6BC0",text:"#E8EAF6"}
                  : {bg:"#E65100",accent:"#FF9800",text:"#FFF8E1"};
                return(
                  <button key={s.id} onClick={()=>{
                    // Prepne na túto sezónu, vypne druhú
                    setSeasons(prev=>prev.map(x=>({...x,active:x.id===s.id})));
                    showToast(`${s.emoji} ${s.name} aktivovaný!`,colors.accent);
                  }} style={{
                    padding:"20px 12px",borderRadius:24,border:`3px solid ${isActive?colors.accent:"#eee"}`,
                    background:isActive?`linear-gradient(135deg,${colors.bg},${colors.accent})`:"white",
                    cursor:"pointer",fontFamily:"inherit",transition:"all 0.25s",
                    boxShadow:isActive?`0 8px 24px ${colors.accent}55`:"0 2px 8px rgba(0,0,0,0.06)",
                    textAlign:"center"
                  }}>
                    <p style={{fontSize:44,margin:"0 0 8px"}}>{s.emoji}</p>
                    <p style={{fontSize:15,fontWeight:900,color:isActive?"white":"#1A1A2E",margin:"0 0 4px"}}>{s.name}</p>
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:isActive?"rgba(255,255,255,0.2)":"#f0f0f0",borderRadius:20,padding:"4px 12px"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:isActive?"#69F0AE":"#bbb"}}/>
                      <span style={{fontSize:11,fontWeight:800,color:isActive?"white":"#aaa"}}>{isActive?"AKTÍVNY":"vypnutý"}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Čo platí v každom režime */}
            <Card style={{marginBottom:12,background:"#F3F4FF",border:"1.5px solid #C5CAE9"}}>
              <p style={{fontWeight:900,fontSize:13,color:"#1A237E",margin:"0 0 10px"}}>🎒 Školský rok obsahuje:</p>
              {["Ranná rutina (umyť zuby, taška, EduPage...)","Domáce úlohy a písomky","Všetky domáce povinnosti","Maggie a zvieratká","Denné úlohy (riad, prádlo...)"].map((t,i)=>(
                <p key={i} style={{fontSize:12,color:"#3949AB",margin:"0 0 4px",display:"flex",gap:6,alignItems:"center"}}>✓ {t}</p>
              ))}
            </Card>

            <Card style={{marginBottom:12,background:"#FFF8E1",border:"1.5px solid #FFE082"}}>
              <p style={{fontWeight:900,fontSize:13,color:"#E65100",margin:"0 0 10px"}}>🌞 Prázdniny obsahuje:</p>
              {["Vstať do dohodnutého času","Všetky domáce povinnosti","Maggie a zvieratká","Denné úlohy (riad, prádlo...)","BEZ školských úloh a rutiny"].map((t,i)=>(
                <p key={i} style={{fontSize:12,color:"#BF360C",margin:"0 0 4px",display:"flex",gap:6,alignItems:"center"}}>{i===4?"✗":"✓"} {t}</p>
              ))}
            </Card>

            {/* Reset */}
            <Card style={{background:`linear-gradient(135deg,${DARK},#2C2C54)`}}>
              <p style={{color:YELLOW,fontSize:14,fontWeight:900,margin:"0 0 6px"}}>🔄 Reset denných úloh</p>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,margin:"0 0 12px"}}>Automaticky každý deň o 23:00.</p>
              <Btn onClick={()=>showToast("🔄 Denné úlohy resetované!",YELLOW)} color="rgba(255,217,15,0.15)" style={{width:"100%",border:"1px solid rgba(255,217,15,0.3)",color:YELLOW,fontSize:13}}>🔄 Resetovať teraz</Btn>
            </Card>
          </>
        )}
      </div>

      {/* DIALÓGY */}
      {approveItem&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <p style={{fontSize:36,textAlign:"center",margin:"0 0 6px"}}>{approveItem.emoji}</p>
            <h3 style={{textAlign:"center",fontSize:16,fontWeight:900,color:"#1A1A2E",margin:"0 0 16px"}}>{approveItem.text}</h3>
            {approveItem.type!=="request"&&(
              <div style={{marginBottom:16}}><p style={{fontSize:12,fontWeight:800,color:"#666",margin:"0 0 6px"}}>⭐ Počet bodov (môžeš zmeniť)</p><input style={{...iS,fontSize:18,fontWeight:900,textAlign:"center"}} type="number" value={approvePts} onChange={e=>setApprovePts(e.target.value)} placeholder="napr. 10"/></div>
            )}
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setApproveItem(null)} color="#eee" style={{flex:1,color:"#888"}}>Zrušiť</Btn>
              <Btn onClick={approveProposal} color="#66BB6A" style={{flex:2}}>✅ Schváliť</Btn>
            </div>
          </div>
        </div>
      )}
      {rejectId&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:100,backdropFilter:"blur(4px)"}}>
          <div style={{background:"white",borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",width:"100%",maxWidth:480}}>
            <h3 style={{fontSize:18,fontWeight:900,color:"#1A1A2E",margin:"0 0 6px"}}>❌ Zamietnuť návrh</h3>
            <p style={{color:"#aaa",fontSize:13,margin:"0 0 14px"}}>Napíš dôvod — dieťa ho uvidí</p>
            <input style={{...iS,marginBottom:16}} value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Napr. Skúsime to neskôr 😊" autoFocus/>
            <div style={{display:"flex",gap:10}}>
              <Btn onClick={()=>setRejectId(null)} color="#eee" style={{flex:1,color:"#888"}}>Späť</Btn>
              <Btn onClick={rejectProposal} color="#FF5252" style={{flex:2}}>❌ Zamietnuť</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
