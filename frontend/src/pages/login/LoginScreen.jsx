import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();

  //esto es solo para simular el error 500 se quitara cuando se empiece a crear el login correctamente 
  const handleSimulateError = () => {
    const response = { status: 500 }; 
    if (response.status === 500) {
      navigate('/error-500'); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-2xl font-bold mb-4">Pantalla de Login (En construcción)</h1>
      <button 
        onClick={handleSimulateError}
        className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition-colors"
      >
        Simular Error 500
      </button>
    </div>
  );
};

export default LoginScreen; 