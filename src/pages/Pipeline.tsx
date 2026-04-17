import React, { useEffect, useState } from 'react';
import { 
  Kanban as KanbanIcon, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  User,
  Filter,
  DollarSign,
  Briefcase,
  X
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import { API } from '../lib/api';
import { cn } from '../lib/utils';

const STAGES = [
  { id: 'prospect', title: 'Prospek', color: 'bg-slate-200' },
  { id: 'negotiation', title: 'Negosiasi', color: 'bg-amber-100' },
  { id: 'contract', title: 'Kontrak', color: 'bg-blue-100' },
  { id: 'closed', title: 'Selesai', color: 'bg-emerald-100' }
];

export default function Pipeline() {
  const [deals, setDeals] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDeal, setNewDeal] = useState({ 
    customer_id: '', 
    title: '', 
    value: '', 
    stage: 'prospect', 
    priority: 'medium' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [dealsData, customersData] = await Promise.all([
      API.getDeals(),
      API.getCustomers()
    ]);
    setDeals(dealsData);
    setCustomers(customersData);
  };

  const handleUpdateStage = async (dealId: number, newStage: string) => {
    await API.updateDealStage(dealId, newStage);
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await API.addDeal({
        ...newDeal,
        customer_id: parseInt(newDeal.customer_id) || 0,
        value: parseInt(newDeal.value) || 0
      });

      if (response.error) {
        alert(`Gagal menambah penawaran: ${response.error}`);
      } else {
        setIsModalOpen(false);
        setNewDeal({ customer_id: '', title: '', value: '', stage: 'prospect', priority: 'medium' });
        fetchData();
      }
    } catch (error) {
       console.error('Error adding deal:', error);
       alert('Terjadi kesalahan saat menyimpan data deal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dealsByStage = (stage: string) => (Array.isArray(deals) ? deals : []).filter(d => d.stage === stage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Pipeline Penjualan</h2>
          <p className="text-slate-400 text-[10px] italic font-serif">Visualisasikan progres transaksi anda setiap harinya.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Deal</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
        {STAGES.map((column) => (
          <div key={column.id} className="min-w-[260px] flex-1">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-1.5">
                <span className={cn("w-1.5 h-1.5 rounded-full", column.color.replace('bg-', 'bg-').replace('100', '500').replace('200', '400'))}></span>
                <h3 className="font-bold text-slate-800 uppercase font-mono tracking-widest text-[9px] bg-white border border-slate-100 px-2 py-0.5 rounded shadow-sm">
                  {column.title}
                </h3>
              </div>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded">
                {dealsByStage(column.id).length}
              </span>
            </div>

            <Reorder.Group 
              axis="y" 
              values={dealsByStage(column.id)} 
              onReorder={() => {}} // Handle reorder if needed
              className="space-y-2 p-1.5 min-h-[400px] rounded-xl bg-slate-100/40 border border-dashed border-slate-200"
            >
              {dealsByStage(column.id).map((deal) => (
                <Reorder.Item 
                  key={deal.id}
                  value={deal}
                  className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow cursor-grab active:cursor-grabbing group relative"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter",
                      deal.priority === 'high' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                    )}>
                      {deal.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-slate-300 hover:text-slate-900">
                      <MoreHorizontal size={12} />
                    </button>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-900 mb-2 leading-snug truncate">{deal.title}</h4>
                  
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <User className="w-3 h-3 text-slate-300" />
                      <span className="truncate">{deal.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-300" />
                      <span>{new Date(deal.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-slate-900 font-bold text-[11px]">
                      <span className="text-slate-400 font-medium">Rp</span>
                      {deal.value.toLocaleString('id-ID')}
                    </div>
                    
                    <select 
                      value={deal.stage}
                      onChange={(e) => handleUpdateStage(deal.id, e.target.value)}
                      className="text-[9px] font-bold text-slate-400 border-none bg-transparent p-0 focus:ring-0 cursor-pointer hover:text-slate-900"
                    >
                      {STAGES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                  </div>
                </Reorder.Item>
              ))}
              
              {dealsByStage(column.id).length === 0 && (
                <div className="h-20 flex flex-col items-center justify-center text-slate-300 gap-2 grayscale brightness-110">
                   <Briefcase className="w-5 h-5 opacity-20" />
                   <p className="text-[10px] font-bold tracking-widest uppercase opacity-20">Kosong</p>
                </div>
              )}
            </Reorder.Group>
          </div>
        ))}
      </div>

      {/* Modal Buat Deal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 italic font-serif tracking-tight">Buat Penawaran Baru</h3>
                <p className="text-xs text-slate-500">Isi detail deal untuk mulai melacak progresnya.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Pelanggan</label>
                <select 
                  required
                  value={newDeal.customer_id}
                  onChange={e => setNewDeal({...newDeal, customer_id: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-700"
                >
                  <option value="">Pilih Pelanggan...</option>
                  {(Array.isArray(customers) ? customers : []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Judul Deal / Proyek</label>
                <input 
                  required
                  type="text" 
                  value={newDeal.title}
                  placeholder="Misal: Penawaran Website Desa..."
                  onChange={e => setNewDeal({...newDeal, title: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Nilai (Rp)</label>
                  <input 
                    required
                    type="number" 
                    value={newDeal.value}
                    onChange={e => setNewDeal({...newDeal, value: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Prioritas</label>
                  <select 
                    value={newDeal.priority}
                    onChange={e => setNewDeal({...newDeal, priority: e.target.value})}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 outline-none transition-all font-medium text-slate-700"
                  >
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all font-serif italic"
                >
                  Tutup
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "flex-[2] px-4 py-4 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Buat Penawaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
