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

export const BrandingProvider: React.FC<BrandingProviderProps> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingSettings>(defaultBranding);
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    try {
      const settings = await getSettings();
      setBranding(settings.branding);
      
      // Applica i colori CSS
      document.documentElement.style.setProperty('--color-primary', settings.branding.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', settings.branding.secondaryColor);
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
