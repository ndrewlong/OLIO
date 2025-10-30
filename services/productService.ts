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

export interface Product {
  id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  description?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = 'products';

// Creare un nuovo prodotto
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...product,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error('Errore creazione prodotto:', error);
    throw error;
  }
};

// Leggere tutti i prodotti
export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    } as Product));
  } catch (error) {
    console.error('Errore lettura prodotti:', error);
    throw error;
  }
};

// Aggiornare un prodotto
export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, product);
    return { id, ...product };
  } catch (error) {
    console.error('Errore aggiornamento prodotto:', error);
    throw error;
  }
};

// Eliminare un prodotto
export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Errore eliminazione prodotto:', error);
    throw error;
  }
};
