import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const auth = getAuth();

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
}

// Registrare un nuovo utente
export const registerUser = async (
  email: string, 
  password: string, 
  role: UserRole = 'viewer',
  displayName?: string
): Promise<UserData> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Salva i dati utente in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      role,
      displayName,
      createdAt: new Date()
    };
    
    await setDoc(doc(db, 'users', user.uid), userData);
    
    return userData;
  } catch (error: any) {
    console.error('Errore registrazione:', error);
    throw new Error(error.message || 'Errore durante la registrazione');
  }
};

// Login utente
export const loginUser = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Recupera i dati utente da Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('Dati utente non trovati');
    }
    
    return userDoc.data() as UserData;
  } catch (error: any) {
    console.error('Errore login:', error);
    throw new Error(error.message || 'Errore durante il login');
  }
};

// Logout utente
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Errore logout:', error);
    throw new Error(error.message || 'Errore durante il logout');
  }
};

// Ottenere i dati dell'utente corrente
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserData;
  } catch (error) {
    console.error('Errore recupero dati utente:', error);
    return null;
  }
};

// Ottenere tutti gli utenti (solo Admin)
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date()
      } as UserData;
    });
  } catch (error) {
    console.error('Errore recupero utenti:', error);
    throw error;
  }
};

// Aggiornare ruolo utente (solo Admin)
export const updateUserRole = async (uid: string, role: UserRole): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
  } catch (error) {
    console.error('Errore aggiornamento ruolo:', error);
    throw error;
  }
};

// Eliminare utente (solo Admin) - elimina solo da Firestore
export const deleteUserData = async (uid: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    console.error('Errore eliminazione utente:', error);
    throw error;
  }
};

// Listener per cambiamenti stato autenticazione
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
