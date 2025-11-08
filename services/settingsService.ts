import { 
  doc, 
  getDoc, 
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CompanySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  vatNumber?: string;
  website?: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface Configurations {
  productCategories: string[];
  productUnits: string[];
  paymentMethods: string[];
}

export interface BrandingSettings {
  appName: string;
  appInitials: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface Settings {
  company: CompanySettings;
  preferences: UserPreferences;
  configurations: Configurations;
  branding: BrandingSettings;
  updatedAt?: Date;
}

const SETTINGS_DOC_ID = 'app-settings';
const COLLECTION_NAME = 'settings';

// Configurazioni di default
const defaultConfigurations: Configurations = {
  productCategories: ['Olio', 'Olive', 'Conserve', 'Vino', 'Altro'],
  productUnits: ['Lt', 'Kg', 'Pz', 'Conf'],
  paymentMethods: ['Contanti', 'Carta', 'Bonifico', 'Assegno']
};

// Branding di default
const defaultBranding: BrandingSettings = {
  appName: 'OLIO',
  appInitials: 'O',
  tagline: 'Gestione Business',
  primaryColor: '#059669', // emerald-600
  secondaryColor: '#10b981'  // emerald-500
};

// Impostazioni di default
const defaultSettings: Settings = {
  company: {
    name: '',
    email: '',
    phone: '',
    address: '',
    vatNumber: '',
    website: ''
  },
  preferences: {
    language: 'it',
    currency: 'EUR',
    emailNotifications: true,
    pushNotifications: false
  },
  configurations: defaultConfigurations,
  branding: defaultBranding
};

// Leggere le impostazioni
export const getSettings = async (): Promise<Settings> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        configurations: data.configurations || defaultConfigurations,
        branding: data.branding || defaultBranding,
        updatedAt: data.updatedAt?.toDate()
      } as Settings;
    } else {
      return defaultSettings;
    }
  } catch (error) {
    console.error('Errore lettura impostazioni:', error);
    return defaultSettings;
  }
};

// Salvare le impostazioni
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Errore salvataggio impostazioni:', error);
    throw error;
  }
};

// Aggiornare solo le impostazioni azienda
export const updateCompanySettings = async (company: CompanySettings): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    await saveSettings({
      ...currentSettings,
      company
    });
  } catch (error) {
    console.error('Errore aggiornamento impostazioni azienda:', error);
    throw error;
  }
};

// Aggiornare solo le preferenze utente
export const updateUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    await saveSettings({
      ...currentSettings,
      preferences
    });
  } catch (error) {
    console.error('Errore aggiornamento preferenze:', error);
    throw error;
  }
};

// Aggiornare solo le configurazioni
export const updateConfigurations = async (configurations: Configurations): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    await saveSettings({
      ...currentSettings,
      configurations
    });
  } catch (error) {
    console.error('Errore aggiornamento configurazioni:', error);
    throw error;
  }
};

// Aggiornare solo il branding
export const updateBranding = async (branding: BrandingSettings): Promise<void> => {
  try {
    const currentSettings = await getSettings();
    await saveSettings({
      ...currentSettings,
      branding
    });
  } catch (error) {
    console.error('Errore aggiornamento branding:', error);
    throw error;
  }
};
