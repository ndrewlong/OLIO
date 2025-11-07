# 🎨 Sistema di Personalizzazione OLIO CRM

Sistema completo per rendere il tuo progetto OLIO completamente personalizzabile: nome, colori, menu e branding.

## 📦 Contenuto del Pacchetto

```
olio-config/
├── config.json                      # Configurazione principale
├── setup.js                         # Script di personalizzazione interattivo
├── App.tsx.template                 # Template App.tsx modificato
├── quick-setup.sh                   # Script automatico di installazione
├── README_PERSONALIZZAZIONE.md      # Guida completa
├── INSTALLATION.md                  # Guida installazione
├── ESEMPI_CONFIGURAZIONI.md         # 10 configurazioni pronte
└── README.md                        # Questo file
```

## 🚀 Quick Start (3 Minuti)

### Passo 1: Posizionati nel Progetto

```bash
cd TUO_PROGETTO_OLIO
```

### Passo 2: Estrai i File

Estrai la cartella `olio-config` nella root del progetto:

```
TUO_PROGETTO_OLIO/
├── config/              ← Rinomina "olio-config" in "config"
├── App.tsx
├── index.html
├── package.json
└── ...
```

### Passo 3: Esegui Setup Automatico

```bash
chmod +x config/quick-setup.sh
./config/quick-setup.sh
```

Oppure manualmente:

```bash
cd config
node setup.js
cd ..
cp config/App.tsx.template App.tsx
npm run dev
```

## 📚 Documentazione

### 1. [INSTALLATION.md](INSTALLATION.md)
Guida completa all'installazione passo-passo con troubleshooting.

### 2. [README_PERSONALIZZAZIONE.md](README_PERSONALIZZAZIONE.md)
Guida dettagliata su come personalizzare ogni aspetto del CRM.

### 3. [ESEMPI_CONFIGURAZIONI.md](ESEMPI_CONFIGURAZIONI.md)
10 configurazioni pronte per diversi settori:
- 🍷 Cantina Vinicola
- 💻 Negozio Tecnologia
- 📊 Studio Consulenza
- 🏠 Agenzia Immobiliare
- 💊 Farmacia
- 🍝 Ristorante/Catering
- 👗 E-commerce Fashion
- 💪 Palestra/Fitness
- ✈️ Agenzia Viaggi
- ⚖️ Studio Legale

## 🎯 Cosa Puoi Personalizzare

### ✅ Branding
- Nome applicazione (breve e completo)
- Descrizione e sottotitolo
- Title della pagina HTML

### ✅ Colori
- 6 palette predefinite professionali
- Personalizzazione manuale completa
- Colori primari, secondari e background

### ✅ Menu
- Etichette personalizzabili
- Ordine voci di menu
- Ruoli e permessi

### ✅ Localizzazione
- Lingua interfaccia
- Formato valuta
- Formato date

## 🎨 Palette Colori Disponibili

1. **Verde Oliva** - Naturale (default)
2. **Blu Professionale** - Corporate
3. **Rosso Vino** - Elegante
4. **Grigio Moderno** - Minimale
5. **Viola Tech** - Innovativo
6. **Arancio Energia** - Dinamico

## 💡 Esempi d'Uso

### Scenario 1: CRM per Cantina Vinicola

```bash
# Copia configurazione esempio cantina
cat ESEMPI_CONFIGURAZIONI.md  # Trova esempio "Cantina Vinicola"
# Copia JSON in config.json
node setup.js
```

### Scenario 2: Cambio Rapido Colori

```bash
# Modifica config.json
vim config/config.json  # o usa editor preferito
# Cambia solo sezione "colors"
node config/setup.js
```

### Scenario 3: Personalizzazione Totale

```bash
node config/setup.js
# Rispondi interattivamente a tutte le domande
```

## 🔄 Workflow Tipico

```
1. Modifica config/config.json
   ↓
2. Esegui: node config/setup.js
   ↓
3. Copia template: cp config/App.tsx.template App.tsx
   ↓
4. Avvia app: npm run dev
   ↓
5. Visualizza: http://localhost:5173
```

## 📁 File Generati Automaticamente

Quando esegui `setup.js`, vengono aggiornati:

- ✅ `config.ts` - Configurazione runtime (GENERATO)
- ✅ `index.html` - Title e Tailwind config (AGGIORNATO)
- ✅ `metadata.json` - Nome e descrizione app (AGGIORNATO)
- ✅ `package.json` - Nome package (AGGIORNATO)

## 🛠️ Requisiti

- **Node.js**: v14 o superiore
- **npm** o **yarn**
- **Progetto OLIO**: già clonato da GitHub

## ⚡ Comandi Rapidi

```bash
# Installazione completa automatica
./config/quick-setup.sh

# Setup manuale
cd config && node setup.js

# Applicare template App.tsx
cp config/App.tsx.template App.tsx

# Avviare app
npm run dev

# Modificare configurazione
vim config/config.json
node config/setup.js
```

## 🐛 Troubleshooting

### Errore: "Cannot find module"
```bash
npm install
```

### I colori non cambiano
```bash
# Verifica che App.tsx importi config.ts
grep "import.*config" App.tsx

# Riavvia dev server
npm run dev
```

### Script setup non funziona
```bash
# Verifica Node.js
node --version  # Richiede v14+

# Verifica permessi
chmod +x config/setup.js
```

## 📞 Supporto

1. Leggi la documentazione in `README_PERSONALIZZAZIONE.md`
2. Controlla esempi in `ESEMPI_CONFIGURAZIONI.md`
3. Segui guida installazione in `INSTALLATION.md`

## 🎉 Features

- ✅ **Setup in 3 minuti**: Script automatizzato
- ✅ **10 configurazioni pronte**: Per diversi settori
- ✅ **6 palette colori**: Design professionale
- ✅ **Totalmente personalizzabile**: Nome, colori, menu
- ✅ **Zero dipendenze**: Funziona con setup esistente
- ✅ **Hot reload**: Modifiche istantanee in dev mode
- ✅ **Documentazione completa**: Guide passo-passo

## 🌟 Best Practices

1. **Backup originale**: Prima di modificare App.tsx
2. **Test colori**: Verifica contrasto e accessibilità
3. **Commit frequenti**: Dopo ogni personalizzazione
4. **Usa preset**: Parti da esempi esistenti

## 📈 Roadmap Futura

- [ ] Supporto multi-lingua automatico
- [ ] Generatore palette colori AI
- [ ] Preview live configurazione
- [ ] Export/import configurazioni
- [ ] Theme switcher runtime

## 📄 Licenza

Questo sistema di configurazione è open source e libero da usare.

## 🤝 Contributi

Miglioramenti e nuovi esempi di configurazione sono benvenuti!

---

**Made with ❤️ for OLIO CRM**

**Happy Customization! 🚀**
