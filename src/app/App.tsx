import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { POSView } from './components/POSView';
import { StockView } from './components/StockView';
import { CajaView } from './components/CajaView';
import { HistorialView } from './components/HistorialView';

export default function App() {
  const [activeView, setActiveView] = useState('pos');

  const renderView = () => {
    switch (activeView) {
      case 'pos':
        return <POSView />;
      case 'stock':
        return <StockView />;
      case 'caja':
        return <CajaView />;
      case 'historial':
        return <HistorialView />;
      default:
        return <POSView />;
    }
  };

  return (
    <div className="size-full flex dark">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      {renderView()}
    </div>
  );
}