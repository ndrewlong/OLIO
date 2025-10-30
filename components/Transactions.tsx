

import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, UserRole } from '../types';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  userRole: UserRole;
}

const newTransactionInitialState: Omit<Transaction, 'id' | 'type'> = {
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
};

const formatDate = (dateString?: string) => {
  if (!dateString || dateString.split('-').length !== 3) return dateString || '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);


const Transactions: React.FC<TransactionsProps> = ({ transactions, setTransactions, userRole }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id' | 'type'>>(newTransactionInitialState);
  const [transactionTypeToAdd, setTransactionTypeToAdd] = useState<TransactionType>(TransactionType.Income);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSecondResetModalOpen, setIsSecondResetModalOpen] = useState(false);
  const [resetConfirmationInput, setResetConfirmationInput] = useState('');

  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (importError || importSuccess) {
      const timer = setTimeout(() => {
        setImportError(null);
        setImportSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importError, importSuccess]);

  const columns = [
    { header: 'Data', accessor: 'date' },
    { header: 'Descrizione', accessor: 'description' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Importo (€)', accessor: 'amount' },
  ];

  // --- Edit Logic ---
  const handleEdit = (transaction: any) => {
    const originalTransaction = transactions.find(t => t.id === transaction.id);
    if(originalTransaction) {
      setEditingTransaction(originalTransaction);
      setIsEditModalOpen(true);
    }
  };
  
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveChanges = () => {
    if (!editingTransaction) return;
    setTransactions(transactions.map(t => t.id === editingTransaction.id ? editingTransaction : t));
    handleCloseEditModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingTransaction) return;
    const { name, value } = e.target;
    setEditingTransaction({ ...editingTransaction, [name]: name === 'amount' ? Number(value) : value });
  };

  // --- Delete Logic ---
  const handleDelete = (transaction: any) => {
    const originalTransaction = transactions.find(t => t.id === transaction.id);
    if (originalTransaction) {
      setDeletingTransaction(originalTransaction);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingTransaction(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingTransaction) return;
    setTransactions(transactions.filter(t => t.id !== deletingTransaction.id));
    handleCloseDeleteModal();
  };

  // --- Add Logic ---
  const handleOpenAddModal = (type: TransactionType) => {
    setTransactionTypeToAdd(type);
    setNewTransaction(newTransactionInitialState);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleNewTransactionFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: name === 'amount' ? Number(value) : value });
  };

  const handleAddNewTransaction = () => {
    if (!newTransaction.description || newTransaction.amount <= 0) {
      alert('Per favore, compila descrizione e importo.');
      return;
    }
    const transactionToAdd: Transaction = {
      id: `trans_${new Date().getTime()}`,
      type: transactionTypeToAdd,
      ...newTransaction,
      amount: Math.abs(newTransaction.amount) // ensure amount is positive
    };
    setTransactions([transactionToAdd, ...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    handleCloseAddModal();
  };

  // --- Export/Import Logic ---
  const escapeCsv = (val: any): string => {
    if (val === undefined || val === null) {
      return '';
    }
    let str = String(val);
    if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Data', 'Descrizione', 'Tipo', 'Importo'];
    const keys: (keyof Transaction)[] = ['id', 'date', 'description', 'type', 'amount'];

    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction =>
        keys.map(key => escapeCsv(transaction[key])).join(',')
      )
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `finanze_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length < 1) {
        setImportError("Il file CSV è vuoto.");
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const expectedHeaders = ['ID', 'Data', 'Descrizione', 'Tipo', 'Importo'];

      if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
        setImportError("File non compatibile. Le intestazioni del CSV non corrispondono al formato richiesto per le finanze.");
        return;
      }

      try {
        const importedTransactions: Transaction[] = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          const type = values[3] as TransactionType;
          if (!Object.values(TransactionType).includes(type)) {
            throw new Error(`Tipo di transazione non valido "${type}" alla riga ${index + 2}. Valori permessi: Entrata, Uscita.`);
          }
          const amount = parseFloat(values[4]);
          if (isNaN(amount)) {
            throw new Error(`Importo non valido "${values[4]}" alla riga ${index + 2}.`);
          }

          return {
            id: values[0],
            date: values[1],
            description: values[2],
            type: type,
            amount: amount,
          };
        });

        setTransactions(prevTransactions => {
          const transactionsMap = new Map(prevTransactions.map(t => [t.id, t]));
          importedTransactions.forEach(t => transactionsMap.set(t.id, t));
          return Array.from(transactionsMap.values());
        });
        
        setImportSuccess(`${importedTransactions.length} transazioni importate/aggiornate con successo!`);
      } catch (error: any) {
        setImportError(error.message || "Errore durante l'analisi del file CSV.");
      }
    };

    reader.onerror = () => {
      setImportError("Errore durante la lettura del file.");
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };
  
  // --- Reset Logic ---
  const handleProceedToFinalReset = () => {
    setIsResetModalOpen(false);
    setIsSecondResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setTransactions([]);
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };

  const handleCloseSecondResetModal = () => {
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };


  const renderData = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => ({
    ...t,
    date: formatDate(t.date),
    amount: (
      <span className={t.type === TransactionType.Income ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {t.type === TransactionType.Income ? '+' : '-'} {t.amount.toFixed(2)}
      </span>
    ),
    type: (
       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        t.type === TransactionType.Income ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
       }`}>
        {t.type}
      </span>
    )
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-700 hidden lg:block">Finanze</h2>
        {userRole === UserRole.Admin && (
            <div className="flex items-center space-x-2 flex-wrap gap-2 justify-end">
                <Button onClick={() => handleOpenAddModal(TransactionType.Income)}>Aggiungi Entrata</Button>
                <Button onClick={() => handleOpenAddModal(TransactionType.Expense)} className="bg-brand-gold hover:bg-brand-gold-light">Aggiungi Uscita</Button>
                <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".csv" className="hidden" />
                <Button onClick={handleImportClick} className="bg-gray-500 hover:bg-gray-600 text-white flex items-center space-x-2">
                    <UploadIcon className="w-5 h-5" />
                    <span>Importa CSV</span>
                </Button>
                <Button onClick={handleExportCsv} className="bg-brand-gold hover:bg-brand-gold-light flex items-center space-x-2">
                    <DownloadIcon className="w-5 h-5" />
                    <span>Esporta CSV</span>
                </Button>
                <Button onClick={() => setIsResetModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2">
                    <TrashIcon className="w-5 h-5" />
                    <span>Resetta Finanze</span>
                </Button>
            </div>
        )}
      </div>

      {importSuccess && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">{importSuccess}</div>}
      {importError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{importError}</div>}
      
      <Table columns={columns} data={renderData} onEdit={handleEdit} onDelete={handleDelete} userRole={userRole} />

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title={`Aggiungi Nuova ${transactionTypeToAdd}`}
        footer={
          <>
            <Button onClick={handleCloseAddModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
            <Button onClick={handleAddNewTransaction}>Aggiungi</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="date-add" className="block text-sm font-medium text-gray-900">Data</label>
            <input type="date" name="date" id="date-add" value={newTransaction.date} onChange={handleNewTransactionFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description-add" className="block text-sm font-medium text-gray-900">Descrizione</label>
            <input type="text" name="description" id="description-add" value={newTransaction.description} onChange={handleNewTransactionFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label htmlFor="amount-add" className="block text-sm font-medium text-gray-900">Importo (€)</label>
            <input type="number" name="amount" id="amount-add" value={newTransaction.amount === 0 ? '' : newTransaction.amount} onChange={handleNewTransactionFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" placeholder="es. 50.00" />
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingTransaction && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title={`Modifica Transazione`}
          footer={
            <>
              <Button onClick={handleCloseEditModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleSaveChanges}>Salva Modifiche</Button>
            </>
          }
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-900">Data</label>
              <input type="date" name="date" id="date" value={editingTransaction.date} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">Descrizione</label>
              <input type="text" name="description" id="description" value={editingTransaction.description} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-900">Tipo</label>
                <select name="type" id="type" value={editingTransaction.type} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                  <option value={TransactionType.Income}>Entrata</option>
                  <option value={TransactionType.Expense}>Uscita</option>
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-900">Importo (€)</label>
                <input type="number" name="amount" id="amount" value={editingTransaction.amount} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {deletingTransaction && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title="Conferma Eliminazione"
          footer={
            <>
              <Button onClick={handleCloseDeleteModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Elimina</Button>
            </>
          }
        >
            <p>Sei sicuro di voler eliminare la transazione "{deletingTransaction.description}"?</p>
            <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
        </Modal>
      )}

      {/* Reset Modal - Step 1 */}
       <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Conferma Reset Finanze"
          footer={
            <>
              <Button onClick={() => setIsResetModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleProceedToFinalReset} className="bg-red-600 hover:bg-red-700">Procedi</Button>
            </>
          }
        >
          <p>Sei sicuro di voler eliminare tutti i dati dalla sezione "Finanze"?</p>
          <p className="text-sm text-gray-500 mt-2">Questa azione è irreversibile e cancellerà permanentemente tutte le transazioni.</p>
        </Modal>

      {/* Reset Modal - Step 2 */}
       <Modal
          isOpen={isSecondResetModalOpen}
          onClose={handleCloseSecondResetModal}
          title="Conferma Definitiva"
          footer={
            <>
              <Button onClick={handleCloseSecondResetModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button
                onClick={handleConfirmReset}
                className="bg-red-800 hover:bg-red-900 disabled:bg-red-300 disabled:cursor-not-allowed"
                disabled={resetConfirmationInput !== 'ELIMINA'}
              >
                Elimina Definitivamente
              </Button>
            </>
          }
        >
          <p className="font-semibold text-gray-800">Questa è l'ultima verifica. L'azione non potrà essere annullata.</p>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Per confermare l'eliminazione di tutte le transazioni, scrivi "ELIMINA" nel campo qui sotto.
          </p>
          <input
            type="text"
            value={resetConfirmationInput}
            onChange={(e) => setResetConfirmationInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:text-sm"
            placeholder="ELIMINA"
          />
        </Modal>
    </div>
  );
};

export default Transactions;