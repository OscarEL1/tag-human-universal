import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold uppercase tracking-wider">
          Tag Human Universal
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-400 transition-colors">Inicio</Link>
          <Link to="/register" className="hover:text-blue-400 transition-colors">Registro</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;