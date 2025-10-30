
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Product, User, UserRole } from '../types';

interface SettingsProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  productTypes: string[];
  setProductTypes: React.Dispatch<React.SetStateAction<string[]>>;
  packagingTypes: string[];
  setPackagingTypes: React.Dispatch<React.SetStateAction<string[]>>;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>
);

const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);


const Settings: React.FC<SettingsProps> = ({ currentUser, setCurrentUser, users, setUsers, productTypes, setProductTypes, packagingTypes, setPackagingTypes, products, setProducts }) => {
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State for product type management
  const [newProductType, setNewProductType] = useState('');
  const [typeError, setTypeError] = useState('');
  const [isEditTypeModalOpen, setIsEditTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<{ oldName: string; newName: string } | null>(null);
  const [isDeleteTypeModalOpen, setIsDeleteTypeModalOpen] = useState(false);
  const [deletingType, setDeletingType] = useState<string | null>(null);

  // State for packaging type management
  const [newPackagingType, setNewPackagingType] = useState('');
  const [packagingError, setPackagingError] = useState('');
  const [isEditPackagingModalOpen, setIsEditPackagingModalOpen] = useState(false);
  const [editingPackaging, setEditingPackaging] = useState<{ oldName: string; newName: string } | null>(null);
  const [isDeletePackagingModalOpen, setIsDeletePackagingModalOpen] = useState(false);
  const [deletingPackaging, setDeletingPackaging] = useState<string | null>(null);

  // State for user management
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | Omit<User, 'id'> | null>(null);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [userError, setUserError] = useState('');


  const handleSaveCredentials = () => {
    setError('');
    setSuccessMessage('');

    if (!newUsername.trim()) {
      setError('L\'username non può essere vuoto.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    const updatedUser: User = {
        ...currentUser,
        username: newUsername,
        password: newPassword || currentUser.password,
    }

    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);

    setSuccessMessage('Credenziali aggiornate con successo!');
    setNewPassword('');
    setConfirmPassword('');
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  // --- Product Type Management Logic ---

  const handleAddNewType = () => {
    setTypeError('');
    if (!newProductType.trim()) {
      setTypeError('Il nome della tipologia non può essere vuoto.');
      return;
    }
    if (productTypes.some(type => type.toLowerCase() === newProductType.trim().toLowerCase())) {
      setTypeError('Questa tipologia esiste già.');
      return;
    }
    setProductTypes([...productTypes, newProductType.trim()]);
    setNewProductType('');
  };

  const handleOpenEditTypeModal = (typeName: string) => {
    setEditingType({ oldName: typeName, newName: typeName });
    setIsEditTypeModalOpen(true);
  };

  const handleCloseEditTypeModal = () => {
    setIsEditTypeModalOpen(false);
    setEditingType(null);
    setTypeError('');
  };

  const handleSaveTypeEdit = () => {
    if (!editingType) return;
    const { oldName, newName } = editingType;
    
    if (!newName.trim()) {
      setTypeError('Il nome non può essere vuoto.');
      return;
    }
    if (newName.trim().toLowerCase() !== oldName.toLowerCase() && productTypes.some(type => type.toLowerCase() === newName.trim().toLowerCase())) {
        setTypeError('Questa tipologia esiste già.');
        return;
    }

    setProductTypes(productTypes.map(type => type === oldName ? newName.trim() : type));
    setProducts(products.map(product => product.type === oldName ? { ...product, type: newName.trim() } : product));

    handleCloseEditTypeModal();
  };

  const handleOpenDeleteTypeModal = (typeName: string) => {
    setDeletingType(typeName);
    setIsDeleteTypeModalOpen(true);
  };

  const handleCloseDeleteTypeModal = () => {
      setIsDeleteTypeModalOpen(false);
      setDeletingType(null);
      setTypeError('');
  };

  const handleConfirmTypeDelete = () => {
    if (!deletingType) return;
    const isTypeInUse = products.some(p => p.type === deletingType);
    if (isTypeInUse) {
        setTypeError(`Impossibile eliminare "${deletingType}" perché è utilizzata da almeno un prodotto.`);
        return;
    }
    setProductTypes(productTypes.filter(type => type !== deletingType));
    handleCloseDeleteTypeModal();
  };


  // --- Packaging Type Management Logic ---
  const handleAddNewPackaging = () => {
    setPackagingError('');
    if (!newPackagingType.trim()) {
      setPackagingError('Il nome della confezione non può essere vuoto.');
      return;
    }
    if (packagingTypes.some(type => type.toLowerCase() === newPackagingType.trim().toLowerCase())) {
      setPackagingError('Questa confezione esiste già.');
      return;
    }
    setPackagingTypes([...packagingTypes, newPackagingType.trim()]);
    setNewPackagingType('');
  };

  const handleOpenEditPackagingModal = (packagingName: string) => {
    setEditingPackaging({ oldName: packagingName, newName: packagingName });
    setIsEditPackagingModalOpen(true);
  };

  const handleCloseEditPackagingModal = () => {
    setIsEditPackagingModalOpen(false);
    setEditingPackaging(null);
    setPackagingError('');
  };

  const handleSavePackagingEdit = () => {
    if (!editingPackaging) return;
    const { oldName, newName } = editingPackaging;
    
    if (!newName.trim()) {
      setPackagingError('Il nome non può essere vuoto.');
      return;
    }
    if (newName.trim().toLowerCase() !== oldName.toLowerCase() && packagingTypes.some(type => type.toLowerCase() === newName.trim().toLowerCase())) {
        setPackagingError('Questa confezione esiste già.');
        return;
    }

    setPackagingTypes(packagingTypes.map(type => type === oldName ? newName.trim() : type));
    setProducts(products.map(product => product.packaging === oldName ? { ...product, packaging: newName.trim() } : product));

    handleCloseEditPackagingModal();
  };

  const handleOpenDeletePackagingModal = (packagingName: string) => {
    setDeletingPackaging(packagingName);
    setIsDeletePackagingModalOpen(true);
  };

  const handleCloseDeletePackagingModal = () => {
      setIsDeletePackagingModalOpen(false);
      setDeletingPackaging(null);
      setPackagingError('');
  };

  const handleConfirmPackagingDelete = () => {
    if (!deletingPackaging) return;
    const isPackagingInUse = products.some(p => p.packaging === deletingPackaging);
    if (isPackagingInUse) {
        setPackagingError(`Impossibile eliminare "${deletingPackaging}" perché è utilizzata da almeno un prodotto.`);
        return;
    }
    setPackagingTypes(packagingTypes.filter(type => type !== deletingPackaging));
    handleCloseDeletePackagingModal();
  };


  // --- User Management Logic ---

  const handleOpenUserModal = (user: User | null) => {
    setUserError('');
    if (user) {
      setEditingUser({ ...user, password: '' }); // Edit mode, clear password field
    } else {
      setEditingUser({ username: '', password: '', role: UserRole.Viewer }); // Add mode
    }
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    setUserError('');

    if (!editingUser.username.trim()) {
        setUserError('L\'username non può essere vuoto.');
        return;
    }
    
    const isEditing = 'id' in editingUser;
    
    // Check for unique username
    if (users.some(u => u.username.toLowerCase() === editingUser.username.trim().toLowerCase() && (!isEditing || u.id !== editingUser.id))) {
        setUserError('Questo username è già in uso.');
        return;
    }

    // Check for password on new user
    if (!isEditing && !editingUser.password.trim()) {
        setUserError('La password è obbligatoria per i nuovi utenti.');
        return;
    }

    if (isEditing) {
        // Edit existing user
        const originalUser = users.find(u => u.id === editingUser.id);
        if(!originalUser) return;

        const updatedUser = {
            ...originalUser,
            username: editingUser.username.trim(),
            role: editingUser.role,
            password: editingUser.password.trim() || originalUser.password, // Keep old password if new one is empty
        };
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        if (currentUser.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    } else {
        // Add new user
        const newUser: User = {
            id: `user_${new Date().getTime()}`,
            username: editingUser.username.trim(),
            password: editingUser.password.trim(),
            role: editingUser.role,
        };
        setUsers([...users, newUser]);
    }

    handleCloseUserModal();
  };

  const handleOpenDeleteUserModal = (user: User) => {
    setDeletingUser(user);
    setIsDeleteUserModalOpen(true);
  };
  
  const handleCloseDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setDeletingUser(null);
  }

  const handleConfirmUserDelete = () => {
    if (!deletingUser) return;
    setUsers(users.filter(u => u.id !== deletingUser.id));
    handleCloseDeleteUserModal();
  };


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-700 hidden lg:block">Impostazioni</h2>
      
      {/* Account Settings */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Impostazioni Account</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
            />
          </div>
          <hr />
          <h4 className="text-lg font-medium text-gray-800">Cambia Password</h4>
           <p className="text-sm text-gray-500 -mt-4">Lasciare i campi vuoti per mantenere la password attuale.</p>
          <div>
            <label htmlFor="new-password"className="block text-sm font-medium text-gray-900">Nuova Password</label>
            <input
              type="password"
              name="new-password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-900">Conferma Nuova Password</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
            />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSaveCredentials}>Salva Modifiche</Button>
          </div>
        </div>
      </div>

      {/* User Management */}
      {currentUser.role === UserRole.Admin &&
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Gestione Utenti</h3>
                <Button onClick={() => handleOpenUserModal(null)}>Aggiungi Utente</Button>
            </div>
            <div className="space-y-4">
                <ul className="space-y-2">
                    {users.map(user => (
                        <li key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <span className="font-medium text-gray-800">{user.username}</span>
                                <span className="ml-2 text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{user.role}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => handleOpenUserModal(user)} className="text-brand-green hover:text-brand-green-light">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                {currentUser.id !== user.id && (
                                  <button onClick={() => handleOpenDeleteUserModal(user)} className="text-red-500 hover:text-red-700">
                                      <DeleteIcon className="w-5 h-5" />
                                  </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      }

      {/* Product Type Management */}
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Gestione Tipologie Prodotto</h3>
        <div className="space-y-4">
            <ul className="space-y-2">
                {productTypes.map(type => (
                    <li key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">{type}</span>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenEditTypeModal(type)} className="text-brand-green hover:text-brand-green-light">
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleOpenDeleteTypeModal(type)} className="text-red-500 hover:text-red-700">
                                <DeleteIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
             <div className="pt-4">
                <label htmlFor="new-product-type" className="block text-sm font-medium text-gray-900">Aggiungi Nuova Tipologia</label>
                <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      id="new-product-type"
                      value={newProductType}
                      onChange={(e) => setNewProductType(e.target.value)}
                      className="flex-grow block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
                      placeholder="es. Novello"
                    />
                    <Button onClick={handleAddNewType}>Aggiungi</Button>
                </div>
                {typeError && <p className="text-sm text-red-600 mt-2">{typeError}</p>}
            </div>
        </div>
      </div>

       {/* Packaging Type Management */}
       <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Gestione Confezioni Prodotto</h3>
        <div className="space-y-4">
            <ul className="space-y-2">
                {packagingTypes.map(type => (
                    <li key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">{type}</span>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleOpenEditPackagingModal(type)} className="text-brand-green hover:text-brand-green-light">
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleOpenDeletePackagingModal(type)} className="text-red-500 hover:text-red-700">
                                <DeleteIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
             <div className="pt-4">
                <label htmlFor="new-packaging-type" className="block text-sm font-medium text-gray-900">Aggiungi Nuova Confezione</label>
                <div className="mt-1 flex space-x-2">
                    <input
                      type="text"
                      id="new-packaging-type"
                      value={newPackagingType}
                      onChange={(e) => setNewPackagingType(e.target.value)}
                      className="flex-grow block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
                      placeholder="es. Lattina 5L"
                    />
                    <Button onClick={handleAddNewPackaging}>Aggiungi</Button>
                </div>
                {packagingError && <p className="text-sm text-red-600 mt-2">{packagingError}</p>}
            </div>
        </div>
      </div>


      {/* Edit Type Modal */}
      {isEditTypeModalOpen && editingType && (
        <Modal
          isOpen={isEditTypeModalOpen}
          onClose={handleCloseEditTypeModal}
          title={`Modifica Tipologia`}
          footer={<>
            <Button onClick={handleCloseEditTypeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
            <Button onClick={handleSaveTypeEdit}>Salva</Button>
          </>}
        >
          <div>
            <label htmlFor="edit-type-name" className="block text-sm font-medium text-gray-900">Nome Tipologia</label>
            <input 
              type="text"
              id="edit-type-name"
              value={editingType.newName}
              onChange={(e) => setEditingType({ ...editingType, newName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
            />
            {typeError && <p className="text-sm text-red-600 mt-2">{typeError}</p>}
          </div>
        </Modal>
      )}

      {/* Delete Type Modal */}
      {isDeleteTypeModalOpen && deletingType && (
        <Modal
            isOpen={isDeleteTypeModalOpen}
            onClose={handleCloseDeleteTypeModal}
            title="Conferma Eliminazione"
            footer={<>
                <Button onClick={handleCloseDeleteTypeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
                <Button onClick={handleConfirmTypeDelete} className="bg-red-600 hover:bg-red-700">Elimina</Button>
            </>}
        >
            <p>Sei sicuro di voler eliminare la tipologia "{deletingType}"?</p>
            {typeError ? (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-2">{typeError}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
            )}
        </Modal>
      )}

      {/* Edit Packaging Modal */}
      {isEditPackagingModalOpen && editingPackaging && (
        <Modal
          isOpen={isEditPackagingModalOpen}
          onClose={handleCloseEditPackagingModal}
          title={`Modifica Confezione`}
          footer={<>
            <Button onClick={handleCloseEditPackagingModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
            <Button onClick={handleSavePackagingEdit}>Salva</Button>
          </>}
        >
          <div>
            <label htmlFor="edit-packaging-name" className="block text-sm font-medium text-gray-900">Nome Confezione</label>
            <input 
              type="text"
              id="edit-packaging-name"
              value={editingPackaging.newName}
              onChange={(e) => setEditingPackaging({ ...editingPackaging, newName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm"
            />
            {packagingError && <p className="text-sm text-red-600 mt-2">{packagingError}</p>}
          </div>
        </Modal>
      )}

      {/* Delete Packaging Modal */}
      {isDeletePackagingModalOpen && deletingPackaging && (
        <Modal
            isOpen={isDeletePackagingModalOpen}
            onClose={handleCloseDeletePackagingModal}
            title="Conferma Eliminazione"
            footer={<>
                <Button onClick={handleCloseDeletePackagingModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
                <Button onClick={handleConfirmPackagingDelete} className="bg-red-600 hover:bg-red-700">Elimina</Button>
            </>}
        >
            <p>Sei sicuro di voler eliminare la confezione "{deletingPackaging}"?</p>
            {packagingError ? (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-2">{packagingError}</p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
            )}
        </Modal>
      )}


      {/* Add/Edit User Modal */}
      {isUserModalOpen && editingUser && (
          <Modal
              isOpen={isUserModalOpen}
              onClose={handleCloseUserModal}
              title={'id' in editingUser ? 'Modifica Utente' : 'Aggiungi Utente'}
              footer={<>
                  <Button onClick={handleCloseUserModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
                  <Button onClick={handleSaveUser}>Salva</Button>
              </>}
          >
              <form className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-900">Username</label>
                      <input type="text" value={editingUser.username} onChange={(e) => setEditingUser({...editingUser, username: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-900">Password</label>
                      <input type="password" value={editingUser.password} onChange={(e) => setEditingUser({...editingUser, password: e.target.value})} placeholder={'id' in editingUser ? 'Lasciare vuoto per non modificare' : '********'} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-900">Ruolo</label>
                      <select value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-900 shadow-sm focus:border-brand-green focus:ring-1 focus:ring-brand-green sm:text-sm">
                          <option value={UserRole.Admin}>Admin</option>
                          <option value={UserRole.Viewer}>Visualizzatore</option>
                      </select>
                  </div>
                  {userError && <p className="text-sm text-red-600 mt-2">{userError}</p>}
              </form>
          </Modal>
      )}

      {/* Delete User Modal */}
      {isDeleteUserModalOpen && deletingUser && (
          <Modal
              isOpen={isDeleteUserModalOpen}
              onClose={handleCloseDeleteUserModal}
              title="Conferma Eliminazione Utente"
              footer={<>
                  <Button onClick={handleCloseDeleteUserModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800">Annulla</Button>
                  <Button onClick={handleConfirmUserDelete} className="bg-red-600 hover:bg-red-700">Elimina</Button>
              </>}
          >
              <p>Sei sicuro di voler eliminare l'utente "{deletingUser.username}"?</p>
              <p className="text-sm text-gray-500 mt-2">Questa azione non può essere annullata.</p>
          </Modal>
      )}

    </div>
  );
};

export default Settings;
