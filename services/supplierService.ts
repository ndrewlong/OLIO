import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Supplier {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  productType?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = 'suppliers';

// Creare un nuovo fornitore
export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...supplier,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...supplier };
  } catch (error) {
    console.error('Errore creazione fornitore:', error);
    throw error;
  }
};

// Leggere tutti i fornitori
export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Supplier));
  } catch (error) {
    console.error('Errore lettura fornitori:', error);
    throw error;
  }
};

// Aggiornare un fornitore
export const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
  try {
    const supplierRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(supplierRef, supplier);
    return { id, ...supplier };
  } catch (error) {
    console.error('Errore aggiornamento fornitore:', error);
    throw error;
  }
};

// Eliminare un fornitore
export const deleteSupplier = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Errore eliminazione fornitore:', error);
    throw error;
  }
};
