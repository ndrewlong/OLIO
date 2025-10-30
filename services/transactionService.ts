import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod?: string;
  reference?: string;
  createdAt?: Date;
}

const COLLECTION_NAME = 'transactions';

// Creare una nuova transazione
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...transaction,
      date: Timestamp.fromDate(transaction.date),
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...transaction };
  } catch (error) {
    console.error('Errore creazione transazione:', error);
    throw error;
  }
};

// Leggere tutte le transazioni (ordinate per data)
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate(),
        createdAt: data.createdAt?.toDate()
      } as Transaction;
    });
  } catch (error) {
    console.error('Errore lettura transazioni:', error);
    throw error;
  }
};

// Aggiornare una transazione
export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  try {
    const transactionRef = doc(db, COLLECTION_NAME, id);
    const updateData: any = { ...transaction };
    
    // Converti la data in Timestamp se presente
    if (transaction.date) {
      updateData.date = Timestamp.fromDate(transaction.date);
    }
    
    await updateDoc(transactionRef, updateData);
    return { id, ...transaction };
  } catch (error) {
    console.error('Errore aggiornamento transazione:', error);
    throw error;
  }
};

// Eliminare una transazione
export const deleteTransaction = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Errore eliminazione transazione:', error);
    throw error;
  }
};

// Calcolare il totale delle entrate
export const getTotalIncome = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error('Errore calcolo entrate:', error);
    return 0;
  }
};

// Calcolare il totale delle uscite
export const getTotalExpenses = async (): Promise<number> => {
  try {
    const transactions = await getTransactions();
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error('Errore calcolo uscite:', error);
    return 0;
  }
};

// Calcolare il bilancio
export const getBalance = async (): Promise<number> => {
  try {
    const income = await getTotalIncome();
    const expenses = await getTotalExpenses();
    return income - expenses;
  } catch (error) {
    console.error('Errore calcolo bilancio:', error);
    return 0;
  }
};
