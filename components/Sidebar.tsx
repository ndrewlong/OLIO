
import React from 'react';
import { View, User, UserRole } from '../types';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  currentUser: User;
}

const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2C8.13,2,5,5.13,5,9c0,5.25,7,13,7,13s7-7.75,7-13C19,5.13,15.87,2,12,2z"/>
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, currentUser }) => {
  const navItems = Object.values(View).filter(
    view => view !== View.Settings || currentUser.role === UserRole.Admin
  );

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const NavLink: React.FC<{ view: View }> = ({ view }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full text-left px-4 py-3 my-1 rounded-lg transition-all duration-200 flex items-center ${
          isActive
            ? 'bg-brand-gold text-white shadow-md'
            : 'text-gray-100 hover:bg-brand-green-light hover:text-white'
        }`}
      >
        <span className="font-medium">{view}</span>
      </button>
    );
  };

  const sidebarContent = (
    <>
      <div className="px-6 py-8 text-center">
        <div className="flex items-center justify-center space-x-3">
            <LogoIcon className="w-10 h-10 text-brand-gold"/>
            <h1 className="text-xl font-bold text-white tracking-wider">Olio della Contrada</h1>
        </div>
      </div>
      <nav className="flex-1 px-4">
        {navItems.map((view) => (
          <NavLink key={view} view={view} />
        ))}
      </nav>
      <div className="p-4 border-t border-brand-green-light">
         <div className="flex items-center space-x-3 mb-4">
            <div className="flex-shrink-0 p-2 bg-brand-gold rounded-full">
                <UserIcon className="w-5 h-5 text-white"/>
            </div>
            <div>
                <p className="font-semibold text-white capitalize">{currentUser.username}</p>
                <p className="text-xs text-gray-300">{currentUser.role}</p>
            </div>
        </div>
         <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-gray-100 hover:bg-brand-green-light hover:text-white transition-colors duration-200"
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
      </div>
      <div className="p-4 text-center text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Olio della Contrada</p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brand-green rounded-full text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
          <div 
              className="lg:hidden fixed inset-0 bg-black opacity-50 z-40" 
              onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      {/* Sidebar for Mobile */}
      <div className={`fixed lg:hidden inset-y-0 left-0 w-64 bg-brand-green shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

       {/* Sidebar for Desktop */}
       <div className="hidden lg:flex w-64 bg-brand-green shadow-xl flex-col">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
