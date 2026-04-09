import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

// Importaciones de Pantallas
import LoginScreen from './pages/login/LoginScreen';
import RegisterStep1 from './pages/register/RegisterStep1';
import RegisterStep2 from './pages/register/RegisterStep2';
import GuardScanner from './pages/guard/GuardScanner';
import GuardValidation from './pages/guard/GuardValidation';
import DriverDashboard from './pages/driver/DriverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Error404 from './pages/errors/Error404';
import DecisionAcceso from './pages/acceso/DecisionAcceso';
import Navbar from './components/shared/Navbar';
import RecoverPasswordScreen from './pages/auth/RecoverPasswordScreen';
import ResetPasswordScreen from './pages/auth/ResetPasswordScreen';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Error500 from './pages/errors/Error500';
import ErrorOffline from './pages/errors/ErrorOffline';
import PWAInstallPrompt from './components/shared/PWAInstallPrompt';

// COMPONENTE GUARDÍAN: Control de acceso por roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

function AppContent() {
  const navigate = useNavigate();

  // Redirigir a /offline si no hay conexión al montar o al perderla
  useEffect(() => {
    if (!navigator.onLine) navigate('/offline');

    const handleOffline = () => navigate('/offline');
    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [navigate]);

  const [userData, setUserData] = useState({
    nombre: '',
    phone: '',
    password: '',
    plates: '',
    role: 'driver'
  });

  const [scannedDriver, setScannedDriver] = useState(null);

  const handleRegisterStep1 = (data) => {
    // Actualizamos el estado con los datos del formulario (nombre, phone, password, plates)
    setUserData((prev) => ({ ...prev, ...data }));
    navigate('/register/step2');
  };

  const handleLogout = () => {
    localStorage.clear(); // Limpiamos token y sesión
    setUserData({ nombre: '', phone: '', password: '', plates: '', role: 'driver' });
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<LoginScreen onNavigateToRegister={() => navigate('/register')} />} />

      {/* Ruta temporal: Decisión de Acceso (repartidor/placas/autorizar) */}
      <Route path="/acceso" element={<DecisionAcceso />} />

      {/* FLUJO DE REGISTRO ASÍNCRONO */}
      <Route path="/register" element={
        <RegisterStep1 onNext={handleRegisterStep1} onBack={() => navigate('/')} initialData={userData} />
      } />

      <Route path="/register/step2" element={
        <RegisterStep2 
          userData={userData} // <--- ¡ESTO FALTABA! Ahora el Step 2 tiene los datos para el fetch
          onBack={() => navigate('/register')} 
          onFinish={() => navigate('/app/qr')} 
        />
      } />

      {/* PANELES PROTEGIDOS */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      } />

      {/* Redirección /admin -> /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/app/qr" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <DriverDashboard onLogout={handleLogout} />
        </ProtectedRoute>
      } />

      {/* VISTAS DE GUARDIA */}
      <Route path="/guard/scanner" element={
        <ProtectedRoute allowedRoles={['guard', 'admin']}>
          <GuardScanner onScanResult={(res) => { setScannedDriver(res); navigate('/guard/validate'); }} />
        </ProtectedRoute>
      } />

      <Route path="/guard/validate" element={
        <ProtectedRoute allowedRoles={['guard', 'admin']}>
          <GuardValidation 
            driverData={scannedDriver || {}} 
            onAuthorize={() => navigate('/guard/scanner')}
            onReject={() => navigate('/guard/scanner')}
            onBack={() => navigate('/guard/scanner')}
          />
        </ProtectedRoute>
      } />

      {/* Recuperación de contraseña (no protegido) */}
      <Route path="/recover-password" element={<RecoverPasswordScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />

      {/* Pantallas de error */}
      <Route path="/500" element={<Error500 />} />
      <Route path="/offline" element={<ErrorOffline />} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-[#1A1A1A]">
            <Navbar />
            <AppContent />
            <PWAInstallPrompt />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}