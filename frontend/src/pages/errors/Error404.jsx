import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/shared/PageTransition';

const Error404 = () => {
  return (
    <PageTransition>
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8" aria-live="polite">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 outline-none transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
    </PageTransition>
  );
};

export default Error404;