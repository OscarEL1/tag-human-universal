import React from 'react';

const Alert = ({ message, type = 'error' }) => {
  if (!message) return null;

  return (
    <div 
      role="alert" 
      // Si es error, interrumpe al lector de pantalla. Si es éxito, espera a que termine.
      aria-live={type === 'error' ? 'assertive' : 'polite'} 
      aria-atomic="true"
      className={`p-4 mb-4 rounded-lg flex items-center gap-3 ${
        type === 'error' 
          ? 'bg-red-50 text-red-800 border-l-4 border-red-600' 
          : 'bg-green-50 text-green-800 border-l-4 border-green-600'
      }`}
    >
      <span className="font-medium">
        {type === 'error' ? '⚠️ Error:' : '✅ Éxito:'}
      </span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;