import { useState } from 'react';
import { Plus, Edit, AlertTriangle, Search, X } from 'lucide-react';

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
  minStock: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Jamón Cocido', brand: 'Paladini', category: 'Fiambres', pricePerKg: 8500, wholesalePrice: 7500, wholesaleMinQty: 1, unit: 'kg', stock: 15, minStock: 5 },
  { id: '2', name: 'Queso Provolone', brand: 'La Paulina', category: 'Quesos', pricePerKg: 12000, wholesalePrice: 10500, wholesaleMinQty: 1, unit: 'kg', stock: 8, minStock: 10 },
  { id: '3', name: 'Aceitunas Verdes', brand: 'Nucete', category: 'Conservas', pricePerUnit: 2500, unit: 'unidad', stock: 24, minStock: 12 },
];

export function StockView() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Gestión de Stock</h2>
            <p className="text-sm text-gray-400">Control de inventario JPCFIX</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium text-red-500">Stock Bajo Detectado</p>
              <p className="text-sm text-red-400/80 mt-1">
                Hay {lowStockProducts.length} productos por debajo del límite.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o marca..."
              className="w-full pl-10 pr-4 py-2 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-[#0f0f0f] border-2 border-[#2a2a2a] rounded-lg text-white outline-none focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-[#0f0f0f]">
                {cat === 'all' ? 'Todas las categorías' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1f1f1f]">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase">Producto</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-right">Precio Minorista</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-right">Precio Mayorista</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-right">Stock</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-center">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStock;
                const retailPrice = product.unit === 'kg' ? product.pricePerKg : product.pricePerUnit;

                return (
                  <tr key={product.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand} • {product.category}</div>
                    </td>
                    <td className="p-4 text-right text-white font-mono">
                      ${retailPrice?.toLocaleString()}<span className="text-xs text-gray-500 ml-1">/{product.unit === 'kg' ? 'kg' : 'u'}</span>
                    </td>
                    <td className="p-4 text-right">
                      {product.wholesalePrice ? (
                        <div className="text-green-400 font-mono">
                          ${product.wholesalePrice.toLocaleString()}
                          <div className="text-[10px] text-gray-500">Min. {product.wholesaleMinQty}u</div>
                        </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className={`font-bold ${isLowStock ? 'text-red-500' : 'text-blue-400'}`}>
                        {product.stock} <span className="text-xs font-normal opacity-70">{product.unit === 'kg' ? 'kg' : 'un'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${isLowStock ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        {isLowStock ? 'BAJO' : 'OK'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 text-gray-500 hover:text-white hover:bg-[#2a2a2a] rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAddProduct} />}
    </div>
  );
}

function AddProductModal({ onClose, onAdd }: { onClose: () => void, onAdd: (p: Product) => void }) {
  const [unit, setUnit] = useState<'unidad' | 'kg'>('kg');
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'Fiambres', price: '', wholesalePrice: '', wholesaleMinQty: '', stock: '', minStock: '5'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isUnit = unit === 'unidad';
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      unit: unit,
      stock: Number(formData.stock),
      minStock: Number(formData.minStock),
      ...(unit === 'kg' ? { pricePerKg: Number(formData.price) } : { pricePerUnit: Number(formData.price) }),
      wholesalePrice: isUnit && formData.wholesalePrice ? Number(formData.wholesalePrice) : undefined,
      wholesaleMinQty: isUnit && formData.wholesaleMinQty ? Number(formData.wholesaleMinQty) : undefined,
    };
    onAdd(newProduct);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-8 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 text-white">
          <h3 className="text-xl font-bold">Nuevo Producto</h3>
          <X className="w-6 h-6 cursor-pointer" onClick={onClose} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre</label>
            <input required type="text" className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-blue-600" onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Marca</label>
            <input required type="text" className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-blue-600" onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Unidad de Venta</label>
          <div className="flex p-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl">
            <button type="button" onClick={() => setUnit('kg')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${unit === 'kg' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Peso (Kg)</button>
            <button type="button" onClick={() => setUnit('unidad')} className={`flex-1 py-2 text-sm font-bold rounded-lg ${unit === 'unidad' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Unidad</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Precio {unit === 'kg' ? 'x Kg' : 'Unitario'}</label>
            <input required type="number" className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-blue-600" onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock ({unit})</label>
            <input required type="number" className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none focus:border-blue-600" onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
        </div>

        {/* Sección Mayorista Condicional */}
        {unit === 'unidad' ? (
          <div className="bg-blue-600/5 border border-blue-600/20 rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-top-2">
            <h4 className="text-sm font-bold text-blue-400 mb-4">Configuración Mayorista</h4>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Precio Mayorista" className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none" onChange={e => setFormData({...formData, wholesalePrice: e.target.value})} />
              <input type="number" placeholder="Cant. Mínima" className="px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white outline-none" onChange={e => setFormData({...formData, wholesaleMinQty: e.target.value})} />
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 border border-dashed border-gray-800 rounded-2xl text-center text-xs text-gray-600">
            Mayorista disponible solo para venta por unidad.
          </div>
        )}

        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 border border-[#2a2a2a] rounded-xl text-gray-400 hover:text-white">Cancelar</button>
          <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Guardar</button>
        </div>
      </form>
    </div>
  );
}