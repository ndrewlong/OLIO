
import React, { useState, useRef, useEffect } from 'react';
import { Customer, UserRole } from '../types';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  userRole: UserRole;
}

const newCustomerInitialState: Omit<Customer, 'id'> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  joinDate: '',
  lastPurchaseDate: '',
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


const Customers: React.FC<CustomersProps> = ({ customers, setCustomers, userRole }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>(newCustomerInitialState);
  
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
    { header: 'Nome', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Telefono', accessor: 'phone' },
    { header: 'Indirizzo', accessor: 'address' },
    { header: 'Data Iscrizione', accessor: 'joinDate' },
    { header: 'Data Ultimo Acquisto', accessor: 'lastPurchaseDate' },
  ];

  const displayData = [...customers]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(customer => ({
    ...customer,
    joinDate: formatDate(customer.joinDate),
    lastPurchaseDate: formatDate(customer.lastPurchaseDate),
    email: (
      <a href={`mailto:${customer.email}`} className="text-brand-green hover:underline hover:text-brand-green-light transition-colors duration-200">
        {customer.email}
      </a>
    ),
  }));

  // --- Edit Logic ---
  // FIX: Changed parameter type from Customer to { id: string } to match the data structure passed by the Table component.
  const handleEdit = (customer: { id: string }) => {
    const originalCustomer = customers.find(c => c.id === customer.id);
    if (originalCustomer) {
      setEditingCustomer(originalCustomer);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveChanges = () => {
    if (!editingCustomer) return;
    setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
    handleCloseEditModal();
  };
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCustomer) return;
    const { name, value } = e.target;
    setEditingCustomer({ ...editingCustomer, [name]: value });
  };

  // --- Delete Logic ---
  // FIX: Changed parameter type from Customer to { id: string } to match the data structure passed by the Table component.
  const handleDelete = (customer: { id: string }) => {
    const originalCustomer = customers.find(c => c.id === customer.id);
    if (originalCustomer) {
      setDeletingCustomer(originalCustomer);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingCustomer(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingCustomer) return;
    setCustomers(customers.filter(c => c.id !== deletingCustomer.id));
    handleCloseDeleteModal();
  };

  // --- Add Logic ---
  const handleOpenAddModal = () => {
    setNewCustomer(newCustomerInitialState);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddNewCustomer = () => {
    const customerToAdd: Customer = {
      id: `cust_${new Date().getTime()}`,
      ...newCustomer,
      joinDate: newCustomer.joinDate || new Date().toISOString().split('T')[0] // Set current date if not provided
    };
    setCustomers([customerToAdd, ...customers]);
    handleCloseAddModal();
  };

  const handleNewCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
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
    const headers = [ 'ID', 'Nome', 'Email', 'Telefono', 'Indirizzo', 'Data Iscrizione', 'Data Ultimo Acquisto' ];
    const keys: (keyof Customer)[] = [ 'id', 'name', 'email', 'phone', 'address', 'joinDate', 'lastPurchaseDate' ];

    const csvContent = [
      headers.join(','),
      ...customers.map(customer =>
        keys.map(key => escapeCsv(customer[key])).join(',')
      )
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `clienti_${date}.csv`);
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
      const expectedHeaders = [ 'ID', 'Nome', 'Email', 'Telefono', 'Indirizzo', 'Data Iscrizione', 'Data Ultimo Acquisto' ];

      if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
        setImportError("File non compatibile. Le intestazioni del CSV non corrispondono al formato richiesto per i clienti.");
        return;
      }

      const importedCustomers: Customer[] = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          id: values[0],
          name: values[1],
          email: values[2],
          phone: values[3],
          address: values[4],
          joinDate: values[5],
          lastPurchaseDate: values[6] || undefined,
        };
      });

      setCustomers(prevCustomers => {
        const customersMap = new Map(prevCustomers.map(c => [c.id, c]));
        importedCustomers.forEach(c => customersMap.set(c.id, c));
        return Array.from(customersMap.values());
      });
      
      setImportSuccess(`${importedCustomers.length} clienti importati/aggiornati con successo!`);
    };

    reader.onerror = () => {
      setImportError("Errore durante la lettura del file.");
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // --- Reset Logic ---
  const handleProceedToFinalReset = () => {
    setIsResetModalOpen(false);
    setIsSecondResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    setCustomers([]);
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };

  const handleCloseSecondResetModal = () => {
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-700 hidden lg:block">Clienti</h2>
        {userRole === UserRole.Admin && (
            <div className="flex items-center space-x-2 flex-wrap gap-2 justify-end">
                <Button onClick={handleOpenAddModal}>Aggiungi Cliente</Button>
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
                    <span>Resetta Clienti</span>
                </Button>
            </div>
        )}
      </div>
      
      {importSuccess && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">{importSuccess}</div>}
      {importError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{importError}</div>}
      
      <Table columns={columns} data={displayData} onEdit={handleEdit} onDelete={handleDelete} userRole={userRole} />

      {/* Edit Modal */}
      {editingCustomer && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          title={`Modifica ${editingCustomer.name}`}
          footer={
            <>
              <Button onClick={handleCloseEditModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleSaveChanges}>Salva Modifiche</Button>
            </>
          }
        >
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">Nome</label>
              <input type="text" name="name" id="name" value={editingCustomer.name} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
              <input type="email" name="email" id="email" value={editingCustomer.email} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Telefono</label>
              <input type="text" name="phone" id="phone" value={editingCustomer.phone} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900">Indirizzo</label>
              <input type="text" name="address" id="address" value={editingCustomer.address} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-900">Data Iscrizione</label>
                <input type="date" name="joinDate" id="joinDate" value={editingCustomer.joinDate} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label htmlFor="lastPurchaseDate" className="block text-sm font-medium text-gray-900">Data Ultimo Acquisto</label>
                <input type="date" name="lastPurchaseDate" id="lastPurchaseDate" value={editingCustomer.lastPurchaseDate || ''} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Aggiungi Nuovo Cliente"
        footer={
          <>
            <Button onClick={handleCloseAddModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
            <Button onClick={handleAddNewCustomer}>Aggiungi Cliente</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label htmlFor="name-add" className="block text-sm font-medium text-gray-900">Nome</label>
            <input type="text" name="name" id="name-add" value={newCustomer.name} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label htmlFor="email-add" className="block text-sm font-medium text-gray-900">Email</label>
            <input type="email" name="email" id="email-add" value={newCustomer.email} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label htmlFor="phone-add" className="block text-sm font-medium text-gray-900">Telefono</label>
            <input type="text" name="phone" id="phone-add" value={newCustomer.phone} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div>
            <label htmlFor="address-add" className="block text-sm font-medium text-gray-900">Indirizzo</label>
            <input type="text" name="address" id="address-add" value={newCustomer.address} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="joinDate-add" className="block text-sm font-medium text-gray-900">Data Iscrizione</label>
              <input type="date" name="joinDate" id="joinDate-add" value={newCustomer.joinDate} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div>
              <label htmlFor="lastPurchaseDate-add" className="block text-sm font-medium text-gray-900">Data Ultimo Acquisto</label>
              <input type="date" name="lastPurchaseDate" id="lastPurchaseDate-add" value={newCustomer.lastPurchaseDate || ''} onChange={handleNewCustomerFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      {deletingCustomer && (
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
          <p>Sei sicuro di voler eliminare il cliente "{deletingCustomer.name}"?</p>
          <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
        </Modal>
      )}

      {/* Reset Modal - Step 1 */}
      <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Conferma Reset Clienti"
          footer={
            <>
              <Button onClick={() => setIsResetModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleProceedToFinalReset} className="bg-red-600 hover:bg-red-700">Procedi</Button>
            </>
          }
        >
          <p>Sei sicuro di voler eliminare tutti i dati dalla sezione "Clienti"?</p>
          <p className="text-sm text-gray-500 mt-2">Questa azione è irreversibile e cancellerà permanentemente tutti i clienti.</p>
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
            Per confermare l'eliminazione di tutti i clienti, scrivi "ELIMINA" nel campo qui sotto.
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

export default Customers;
