

import React, { useState, useRef, useEffect } from 'react';
import { Product, UserRole } from '../types';
import { Table } from './ui/Table';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface ProductsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  productTypes: string[];
  packagingTypes: string[];
  userRole: UserRole;
}

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

const Products: React.FC<ProductsProps> = ({ products, setProducts, productTypes, packagingTypes, userRole }) => {

  const newProductInitialState: Omit<Product, 'id' | 'isActive'> = {
    name: '',
    type: productTypes[0] || '',
    packaging: packagingTypes[0] || '',
    description: '',
    pricePerLiter: 0,
    stock: { emilia: 0, calabria: 0 },
  };
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'isActive'>>(newProductInitialState);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
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
    { header: 'Nome Prodotto', accessor: 'name' },
    { header: 'Tipologia', accessor: 'type' },
    { header: 'Confezione', accessor: 'packaging' },
    { header: 'Stato', accessor: 'status' },
    { header: 'Prezzo/Litro (€)', accessor: 'pricePerLiter' },
    { header: 'Stock Emilia (L)', accessor: 'stockEmilia' },
    { header: 'Stock Calabria (L)', accessor: 'stockCalabria' },
    { header: 'Stock Totale (L)', accessor: 'stockTotale' },
  ];
  
  const displayData = products.map(p => ({
    ...p,
    stockEmilia: p.stock.emilia,
    stockCalabria: p.stock.calabria,
    stockTotale: p.stock.emilia + p.stock.calabria,
    status: (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
        p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {p.isActive ? 'Attivo' : 'Inattivo'}
      </span>
    )
  }));

  // --- Edit Logic ---
  const handleEdit = (product: Product) => {
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct) {
        setEditingProduct(originalProduct);
        setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveChanges = () => {
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    handleCloseEditModal();
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    const { name, value } = e.target;
    
    if (name === 'stock.emilia' || name === 'stock.calabria') {
        const stockField = name.split('.')[1] as 'emilia' | 'calabria';
        setEditingProduct({
            ...editingProduct,
            stock: {
                ...editingProduct.stock,
                [stockField]: Number(value)
            }
        });
    } else {
        setEditingProduct({ ...editingProduct, [name]: name === 'pricePerLiter' ? Number(value) : value });
    }
  };

  // --- Add Logic ---
  const handleOpenAddModal = () => {
    setNewProduct(newProductInitialState);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddNewProduct = () => {
    const productToAdd: Product = {
        id: `prod_${new Date().getTime()}`,
        ...newProduct,
        type: newProduct.type || productTypes[0] || '', // Ensure a type is set
        packaging: newProduct.packaging || packagingTypes[0] || '',
        isActive: true, // New products are active by default
    };
    setProducts([...products, productToAdd]);
    handleCloseAddModal();
  };
  
  const handleNewProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'stock.emilia' || name === 'stock.calabria') {
        const stockField = name.split('.')[1] as 'emilia' | 'calabria';
        setNewProduct({
            ...newProduct,
            stock: {
                ...newProduct.stock,
                [stockField]: Number(value) || 0
            }
        });
    } else {
        setNewProduct({ ...newProduct, [name]: name === 'pricePerLiter' ? Number(value) || 0 : value });
    }
  };

  // --- Delete Logic ---
  const handleDelete = (product: Product) => {
    const originalProduct = products.find(p => p.id === product.id);
    if (originalProduct) {
      setDeletingProduct(originalProduct);
      setIsDeleteModalOpen(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    setProducts(products.filter(p => p.id !== deletingProduct.id));
    handleCloseDeleteModal();
  };

  // --- Toggle Active Logic ---
  const handleToggleActive = (product: Product) => {
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // --- Export/Import Logic ---
   const escapeCsv = (val: any): string => {
      if (val === undefined || val === null) return '';
      let str = String(val);
      if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

  const handleExportCsv = () => {
    const headers = ['ID', 'Nome Prodotto', 'Tipologia', 'Confezione', 'Descrizione', 'Prezzo/Litro', 'Stock Emilia', 'Stock Calabria', 'Attivo'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        escapeCsv(p.id),
        escapeCsv(p.name),
        escapeCsv(p.type),
        escapeCsv(p.packaging),
        escapeCsv(p.description),
        escapeCsv(p.pricePerLiter),
        escapeCsv(p.stock.emilia),
        escapeCsv(p.stock.calabria),
        escapeCsv(p.isActive),
      ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `prodotti_${date}.csv`);
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
      const expectedHeaders = ['ID', 'Nome Prodotto', 'Tipologia', 'Confezione', 'Descrizione', 'Prezzo/Litro', 'Stock Emilia', 'Stock Calabria', 'Attivo'];

      if (JSON.stringify(headers) !== JSON.stringify(expectedHeaders)) {
        setImportError("File non compatibile. Le intestazioni del CSV non corrispondono al formato richiesto per i prodotti.");
        return;
      }

      const importedProducts: Product[] = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
          id: values[0],
          name: values[1],
          type: values[2],
          packaging: values[3],
          description: values[4],
          pricePerLiter: parseFloat(values[5]),
          stock: {
            emilia: parseInt(values[6], 10),
            calabria: parseInt(values[7], 10),
          },
          isActive: values[8] === 'true',
        };
      });

      setProducts(prevProducts => {
        const productsMap = new Map(prevProducts.map(p => [p.id, p]));
        importedProducts.forEach(p => productsMap.set(p.id, p));
        return Array.from(productsMap.values());
      });
      
      setImportSuccess(`${importedProducts.length} prodotti importati/aggiornati con successo!`);
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
    setProducts([]);
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };

  const handleCloseSecondResetModal = () => {
    setIsSecondResetModalOpen(false);
    setResetConfirmationInput('');
  };

  // --- Stock Calculation by Type and Location ---
  const stockByTypeAndLocation = products.reduce((acc, product) => {
    const type = product.type;
    if (!acc[type]) {
      acc[type] = { emilia: 0, calabria: 0 };
    }
    acc[type].emilia += product.stock.emilia;
    acc[type].calabria += product.stock.calabria;
    return acc;
  }, {} as Record<string, { emilia: number; calabria: number }>);

  const totalEmilia = productTypes.reduce((sum, type) => sum + (stockByTypeAndLocation[type]?.emilia || 0), 0);
  const totalCalabria = productTypes.reduce((sum, type) => sum + (stockByTypeAndLocation[type]?.calabria || 0), 0);
  const grandTotal = totalEmilia + totalCalabria;


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-700 hidden lg:block">Prodotti</h2>
        {userRole === UserRole.Admin && (
            <div className="flex items-center space-x-2 flex-wrap gap-2 justify-end">
                <Button onClick={handleOpenAddModal}>Aggiungi Prodotto</Button>
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
                    <span>Resetta Prodotti</span>
                </Button>
            </div>
        )}
      </div>
       
      {importSuccess && <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-sm">{importSuccess}</div>}
      {importError && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{importError}</div>}
      
      <Table 
        columns={columns} 
        data={displayData} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        itemIsActive={(item) => item.isActive} 
        userRole={userRole}
      />

      {/* Stock Summary by Type and Location */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Riepilogo Giacenze Dettagliato</h3>
        <div className="space-y-2">
          {/* Headers */}
          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-600 pb-2">
            <div className="text-left">Tipologia</div>
            <div className="text-right">Stock Emilia (L)</div>
            <div className="text-right">Stock Calabria (L)</div>
            <div className="text-right">Totale per Tipo (L)</div>
          </div>

          {/* Rows for each product type */}
          {productTypes.map((type, index) => {
            const stock = stockByTypeAndLocation[type] || { emilia: 0, calabria: 0 };
            const totalForType = stock.emilia + stock.calabria;
            return (
              <div key={type} className={`grid grid-cols-4 gap-4 py-2 items-center rounded-lg ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="font-medium text-gray-800 text-left">{type}</div>
                <div className="text-right text-gray-600">{stock.emilia.toLocaleString()}</div>
                <div className="text-right text-gray-600">{stock.calabria.toLocaleString()}</div>
                <div className="text-right font-bold text-brand-green">{totalForType.toLocaleString()}</div>
              </div>
            );
          })}

          {/* Footer with grand totals */}
          <div className="grid grid-cols-4 gap-4 font-bold text-gray-800 pt-4 mt-2 items-center">
            <div className="text-left">Totale Complessivo</div>
            <div className="text-right">{totalEmilia.toLocaleString()}</div>
            <div className="text-right">{totalCalabria.toLocaleString()}</div>
            <div className="text-right text-lg text-black">{grandTotal.toLocaleString()}</div>
          </div>
        </div>
      </div>


      {/* Edit Modal */}
      {editingProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          title={`Modifica ${editingProduct.name}`}
          footer={
            <>
              <Button onClick={handleCloseEditModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleSaveChanges}>Salva Modifiche</Button>
            </>
          }
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">Nome Prodotto</label>
                <input type="text" name="name" id="name" value={editingProduct.name} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-900">Tipologia</label>
                <select name="type" id="type" value={editingProduct.type} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                  {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="packaging" className="block text-sm font-medium text-gray-900">Confezione</label>
                <select name="packaging" id="packaging" value={editingProduct.packaging} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                  {packagingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">Descrizione</label>
                <textarea name="description" id="description" value={editingProduct.description} onChange={handleEditFormChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="pricePerLiter" className="block text-sm font-medium text-gray-900">Prezzo/Litro (€)</label>
                    <input type="number" name="pricePerLiter" id="pricePerLiter" value={editingProduct.pricePerLiter} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="stock.emilia" className="block text-sm font-medium text-gray-900">Stock Emilia (L)</label>
                    <input type="number" name="stock.emilia" id="stock.emilia" value={editingProduct.stock.emilia} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="stock.calabria" className="block text-sm font-medium text-gray-900">Stock Calabria (L)</label>
                    <input type="number" name="stock.calabria" id="stock.calabria" value={editingProduct.stock.calabria} onChange={handleEditFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Aggiungi Nuovo Prodotto"
        footer={
          <>
            <Button onClick={handleCloseAddModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
            <Button onClick={handleAddNewProduct}>Aggiungi Prodotto</Button>
          </>
        }
      >
        <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name-add" className="block text-sm font-medium text-gray-900">Nome Prodotto</label>
                <input type="text" name="name" id="name-add" value={newProduct.name} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
              </div>
              <div>
                <label htmlFor="type-add" className="block text-sm font-medium text-gray-900">Tipologia</label>
                <select name="type" id="type-add" value={newProduct.type} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                  {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="packaging-add" className="block text-sm font-medium text-gray-900">Confezione</label>
                <select name="packaging" id="packaging-add" value={newProduct.packaging} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                  {packagingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
                <label htmlFor="description-add" className="block text-sm font-medium text-gray-900">Descrizione</label>
                <textarea name="description" id="description-add" value={newProduct.description} onChange={handleNewProductFormChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="pricePerLiter-add" className="block text-sm font-medium text-gray-900">Prezzo/Litro (€)</label>
                    <input type="number" name="pricePerLiter" id="pricePerLiter-add" value={newProduct.pricePerLiter} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="stock.emilia-add" className="block text-sm font-medium text-gray-900">Stock Emilia (L)</label>
                    <input type="number" name="stock.emilia" id="stock.emilia-add" value={newProduct.stock.emilia} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="stock.calabria-add" className="block text-sm font-medium text-gray-900">Stock Calabria (L)</label>
                    <input type="number" name="stock.calabria" id="stock.calabria-add" value={newProduct.stock.calabria} onChange={handleNewProductFormChange} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                </div>
            </div>
          </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
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
            <p>Sei sicuro di voler eliminare il prodotto "{deletingProduct.name}"?</p>
            <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
        </Modal>
      )}
      
      {/* Reset Modal - Step 1 */}
      <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Conferma Reset Prodotti"
          footer={
            <>
              <Button onClick={() => setIsResetModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
              <Button onClick={handleProceedToFinalReset} className="bg-red-600 hover:bg-red-700">Procedi</Button>
            </>
          }
        >
          <p>Sei sicuro di voler eliminare tutti i dati dalla sezione "Prodotti"?</p>
          <p className="text-sm text-gray-500 mt-2">Questa azione è irreversibile e cancellerà permanentemente tutti i prodotti.</p>
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
          Per confermare l'eliminazione di tutti i prodotti, scrivi "ELIMINA" nel campo qui sotto.
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

export default Products;