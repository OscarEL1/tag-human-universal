import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// Importaciones de Pantallas
import LoginScreen from './pages/login/LoginScreen';
import RegisterStep1 from './pages/register/RegisterStep1';
import RegisterStep2 from './pages/register/RegisterStep2';
import GuardScanner from './pages/guard/GuardScanner';
import GuardValidation from './pages/guard/GuardValidation';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard'; // <--- Nueva Importación
import Error404 from './pages/errors/Error404';

function AppContent() {
  const navigate = useNavigate();

  // ESTADO DINÁMICO: Registro de conductor y datos de sesión
  const [userData, setUserData] = useState({
    nombre: '',
    plates: '',
    role: 'driver', // Por defecto para el registro público
    zoneId: null
  });

  const [scannedDriver, setScannedDriver] = useState(null);

  const handleRegisterStep1 = (data) => {
    setUserData({ ...userData, ...data });
    navigate('/register/step2');
  };

  const handleFinishRegister = () => {
    navigate('/app/qr');
  };

  const handleScanResult = (result) => {
    setScannedDriver(result);
    navigate('/guard/validate');
  };

  const handleLogout = () => {
    setUserData({ nombre: '', plates: '', role: 'driver', zoneId: null });
    navigate('/');
  };

  return (
    <Routes>
      {/* 1. Login Centralizado: Redirige según rol */}
      <Route path="/" element={
        <LoginScreen onNavigateToRegister={() => navigate('/register')} />
      } />

      {/* 2. Registro Público: Solo para Drivers */}
      <Route path="/register" element={
        <RegisterStep1
          onNext={handleRegisterStep1}
          onBack={() => navigate('/')}
          initialData={userData}
        />
      } />

      <Route path="/register/step2" element={
        <RegisterStep2
          onBack={() => navigate('/register')}
          onFinish={handleFinishRegister}
        />
      } />

      {/* 3. Panel de Administrador (Nuevo) */}
      <Route path="/admin/dashboard" element={
        <AdminDashboard onLogout={handleLogout} />
      } />

      {/* 4. Vistas de Usuario / Repartidor */}
      <Route path="/app/qr" element={
        <DriverDashboard
          licensePlate={userData.plates || "ABC-1234"}
          driverName={userData.nombre || "Usuario"}
          onLogout={handleLogout}
        />
      } />

      {/* 5. Vistas de Seguridad / Guardia */}
      <Route path="/guard/scanner" element={
        <GuardScanner onScanResult={handleScanResult} /> 
      } />

      <Route path="/guard/validate" element={
        <GuardValidation 
          driverData={scannedDriver || {}} 
          onAuthorize={(house) => {
            alert(`Acceso registrado: Casa ${house}`);
            navigate('/guard/scanner');
          }}
          onReject={() => navigate('/guard/scanner')}
          onBack={() => navigate('/guard/scanner')}
        />
      } />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1A1A1A]">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}