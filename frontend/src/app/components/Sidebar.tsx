import { LogOut, Package, ShoppingCart, Wallet, History } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  role: 'admin' | 'empleado';
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ activeView, onViewChange, role, userName, onLogout }: SidebarProps) {
  const allItems = [
    { id: 'pos', label: 'Venta', icon: ShoppingCart },
    { id: 'stock', label: 'Stock', icon: Package },
    { id: 'caja', label: 'Caja', icon: Wallet },
    { id: 'historial', label: 'Historial', icon: History },
  ];
  const menuItems = role === 'admin' ? allItems : allItems.filter((item) => item.id === 'pos' || item.id === 'stock');

  return (
    <div className="w-64 h-screen bg-[#0f0f0f] border-r-2 border-[#2a2a2a] flex flex-col">
      <div className="p-6 border-b-2 border-[#2a2a2a]">
        <h1 className="text-white text-xl">Fiambrería</h1>
        <p className="text-xs text-white400 mt-1">Sistema de Gestión</p>
        <p className="text-xs text-blue-300 mt-2">{userName} ({role})</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors font-medium ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-white300 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-[#2a2a2a]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white300 hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
