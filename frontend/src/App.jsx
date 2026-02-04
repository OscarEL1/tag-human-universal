import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importación de Páginas (Asegúrate de crearlas en las carpetas correspondientes)
import LoginScreen from './pages/login/LoginScreen';
import RegisterStep1 from './pages/register/RegisterStep1';
import DriverDashboard from './pages/driver/DriverDashboard';
import GuardScanner from './pages/guard/GuardScanner';

// Importación de Componentes de Error y Navegación
import Error404 from './pages/errors/Error404';
import Error500 from './pages/errors/Error500';
import Navbar from './components/shared/Navbar';
import Breadcrumbs from './components/shared/Breadcrumbs';

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar y Breadcrumbs aparecen en todas las páginas para dar contexto */}
      <Navbar />
      <div className="container mx-auto px-4">
        <Breadcrumbs />
        
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterStep1 />} />

          {/* Rutas Privadas (Ejemplos) */}
          <Route path="/app/qr" element={<DriverDashboard />} />
          <Route path="/guard/scanner" element={<GuardScanner />} />
          <Route path="/error-500" element={<Error500 />} />

          {/* Manejo de Error 404 - Siempre al final */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;