import { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, TrendingDown, Printer, Lock, Edit, Check, X } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'venta' | 'gasto';
  description: string;
  amount: number;
  paymentMethod: 'efectivo' | 'transferencia' | 'otro';
  timestamp: Date;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  frequency: 'diario' | 'mensual';
  paid: boolean;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'venta', description: 'Venta #001', amount: 15450, paymentMethod: 'efectivo', timestamp: new Date(2026, 3, 24, 9, 30) },
  { id: '2', type: 'venta', description: 'Venta #002', amount: 28900, paymentMethod: 'transferencia', timestamp: new Date(2026, 3, 24, 10, 15) },
  { id: '3', type: 'gasto', description: 'Compra Proveedor - La Paulina', amount: 45000, paymentMethod: 'transferencia', timestamp: new Date(2026, 3, 24, 11, 0) },
  { id: '4', type: 'venta', description: 'Venta #003', amount: 12300, paymentMethod: 'efectivo', timestamp: new Date(2026, 3, 24, 12, 45) },
];

const mockExpenses: Expense[] = [
  { id: '1', name: 'Alquiler Local', amount: 150000, frequency: 'mensual', paid: true },
  { id: '2', name: 'Luz', amount: 25000, frequency: 'mensual', paid: false },
  { id: '3', name: 'Internet', amount: 12000, frequency: 'mensual', paid: true },
  { id: '4', name: 'Limpieza', amount: 3500, frequency: 'diario', paid: true },
];

export function CajaView() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [showCloseModal, setShowCloseModal] = useState(false);
  
  // Estados para la edición de gastos
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const totalSales = transactions
    .filter(t => t.type === 'venta')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'gasto')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashSales = transactions
    .filter(t => t.type === 'venta' && t.paymentMethod === 'efectivo')
    .reduce((sum, t) => sum + t.amount, 0);

  const transferSales = transactions
    .filter(t => t.type === 'venta' && t.paymentMethod === 'transferencia')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalSales - totalExpenses;
  const pendingExpenses = expenses.filter(e => !e.paid);

  // Funciones para editar gastos
  const startEditing = (expense: Expense) => {
    setEditingId(expense.id);
    setEditValue(expense.amount.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveExpense = (id: string) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id ? { ...exp, amount: Number(editValue) } : exp
    ));
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-white text-2xl font-bold">Control de Caja</h2>
            <p className="text-sm text-gray-400 font-medium">Viernes, 24 de Abril 2026</p>
          </div>
          <button
            onClick={() => setShowCloseModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Lock className="w-4 h-4" />
            Cierre del Día
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ingresos Totales</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-white">${totalSales.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{transactions.filter(t => t.type === 'venta').length} ventas hoy</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Efectivo</span>
              <DollarSign className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-white">${cashSales.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Dinero físico</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transferencias</span>
              <CreditCard className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-white">${transferSales.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Mercado Pago / Bancos</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Balance Neto</span>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netBalance.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Caja actual</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Transactions History */}
          <div className="col-span-2">
            <h3 className="mb-4 text-lg font-bold text-white">Historial de Operaciones</h3>
            <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-[#1f1f1f]">
                  <tr>
                    <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Hora</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Descripción</th>
                    <th className="text-left p-4 text-xs font-bold text-gray-400 uppercase">Método</th>
                    <th className="text-right p-4 text-xs font-bold text-gray-400 uppercase">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-4 text-sm text-gray-300 font-mono">
                        {transaction.timestamp.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-white font-medium">{transaction.description}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-[#2a2a2a] rounded text-[10px] font-bold uppercase text-gray-300">
                          {transaction.paymentMethod}
                        </span>
                      </td>
                      <td className={`p-4 text-right font-mono font-bold ${
                        transaction.type === 'venta' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {transaction.type === 'venta' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fixed Expenses Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Gastos Fijos</h3>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 transition-all hover:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-white">{expense.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{expense.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {expense.paid ? (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded text-[10px] font-bold">PAGADO</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold">PENDIENTE</span>
                      )}
                      
                      {/* Lógica de edición */}
                      {editingId === expense.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => saveExpense(expense.id)} className="p-1.5 bg-green-600 rounded text-white"><Check className="w-3 h-3" /></button>
                          <button onClick={cancelEditing} className="p-1.5 bg-gray-700 rounded text-white"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => startEditing(expense)}
                          className="p-1.5 hover:bg-[#2a2a2a] rounded text-gray-500 hover:text-white transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    {editingId === expense.id ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input
                          type="number"
                          className="w-full bg-[#0a0a0a] border border-blue-600 rounded-lg py-1.5 pl-7 pr-3 text-white font-mono outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <p className="text-xl font-bold text-white font-mono">${expense.amount.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}

              {pendingExpenses.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-red-500 uppercase">Total Pendiente</p>
                    <p className="text-lg font-bold text-red-500 font-mono">
                      ${pendingExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCloseModal && (
        <CloseDayModal
          totalSales={totalSales}
          cashSales={cashSales}
          transferSales={transferSales}
          totalExpenses={totalExpenses}
          netBalance={netBalance}
          transactionCount={transactions.filter(t => t.type === 'venta').length}
          onClose={() => setShowCloseModal(false)}
        />
      )}
    </div>
  );
}

// Modal de Cierre se mantiene igual, pero con los colores ajustados al Dark Mode
function CloseDayModal({ totalSales, cashSales, transferSales, totalExpenses, netBalance, transactionCount, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h3 className="text-2xl font-bold text-white mb-6">Cierre del Día</h3>

        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#2a2a2a]">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Ventas ({transactionCount})</p>
              <p className="text-xl font-bold text-white font-mono">${totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#2a2a2a]">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Efectivo en Caja</p>
              <p className="text-xl font-bold text-green-500 font-mono">${cashSales.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#2a2a2a]">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Gastos Operativos</p>
            <p className="text-xl font-bold text-red-500 font-mono">-${totalExpenses.toLocaleString()}</p>
          </div>

          <div className="bg-blue-600/10 border-2 border-blue-600 p-5 rounded-xl">
            <p className="text-xs font-bold text-blue-400 uppercase mb-1">Balance Final Neto</p>
            <p className={`text-3xl font-bold font-mono ${netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${netBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-400 border border-[#2a2a2a] rounded-xl hover:bg-[#1a1a1a] transition-all">Cancelar</button>
          <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}