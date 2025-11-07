# 📦 Guida all'Installazione - Sistema di Personalizzazione CRM

## 🎯 Obiettivo

Rendere il tuo progetto OLIO completamente personalizzabile per nome, colori e branding.

---

## 📋 Prerequisiti

- ✅ Node.js v14 o superiore
- ✅ npm o yarn
- ✅ Progetto OLIO già clonato da GitHub

---

## 🚀 Installazione in 5 Minuti

### Step 1: Posizionati nella root del progetto

```bash
cd OLIO  # o il nome della tua cartella progetto
```

### Step 2: Crea la cartella config

```bash
mkdir config
cd config
```

### Step 3: Copia i file di configurazione

Copia nella cartella `config/` questi 4 file:

1. **config.json** - Configurazione principale
2. **setup.js** - Script di personalizzazione
3. **App.tsx.template** - Template App.tsx modificato
4. **README_PERSONALIZZAZIONE.md** - Documentazione

```bash
# La struttura dovrebbe essere:
OLIO/
├── config/
│   ├── config.json
│   ├── setup.js
│   ├── App.tsx.template
│   └── README_PERSONALIZZAZIONE.md
├── App.tsx
├── index.html
├── package.json
└── ... (altri file)
```

### Step 4: Esegui lo script di setup

```bash
# Dalla cartella config/
node setup.js
```

Lo script ti chiederà:
- Nome dell'applicazione
- Palette colori (preset o personalizzata)
- Etichette del menu

### Step 5: Sostituisci App.tsx

```bash
# Dalla root del progetto
cp config/App.tsx.template App.tsx
```

### Step 6: Installa dipendenze (se non l'hai già fatto)

```bash
npm install
```

### Step 7: Avvia l'app

```bash
npm run dev
```

Apri http://localhost:5173 e vedrai il tuo CRM personalizzato! 🎉

---

## 🔄 Workflow Completo

```
┌─────────────────────────────────────────────────┐
│ 1. Clona progetto da GitHub                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 2. mkdir config && cd config                    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 3. Copia i 4 file nella cartella config/       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 4. node setup.js (rispondi alle domande)       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 5. cp config/App.tsx.template App.tsx          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 6. npm install && npm run dev                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ 7. Apri http://localhost:5173                   │
│    CRM PERSONALIZZATO PRONTO! 🚀                │
└─────────────────────────────────────────────────┘
```

---

## 📝 Cosa Fa lo Script?

Lo script `setup.js` automaticamente:

1. ✅ Legge le tue preferenze da `config.json`
2. ✅ Aggiorna `index.html` (title, Tailwind colors)
3. ✅ Genera `config.ts` con la configurazione
4. ✅ Aggiorna `metadata.json` (nome app)
5. ✅ Aggiorna `package.json` (nome package)

---

## 🎨 Personalizzazione Rapida

### Cambiare Solo il Nome

```bash
# Modifica config/config.json
{
  "branding": {
    "appName": "MyCRM",
    "appNameLong": "My Business CRM",
    "appDescription": "Sistema Gestionale"
  }
}

# Applica
node config/setup.js
```

### Cambiare Solo i Colori

```bash
# Modifica config/config.json
{
  "colors": {
    "primary": {
      "base": "#1E40AF",
      "light": "#3B82F6"
    }
  }
}

# Applica
node config/setup.js
```

---

## 🎯 Esempio Pratico

**Scenario**: Vuoi trasformare OLIO in un CRM per una cantina vinicola chiamata "Cantina Rossi"

### 1. Modifica config.json

```json
{
  "branding": {
    "appName": "VinoCRM",
    "appNameLong": "Cantina Rossi",
    "appDescription": "Gestione Vinicola"
  },
  "colors": {
    "primary": {
      "base": "#7C2D12",
      "light": "#B91C1C"
    },
    "secondary": {
      "base": "#F59E0B",
      "light": "#FBBF24"
    }
  }
}
```

### 2. Esegui Setup

```bash
node config/setup.js
```

### 3. Copia Template

```bash
cp config/App.tsx.template App.tsx
```

### 4. Avvia

```bash
npm run dev
```

**Risultato**: Il tuo CRM ora si chiama "VinoCRM", ha i colori del vino rosso e puoi gestire la tua cantina! 🍷

---

## 🛠️ File Modificati

Dopo l'installazione, questi file saranno aggiornati:

| File | Cosa Cambia | Automatico? |
|------|-------------|-------------|
| `config.ts` | Configurazione runtime | ✅ Generato |
| `index.html` | Title, Tailwind colors | ✅ Aggiornato |
| `metadata.json` | Nome e descrizione | ✅ Aggiornato |
| `package.json` | Nome package | ✅ Aggiornato |
| `App.tsx` | Importa config.ts | ⚠️ Manuale (usa template) |

---

## ⚙️ Configurazione Avanzata

### Aggiungere Nuovi Colori

Modifica `config.json`:

```json
{
  "colors": {
    "primary": { ... },
    "secondary": { ... },
    "accent": {
      "base": "#10B981",
      "light": "#34D399"
    }
  }
}
```

Usa nel codice:

```typescript
import { APP_CONFIG } from './config';

const accentColor = APP_CONFIG.colors.accent.base;
```

### Personalizzare Menu Icons

```json
{
  "menu": {
    "items": [
      {
        "id": "dashboard",
        "label": "Pannello",
        "icon": "Home",  // Nome icona da lucide-react
        "roles": ["admin", "editor"]
      }
    ]
  }
}
```

---

## 🐛 Troubleshooting

### Errore: "Cannot find module 'fs'"

**Soluzione**: Stai usando Node.js? (non browser)

```bash
node --version  # Verifica versione
```

### Errore: "config.ts not found"

**Soluzione**: Esegui prima lo script di setup

```bash
cd config
node setup.js
```

### I colori non cambiano

**Soluzione**: 
1. Verifica che `App.tsx` importi `config.ts`
2. Riavvia il dev server

```bash
# Ctrl+C per fermare
npm run dev
```

### Script non esegue

**Soluzione**: Dai permessi di esecuzione

```bash
chmod +x config/setup.js
node config/setup.js
```

---

## 📚 Struttura File Finale

```
OLIO/
├── config/
│   ├── config.json              # Configurazione
│   ├── setup.js                 # Script setup
│   ├── App.tsx.template         # Template
│   └── README_PERSONALIZZAZIONE.md
│
├── config.ts                    # ← GENERATO
├── App.tsx                      # ← SOSTITUITO
├── index.html                   # ← AGGIORNATO
├── metadata.json                # ← AGGIORNATO
├── package.json                 # ← AGGIORNATO
│
├── components/
├── contexts/
├── services/
└── ... (altri file originali)
```

---

## 🎓 Tutorial Video-Style

### Scenario: Convertire OLIO in "TechDesk"

```bash
# 1. Setup iniziale
cd OLIO
mkdir config
cd config

# 2. [Copia i file di configurazione]

# 3. Modifica config.json
{
  "branding": {
    "appName": "TechDesk",
    "appNameLong": "TechDesk Manager",
    "appDescription": "IT Support CRM"
  },
  "colors": {
    "primary": { "base": "#1E40AF" }
  }
}

# 4. Applica
node setup.js
# Seleziona: "2. Blu Professionale"
# Conferma le modifiche

# 5. Aggiorna App.tsx
cd ..
cp config/App.tsx.template App.tsx

# 6. Avvia
npm run dev

# 7. Visita http://localhost:5173
# Voilà! TechDesk è pronto! 💻
```

---

## ✅ Checklist Pre-Deploy

Prima di mettere online il tuo CRM personalizzato:

- [ ] Eseguito `node setup.js` con successo
- [ ] Sostituito `App.tsx` con template
- [ ] Verificato che i colori siano corretti
- [ ] Testato tutte le pagine del menu
- [ ] Aggiornato README.md con il nuovo nome
- [ ] Configurato Firebase (se necessario)
- [ ] Testato su mobile/tablet
- [ ] Verificato accessibilità colori

---

## 🚀 Deploy

Dopo la personalizzazione:

```bash
# Build per produzione
npm run build

# Deploy su GitHub Pages (o altro hosting)
# Segui le istruzioni del tuo hosting
```

---

## 💡 Tips Finali

1. **Backup**: Fai sempre backup prima di modificare file
2. **Git**: Committa le modifiche dopo ogni personalizzazione
3. **Testing**: Testa su diversi browser
4. **Documentazione**: Annota le tue personalizzazioni

---

## 🎉 Congratulazioni!

Hai trasformato OLIO in un CRM completamente personalizzato! 

Ora puoi:
- ✅ Riutilizzarlo per clienti diversi
- ✅ Cambiare branding in minuti
- ✅ Adattarlo a qualsiasi settore
- ✅ Mantenere un codebase pulito

**Buon lavoro! 🚀**

---

## 📞 Supporto

Per domande o problemi:
1. Leggi `README_PERSONALIZZAZIONE.md`
2. Verifica `config.ts` generato
3. Controlla console per errori

**Happy Coding! 💻**
