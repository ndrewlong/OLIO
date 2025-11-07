# 🎨 Esempi di Configurazioni Pronte all'Uso

Questa guida contiene configurazioni complete e pronte per diversi tipi di business. Copia e incolla direttamente in `config/config.json`!

---

## 📋 Indice

1. [Cantina Vinicola](#1-cantina-vinicola)
2. [Negozio Tecnologia](#2-negozio-tecnologia)
3. [Studio Consulenza](#3-studio-consulenza)
4. [Agenzia Immobiliare](#4-agenzia-immobiliare)
5. [Farmacia](#5-farmacia)
6. [Ristorante / Catering](#6-ristorante--catering)
7. [E-commerce Fashion](#7-e-commerce-fashion)
8. [Palestra / Fitness](#8-palestra--fitness)
9. [Agenzia Viaggi](#9-agenzia-viaggi)
10. [Studio Legale](#10-studio-legale)

---

## 1. 🍷 Cantina Vinicola

**Ideale per**: Produttori vino, enoteche, distributori vini

```json
{
  "branding": {
    "appName": "VinoCRM",
    "appNameLong": "Cantina Rossi - Gestione Vinicola",
    "appDescription": "Sistema Gestionale Vini",
    "businessDescription": "Gestione completa della produzione e vendita vinicola: clienti, fornitori, etichette e ordini",
    "favicon": "🍷",
    "htmlTitle": "VinoCRM - Gestione Cantina"
  },
  "colors": {
    "primary": {
      "name": "wine-red",
      "base": "#7C2D12",
      "light": "#B91C1C",
      "lighter": "#DC2626",
      "lightest": "#FEE2E2"
    },
    "secondary": {
      "name": "gold",
      "base": "#F59E0B",
      "light": "#FBBF24",
      "lighter": "#FCD34D"
    },
    "background": {
      "name": "wine-background",
      "base": "#FFF7ED"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Panoramica", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Enoteche & Clienti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Produttori Uva", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Etichette Vini", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Ordini & Vendite", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Team", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 2. 💻 Negozio Tecnologia

**Ideale per**: Rivenditori hardware, assistenza IT, negozi elettronica

```json
{
  "branding": {
    "appName": "TechDesk",
    "appNameLong": "TechDesk Business Manager",
    "appDescription": "IT Support & Sales",
    "businessDescription": "Gestione vendite tecnologia, assistenza clienti e inventario hardware/software",
    "favicon": "💻",
    "htmlTitle": "TechDesk CRM"
  },
  "colors": {
    "primary": {
      "name": "tech-blue",
      "base": "#1E40AF",
      "light": "#3B82F6",
      "lighter": "#60A5FA",
      "lightest": "#DBEAFE"
    },
    "secondary": {
      "name": "cyan",
      "base": "#06B6D4",
      "light": "#22D3EE",
      "lighter": "#67E8F9"
    },
    "background": {
      "name": "tech-background",
      "base": "#F8FAFC"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Dashboard", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Clienti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Fornitori Tech", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Inventario", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Vendite & Ticket", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Staff", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Impostazioni", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 3. 📊 Studio Consulenza

**Ideale per**: Consulenti, agenzie marketing, studi professionali

```json
{
  "branding": {
    "appName": "ConsultPro",
    "appNameLong": "ConsultPro CRM Suite",
    "appDescription": "Gestione Clienti & Progetti",
    "businessDescription": "CRM professionale per gestire clienti, progetti di consulenza e contratti di servizio",
    "favicon": "📊",
    "htmlTitle": "ConsultPro - Professional CRM"
  },
  "colors": {
    "primary": {
      "name": "professional-gray",
      "base": "#1F2937",
      "light": "#4B5563",
      "lighter": "#6B7280",
      "lightest": "#F3F4F6"
    },
    "secondary": {
      "name": "accent-cyan",
      "base": "#06B6D4",
      "light": "#22D3EE",
      "lighter": "#67E8F9"
    },
    "background": {
      "name": "neutral-bg",
      "base": "#F9FAFB"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Overview", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Aziende Clienti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Partner", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Servizi", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Contratti", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Consulenti", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 4. 🏠 Agenzia Immobiliare

**Ideale per**: Agenzie immobiliari, costruttori, property management

```json
{
  "branding": {
    "appName": "RealEstate+",
    "appNameLong": "RealEstate Plus - Gestione Immobili",
    "appDescription": "Property Management System",
    "businessDescription": "Gestione completa di immobili, clienti, proprietari e transazioni immobiliari",
    "favicon": "🏠",
    "htmlTitle": "RealEstate+ CRM"
  },
  "colors": {
    "primary": {
      "name": "real-estate-green",
      "base": "#059669",
      "light": "#10B981",
      "lighter": "#34D399",
      "lightest": "#D1FAE5"
    },
    "secondary": {
      "name": "property-gold",
      "base": "#D97706",
      "light": "#F59E0B",
      "lighter": "#FBBF24"
    },
    "background": {
      "name": "property-bg",
      "base": "#F0FDF4"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Dashboard", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Acquirenti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Proprietari", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Immobili", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Contratti & Vendite", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Agenti", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Impostazioni", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 5. 💊 Farmacia

**Ideale per**: Farmacie, parafarmacie, distributori farmaceutici

```json
{
  "branding": {
    "appName": "PharmaCRM",
    "appNameLong": "Farmacia San Marco - Gestionale",
    "appDescription": "Sistema Gestione Farmacia",
    "businessDescription": "Gestione completa farmacia: clienti, fornitori farmaceutici, prodotti e prescrizioni",
    "favicon": "💊",
    "htmlTitle": "PharmaCRM"
  },
  "colors": {
    "primary": {
      "name": "pharma-blue",
      "base": "#0284C7",
      "light": "#0EA5E9",
      "lighter": "#38BDF8",
      "lightest": "#E0F2FE"
    },
    "secondary": {
      "name": "health-green",
      "base": "#16A34A",
      "light": "#22C55E",
      "lighter": "#4ADE80"
    },
    "background": {
      "name": "clean-white",
      "base": "#FAFAFA"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Riepilogo", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Pazienti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Fornitori Farmaci", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Farmaci & Prodotti", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Vendite & Prescrizioni", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Staff Farmacia", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 6. 🍝 Ristorante / Catering

**Ideale per**: Ristoranti, servizi catering, food delivery

```json
{
  "branding": {
    "appName": "TasteManager",
    "appNameLong": "Ristorante Da Mario - Gestionale",
    "appDescription": "Food & Catering Management",
    "businessDescription": "Sistema completo per gestione ristorante: clienti, fornitori alimentari, menu e prenotazioni",
    "favicon": "🍝",
    "htmlTitle": "TasteManager CRM"
  },
  "colors": {
    "primary": {
      "name": "food-red",
      "base": "#DC2626",
      "light": "#EF4444",
      "lighter": "#F87171",
      "lightest": "#FEE2E2"
    },
    "secondary": {
      "name": "food-orange",
      "base": "#EA580C",
      "light": "#F97316",
      "lighter": "#FB923C"
    },
    "background": {
      "name": "warm-bg",
      "base": "#FFFBEB"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Panoramica", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Clienti & Eventi", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Fornitori Food", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Menu & Piatti", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Ordini & Prenotazioni", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Staff Cucina", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 7. 👗 E-commerce Fashion

**Ideale per**: Negozi abbigliamento, boutique, fashion online

```json
{
  "branding": {
    "appName": "StyleHub",
    "appNameLong": "StyleHub Fashion Manager",
    "appDescription": "Fashion Retail System",
    "businessDescription": "Gestione negozio moda: clienti, fornitori tessili, collezioni e vendite",
    "favicon": "👗",
    "htmlTitle": "StyleHub CRM"
  },
  "colors": {
    "primary": {
      "name": "fashion-pink",
      "base": "#DB2777",
      "light": "#EC4899",
      "lighter": "#F472B6",
      "lightest": "#FCE7F3"
    },
    "secondary": {
      "name": "fashion-purple",
      "base": "#7C3AED",
      "light": "#8B5CF6",
      "lighter": "#A78BFA"
    },
    "background": {
      "name": "fashion-bg",
      "base": "#FAF5FF"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Dashboard", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Clienti VIP", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Brand & Fornitori", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Collezioni", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Vendite & Ordini", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Staff Negozio", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 8. 💪 Palestra / Fitness

**Ideale per**: Palestre, centri fitness, personal trainer

```json
{
  "branding": {
    "appName": "FitnessPro",
    "appNameLong": "FitnessPro - Gestione Palestra",
    "appDescription": "Gym Management System",
    "businessDescription": "Gestione completa palestra: iscritti, abbonamenti, corsi e personal training",
    "favicon": "💪",
    "htmlTitle": "FitnessPro CRM"
  },
  "colors": {
    "primary": {
      "name": "fitness-orange",
      "base": "#EA580C",
      "light": "#F97316",
      "lighter": "#FB923C",
      "lightest": "#FFEDD5"
    },
    "secondary": {
      "name": "energy-green",
      "base": "#15803D",
      "light": "#16A34A",
      "lighter": "#22C55E"
    },
    "background": {
      "name": "gym-bg",
      "base": "#FFF7ED"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Dashboard", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Iscritti", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Fornitori Attrezzature", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Abbonamenti & Corsi", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Pagamenti", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Staff & Trainer", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 9. ✈️ Agenzia Viaggi

**Ideale per**: Agenzie viaggio, tour operator, travel booking

```json
{
  "branding": {
    "appName": "TravelDesk",
    "appNameLong": "TravelDesk - Gestione Viaggi",
    "appDescription": "Travel Agency Management",
    "businessDescription": "Sistema completo agenzia viaggi: clienti, fornitori turistici, pacchetti e prenotazioni",
    "favicon": "✈️",
    "htmlTitle": "TravelDesk CRM"
  },
  "colors": {
    "primary": {
      "name": "travel-sky",
      "base": "#0369A1",
      "light": "#0284C7",
      "lighter": "#0EA5E9",
      "lightest": "#E0F2FE"
    },
    "secondary": {
      "name": "travel-sun",
      "base": "#F59E0B",
      "light": "#FBBF24",
      "lighter": "#FCD34D"
    },
    "background": {
      "name": "travel-bg",
      "base": "#F0F9FF"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Pannello", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Viaggiatori", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Partner Turistici", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Pacchetti Viaggio", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Prenotazioni", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Agenti", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 10. ⚖️ Studio Legale

**Ideale per**: Studi legali, avvocati, consulenza legale

```json
{
  "branding": {
    "appName": "LegalPro",
    "appNameLong": "LegalPro - Studio Legale Manager",
    "appDescription": "Legal Practice Management",
    "businessDescription": "Gestione studio legale: clienti, casi, documenti e fatturazione professionale",
    "favicon": "⚖️",
    "htmlTitle": "LegalPro CRM"
  },
  "colors": {
    "primary": {
      "name": "legal-navy",
      "base": "#1E3A8A",
      "light": "#1E40AF",
      "lighter": "#3B82F6",
      "lightest": "#DBEAFE"
    },
    "secondary": {
      "name": "legal-gold",
      "base": "#B45309",
      "light": "#D97706",
      "lighter": "#F59E0B"
    },
    "background": {
      "name": "legal-bg",
      "base": "#F8FAFC"
    }
  },
  "menu": {
    "items": [
      { "id": "dashboard", "label": "Overview", "icon": "Home", "roles": ["admin", "editor", "viewer"] },
      { "id": "customers", "label": "Clienti & Casi", "icon": "UsersIcon", "roles": ["admin", "editor", "viewer"] },
      { "id": "suppliers", "label": "Partner Legali", "icon": "Truck", "roles": ["admin", "editor", "viewer"] },
      { "id": "products", "label": "Servizi Legali", "icon": "Package", "roles": ["admin", "editor", "viewer"] },
      { "id": "transactions", "label": "Parcelle & Pagamenti", "icon": "DollarSign", "roles": ["admin", "editor", "viewer"] },
      { "id": "users", "label": "Avvocati & Staff", "icon": "UserCog", "roles": ["admin"] },
      { "id": "settings", "label": "Configurazione", "icon": "SettingsIcon", "roles": ["admin"] }
    ]
  },
  "localization": {
    "language": "it",
    "currency": "EUR",
    "currencySymbol": "€",
    "dateFormat": "DD/MM/YYYY"
  }
}
```

---

## 🎯 Come Usare Questi Esempi

### Metodo 1: Copia & Incolla Completo

1. Apri `config/config.json`
2. Copia l'intero esempio che ti interessa
3. Incolla sostituendo tutto il contenuto
4. Esegui: `node config/setup.js`
5. Avvia: `npm run dev`

### Metodo 2: Mix & Match

Prendi pezzi da diversi esempi:
- Colori da un esempio
- Menu da un altro
- Nome personalizzato

### Metodo 3: Personalizza Ulteriormente

Usa un esempio come base e modifica:
- Etichette menu specifiche
- Tonalità colori
- Descrizioni business

---

## 💡 Tips per Personalizzazione

### Scegliere i Colori Giusti

| Settore | Colori Consigliati | Psicologia |
|---------|-------------------|------------|
| Finance | Blu, Grigio | Professionale, Affidabile |
| Food | Rosso, Arancio, Verde | Appetitoso, Fresco |
| Health | Blu, Verde, Bianco | Calmo, Pulito, Safe |
| Luxury | Nero, Oro, Bordeaux | Elegante, Premium |
| Tech | Blu, Viola, Cyan | Innovativo, Moderno |
| Sport | Arancio, Rosso, Verde | Energia, Dinamismo |

### Testare i Colori

```bash
# Applica una configurazione di test
node config/setup.js

# Se non ti piace, prova un'altra palette
# Modifica config.json e riesegui setup
```

---

## 🚀 Quick Start

```bash
# 1. Scegli un esempio sopra
# 2. Copia in config/config.json
# 3. Applica
cd config
node setup.js

# 4. Sostituisci App.tsx
cd ..
cp config/App.tsx.template App.tsx

# 5. Avvia
npm run dev
```

---

## 📝 Note Finali

- Tutti gli esempi sono pronti all'uso
- Puoi mescolare elementi da diversi esempi
- Modifica sempre `config/config.json` e poi esegui `setup.js`
- I colori seguono best practices di design

**Buona personalizzazione! 🎨**
