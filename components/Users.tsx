import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Edit2, Trash2, Shield, UserCheck, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllUsers, 
  registerUser, 
  updateUserRole, 
  deleteUserData,
  type UserData,
  type UserRole 
} from '../services/authService';

export default function Users() {
  const { userData } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'viewer' as UserRole
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Errore caricamento utenti:', error);
      alert('Errore nel caricamento degli utenti');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser && formData.password.length < 6) {
      alert('La password deve essere di almeno 6 caratteri');
      return;
    }

    try {
      if (editingUser) {
        // Aggiorna solo il ruolo
        await updateUserRole(editingUser.uid, formData.role);
        alert('Ruolo aggiornato con successo!');
      } else {
        // Salva le credenziali admin correnti
        const adminEmail = userData?.email;
        const adminPassword = prompt('Inserisci la tua password admin per continuare:');
        
        if (!adminPassword) {
          alert('Password admin richiesta per creare nuovi utenti');
          return;
        }
        
        // Crea nuovo utente
        await registerUser(
          formData.email,
          formData.password,
          formData.role,
          formData.displayName || undefined
        );
        
        // Re-login come admin
        if (adminEmail) {
          await loginUser(adminEmail, adminPassword);
        }
        
        alert('Utente creato con successo!');
      }
      
      await loadUsers();
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Errore durante l\'operazione');
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      displayName: user.displayName || '',
      role: user.role
    });
    setShowForm(true);
  };

  const handleDelete = async (uid: string) => {
    if (uid === userData?.uid) {
      alert('Non puoi eliminare il tuo account!');
      return;
    }

    if (window.confirm('Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.')) {
      try {
        await deleteUserData(uid);
        alert('Utente eliminato con successo!');
        await loadUsers();
      } catch (error) {
        alert('Errore durante l\'eliminazione dell\'utente');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      displayName: '',
      role: 'viewer'
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'editor':
        return <UserCheck className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Viewer';
    }
  };

  // Solo Admin può accedere a questa pagina
  if (userData?.role !== 'admin') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Accesso Negato</h2>
        <p className="text-gray-600">Solo gli amministratori possono accedere a questa pagina.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestione Utenti</h1>
          <p className="text-gray-600">Gestisci gli utenti e i loro ruoli</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          <span>Nuovo Utente</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingUser ? 'Modifica Ruolo Utente' : 'Nuovo Utente'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                />
              </div>
              
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Minimo 6 caratteri"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Visualizzato
                </label>
                <input
                  type="text"
                  disabled={!!editingUser}
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ruolo *
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="viewer">Viewer - Solo visualizzazione</option>
                  <option value="editor">Editor - Può modificare dati</option>
                  <option value="admin">Admin - Accesso completo</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
              >
                {editingUser ? 'Aggiorna Ruolo' : 'Crea Utente'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Creazione
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName || 'Utente'}
                        </div>
                        {user.uid === userData?.uid && (
                          <span className="text-xs text-emerald-600">(Tu)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span>{getRoleLabel(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-emerald-600 hover:text-emerald-900 mr-3"
                      disabled={user.uid === userData?.uid}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.uid)}
                      className="text-red-600 hover:text-red-900"
                      disabled={user.uid === userData?.uid}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
