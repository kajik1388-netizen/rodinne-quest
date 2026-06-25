# Rodinné Quest v2 — Návod na inštaláciu

## Štruktúra súborov

Skopíruj tieto súbory do tvojho projektu:

```
src/
  App.jsx                    ← hlavná appka
  data.js                    ← databáza úloh a konštanty
  components/
    Avatars.jsx              ← SVG avatary
    UI.jsx                   ← zdieľané UI komponenty
    SelectPlayer.jsx         ← výber hráča + PIN login
    Dashboard.jsx            ← dashboard hráča + admin prehľad
    AdminPanel.jsx           ← správa úloh, overenie, body
    Screens.jsx              ← rebríček, odmeny, chat, profil
```

## Postup

1. Skopíruj všetky súbory do `D:\Users\Karolína\Desktop\rodinne-quest\app\src\`
2. Vytvor zložku `src\components\` ak neexistuje
3. Skopíruj každý súbor na správne miesto
4. Spusti v termináli:
   ```
   git add .
   git commit -m "v2 - nova architektura"
   git push origin main
   ```

## Čo je nové v v2

### Admin úlohy
- Admin priraďuje úlohy → deti ich vidia (nie automaticky všetky)
- Pohľad "Zoznam" — školský/prázdniny/vždy filter + kategórie
- Pohľad "Podľa osôb" — vidíš čo má každý pridelené
- Dostupné úlohy sú sivé, aktívne sú farebné
- ➕ Prideliť — výber komu + ktoré dni + typ (povinná/dobrovoľná/bonusová)
- ✏️ Edit, 📋 Kopírovať, ⬆️⬇️ Presúvať, 🗑️ Zmazať

### Dashboard detí
- Vidí LEN úlohy ktoré admin pridelil na dnešný deň
- Ranné/denné/bonusové úlohy oddelené sekciami
- 📅 Týždeň — pohľad na celý týždeň
- Zaškrtne → 🕐 Čaká na overenie → Admin potvrdí → ✅ Body

### Overenie (admin)
- ⏳ Overenie tab — všetky úlohy čakajúce na potvrdenie
- ✅ Potvrdiť = body sa pripíšu
- ❌ Zamietnuť = úloha sa odškrtne

### Chat
- 👨‍👩‍👧 Rodinný chat (všetci)
- 🔒 Bart & Lisa súkromný chat (rodičia nevidia)
- @ mention — označ konkrétnu osobu
- 🤝 Obchodovanie — Bart môže požiadať Lisu o pomoc s úlohou

### Sezóny
- 🎒 Školský rok — všetky úlohy vrátane školy
- 🌞 Prázdniny — bez školských úloh
- Jeden klik prepne celý systém
