import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Printer, DollarSign, Smartphone } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  pricePerUnit?: number;
  pricePerKg?: number;
  wholesalePrice?: number;
  wholesaleMinQty?: number;
  unit: 'unidad' | 'kg';
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
  totalPrice: number;
  isWholesale: boolean;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Jamón Cocido', brand: 'Paladini', category: 'Fiambres', pricePerKg: 8500, wholesalePrice: 7500, wholesaleMinQty: 1, unit: 'kg', stock: 15 },
  { id: '2', name: 'Queso Provolone', brand: 'La Paulina', category: 'Quesos', pricePerKg: 12000, wholesalePrice: 10500, wholesaleMinQty: 1, unit: 'kg', stock: 8 },
  { id: '3', name: 'Salame Milán', brand: 'Cattorini', category: 'Embutidos', pricePerKg: 15000, wholesalePrice: 13000, wholesaleMinQty: 1, unit: 'kg', stock: 12 },
  { id: '4', name: 'Aceitunas Verdes', brand: 'Nucete', category: 'Conservas', pricePerUnit: 2500, unit: 'unidad', stock: 24 },
];

interface POSViewProps {
  operatorName?: string;
}

export function POSView({ operatorName = 'Operador' }: POSViewProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [measureType, setMeasureType] = useState<'peso' | 'unidad'>('peso');
  const [weightInput, setWeightInput] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [printTicket, setPrintTicket] = useState(true);

  const addToCart = () => {
    if (!selectedProduct) return;

    const quantity = measureType === 'peso' ? parseFloat(weightInput) / 1000 : 1;
    if (!quantity || quantity <= 0) return;

    const basePrice = selectedProduct.unit === 'kg'
      ? selectedProduct.pricePerKg!
      : selectedProduct.pricePerUnit!;

    const isWholesale = selectedProduct.wholesaleMinQty && quantity >= selectedProduct.wholesaleMinQty;
    const price = isWholesale ? (selectedProduct.wholesalePrice || basePrice) : basePrice;
    const totalPrice = measureType === 'peso' ? price * quantity : price;

    const newItem: CartItem = {
      ...selectedProduct,
      quantity,
      totalPrice,
      isWholesale,
    };

    setCart([...cart, newItem]);
    setWeightInput('');
    setSelectedProduct(null);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a]">
      <div className="p-6 border-b border-[#2a2a2a]">
        <h2 className="text-white">Punto de Venta</h2>
        <p className="text-sm text-white400">Operador: {operatorName}</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Product Selection */}
        <div className="w-96 border-r border-[#2a2a2a] p-4 overflow-y-auto bg-[#0f0f0f]">
          <h3 className="mb-4 text-white">Productos Rápidos</h3>

          <div className="space-y-2">
            {mockProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setMeasureType(product.unit === 'kg' ? 'peso' : 'unidad');
                }}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedProduct?.id === product.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[#2a2a2a] hover:border-gray-600 bg-[#1a1a1a]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-xs text-white400">{product.brand}</p>
                  </div>
                  <span className="text-xs bg-[#2a2a2a] text-white300 px-2 py-1 rounded">{product.category}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-white300">
                    ${(product.pricePerKg || product.pricePerUnit)?.toLocaleString()}/{product.unit === 'kg' ? 'kg' : 'u'}
                  </span>
                  {product.wholesalePrice && (
                    <span className="text-xs text-green-400">Mayor: ${product.wholesalePrice.toLocaleString()}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedProduct && (
            <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border-2 border-[#2a2a2a]">
              <h4 className="mb-3 text-white">Agregar: {selectedProduct.name}</h4>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMeasureType('peso')}
                  className={`flex-1 py-2 rounded-md transition-colors font-medium ${
                    measureType === 'peso'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#2a2a2a] text-white400'
                  }`}
                  disabled={selectedProduct.unit === 'unidad'}
                >
                  Peso (g)
                </button>
                <button
                  onClick={() => setMeasureType('unidad')}
                  className={`flex-1 py-2 rounded-md transition-colors font-medium ${
                    measureType === 'unidad'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#2a2a2a] text-white400'
                  }`}
                >
                  Unidad
                </button>
              </div>

              {measureType === 'peso' && (
                <div className="mb-4">
                  <label className="block text-sm mb-2 text-white300">Cantidad (gramos)</label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="250"
                    className="w-full px-4 py-3 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    autoFocus
                  />
                  {weightInput && (
                    <p className="text-xs text-white400 mt-1">
                      = {(parseFloat(weightInput) / 1000).toFixed(3)} kg
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={addToCart}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Agregar al Carrito
              </button>
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="mb-4 text-white">Carrito de Compra</h3>

            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white500">
                <p>No hay productos en el carrito</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={index} className="p-4 bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-xs text-white400">{item.brand}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white300">
                        {item.unit === 'kg'
                          ? `${(item.quantity * 1000).toFixed(0)}g (${item.quantity.toFixed(3)}kg)`
                          : `${item.quantity} unidad(es)`
                        }
                        {item.isWholesale && (
                          <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">MAYORISTA</span>
                        )}
                      </span>
                      <span className="font-medium text-white">${item.totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total and Actions */}
          <div className="border-t-2 border-[#2a2a2a] p-6 bg-[#0f0f0f]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white">Total</h3>
              <span className="text-3xl text-white font-bold">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printTicket}
                  onChange={(e) => setPrintTicket(e.target.checked)}
                  className="w-4 h-4"
                />
                <Printer className="w-4 h-4 text-white400" />
                <span className="text-sm text-white300">Imprimir ticket</span>
              </label>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              <CreditCard className="w-5 h-5" />
              Procesar Pago
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={total}
          onClose={() => setShowPaymentModal(false)}
          onComplete={() => {
            setCart([]);
            setShowPaymentModal(false);
            if (printTicket) {
              alert('Imprimiendo ticket...');
            }
          }}
        />
      )}
    </div>
  );
}

function PaymentModal({ total, onClose, onComplete }: { total: number; onClose: () => void; onComplete: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<'efectivo' | 'transferencia' | 'combinado'>('efectivo');
  const [cash, setCash] = useState('');
  const [transfer, setTransfer] = useState('');

  const totalPaid = selectedMethod === 'combinado'
    ? (parseFloat(cash) || 0) + (parseFloat(transfer) || 0)
    : selectedMethod === 'efectivo'
      ? (parseFloat(cash) || 0)
      : (parseFloat(transfer) || 0);

  const remaining = total - totalPaid;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl p-6 w-[480px] max-w-full shadow-2xl">
        <h3 className="mb-6 text-white text-xl">Procesar Pago</h3>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-[#2a2a2a]">
            <span className="text-white400 text-lg">Total a pagar:</span>
            <span className="text-3xl text-white font-bold">${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-3 text-white300 font-medium">Método de Pago</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedMethod('efectivo')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'efectivo'
                    ? 'border-green-500 bg-green-500/20 text-green-400'
                    : 'border-[#2a2a2a] bg-[#0f0f0f] text-white400 hover:border-gray-600'
                }`}
              >
                <DollarSign className="w-6 h-6" />
                <span className="text-sm font-medium">Efectivo</span>
              </button>

              <button
                onClick={() => setSelectedMethod('transferencia')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'transferencia'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                    : 'border-[#2a2a2a] bg-[#0f0f0f] text-white400 hover:border-gray-600'
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-sm font-medium">Transfer</span>
              </button>

              <button
                onClick={() => setSelectedMethod('combinado')}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                  selectedMethod === 'combinado'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                    : 'border-[#2a2a2a] bg-[#0f0f0f] text-white400 hover:border-gray-600'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm font-medium">Mixto</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(selectedMethod === 'efectivo' || selectedMethod === 'combinado') && (
              <div>
                <label className="block text-sm mb-2 text-white300 font-medium">Efectivo</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white500 text-lg">$</span>
                  <input
                    type="number"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white text-lg focus:border-green-500 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {(selectedMethod === 'transferencia' || selectedMethod === 'combinado') && (
              <div>
                <label className="block text-sm mb-2 text-white300 font-medium">Transferencia</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white500 text-lg">$</span>
                  <input
                    type="number"
                    value={transfer}
                    onChange={(e) => setTransfer(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white text-lg focus:border-blue-500 focus:outline-none"
                    autoFocus={selectedMethod === 'transferencia'}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={`mt-6 p-4 rounded-lg border-2 ${
            remaining > 0
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : remaining < 0
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-green-500/10 border-green-500/30 text-green-400'
          }`}>
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg">
                {remaining > 0 ? 'Falta:' : remaining < 0 ? 'Vuelto:' : 'Exacto:'}
              </span>
              <span className="font-bold text-2xl">
                ${Math.abs(remaining).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-[#2a2a2a] rounded-lg hover:bg-[#2a2a2a] transition-colors text-white font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onComplete}
            disabled={remaining > 0}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
}
