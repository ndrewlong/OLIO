
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-brand-green text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-opacity-75 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
