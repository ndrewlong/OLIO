#!/usr/bin/env node

/**
 * Script di Setup Interattivo per Personalizzare il CRM
 * 
 * Questo script ti permette di personalizzare:
 * - Nome dell'applicazione
 * - Palette colori (primario, secondario, background)
 * - Etichette del menu
 * - Descrizioni e metadati
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funzione helper per fare domande
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Colori predefiniti popolari per CRM
const colorPresets = {
  'verde-oliva': {
    name: 'Verde Oliva (Naturale)',
    primary: { base: '#4A6D4D', light: '#6F8F71' },
    secondary: { base: '#D4AF37', light: '#EACD6F' },
    background: { base: '#F9F9F7' }
  },
  'blu-professionale': {
    name: 'Blu Professionale',
    primary: { base: '#1E40AF', light: '#3B82F6' },
    secondary: { base: '#F59E0B', light: '#FBBF24' },
    background: { base: '#F8FAFC' }
  },
  'rosso-vino': {
    name: 'Rosso Vino (Elegante)',
    primary: { base: '#7C2D12', light: '#B91C1C' },
    secondary: { base: '#F59E0B', light: '#FBBF24' },
    background: { base: '#FFF7ED' }
  },
  'grigio-moderno': {
    name: 'Grigio Moderno (Minimale)',
    primary: { base: '#1F2937', light: '#4B5563' },
    secondary: { base: '#06B6D4', light: '#22D3EE' },
    background: { base: '#F9FAFB' }
  },
  'viola-tech': {
    name: 'Viola Tech',
    primary: { base: '#6366F1', light: '#818CF8' },
    secondary: { base: '#EC4899', light: '#F472B6' },
    background: { base: '#FAF5FF' }
  },
  'arancio-energia': {
    name: 'Arancio Energia',
    primary: { base: '#EA580C', light: '#F97316' },
    secondary: { base: '#14B8A6', light: '#2DD4BF' },
    background: { base: '#FFF7ED' }
  }
};

async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   🎨 CONFIGURATORE CRM PERSONALIZZATO   ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
  
  // 1. Nome Applicazione
  console.log('\n📝 STEP 1: Nome dell\'Applicazione\n');
  const appName = await question(`Nome breve dell'app (attuale: ${config.branding.appName}): `);
  if (appName.trim()) config.branding.appName = appName.trim();
  
  const appNameLong = await question(`Nome completo (attuale: ${config.branding.appNameLong}): `);
  if (appNameLong.trim()) config.branding.appNameLong = appNameLong.trim();
  
  const appDescription = await question(`Sottotitolo/descrizione (attuale: ${config.branding.appDescription}): `);
  if (appDescription.trim()) config.branding.appDescription = appDescription.trim();
  
  // 2. Palette Colori
  console.log('\n🎨 STEP 2: Palette Colori\n');
  console.log('Scegli un preset o personalizza i colori:\n');
  
  Object.keys(colorPresets).forEach((key, index) => {
    console.log(`${index + 1}. ${colorPresets[key].name}`);
  });
  console.log(`${Object.keys(colorPresets).length + 1}. Personalizza manualmente\n`);
  
  const colorChoice = await question('Scegli un\'opzione (1-' + (Object.keys(colorPresets).length + 1) + '): ');
  const choiceIndex = parseInt(colorChoice) - 1;
  
  if (choiceIndex >= 0 && choiceIndex < Object.keys(colorPresets).length) {
    const presetKey = Object.keys(colorPresets)[choiceIndex];
    const preset = colorPresets[presetKey];
    
    config.colors.primary.base = preset.primary.base;
    config.colors.primary.light = preset.primary.light;
    config.colors.secondary.base = preset.secondary.base;
    config.colors.secondary.light = preset.secondary.light;
    config.colors.background.base = preset.background.base;
    
    console.log(`\n✅ Palette "${preset.name}" applicata!`);
  } else if (choiceIndex === Object.keys(colorPresets).length) {
    console.log('\n📌 Inserisci i colori in formato esadecimale (es: #4A6D4D):\n');
    
    const primaryBase = await question(`Colore primario base (attuale: ${config.colors.primary.base}): `);
    if (primaryBase.trim() && primaryBase.match(/^#[0-9A-Fa-f]{6}$/)) {
      config.colors.primary.base = primaryBase.trim();
    }
    
    const primaryLight = await question(`Colore primario chiaro (attuale: ${config.colors.primary.light}): `);
    if (primaryLight.trim() && primaryLight.match(/^#[0-9A-Fa-f]{6}$/)) {
      config.colors.primary.light = primaryLight.trim();
    }
    
    const secondaryBase = await question(`Colore secondario base (attuale: ${config.colors.secondary.base}): `);
    if (secondaryBase.trim() && secondaryBase.match(/^#[0-9A-Fa-f]{6}$/)) {
      config.colors.secondary.base = secondaryBase.trim();
    }
    
    const backgroundBase = await question(`Colore sfondo (attuale: ${config.colors.background.base}): `);
    if (backgroundBase.trim() && backgroundBase.match(/^#[0-9A-Fa-f]{6}$/)) {
      config.colors.background.base = backgroundBase.trim();
    }
  }
  
  // 3. Personalizzazione Menu
  console.log('\n📋 STEP 3: Etichette Menu\n');
  const customizeMenu = await question('Vuoi personalizzare le etichette del menu? (s/n): ');
  
  if (customizeMenu.toLowerCase() === 's') {
    for (let item of config.menu.items) {
      const newLabel = await question(`Etichetta per "${item.label}" (premi Invio per mantenere): `);
      if (newLabel.trim()) item.label = newLabel.trim();
    }
  }
  
  // 4. Salva configurazione
  console.log('\n💾 Salvataggio configurazione...\n');
  fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  
  // 5. Applica modifiche ai file del progetto
  console.log('🔧 Applicazione modifiche ai file del progetto...\n');
  
  try {
    applyConfigToProject(config);
    console.log('✅ Configurazione applicata con successo!\n');
    console.log('🚀 Prossimi passi:');
    console.log('   1. Esegui: npm install');
    console.log('   2. Esegui: npm run dev');
    console.log('   3. Apri: http://localhost:5173\n');
  } catch (error) {
    console.error('❌ Errore durante l\'applicazione:', error.message);
  }
  
  rl.close();
}

function applyConfigToProject(config) {
  const projectRoot = path.resolve(__dirname, '..');
  
  // 1. Aggiorna index.html
  const indexHtmlPath = path.join(projectRoot, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Aggiorna title
    indexHtml = indexHtml.replace(
      /<title>.*?<\/title>/,
      `<title>${config.branding.appNameLong}</title>`
    );
    
    // Aggiorna Tailwind config con i nuovi colori
    const tailwindConfig = `
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'brand-primary': '${config.colors.primary.base}',
              'brand-primary-light': '${config.colors.primary.light}',
              'brand-secondary': '${config.colors.secondary.base}',
              'brand-secondary-light': '${config.colors.secondary.light}',
              'brand-background': '${config.colors.background.base}',
            },
          }
        }
      }
    `;
    
    indexHtml = indexHtml.replace(
      /tailwind\.config\s*=\s*\{[\s\S]*?\}/,
      tailwindConfig.trim()
    );
    
    fs.writeFileSync(indexHtmlPath, indexHtml);
    console.log('  ✓ index.html aggiornato');
  }
  
  // 2. Crea file config.ts per il progetto
  const configTsContent = `
/**
 * Configurazione dell'applicazione
 * Generato automaticamente da setup.js
 * NON MODIFICARE MANUALMENTE - Usa lo script di setup
 */

export const APP_CONFIG = ${JSON.stringify(config, null, 2)};

export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = APP_CONFIG.colors;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return '#000000';
  }
  
  return value;
};

export const getBranding = () => APP_CONFIG.branding;
export const getMenuItems = () => APP_CONFIG.menu.items;
`;
  
  const configTsPath = path.join(projectRoot, 'config.ts');
  fs.writeFileSync(configTsPath, configTsContent);
  console.log('  ✓ config.ts creato');
  
  // 3. Aggiorna metadata.json
  const metadataPath = path.join(projectRoot, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = {
      name: config.branding.appNameLong,
      description: config.branding.businessDescription,
      requestFramePermissions: []
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log('  ✓ metadata.json aggiornato');
  }
  
  // 4. Aggiorna package.json
  const packagePath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    packageJson.name = config.branding.appName.toLowerCase().replace(/\s+/g, '-');
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('  ✓ package.json aggiornato');
  }
}

// Gestione errori
process.on('SIGINT', () => {
  console.log('\n\n❌ Setup interrotto dall\'utente');
  rl.close();
  process.exit(0);
});

main().catch(error => {
  console.error('❌ Errore:', error);
  rl.close();
  process.exit(1);
});
