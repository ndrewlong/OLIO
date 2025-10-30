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

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = 'customers';

// Creare un nuovo cliente
export const createCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...customer,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...customer };
  } catch (error) {
    console.error('Errore creazione cliente:', error);
    throw error;
  }
};

// Leggere tutti i clienti
export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Customer));
  } catch (error) {
    console.error('Errore lettura clienti:', error);
    throw error;
  }
};

// Aggiornare un cliente
export const updateCustomer = async (id: string, customer: Partial<Customer>) => {
  try {
    const customerRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(customerRef, customer);
    return { id, ...customer };
  } catch (error) {
    console.error('Errore aggiornamento cliente:', error);
    throw error;
  }
};

// Eliminare un cliente
export const deleteCustomer = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Errore eliminazione cliente:', error);
    throw error;
  }
};
