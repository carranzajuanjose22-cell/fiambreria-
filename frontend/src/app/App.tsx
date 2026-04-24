import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { POSView } from './components/POSView';
import { StockView } from './components/StockView';
import { CajaView } from './components/CajaView';
import { HistorialView } from './components/HistorialView';
import { LoginView } from './components/LoginView';
import { loginRequest } from './services/auth';
import type { AuthUser } from './types/auth';

export default function App() {
  const [activeView, setActiveView] = useState('pos');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const renderView = () => {
    if (!user) {
      return null;
    }

    if (user.role === 'empleado') {
      return activeView === 'stock' ? <StockView /> : <POSView operatorName={user.name} />;
    }

    switch (activeView) {
      case 'pos':
        return <POSView operatorName={user.name} />;
      case 'stock':
        return <StockView />;
      case 'caja':
        return <CajaView />;
      case 'historial':
        return <HistorialView />;
      default:
        return <POSView operatorName={user.name} />;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    setAuthToken(data.token);
    setUser(data.user);
    setActiveView('pos');
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    if (token && userData) {
      try {
        setAuthToken(token);
        setUser(JSON.parse(userData));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  if (!authToken || !user) {
    return <LoginView onSubmit={handleLogin} />;
  }

  return (
    <div className="size-full flex dark">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        role={user.role}
        userName={user.name}
        onLogout={handleLogout}
      />
      {renderView()}
    </div>
  );
}