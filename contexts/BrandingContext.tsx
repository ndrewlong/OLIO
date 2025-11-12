import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSettings, type BrandingSettings } from '../services/settingsService';

interface BrandingContextType {
  branding: BrandingSettings;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const defaultBranding: BrandingSettings = {
  appName: 'OLIO',
  appInitials: 'O',
  tagline: 'Gestione Business',
  primaryColor: '#059669',
  primaryHover: '#047857',
  primaryLight: '#d1fae5',
  textOnPrimary: '#ffffff',
  secondaryColor: '#10b981'
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  loading: true,
  refreshBranding: async () => {}
});

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within BrandingProvider');
  }
  return context;
};

interface BrandingProviderProps {
  children: ReactNode;
}

// Funzione per calcolare la luminosità di un colore
function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance;
}

// Funzione per determinare se serve testo chiaro o scuro
function getTextColor(bgColor: string): string {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Funzione per scurire un colore (hover)
function darkenColor(hex: string, percent: number = 15): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((num >> 16) & 0xff) * (1 - percent / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) * (1 - percent / 100));
  const b = Math.max(0, (num & 0xff) * (1 - percent / 100));
  
  return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

// Funzione per schiarire un colore (background light)
function lightenColor(hex: string, percent: number = 85): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((num >> 16) & 0xff) + (255 - ((num >> 16) & 0xff)) * (percent / 100));
  const g = Math.min(255, ((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * (percent / 100));
  const b = Math.min(255, (num & 0xff) + (255 - (num & 0xff)) * (percent / 100));
  
  return '#' + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
}

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    try {
      const settings = await getSettings();
      const brandingSettings = settings.branding;
      
      // Calcola automaticamente i colori derivati
      const primaryColor = brandingSettings.primaryColor || defaultBranding.primaryColor;
      const calculatedBranding: BrandingSettings = {
        ...brandingSettings,
        primaryHover: darkenColor(primaryColor, 15),
        primaryLight: lightenColor(primaryColor, 85),
        textOnPrimary: getTextColor(primaryColor)
      };
      
      setBranding(calculatedBranding);
      
      // Applica i colori CSS
      document.documentElement.style.setProperty('--color-primary', calculatedBranding.primaryColor);
      document.documentElement.style.setProperty('--color-primary-hover', calculatedBranding.primaryHover);
      document.documentElement.style.setProperty('--color-primary-light', calculatedBranding.primaryLight);
      document.documentElement.style.setProperty('--color-text-on-primary', calculatedBranding.textOnPrimary);
      document.documentElement.style.setProperty('--color-secondary', calculatedBranding.secondaryColor);
    } catch (error) {
      console.error('Errore caricamento branding:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranding();
  }, []);

  const refreshBranding = async () => {
    await loadBranding();
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};
