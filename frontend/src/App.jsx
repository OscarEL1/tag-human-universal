import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

// 1. IMPORTACIÓN FALTANTE:
import LoginScreen from './pages/login/LoginScreen';
import RegisterStep1 from './pages/register/RegisterStep1';
import RegisterStep2 from './pages/register/RegisterStep2';
import GuardScanner from './pages/guard/GuardScanner';
import GuardValidation from './pages/guard/GuardValidation'; // <--- Agregamos esta
import DriverDashboard from './pages/driver/DriverDashboard';
import Error404 from './pages/errors/Error404';

function AppContent() {
  const navigate = useNavigate();

  // ESTADO DINÁMICO: Registro de conductor
  const [userData, setUserData] = useState({
    nombre: '',
    plates: '',
    role: 'driver'
  });

  // ESTADO DINÁMICO: Datos del escaneo del guardia
  const [scannedDriver, setScannedDriver] = useState(null);

  const handleRegisterStep1 = (data) => {
    setUserData({ ...userData, ...data });
    navigate('/register/step2');
  };

  const handleFinishRegister = () => {
    navigate('/app/qr');
  };

  // 2. FUNCIÓN DE RESULTADO DEL ESCÁNER:
  const handleScanResult = (result) => {
    setScannedDriver(result); // Guardamos lo que leyó el QR
    navigate('/guard/validate'); // Mandamos al guardia a validar
  };

  return (
    <Routes>
      <Route path="/" element={
        <LoginScreen onNavigateToRegister={() => navigate('/register')} />
      } />

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

      <Route path="/app/qr" element={
        <DriverDashboard
          licensePlate={userData.plates || "ABC-1234"}
          driverName={userData.nombre || "Usuario"}
          onLogout={() => navigate('/')}
        />
      } />

      {/* 3. CORRECCIÓN EN EL SCANNER: */}
      <Route path="/guard/scanner" element={
        <GuardScanner onScanResult={handleScanResult} /> 
      } />

      <Route path="/guard/validate" element={
        <GuardValidation 
          driverData={scannedDriver || {}} 
          onAuthorize={(house) => {
            alert(`Entrada registrada a casa ${house}`);
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