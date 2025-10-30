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

export interface Settings {
  company: CompanySettings;
  preferences: UserPreferences;
  updatedAt?: Date;
}

const SETTINGS_DOC_ID = 'app-settings';
const COLLECTION_NAME = 'settings';

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
  }
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
        updatedAt: data.updatedAt?.toDate()
      } as Settings;
    } else {
      // Se non esistono impostazioni, restituisci quelle di default
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
