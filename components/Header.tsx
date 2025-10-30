
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <header className="bg-white shadow-sm p-4 lg:hidden">
      <h2 className="text-xl font-semibold text-brand-green">{currentView}</h2>
    </header>
  );
};

export default Header;
