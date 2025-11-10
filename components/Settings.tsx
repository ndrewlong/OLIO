import React, { useState, useEffect } from 'react';
import { Building2, Shield, Save, Settings as SettingsIcon, Plus, X, Palette } from 'lucide-react';
import { useBranding } from '../contexts/BrandingContext';
import { 
  getSettings, 
  updateCompanySettings, 
  updateConfigurations,
  updateBranding,
  type CompanySettings,
  type Configurations,
  type BrandingSettings
} from '../services/settingsService';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'branding' | 'configurations' | 'security'>('company');
  const { refreshBranding } = useBranding();
  
  const [companyData, setCompanyData] = useState<CompanySettings>({
    name: '',
    email: '',
    phone: '',
    address: '',
    vatNumber: '',
    website: ''
  });

  const [brandingData, setBrandingData] = useState<BrandingSettings>({
    appName: '',
    appInitials: '',
    tagline: '',
    primaryColor: '',
    secondaryColor: ''
  });

  const [configurationsData, setConfigurationsData] = useState<Configurations>({
    productCategories: [],
    productUnits: [],
    paymentMethods: []
  });

  const [newCategory, setNewCategory] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getSettings();
      setCompanyData(settings.company);
      setBrandingData(settings.branding);
      setConfigurationsData(settings.configurations);
    } catch (error) {
      console.error('Errore caricamento impostazioni:', error);
      alert('Errore nel caricamento delle impostazioni');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateCompanySettings(companyData);
      alert('Impostazioni azienda salvate con successo!');
    } catch (error) {
      console.error('Errore salvataggio impostazioni azienda:', error);
      alert('Errore nel salvataggio delle impostazioni');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateBranding(brandingData);
      await refreshBranding();
      alert('Branding aggiornato con successo! Ricarica la pagina per vedere tutte le modifiche.');
    } catch (error) {
      console.error('Errore salvataggio branding:', error);
      alert('Errore nel salvataggio del branding');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveConfigurations = async () => {
    try {
      setSaving(true);
      await updateConfigurations(configurationsData);
      alert('Configurazioni salvate con successo!');
    } catch (error) {
      console.error('Errore salvataggio configurazioni:', error);
      alert('Errore nel salvataggio delle configurazioni');
    } finally {
      setSaving(false);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !configurationsData.productCategories.includes(newCategory.trim())) {
      setConfigurationsData({
        ...configurationsData,
        productCategories: [...configurationsData.productCategories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setConfigurationsData({
      ...configurationsData,
      productCategories: configurationsData.productCategories.filter(c => c !== category)
    });
  };

  const addUnit = () => {
    if (newUnit.trim() && !configurationsData.productUnits.includes(newUnit.trim())) {
      setConfigurationsData({
        ...configurationsData,
        productUnits: [...configurationsData.productUnits, newUnit.trim()]
      });
      setNewUnit('');
    }
  };

  const removeUnit = (unit: string) => {
    setConfigurationsData({
      ...configurationsData,
      productUnits: configurationsData.productUnits.filter(u => u !== unit)
    });
  };

  const addPaymentMethod = () => {
    if (newPaymentMethod.trim() && !configurationsData.paymentMethods.includes(newPaymentMethod.trim())) {
      setConfigurationsData({
        ...configurationsData,
        paymentMethods: [...configurationsData.paymentMethods, newPaymentMethod.trim()]
      });
      setNewPaymentMethod('');
    }
  };

  const removePaymentMethod = (method: string) => {
    setConfigurationsData({
      ...configurationsData,
      paymentMethods: configurationsData.paymentMethods.filter(m => m !== method)
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Le password non coincidono!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('La password deve essere di almeno 8 caratteri!');
      return;
    }
    alert('Funzionalità cambio password non ancora implementata');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const tabs = [
    { id: 'company', label: 'Azienda', icon: <Building2 className="h-5 w-5" /> },
    { id: 'branding', label: 'Branding', icon: <Palette className="h-5 w-5" /> },
    { id: 'configurations', label: 'Configurazioni', icon: <SettingsIcon className="h-5 w-5" /> },
    { id: 'security', label: 'Sicurezza', icon: <Shield className="h-5 w-5" /> }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-600">Gestisci le impostazioni dell'applicazione</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Tab Azienda */}
          {activeTab === 'company' && (
            <form onSubmit={handleSaveCompany} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-emerald-600" />
                  Informazioni Azienda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Azienda *
                    </label>
                    <input
                      type="text"
                      required
                      value={companyData.name}
                      onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partita IVA
                    </label>
                    <input
                      type="text"
                      value={companyData.vatNumber}
                      onChange={(e) => setCompanyData({ ...companyData, vatNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sito Web
                    </label>
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                      placeholder="https://esempio.it"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indirizzo *
                  </label>
                  <textarea
                    required
                    value={companyData.address}
                    onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Salvataggio...' : 'Salva Modifiche'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab Branding */}
          {activeTab === 'branding' && (
            <form onSubmit={handleSaveBranding} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-emerald-600" />
                  Personalizzazione Brand
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Applicazione *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandingData.appName}
                      onChange={(e) => setBrandingData({ ...brandingData, appName: e.target.value })}
                      placeholder="es. OLIO, MyBusiness"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Iniziali/Sigla *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      value={brandingData.appInitials}
                      onChange={(e) => setBrandingData({ ...brandingData, appInitials: e.target.value.toUpperCase() })}
                      placeholder="es. O, MB"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 3 caratteri</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline/Slogan *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandingData.tagline}
                      onChange={(e) => setBrandingData({ ...brandingData, tagline: e.target.value })}
                      placeholder="es. Gestione Business, Il tuo partner"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colore Primario *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        required
                        value={brandingData.primaryColor}
                        onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        value={brandingData.primaryColor}
                        onChange={(e) => setBrandingData({ ...brandingData, primaryColor: e.target.value })}
                        placeholder="#059669"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colore Secondario *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        required
                        value={brandingData.secondaryColor}
                        onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                        className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        value={brandingData.secondaryColor}
                        onChange={(e) => setBrandingData({ ...brandingData, secondaryColor: e.target.value })}
                        placeholder="#10b981"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Anteprima:</strong> Il nome "{brandingData.appName}" e la tagline "{brandingData.tagline}" appariranno nella sidebar. I colori verranno applicati ai pulsanti e agli elementi interattivi.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Salvataggio...' : 'Salva Branding'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab Configurazioni */}
          {activeTab === 'configurations' && (
            <div className="space-y-6">
              {/* Categorie Prodotti */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categorie Prodotti
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    placeholder="Nuova categoria"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Aggiungi</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {configurationsData.productCategories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{category}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Unità di Misura */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Unità di Misura
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addUnit()}
                    placeholder="Nuova unità (es. Lt, Kg)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addUnit}
                    className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Aggiungi</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {configurationsData.productUnits.map((unit) => (
                    <span
                      key={unit}
                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{unit}</span>
                      <button
                        type="button"
                        onClick={() => removeUnit(unit)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Metodi di Pagamento */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Metodi di Pagamento
                </h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPaymentMethod()}
                    placeholder="Nuovo metodo"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addPaymentMethod}
                    className="flex items-center space-x-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Aggiungi</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {configurationsData.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{method}</span>
                      <button
                        type="button"
                        onClick={() => removePaymentMethod(method)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfigurations}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? 'Salvataggio...' : 'Salva Configurazioni'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Sicurezza */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  Cambio Password
                </h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Attuale
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nuova Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimo 8 caratteri
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Conferma Nuova Password
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <Save className="h-5 w-5" />
                  <span>Cambia Password</span>
                </button>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota:</strong> La funzionalità di cambio password sarà implementata in futuro con autenticazione Firebase.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
