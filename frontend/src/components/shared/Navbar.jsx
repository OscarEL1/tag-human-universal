import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav aria-label="Navegación principal" className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold uppercase tracking-wider">
          Tag Human Universal
        </Link>
        <div className="space-x-4">
          <Link
            to="/"
            aria-current={location.pathname === '/' ? 'page' : undefined}
            className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >Inicio</Link>
          <Link
            to="/register"
            aria-current={location.pathname === '/register' ? 'page' : undefined}
            className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >Registro</Link>
          <Link
            to="/acceso"
            aria-current={location.pathname === '/acceso' ? 'page' : undefined}
            className="hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
          >Acceso</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;