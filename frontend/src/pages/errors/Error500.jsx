import React from 'react';
import { Link } from 'react-router-dom';

const Error500 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-2">Error de Servidor</h2>
      <p className="text-gray-600 mb-8" aria-live="assertive">
        Hubo un problema técnico en nuestro sistema. No te preocupes, tus datos están a salvo. Por favor, intenta recargar la página o vuelve más tarde.
      </p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 outline-none"
        >
          Reintentar
        </button>
        <Link 
          to="/" 
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 outline-none"
        >
          Ir al Inicio
        </Link>
      </div>
    </div>
  );
};

export default Error500;