#!/bin/bash

###############################################################################
# Quick Setup Script per Personalizzazione OLIO CRM
# 
# Questo script automatizza l'installazione del sistema di personalizzazione
# nel tuo progetto OLIO esistente.
#
# Uso:
#   chmod +x quick-setup.sh
#   ./quick-setup.sh
###############################################################################

set -e  # Exit on error

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║     🚀 OLIO CRM - INSTALLAZIONE PERSONALIZZAZIONE     ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Verifica di essere nella root del progetto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Errore: package.json non trovato${NC}"
    echo "   Assicurati di essere nella cartella root del progetto OLIO"
    exit 1
fi

echo -e "${GREEN}✓${NC} Trovato package.json - sei nella root del progetto\n"

# Verifica Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js non è installato${NC}"
    echo "   Installa Node.js da: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js installato: ${NODE_VERSION}\n"

# Crea cartella config se non esiste
if [ ! -d "config" ]; then
    echo -e "${YELLOW}📁 Creazione cartella config...${NC}"
    mkdir config
    echo -e "${GREEN}✓${NC} Cartella config creata\n"
else
    echo -e "${GREEN}✓${NC} Cartella config già esistente\n"
fi

# Verifica se i file di configurazione esistono
MISSING_FILES=()

if [ ! -f "config/config.json" ]; then
    MISSING_FILES+=("config.json")
fi

if [ ! -f "config/setup.js" ]; then
    MISSING_FILES+=("setup.js")
fi

if [ ! -f "config/App.tsx.template" ]; then
    MISSING_FILES+=("App.tsx.template")
fi

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  File mancanti nella cartella config/:${NC}"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Per favore, copia questi file nella cartella config/"
    echo "Puoi trovarli nella documentazione fornita."
    exit 1
fi

echo -e "${GREEN}✓${NC} Tutti i file di configurazione sono presenti\n"

# Backup di App.tsx originale
if [ -f "App.tsx" ] && [ ! -f "App.tsx.backup" ]; then
    echo -e "${YELLOW}💾 Creazione backup di App.tsx...${NC}"
    cp App.tsx App.tsx.backup
    echo -e "${GREEN}✓${NC} Backup salvato come App.tsx.backup\n"
fi

# Chiedi all'utente se vuole eseguire il setup
echo -e "${BLUE}📝 Vuoi eseguire lo script di personalizzazione ora?${NC}"
echo "   (Potrai personalizzare nome, colori e menu dell'app)"
echo ""
read -p "Eseguire setup? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${BLUE}🎨 Avvio script di personalizzazione...${NC}"
    echo ""
    cd config
    node setup.js
    cd ..
    
    echo ""
    echo -e "${GREEN}✓${NC} Setup completato!\n"
    
    # Chiedi se applicare il template App.tsx
    echo -e "${BLUE}📝 Vuoi applicare il template App.tsx modificato?${NC}"
    echo "   (Questo sovrascriverà App.tsx con la versione personalizzabile)"
    echo "   (Un backup è già stato creato come App.tsx.backup)"
    echo ""
    read -p "Applicare template? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        cp config/App.tsx.template App.tsx
        echo -e "${GREEN}✓${NC} Template App.tsx applicato\n"
    else
        echo -e "${YELLOW}⚠️  Template non applicato${NC}"
        echo "   Puoi applicarlo manualmente con: cp config/App.tsx.template App.tsx\n"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  Setup non eseguito${NC}"
    echo "   Puoi eseguirlo manualmente con: cd config && node setup.js\n"
fi

# Verifica dipendenze
echo -e "${BLUE}📦 Verifica dipendenze npm...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules non trovato${NC}"
    echo ""
    read -p "Installare dipendenze ora? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm install
        echo -e "${GREEN}✓${NC} Dipendenze installate\n"
    else
        echo -e "${YELLOW}⚠️  Ricorda di eseguire 'npm install' prima di avviare l'app${NC}\n"
    fi
else
    echo -e "${GREEN}✓${NC} Dipendenze già installate\n"
fi

# Summary finale
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║         ✅ INSTALLAZIONE COMPLETATA CON SUCCESSO      ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BLUE}📝 File installati:${NC}"
echo "   ✓ config/config.json"
echo "   ✓ config/setup.js"
echo "   ✓ config/App.tsx.template"
echo "   ✓ config.ts (generato)"
echo ""

echo -e "${BLUE}🚀 Prossimi passi:${NC}"
echo ""
echo "   1. Se non l'hai fatto, esegui la personalizzazione:"
echo "      ${GREEN}cd config && node setup.js${NC}"
echo ""
echo "   2. Applica il template (se non già fatto):"
echo "      ${GREEN}cp config/App.tsx.template App.tsx${NC}"
echo ""
echo "   3. Avvia l'app in modalità sviluppo:"
echo "      ${GREEN}npm run dev${NC}"
echo ""
echo "   4. Apri il browser su:"
echo "      ${GREEN}http://localhost:5173${NC}"
echo ""

echo -e "${BLUE}📚 Documentazione:${NC}"
echo "   - README_PERSONALIZZAZIONE.md - Guida completa"
echo "   - INSTALLATION.md - Guida installazione"
echo "   - config/config.json - File di configurazione"
echo ""

echo -e "${BLUE}💡 Tips:${NC}"
echo "   - Backup originale salvato in: App.tsx.backup"
echo "   - Per modificare la configurazione: modifica config/config.json"
echo "   - Per applicare le modifiche: cd config && node setup.js"
echo ""

echo -e "${GREEN}Happy Customization! 🎨${NC}\n"
