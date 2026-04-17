import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Tag, 
  Database, 
  AlertCircle,
  X,
  Boxes,
  MoreVertical
} from 'lucide-react';
import { API } from '../lib/api';
import { cn } from '../lib/utils';

export default function Inventory() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', sku: '', stock: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    API.getProducts().then(setProducts).catch(console.error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await API.addProduct({
        ...newProduct,
        price: parseInt(newProduct.price) || 0,
        stock: parseInt(newProduct.stock) || 0
      });

      if (response.error) {
        alert(`Gagal menambah produk: ${response.error}`);
      } else {
        setNewProduct({ name: '', description: '', price: '', sku: '', stock: '' });
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Terjadi kesalahan jaringan atau server Gagal total.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => 
    (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Katalog Produk & Layanan</h2>
          <p className="text-xs text-slate-400 font-medium italic">Atur inventaris dan paket layanan bisnis anda di satu tempat.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-all font-serif italic"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item</span>
        </button>
      </div>

      <div className="relative group max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
        <input 
          type="text" 
          placeholder="Cari produk berdasarkan nama atau SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all text-xs font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4.5 flex flex-col justify-between hover:border-slate-300 transition-all group relative">
            <button className="absolute top-2 right-2 p-2.5 text-slate-300 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div>
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:border-slate-900 transition-colors">
                <Package className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight truncate">{product.name}</h4>
              <p className="text-slate-400 text-[10px] mb-3 line-clamp-2 italic leading-relaxed">{product.description || 'Tidak ada deskripsi.'}</p>
              
              <div className="flex items-center gap-1.5 mb-4">
                <Tag className="w-3 h-3 text-slate-300" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.sku || 'NO-SKU'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Harga</p>
                <p className="text-sm font-bold text-slate-900 font-mono">Rp{product.price.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Stok</p>
                <div className="flex items-center gap-1 justify-end">
                  <span className={cn(
                    "font-bold text-xs font-mono",
                    product.stock < 10 ? "text-rose-500" : "text-slate-900"
                  )}>
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>
            {product.stock < 5 && (
              <div className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white p-1 rounded-lg shadow-lg animate-bounce">
                <AlertCircle className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto grayscale opacity-50">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <Database className="w-10 h-10 text-slate-400" />
           </div>
           <h3 className="text-xl font-bold text-slate-900">Belum ada produk</h3>
           <p className="text-slate-500">Mulai dengan menambahkan produk pertama anda ke dalam katalog Artha CRM.</p>
        </div>
      )}

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden transform scale-100 animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight italic font-serif">Tambah Item Katalog</h3>
                <p className="text-sm text-slate-500 mt-1">Lengkapi detail produk atau jasa di bawah ini.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono pl-1">Nama Produk / Layanan</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.name}
                  placeholder="Misal: Paket Jasa Desain Branding..."
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-900"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono pl-1">Deskripsi Singkat</label>
                <textarea 
                  value={newProduct.description}
                  placeholder="Ceritakan sedikit tentang item ini..."
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono pl-1">Harga (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                    <input 
                      required
                      type="number" 
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-black text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono pl-1">SKU / Kode</label>
                  <input 
                    type="text" 
                    placeholder="PRD-001"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 font-mono pl-1">Stok Awal</label>
                <input 
                  type="number" 
                  value={newProduct.stock}
                  onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-900"
                />
              </div>

              <div className="pt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-5 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all italic font-serif"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex-[2] px-4 py-5 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
