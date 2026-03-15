import React from 'react';

const Alert = ({ message, type = 'error' }) => {
  if (!message) return null;

  return (
    <div 
      role="alert" 
      // Assertive para errores críticos (interrumpe inmediatamente)
      aria-live={type === 'error' ? 'assertive' : 'polite'} 
      aria-atomic="true"
      className={`p-4 mb-6 rounded-lg flex items-start gap-3 border-l-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
        type === 'error' 
          ? 'bg-red-50 text-error-red border-error-red' 
          : 'bg-green-50 text-success-green border-success-green'
      }`}
    >
      <span className="text-xl" aria-hidden="true">
        {type === 'error' ? '⚠️' : '✅'}
      </span>
      <div className="flex flex-col">
        <span className="font-bold text-sm uppercase tracking-wide">
          {type === 'error' ? 'Error detectado' : 'Operación exitosa'}
        </span>
        <span className="text-sm font-medium leading-relaxed">{message}</span>
      </div>
    </div>
  );
};

export default Alert;