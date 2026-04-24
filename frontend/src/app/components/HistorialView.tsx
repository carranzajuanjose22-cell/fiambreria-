import { useState } from 'react';
import { Search, Calendar, Filter, CheckCircle, XCircle } from 'lucide-react';

interface Sale {
  id: string;
  date: Date;
  total: number;
  items: number;
  paymentMethod: string;
  status: 'completado' | 'cancelado';
}

const mockSales: Sale[] = [
  { id: 'V001', date: new Date(2026, 3, 24, 14, 30), total: 28450, items: 5, paymentMethod: 'Efectivo', status: 'completado' },
  { id: 'V002', date: new Date(2026, 3, 24, 13, 15), total: 15200, items: 3, paymentMethod: 'Transferencia', status: 'completado' },
  { id: 'V003', date: new Date(2026, 3, 24, 12, 0), total: 42100, items: 8, paymentMethod: 'Transferencia', status: 'completado' },
  { id: 'V004', date: new Date(2026, 3, 24, 11, 45), total: 8300, items: 2, paymentMethod: 'Efectivo', status: 'cancelado' },
  { id: 'V005', date: new Date(2026, 3, 23, 16, 20), total: 65400, items: 12, paymentMethod: 'Transferencia', status: 'completado' },
  { id: 'V006', date: new Date(2026, 3, 23, 15, 10), total: 19800, items: 4, paymentMethod: 'Efectivo', status: 'completado' },
  { id: 'V007', date: new Date(2026, 3, 23, 14, 0), total: 31200, items: 6, paymentMethod: 'Efectivo', status: 'completado' },
];

export function HistorialView() {
  const [sales] = useState<Sale[]>(mockSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completado' | 'cancelado'>('all');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filteredSales
    .filter(s => s.status === 'completado')
    .reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a]">
      <div className="p-6 border-b border-[#2a2a2a]">
        <h2 className="text-white">Historial de Ventas</h2>
        <p className="text-sm text-white">Registro completo de operaciones</p>
      </div>

      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID de venta..."
              className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button className="px-4 py-2 border-2 border-[#2a2a2a] rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2 text-white">
            <Calendar className="w-4 h-4" />
            Filtrar por fecha
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="completado">Completados</option>
            <option value="cancelado">Cancelados</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-white mb-1">Total de Ventas</p>
            <p className="text-2xl text-white">{filteredSales.length}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-white mb-1">Ingresos Totales</p>
            <p className="text-2xl text-green-400">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-white mb-1">Ticket Promedio</p>
            <p className="text-2xl text-white">
              ${filteredSales.length > 0
                ? Math.round(totalRevenue / filteredSales.filter(s => s.status === 'completado').length).toLocaleString()
                : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#2a2a2a]">
              <tr>
                <th className="text-left p-4 text-sm text-white">ID Venta</th>
                <th className="text-left p-4 text-sm text-white">Fecha y Hora</th>
                <th className="text-right p-4 text-sm text-white">Items</th>
                <th className="text-left p-4 text-sm text-white">Método de Pago</th>
                <th className="text-right p-4 text-sm text-white">Total</th>
                <th className="text-center p-4 text-sm text-white">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t border-[#2a2a2a] hover:bg-[#1a1a1a]/50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono font-medium text-white">{sale.id}</span>
                  </td>
                  <td className="p-4 text-white">
                    {sale.date.toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} - {sale.date.toLocaleTimeString('es-AR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <span className="px-2 py-1 bg-[#2a2a2a] rounded text-sm text-white">{sale.items}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-[#2a2a2a] rounded text-xs text-white">{sale.paymentMethod}</span>
                  </td>
                  <td className="p-4 text-right font-medium text-white">
                    ${sale.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 text-center">
                    {sale.status === 'completado' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Completado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600/20 text-red-400 rounded-full text-xs">
                        <XCircle className="w-3 h-3" />
                        Cancelado
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
